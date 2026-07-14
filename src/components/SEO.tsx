import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const SITE = 'https://let-us-massage.se'

const localeMap: Record<string, string> = { sv: 'sv_SE', en: 'en_US', el: 'el_GR' }

// NOTE: JSON-LD structured data (LocalBusiness, Person, Service, FAQPage) is emitted
// at build time into the static HTML by scripts/prerender.mjs, so non-JS crawlers see it
// in the initial response. It is intentionally NOT duplicated here on the client.
export default function SEO() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { pathname } = useLocation()
  const canonicalPath = pathname === '/' ? '/' : pathname
  const canonical = SITE + canonicalPath

  return (
    <Helmet>
      <html lang={lang} />
      <title>{t('seo.title')}</title>
      <meta name="description" content={t('seo.description')} />
      <link rel="canonical" href={canonical} />
      {/* Site serves all languages at one URL; true multilingual hreflang needs distinct per-language URLs. */}
      <link rel="alternate" hrefLang="sv" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <meta property="og:title" content={t('seo.title')} />
      <meta property="og:description" content={t('seo.description')} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${SITE}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Let Us Massage – Professionell massageterapi i Lund" />
      <meta property="og:locale" content={localeMap[lang] ?? 'sv_SE'} />
      <meta property="og:site_name" content="Let Us Massage" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t('seo.title')} />
      <meta name="twitter:description" content={t('seo.description')} />
      <meta name="twitter:image" content={`${SITE}/og-image.jpg`} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="geo.region" content="SE-M" />
      <meta name="geo.placename" content="Lund" />
      <meta name="geo.position" content="55.696716;13.189148" />
      <meta name="ICBM" content="55.696716, 13.189148" />
      <meta name="author" content="Ioulietta Refene" />
    </Helmet>
  )
}
