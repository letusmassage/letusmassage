// Postbuild prerender: skapar dist/<route>/index.html med rätt
// title/description/canonical/og per route. Detta gör att Google och
// sociala crawlers ser unika meta-tags innan JS körs.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runnerImport } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')
const SITE = 'https://let-us-massage.se'
const DEFAULT_OG = `${SITE}/og-image.jpg`

// --- Strukturerad data (JSON-LD) som bakas in i den statiska HTML:en, så att
// crawlers som inte kör JS ser LocalBusiness/Person/Service/FAQPage direkt i svaret.
// Detta är den enda källan till schemat (klienten dubblerar det inte längre). ---
const BUSINESS_ID = `${SITE}/#business`
const PERSON_ID = `${SITE}/#ioulietta`
const BOKADIREKT_PLACE = 'https://www.bokadirekt.se/places/let-us-massage-lund-135622'
// Google Business Profile via CID (0x5f4b27bdb9f58f3e) — pekar på själva verksamheten,
// inte på en adress som kortlänken/kartinbäddningen gör.
const GOOGLE_MAPS = 'https://www.google.com/maps?cid=6866625752678633278'

// Kanonisk URL — alltid med avslutande snedstreck (samma regel som src/lib/site.ts).
// Netlify serverar dist/<route>/index.html och 301:ar formen utan snedstreck.
const canonicalUrl = (path) => SITE + (path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`)

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

// aggregateRating och review-listan bakas bara in där betyget och omdömena faktiskt
// syns — startsidan och /recensioner — så att markup och synligt innehåll matchar.
const buildBusinessGraph = (withReviews = false) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
      '@id': BUSINESS_ID,
      // Samma namn som i Google-profilen, på Bokadirekt och Hitta. Enskild firma utan
      // registrerat företagsnamn, därför ingen legalName.
      name: 'Let Us Massage Lund',
      alternateName: 'Let Us Massage',
      description: svLocale.seo.description,
      url: `${SITE}/`,
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
      hasMap: GOOGLE_MAPS,
      // Kunderna kommer till mottagningen; grannorterna nämns inte på sajten och
      // listas därför inte heller här.
      areaServed: { '@type': 'City', name: 'Lund' },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '19:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '15:00' },
      ],
      telephone: '+46767690887',
      email: 'let.us.massage.info@gmail.com',
      // Bokadirekt 2026-10-04: Relax 30 min 530 kr … Massageterapi 90 min 1 300 kr.
      priceRange: '530-1300 SEK',
      currenciesAccepted: 'SEK',
      paymentAccepted: 'Credit Card, Swish, Epassi, Benifex',
      knowsLanguage: ['sv', 'en', 'el'],
      sameAs: [BOKADIREKT_PLACE, GOOGLE_MAPS],
      potentialAction: {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: BOKADIREKT_PLACE,
          actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'],
        },
        result: { '@type': 'Reservation', name: 'Boka massage' },
      },
      ...(withReviews && aggregateRating ? { aggregateRating } : {}),
      ...(withReviews && reviewNodes.length ? { review: reviewNodes } : {}),
      // Priser per behandling visas inte på sajten och märks därför inte upp per Offer.
      makesOffer: SCHEMA_SERVICES.map(s => ({
        '@type': 'Offer',
        itemOffered: { '@id': `${BUSINESS_ID}/service/${s.id}` },
        url: canonicalUrl(`/behandlingar/${s.id}`),
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
      url: canonicalUrl(`/behandlingar/${s.id}`),
      serviceType: s.therapeutic ? 'Massageterapi' : 'Friskvårdsmassage',
      category: s.therapeutic ? 'Massageterapi' : 'Friskvårdsmassage',
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
function head({ title, description, canonical, ogType = 'website', ogImage = DEFAULT_OG, articleDate, articleModified }) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    canonical ? `<link rel="canonical" href="${esc(canonical)}" />` : null,
    `<meta property="og:type" content="${esc(ogType)}" />`,
    `<meta property="og:site_name" content="Let Us Massage" />`,
    `<meta property="og:locale" content="sv_SE" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    canonical ? `<meta property="og:url" content="${esc(canonical)}" />` : null,
    `<meta property="og:image" content="${esc(ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(ogImage)}" />`,
    articleDate ? `<meta property="article:published_time" content="${esc(articleDate)}" />` : null,
    articleModified ? `<meta property="article:modified_time" content="${esc(articleModified)}" />` : null,
    articleDate ? `<meta property="article:author" content="Ioulietta Refene" />` : null,
  ].filter(Boolean)
  return lines.map(l => '    ' + l).join('\n')
}

// Data per route. Behandlingar och metoder läses ur sv.json — exakt samma texter som
// sidorna renderar (ServiceDetail/TechniqueDetail), så att den statiska head:en och den
// renderade aldrig säger olika saker. (Tidigare hårdkodade kopior hade glidit isär.)
const serviceIds = svLocale.services.items.map(s => s.id)
const techniqueIds = svLocale.techniques.items.map(t => t.id)

// Artiklarna läses direkt ur src/content/articles (TypeScript, via Vite) — samma titlar,
// beskrivningar och datum som Article.tsx renderar. (Tidigare en hårdkodad kopia som glidit isär.)
const { module: articleModule } = await runnerImport(resolve(__dirname, '..', 'src', 'content', 'articles', 'index.ts'))
const articles = articleModule.ARTICLES.map(a => ({
  slug: a.slug,
  title: `${a.seoTitle ?? a.title} | Let Us Massage`,
  description: a.seoDescription ?? a.description,
  date: a.date,
  updated: a.updated,
}))

// Bygg full route-lista
// lastmod = senaste märkbara innehållsändring. Artiklarnas kommer ur innehållsfilerna
// (updated ?? date); för övriga sidor uppdateras datumet här för hand när sidan ändras.
const SERVICES_LASTMOD = '2026-10-04'
const TECHNIQUES_LASTMOD = '2026-10-04'

const routes = [
  // Statiska
  { path: '/', title: svLocale.seo.title, description: svLocale.seo.description, lastmod: '2026-10-04' },
  {
    path: '/artiklar',
    title: articleModule.ARTICLES_PAGE.title,
    description: articleModule.ARTICLES_PAGE.description,
    lastmod: '2026-05-24',
  },
  { path: '/presentkort', title: svLocale.gifts.seo.title, description: svLocale.gifts.seo.description, lastmod: '2026-09-06' },
  { path: '/friskvard', title: svLocale.friskvardPage.seo.title, description: svLocale.friskvardPage.seo.description, lastmod: '2026-09-06' },
  {
    path: '/recensioner',
    title: svLocale.reviewsPage.seo.title,
    description: svLocale.reviewsPage.seo.description.replace('{{total}}', reviewData.aggregate.ratingCount),
    lastmod: reviewData.source.lastFetched,
  },
  // Behandlingar — samma SEO-texter som ServiceDetail.tsx (sv.json serviceDetails.<id>.seo)
  ...serviceIds.map(id => ({
    path: `/behandlingar/${id}`,
    title: svLocale.serviceDetails[id].seo.title,
    description: svLocale.serviceDetails[id].seo.description,
    ogType: 'article',
    ogImage: `${SITE}/services/${id}.jpg`,
    lastmod: SERVICES_LASTMOD,
  })),
  // Metoder — samma SEO-texter som TechniqueDetail.tsx (sv.json techniqueDetails.<id>.seo)
  ...techniqueIds.map(id => ({
    path: `/metoder/${id}`,
    title: svLocale.techniqueDetails[id].seo.title,
    description: svLocale.techniqueDetails[id].seo.description,
    ogType: 'article',
    lastmod: TECHNIQUES_LASTMOD,
  })),
  // Artiklar
  ...articles.map(a => ({
    path: `/artiklar/${a.slug}`,
    title: a.title,
    description: a.description,
    ogType: 'article',
    articleDate: a.date,
    articleModified: a.updated,
    lastmod: a.updated ?? a.date,
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
  const canonical = canonicalUrl(route.path)
  const newHead = head({
    title: route.title,
    description: route.description,
    canonical,
    ogType: route.ogType,
    ogImage: route.ogImage,
    articleDate: route.articleDate,
    articleModified: route.articleModified,
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

// Sitemap — genereras från samma route-lista, så den kan aldrig glida isär från sidorna.
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(r =>
    ['  <url>', `    <loc>${canonicalUrl(r.path)}</loc>`, r.lastmod ? `    <lastmod>${r.lastmod}</lastmod>` : null, '  </url>']
      .filter(Boolean)
      .join('\n')
  ),
  '</urlset>',
  '',
].join('\n')
writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap, 'utf8')

// 404-sida: Netlify serverar dist/404.html med status 404 för alla okända adresser
// (det finns ingen catch-all-rewrite längre). noindex och ingen canonical.
const ROBOTS_RE = /<meta name="robots" content="[^"]*" \/>/
if (!ROBOTS_RE.test(template)) {
  console.error('[prerender] hittade ingen <meta name="robots"> i dist/index.html att byta ut för 404-sidan')
  process.exit(1)
}
const notFoundHead = head({ title: svLocale.notFound.seoTitle, description: svLocale.notFound.text })
const notFoundHtml = template
  .replace(new RegExp(`${HEAD_START}[\\s\\S]*?${HEAD_END}`), `${HEAD_START}\n${notFoundHead}\n    ${HEAD_END}`)
  .replace(ROBOTS_RE, '<meta name="robots" content="noindex, follow" />')
writeFileSync(resolve(distDir, '404.html'), notFoundHtml, 'utf8')

console.log(`[prerender] ✓ Skrev ${count} prerenderade sidor med unik canonical/title/description + sitemap.xml + 404.html`)
