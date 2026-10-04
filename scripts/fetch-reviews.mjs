// Hämtar kundomdömen från Bokadirekt och slår ihop dem med src/content/reviews.json.
//
// Två källor, båda från Bokadirekts egen platssida:
//  - Omdömena: JSON-API:t som sidan själv anropar (getReviews). Det ger HELA listan
//    med ordagranna texter och exakta tidsstämplar — till skillnad från sidans
//    JSON-LD som bara visar de 4 senaste.
//  - Totalbetyget: sidans window.__PRELOADED_STATE__ → place.reviews.stats, med exakt
//    snitt (t.ex. 4.97) och antal betyg inklusive de utan text. JSON-LD:n avrundar
//    snittet till heltal och används inte.
//
// Körs för hand när det passar:
//   node scripts/fetch-reviews.mjs           # skriver ändringar
//   node scripts/fetch-reviews.mjs --dry-run # visar bara vad som skulle hända
//
// Exitkoder:  0 = ändringar skrevs   2 = inget nytt   1 = fel (inget skrivs)

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REVIEWS_PATH = resolve(__dirname, '..', 'src', 'content', 'reviews.json')
const PLACE_ID = 135622
const PLACE_URL = `https://www.bokadirekt.se/places/let-us-massage-lund-${PLACE_ID}`
const API_URL = `https://www.bokadirekt.se/api/places/getReviews/${PLACE_ID}`
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'
const HEADERS = { 'User-Agent': UA, 'Accept-Language': 'sv-SE,sv;q=0.9' }
const PAGE_LIMIT = 100
const MAX_PAGES = 20

const dryRun = process.argv.includes('--dry-run')

/** Kontrollerat avbrott — allt annat än detta är en oväntad bugg och ska bubbla upp. */
class Abort extends Error {}
const fail = (msg) => { throw new Abort(msg) }

async function get(url, kind) {
  let res
  try {
    res = await fetch(url, { headers: HEADERS })
  } catch (err) {
    fail(`kunde inte hämta ${url} — ${err.message}`)
  }
  if (!res.ok) fail(`Bokadirekt svarade ${res.status} ${res.statusText} på ${url}`)
  if (kind === 'json') {
    try { return await res.json() } catch { fail(`${url} svarade inte med JSON — API:t kan ha ändrats`) }
  }
  return res.text()
}

/** Grov språkgissning — styr bara `inLanguage` och lang-attributet, aldrig texten. */
function guessLang(text) {
  const t = ` ${text.toLowerCase()} `
  if (/[äö]/.test(t)) return 'sv'
  if (/[æø]/.test(t)) return 'nb'
  const words = {
    sv: [' och ', ' jag ', ' är ', ' för ', ' att ', ' som ', ' hon ', ' mycket ', ' med ', ' på '],
    en: [' the ', ' and ', ' was ', ' very ', ' she ', ' with ', ' this ', ' after ', ' from ', ' massage that '],
    nb: [' og ', ' ikke ', ' jeg ', ' deg ', ' meg ', ' takk ', ' veldig ', ' slett '],
  }
  const score = (list) => list.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0)
  const [best] = Object.entries(words)
    .map(([lang, list]) => [lang, score(list)])
    .sort((a, b) => b[1] - a[1] || (a[0] === 'sv' ? -1 : 1))
  return best[1] > 0 ? best[0] : 'sv'
}

/** Identitet för ett omdöme — texten är det enda som är stabilt över tid. */
const keyOf = (r) => r.text.replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase()

/** Kalenderdatum i svensk tid (createdAt är UTC). */
const stockholmDate = (iso) => new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' })

async function fetchAllReviews() {
  const items = []
  let count = null
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await get(`${API_URL}?page=${page}&limit=${PAGE_LIMIT}&mp-reviews=true&rating=0`, 'json')
    if (!Array.isArray(data?.items)) fail('getReviews saknar items[] — API:t har ändrats')
    items.push(...data.items)
    count = Number(data.count ?? count)
    if (!data.nextPage || data.items.length === 0) break
  }
  if (Number.isFinite(count) && items.length !== count) {
    fail(`getReviews angav ${count} omdömen men gav ${items.length} — avbryter hellre än skriver en halv lista`)
  }
  return items
}

async function fetchStats() {
  const html = await get(PLACE_URL, 'text')
  const m = html.match(/"reviews":\{"stats":\{"score":([0-9.]+),"count":(\d+)\}/)
  if (!m) fail('hittade inte reviews.stats i platssidans __PRELOADED_STATE__ — sidstrukturen har ändrats')
  return { score: Number(m[1]), count: Number(m[2]) }
}

async function main() {
  // --- 1. Hämta ------------------------------------------------------------
  const [raw, stats] = await Promise.all([fetchAllReviews(), fetchStats()])

  const scraped = raw
    .filter(i => i?.review?.text?.trim() && i?.author?.name && i?.createdAt)
    .map(i => {
      const text = String(i.review.text).trim()
      return {
        author: String(i.author.name).trim(),
        rating: Number(i.review.score),
        date: stockholmDate(i.createdAt),
        lang: guessLang(text),
        text,
      }
    })
    .filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.rating >= 1 && r.rating <= 5)

  // --- 2. Rimlighetskontroller ---------------------------------------------
  const current = JSON.parse(readFileSync(REVIEWS_PATH, 'utf8'))
  const prevTotal = current.aggregate.ratingCount
  const ratingValue = Math.round(stats.score * 100) / 100

  if (!Number.isFinite(ratingValue) || ratingValue < 1 || ratingValue > 5 || !Number.isFinite(stats.count)) {
    fail(`orimligt aggregat från Bokadirekt (${stats.score} / ${stats.count}) — avbryter`)
  }
  if (stats.count < prevTotal) {
    fail(`Bokadirekt rapporterar färre betyg än vi har sparat (${stats.count} < ${prevTotal}) — kontrollera för hand`)
  }
  if (scraped.length > stats.count) {
    fail(`fler skrivna omdömen (${scraped.length}) än betyg (${stats.count}) — avbryter`)
  }
  if (!scraped.length && current.items.length) {
    fail('Bokadirekt gav inga omdömen alls men vi har sparade — avbryter')
  }

  console.log(`[fetch-reviews] Bokadirekt: ${ratingValue} i snitt på ${stats.count} betyg, ${scraped.length} skrivna omdömen`)
  console.log(`[fetch-reviews] lokalt: ${current.aggregate.ratingValue} i snitt på ${prevTotal} betyg, ${current.items.length} omdömen`)

  // --- 3. Slå ihop (lägger bara till, tar aldrig bort) --------------------
  const existing = new Set(current.items.map(keyOf))
  const onBokadirekt = new Set(scraped.map(keyOf))
  const fresh = scraped.filter(r => !existing.has(keyOf(r)))
  const gone = current.items.filter(r => !onBokadirekt.has(keyOf(r)))

  for (const r of gone) {
    console.warn(`[fetch-reviews] VARNING: ${r.author} (${r.date}) finns inte längre på Bokadirekt (borttaget eller redigerat) — ligger kvar, kontrollera för hand.`)
  }

  const aggregateUnchanged = stats.count === prevTotal && ratingValue === current.aggregate.ratingValue
  if (!fresh.length && aggregateUnchanged) {
    console.log('[fetch-reviews] Inget nytt.')
    return 2
  }

  for (const r of fresh) {
    console.log(`[fetch-reviews]  + ${r.author} (${r.date}, ${r.rating}★, ${r.lang}): ${r.text.slice(0, 60)}…`)
  }
  if (!aggregateUnchanged) {
    console.log(`[fetch-reviews]  ~ aggregat: ${current.aggregate.ratingValue}/${prevTotal} → ${ratingValue}/${stats.count}`)
  }

  // --- 4. Skriv ------------------------------------------------------------
  const merged = [...current.items, ...fresh].sort((a, b) => b.date.localeCompare(a.date))
  if (merged.length < current.items.length) fail('sammanslagningen tappade omdömen — avbryter utan att skriva')

  const next = {
    ...current,
    source: { ...current.source, lastFetched: stockholmDate(new Date().toISOString()) },
    aggregate: { ...current.aggregate, ratingValue, ratingCount: stats.count },
    items: merged,
  }

  if (dryRun) {
    console.log(`[fetch-reviews] --dry-run: skulle skriva ${merged.length} omdömen (${fresh.length} nya).`)
    return 0
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
