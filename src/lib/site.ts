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
