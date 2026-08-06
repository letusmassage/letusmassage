// Hämtar nya kundomdömen från Bokadirekt och slår ihop dem med src/content/reviews.json.
//
// Bokadirekt bäddar in sitt eget schema.org-JSON-LD i sidan med aggregateRating och
// de N senaste omdömena (N = 4 i skrivande stund). Vi läser det istället för att
// skrapa DOM:en — formatet är stabilt, texterna är ordagranna och datumen exakta.
//
// Körs av rutinen "Let Us Massage — hämta nya omdömen" och kan köras för hand:
//   node scripts/fetch-reviews.mjs           # skriver ändringar
//   node scripts/fetch-reviews.mjs --dry-run # visar bara vad som skulle hända
//
// Exitkoder:  0 = nya omdömen skrevs   2 = inget nytt   1 = fel (skriv inget, larma)

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REVIEWS_PATH = resolve(__dirname, '..', 'src', 'content', 'reviews.json')
const PLACE_URL = 'https://www.bokadirekt.se/places/let-us-massage-lund-135622'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'

const dryRun = process.argv.includes('--dry-run')

/** Kontrollerat avbrott — allt annat än detta är en oväntad bugg och ska bubbla upp. */
class Abort extends Error {}
const fail = (msg) => { throw new Abort(msg) }

/** Grov språkgissning — styr bara `inLanguage` och lang-attributet, aldrig texten. */
function guessLang(text) {
  const t = ` ${text.toLowerCase()} `
  if (/[åäö]/.test(t)) return 'sv'
  const sv = [' och ', ' jag ', ' är ', ' för ', ' att ', ' som ', ' hon ', ' mycket ', ' med ', ' på ']
  const en = [' the ', ' and ', ' was ', ' very ', ' she ', ' with ', ' this ', ' after ', ' from ', ' massage that ']
  const score = (words) => words.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0)
  return score(sv) >= score(en) ? 'sv' : 'en'
}

/** Identitet för ett omdöme — texten är det enda som är stabilt över tid. */
const keyOf = (r) => r.text.replace(/\s+/g, ' ').trim().toLowerCase()

async function main() {
  // --- 1. Hämta sidan -----------------------------------------------------
  let html
  try {
    const res = await fetch(PLACE_URL, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'sv-SE,sv;q=0.9' },
    })
    if (!res.ok) fail(`Bokadirekt svarade ${res.status} ${res.statusText}`)
    html = await res.text()
  } catch (err) {
    if (err instanceof Abort) throw err
    fail(`kunde inte hämta ${PLACE_URL} — ${err.message}`)
  }
  if (html.length < 50_000) {
    fail(`svaret var misstänkt kort (${html.length} tecken) — troligen en felsida`)
  }

  // --- 2. Plocka ut LocalBusiness-schemat ---------------------------------
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  if (!blocks.length) fail('inga ld+json-block i svaret — Bokadirekt kan ha ändrat sidan')

  let biz = null
  for (const b of blocks) {
    let parsed
    try { parsed = JSON.parse(b[1]) } catch { continue }
    for (const node of [].concat(parsed)) {
      if (node && node['@type'] === 'LocalBusiness' && Array.isArray(node.review)) biz = node
    }
  }
  if (!biz) fail('hittade inget LocalBusiness-schema med review[] — sidstrukturen har ändrats')

  const scraped = biz.review
    .filter(r => r?.reviewBody && r?.author?.name && r?.reviewRating?.ratingValue)
    .map(r => ({
      author: String(r.author.name).trim(),
      rating: Number(r.reviewRating.ratingValue),
      date: String(r.datePublished ?? '').slice(0, 10),
      lang: guessLang(String(r.reviewBody)),
      text: String(r.reviewBody).trim(),
    }))
    .filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.rating >= 1 && r.rating <= 5)

  if (!scraped.length) fail('review[] fanns men innehöll inga giltiga omdömen')

  // --- 3. Slå ihop med befintlig fil --------------------------------------
  const current = JSON.parse(readFileSync(REVIEWS_PATH, 'utf8'))
  const existing = new Set(current.items.map(keyOf))
  const fresh = scraped.filter(r => !existing.has(keyOf(r)))

  const scrapedTotal = Number(biz.aggregateRating?.reviewCount ?? current.aggregate.ratingCount)
  const scrapedValue = Number(biz.aggregateRating?.ratingValue ?? current.aggregate.ratingValue)
  const prevTotal = current.aggregate.ratingCount

  if (!Number.isFinite(scrapedTotal) || !Number.isFinite(scrapedValue) || scrapedValue < 1 || scrapedValue > 5) {
    fail(`orimligt aggregat från Bokadirekt (${scrapedValue} / ${scrapedTotal}) — avbryter`)
  }
  if (scrapedTotal < prevTotal) {
    fail(`Bokadirekt rapporterar färre betyg än vi har sparat (${scrapedTotal} < ${prevTotal}) — avbryter, kontrollera för hand`)
  }

  console.log(`[fetch-reviews] Bokadirekt: ${scrapedValue} i snitt på ${scrapedTotal} betyg, ${scraped.length} omdömen exponerade`)
  console.log(`[fetch-reviews] lokalt: ${current.items.length} omdömen, ${prevTotal} betyg`)

  // Skyddsräcke: fönstret hos Bokadirekt är litet. Har betygsräknaren ökat mer än
  // antalet nya vi fick tag på kan omdömen ha hunnit falla ur listan.
  const missed = (scrapedTotal - prevTotal) - fresh.length
  if (missed > 0) {
    console.warn(
      `[fetch-reviews] VARNING: betygen ökade med ${scrapedTotal - prevTotal} men bara ${fresh.length} nya ` +
      `omdömen syntes. Upp till ${missed} kan ha fallit ur Bokadirekts fönster på ${scraped.length} — ` +
      `hämta dem för hand enligt docs/reviews.md, eller kör rutinen oftare.`
    )
  }

  const aggregateUnchanged =
    scrapedTotal === prevTotal && scrapedValue === current.aggregate.ratingValue
  if (!fresh.length && aggregateUnchanged) {
    console.log('[fetch-reviews] Inget nytt.')
    return 2
  }

  for (const r of fresh) {
    console.log(`[fetch-reviews]  + ${r.author} (${r.date}, ${r.rating}★, ${r.lang}): ${r.text.slice(0, 60)}…`)
  }

  // --- 4. Skriv -----------------------------------------------------------
  const merged = [...current.items, ...fresh].sort((a, b) => b.date.localeCompare(a.date))

  // Sanity: sammanslagningen får aldrig tappa ett befintligt omdöme.
  if (merged.length < current.items.length) {
    fail('sammanslagningen tappade omdömen — avbryter utan att skriva')
  }

  const next = {
    ...current,
    source: { ...current.source, lastFetched: new Date().toISOString().slice(0, 10) },
    aggregate: { ...current.aggregate, ratingValue: scrapedValue, ratingCount: scrapedTotal },
    items: merged,
  }

  if (dryRun) {
    console.log(`[fetch-reviews] --dry-run: skulle skriva ${merged.length} omdömen (${fresh.length} nya).`)
    return fresh.length ? 0 : 2
  }

  writeFileSync(REVIEWS_PATH, JSON.stringify(next, null, 2) + '\n', 'utf8')
  console.log(`[fetch-reviews] ✓ Skrev ${merged.length} omdömen (${fresh.length} nya) till src/content/reviews.json`)
  return 0
}

try {
  process.exitCode = await main()
} catch (err) {
  if (!(err instanceof Abort)) throw err
  console.error(`[fetch-reviews] FEL: ${err.message}`)
  process.exitCode = 1
}
