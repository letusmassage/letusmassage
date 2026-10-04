// Sajtens adresser på ett ställe — samma regler som scripts/prerender.mjs.
export const SITE = 'https://let-us-massage.se'
export const BUSINESS_ID = `${SITE}/#business`
export const PERSON_ID = `${SITE}/#ioulietta`
export const DEFAULT_OG_IMAGE = `${SITE}/og-image.jpg`

/**
 * Kanonisk URL för en route — alltid med avslutande snedstreck. Netlify serverar
 * dist/<route>/index.html och 301:ar formen utan snedstreck, så canonical, og:url,
 * sitemap och JSON-LD måste peka på /route/ för att inte peka på en omdirigering.
 */
export const canonicalUrl = (path: string) =>
  SITE + (path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`)

// Google Business Profile. CID 0x5f4b27bdb9f58f3e = 6866625752678633278.
export const GOOGLE_MAPS_URL = 'https://www.google.com/maps?cid=6866625752678633278'
/** Kort "skriv omdöme"-länk från profilens admin — öppnar recensionsformuläret direkt. */
export const GOOGLE_REVIEW_URL = 'https://g.page/r/CT6P9bm9J0tfEBM/review'
const PLACE_QUERY = encodeURIComponent('Let Us Massage Lund, Stora Södergatan 58A, 222 23 Lund')
export const GOOGLE_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${PLACE_QUERY}`
// Inbäddningen med cid visar företagskortet (namn, adress, betyg); en textsökning med
// namn + adress gav en tom världskarta i test 2026-10-04.
export const GOOGLE_MAPS_EMBED_URL = 'https://maps.google.com/maps?cid=6866625752678633278&output=embed'
