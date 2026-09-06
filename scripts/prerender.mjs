// Postbuild prerender: skapar dist/<route>/index.html med rätt
// title/description/canonical/og per route. Detta gör att Google och
// sociala crawlers ser unika meta-tags innan JS körs.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')
const SITE = 'https://let-us-massage.se'
const DEFAULT_OG = `${SITE}/og-image.jpg`

// --- Strukturerad data (JSON-LD) som bakas in i den statiska HTML:en, så att
// crawlers som inte kör JS ser LocalBusiness/Person/Service/FAQPage direkt i svaret.
// Detta är den enda källan till schemat (klienten dubblerar det inte längre). ---
const BUSINESS_ID = `${SITE}/#business`
const PERSON_ID = `${SITE}/#ioulietta`

const svLocale = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'src', 'i18n', 'locales', 'sv.json'), 'utf8')
)

// Kundomdömen — samma fil som klienten läser (src/content/reviews.ts), så att
// schemat aldrig kan säga något annat än det besökaren faktiskt ser på sidan.
const reviewData = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'src', 'content', 'reviews.json'), 'utf8')
)

// ratingCount = alla betyg (även de utan text), reviewCount = de med skriven text.
const aggregateRating = reviewData.items.length
  ? {
      '@type': 'AggregateRating',
      ratingValue: reviewData.aggregate.ratingValue,
      ratingCount: reviewData.aggregate.ratingCount,
      reviewCount: reviewData.items.length,
      bestRating: reviewData.aggregate.bestRating,
      worstRating: reviewData.aggregate.worstRating,
    }
  : null

const reviewNodes = reviewData.items.map(r => ({
  '@type': 'Review',
  reviewRating: {
    '@type': 'Rating',
    ratingValue: r.rating,
    bestRating: reviewData.aggregate.bestRating,
    worstRating: reviewData.aggregate.worstRating,
  },
  author: { '@type': 'Person', name: r.author },
  datePublished: r.date,
  inLanguage: r.lang,
  reviewBody: r.text,
  publisher: { '@type': 'Organization', name: reviewData.source.name, url: reviewData.source.url },
}))

const SCHEMA_SERVICES = [
  { id: 'relax', name: 'Relaxmassage', description: 'Avslappnande svensk massage för stresshantering och välbefinnande.', therapeutic: false },
  { id: 'klassisk', name: 'Klassisk Massage', description: 'Förebyggande friskvårdsmassage med svensk massage, deep tissue och myofasciell release. Godkänd för friskvårdsbidrag.', therapeutic: false },
  { id: 'massageterapi', name: 'Massageterapi', description: 'Terapeutisk massage med trigger point therapy, neuromuskulär terapi, deep tissue och myofasciell release för smärta och nedsatt rörlighet.', therapeutic: true },
  { id: 'prenatal', name: 'Gravidmassage', description: 'Mjuk, säker massage anpassad för gravida från andra trimestern. Sidoläge med fullt kuddstöd.', therapeutic: false },
]

// aggregateRating följer med på alla sidor (del av verksamhetens identitet), medan
// hela review-listan bara bakas in där omdömena faktiskt syns — startsidan och
// /recensioner — så att markup och synligt innehåll matchar.
const buildBusinessGraph = (withReviews = false) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
      '@id': BUSINESS_ID,
      name: 'Let Us Massage',
      legalName: 'Let Us Massage',
      alternateName: 'Let Us Massage Lund',
      description: svLocale.seo.description,
      url: SITE,
      slogan: svLocale.hero.headline,
      image: [`${SITE}/hero.jpg`, `${SITE}/letta.jpg`, `${SITE}/og-image.jpg`],
      logo: `${SITE}/android-chrome-512x512.png`,
      founder: { '@id': PERSON_ID },
      employee: { '@id': PERSON_ID },
      foundingDate: '2026',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Stora Södergatan 58A',
        addressLocality: 'Lund',
        postalCode: '222 23',
        addressRegion: 'Skåne län',
        addressCountry: 'SE',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 55.696716, longitude: 13.189148 },
      hasMap: 'https://maps.app.goo.gl/v66Jk7S2g5QqUKn56',
      areaServed: [
        { '@type': 'City', name: 'Lund' },
        { '@type': 'City', name: 'Lomma' },
        { '@type': 'City', name: 'Staffanstorp' },
        { '@type': 'City', name: 'Bjärred' },
        { '@type': 'City', name: 'Eslöv' },
        { '@type': 'City', name: 'Dalby' },
        { '@type': 'AdministrativeArea', name: 'Skåne län' },
      ],
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '19:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '15:00' },
      ],
      telephone: '+46767690887',
      email: 'let.us.massage.info@gmail.com',
      priceRange: '550-1295 SEK',
      currenciesAccepted: 'SEK',
      paymentAccepted: 'Credit Card, Swish, Epassi, Benifex',
      knowsLanguage: ['sv', 'en', 'el'],
      sameAs: [
        'https://www.bokadirekt.se/places/let-us-massage-lund-135622',
        'https://maps.app.goo.gl/v66Jk7S2g5QqUKn56',
      ],
      ...(aggregateRating ? { aggregateRating } : {}),
      ...(withReviews && reviewNodes.length ? { review: reviewNodes } : {}),
      makesOffer: SCHEMA_SERVICES.map(s => ({
        '@type': 'Offer',
        itemOffered: { '@id': `${BUSINESS_ID}/service/${s.id}` },
        url: `${SITE}/behandlingar/${s.id}`,
        areaServed: { '@type': 'City', name: 'Lund' },
      })),
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Ioulietta Refene',
      givenName: 'Ioulietta',
      familyName: 'Refene',
      jobTitle: 'Certifierad medicinsk massageterapeut',
      description: 'Certifierad medicinsk massageterapeut sedan 2009 med medlemskap i Kroppsterapeuternas Yrkesförbund.',
      hasOccupation: { '@type': 'Occupation', name: 'Massageterapeut', occupationalCategory: 'Medicinsk massageterapeut' },
      worksFor: { '@id': BUSINESS_ID },
      image: `${SITE}/letta.jpg`,
      nationality: { '@type': 'Country', name: 'Greece' },
      alumniOf: { '@type': 'EducationalOrganization', name: 'Natural Health Science', address: 'Athens, Greece' },
      memberOf: { '@type': 'Organization', name: 'Kroppsterapeuternas Yrkesförbund', identifier: '36786', url: 'https://www.kroppsterapeuterna.se' },
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'Certifierad medicinsk massageterapeut',
        recognizedBy: { '@type': 'Organization', name: 'Kroppsterapeuternas Yrkesförbund' },
      },
      knowsLanguage: ['sv', 'en', 'el'],
      knowsAbout: ['Svensk massage', 'Deep tissue massage', 'Myofascial release', 'Neuromuscular therapy', 'Trigger point therapy', 'Prenatal massage', 'Sports massage', 'Anatomy'],
    },
    ...SCHEMA_SERVICES.map(s => ({
      '@type': 'Service',
      '@id': `${BUSINESS_ID}/service/${s.id}`,
      name: s.name,
      description: s.description,
      provider: { '@id': BUSINESS_ID },
      areaServed: { '@type': 'City', name: 'Lund' },
      url: `${SITE}/behandlingar/${s.id}`,
      serviceType: s.therapeutic ? 'Therapeutic Massage' : 'Wellness Massage',
      category: s.therapeutic ? 'Therapeutic Massage' : 'Wellness Massage',
      availableLanguage: ['sv', 'en', 'el'],
    })),
  ],
})

const businessGraph = buildBusinessGraph(false)
const businessGraphWithReviews = buildBusinessGraph(true)
const REVIEW_PAGES = new Set(['/', '/recensioner'])

const buildFaqGraph = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: (items ?? []).map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
})

const faqGraph = buildFaqGraph(svLocale.faq?.items)
const friskvardFaqGraph = buildFaqGraph(svLocale.friskvardPage?.faq?.items)

// Serialisera JSON-LD säkert för inbäddning i en <script>-tagg (escapa "<").
const ldScript = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`

// Hjälp: bygg HEAD-block för en given sida
function head({ title, description, canonical, ogType = 'website', ogImage = DEFAULT_OG, keywords, articleDate }) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    keywords ? `<meta name="keywords" content="${esc(keywords)}" />` : null,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:type" content="${esc(ogType)}" />`,
    `<meta property="og:site_name" content="Let Us Massage" />`,
    `<meta property="og:locale" content="sv_SE" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:image" content="${esc(ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(ogImage)}" />`,
    articleDate ? `<meta property="article:published_time" content="${esc(articleDate)}" />` : null,
    articleDate ? `<meta property="article:author" content="Ioulietta Refene" />` : null,
  ].filter(Boolean)
  return lines.map(l => '    ' + l).join('\n')
}

// Data per route — synkat med i18n + content/articles
const services = [
  { id: 'relax', name: 'Relaxmassage', duration: '30 / 60 min', description: 'Mjuk och lugnande svensk massage som hjälper kroppen att släppa spänningar och sinnet att varva ner. Perfekt om du känner dig stressad eller behöver en paus i vardagen.' },
  { id: 'klassisk', name: 'Klassisk Massage', duration: '30 / 45 / 60 min', description: 'Förebyggande friskvårdsmassage som kombinerar svensk massage, deep tissue och myofasciell release. Godkänd för friskvårdsbidrag.' },
  { id: 'massageterapi', name: 'Massageterapi', duration: '45 / 60 / 75 / 90 min', description: 'Avancerad terapeutisk behandling för smärta, spänningar och nedsatt rörlighet. Kombinerar deep tissue, triggerpunkter, neuromuskulär terapi och myofascial release.' },
  { id: 'prenatal', name: 'Gravidmassage', duration: '60 min', description: 'Mjuk, säker massage anpassad för gravida från andra trimestern. Utförs i sidoläge med fullt kuddstöd och fokus på rygg, höfter, ben, nacke och axlar.' },
]

const techniques = [
  { id: 'svensk-massage', name: 'Svensk massage', tagline: 'Grunden för avslappning', description: 'Mjuka till medeltryckande rörelser med långa strykningar, knådning och rytmiska rörelser som löser upp spänningar och förbättrar blodcirkulationen.' },
  { id: 'deep-tissue', name: 'Djupgående massage', tagline: 'Deep Tissue', description: 'Intensiv behandlingsform med långsamma rörelser och djupare tryck som arbetar med muskler, senor och bindväv för att lösa upp spända områden och förbättra rörligheten.' },
  { id: 'myofascial-release', name: 'Myofasciell behandling', tagline: 'Myofascial Release', description: 'Mjuk och fokuserad metod som arbetar med kroppens bindväv (fascia) för att minska spänningar och förbättra rörlighet.' },
  { id: 'nmt', name: 'Neuromuskulär terapi', tagline: 'NMT', description: 'Metod som fokuserar på samspelet mellan muskler och nervsystem för att minska smärta och förbättra kroppens funktion.' },
  { id: 'trigger-point', name: 'Triggerpunktsbehandling', tagline: 'Trigger Point Therapy', description: 'Riktad massageteknik som fokuserar på specifika spänningspunkter — "muskelknutor" — i musklerna för att hjälpa dem att återgå till naturlig funktion.' },
]

const articles = [
  { slug: 'massage-i-lund-guide', title: 'Massage i Lund — guide till olika behandlingsformer', description: 'En översikt över massagealternativ i Lund: avslappning, friskvård, terapeutisk massage och gravidmassage. Så väljer du rätt — och vad du bör veta innan du bokar.', date: '2026-05-11', keywords: 'massage Lund, massage Lund centrum, massageterapeut Lund, wellness Lund, boka massage Lund' },
  { slug: 'stillasittande-arbete-nack-och-rygg-lund', title: 'Stillasittande arbete — så påverkar det nacke och rygg', description: 'Hur långvarigt stillasittande påverkar nacke, axlar och rygg — och hur regelbunden massage kan motverka spänningar och stelhet.', date: '2026-05-10', keywords: 'stillasittande Lund, nackspänningar, ryggspänningar, kontorsmassage Lund' },
  { slug: 'triggerpunkter-vad-de-ar-och-hur-de-behandlas', title: 'Triggerpunkter — vad de är och hur de behandlas', description: 'Vad triggerpunkter (muskelknutor) är, varför de uppstår, och hur trigger point therapy och neuromuskulär behandling kan minska smärta.', date: '2026-05-09', keywords: 'triggerpunkter, muskelknutor, trigger point therapy Lund, NMT Lund' },
  { slug: 'deep-tissue-vs-svensk-massage', title: 'Deep tissue eller svensk massage — vad ska du välja?', description: 'Skillnaden mellan deep tissue och svensk massage förklarad: när passar respektive teknik, intensitet, effekt och för vem.', date: '2026-05-08', keywords: 'deep tissue Lund, svensk massage Lund, massage val' },
  { slug: 'gravidmassage-lund-vad-ar-sakert', title: 'Gravidmassage i Lund — vad är säkert?', description: 'Riktlinjer för gravidmassage: när du tidigast kan boka, säker positionering, vad som undviks och vilken erfarenhet du bör söka.', date: '2026-05-07', keywords: 'gravidmassage Lund, prenatal massage Lund, massage gravid' },
  { slug: 'klassisk-massage-vs-massageterapi', title: 'Klassisk massage vs massageterapi — vad är skillnaden?', description: 'Klassisk friskvårdsmassage och terapeutisk massageterapi — vad skiljer dem, vilken passar dig och vad innebär det för friskvårdsbidraget?', date: '2026-05-06', keywords: 'klassisk massage Lund, massageterapi Lund, friskvård vs terapi' },
  { slug: 'friskvardsbidrag-massage-lund', title: 'Friskvårdsbidrag för massage i Lund — så fungerar det', description: 'Hur du använder friskvårdsbidraget för massage i Lund: vilka behandlingar som omfattas, kvitto, Skatteverkets regler och bokning.', date: '2026-05-05', keywords: 'friskvårdsbidrag massage Lund, friskvård massage, Epassi, Benifex, Benify' },
  { slug: 'spanningshuvudvark-massage-lund', title: 'Spänningshuvudvärk — så kan massage hjälpa', description: 'Hur spänningar i nacke, axlar och käke kan ge huvudvärk — och varför riktad massage ofta lindrar både orsak och symtom.', date: '2026-05-04', keywords: 'spänningshuvudvärk Lund, huvudvärk massage, nackspänningar huvudvärk' },
]

// Bygg full route-lista
const routes = [
  // Statiska
  {
    path: '/',
    title: 'Massage i Lund | Let Us Massage – Klassisk, Massageterapi & Gravidmassage',
    description: 'Professionell massage i Lund med Ioulietta Refene, certifierad medicinsk massageterapeut sedan 2009. Klassisk massage, massageterapi, gravidmassage och relaxmassage. Stora Södergatan 58A, Lund. Boka online.',
    keywords: 'massage Lund, massageterapi Lund, klassisk massage Lund, gravidmassage Lund, deep tissue Lund, friskvård Lund, medicinsk massageterapeut Lund, Ioulietta Refene Lund',
  },
  {
    path: '/artiklar',
    title: 'Kunskapsbank — Artiklar om massage i Lund | Let Us Massage',
    description: 'Artiklar och guider om massage, friskvård, spänningshuvudvärk, gravidmassage och förebyggande kroppsvård i Lund.',
  },
  {
    path: '/presentkort',
    title: svLocale.gifts.seo.title,
    description: svLocale.gifts.seo.description,
  },
  {
    path: '/friskvard',
    title: svLocale.friskvardPage.seo.title,
    description: svLocale.friskvardPage.seo.description,
    keywords: 'friskvårdsbidrag massage Lund, friskvårdsmassage Lund, Epassi massage Lund, Benifex massage Lund, Benify massage Lund, friskvård Lund',
  },
  {
    path: '/recensioner',
    title: svLocale.reviewsPage.seo.title,
    description: svLocale.reviewsPage.seo.description,
    keywords: 'recensioner massage Lund, omdömen massageterapeut Lund, Let Us Massage recensioner, bästa massage Lund, Ioulietta Refene omdömen',
  },
  // Behandlingar
  ...services.map(s => ({
    path: `/behandlingar/${s.id}`,
    title: `${s.name} i Lund — ${s.duration} | Let Us Massage`,
    description: `${s.description} Boka ${s.name.toLowerCase()} hos Let Us Massage på Stora Södergatan 58A i Lund.`,
    ogType: 'article',
    ogImage: `${SITE}/services/${s.id}.jpg`,
  })),
  // Metoder
  ...techniques.map(t => ({
    path: `/metoder/${t.id}`,
    title: `${t.name} (${t.tagline}) — Massageteknik i Lund | Let Us Massage`,
    description: t.description.slice(0, 155),
    ogType: 'article',
  })),
  // Artiklar
  ...articles.map(a => ({
    path: `/artiklar/${a.slug}`,
    title: `${a.title} | Let Us Massage Lund`,
    description: a.description,
    keywords: a.keywords,
    ogType: 'article',
    articleDate: a.date,
  })),
]

// Läs bygget
const indexPath = resolve(distDir, 'index.html')
if (!existsSync(indexPath)) {
  console.error(`[prerender] dist/index.html saknas — kör npm run build först`)
  process.exit(1)
}
const template = readFileSync(indexPath, 'utf8')

// Mall måste innehålla SEO_HEAD-markörer
const HEAD_START = '<!-- SEO_HEAD -->'
const HEAD_END = '<!-- /SEO_HEAD -->'
if (!template.includes(HEAD_START) || !template.includes(HEAD_END)) {
  console.error(`[prerender] dist/index.html saknar ${HEAD_START} ... ${HEAD_END} markörer`)
  process.exit(1)
}

function injectHead(html, route) {
  const canonical = SITE + (route.path === '/' ? '/' : route.path)
  const newHead = head({
    title: route.title,
    description: route.description,
    canonical,
    ogType: route.ogType,
    ogImage: route.ogImage,
    keywords: route.keywords,
    articleDate: route.articleDate,
  })
  const graph = REVIEW_PAGES.has(route.path) ? businessGraphWithReviews : businessGraph
  const pageFaq =
    route.path === '/' ? faqGraph : route.path === '/friskvard' ? friskvardFaqGraph : null
  const schema = [ldScript(graph), pageFaq ? ldScript(pageFaq) : null]
    .filter(Boolean)
    .map(l => '    ' + l)
    .join('\n')
  return html.replace(
    new RegExp(`${HEAD_START}[\\s\\S]*?${HEAD_END}`),
    `${HEAD_START}\n${newHead}\n${schema}\n    ${HEAD_END}`
  )
}

let count = 0
for (const route of routes) {
  const html = injectHead(template, route)
  const outDir = route.path === '/'
    ? distDir
    : resolve(distDir, '.' + route.path)
  const outFile = resolve(outDir, 'index.html')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(outFile, html, 'utf8')
  count++
}

console.log(`[prerender] ✓ Skrev ${count} prerenderade sidor med unik canonical/title/description`)
