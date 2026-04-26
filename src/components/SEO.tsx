import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

export default function SEO() {
  const { t, i18n } = useTranslation()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Let Us Massage',
    description: t('seo.description'),
    url: 'https://let-us-massage.se',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Stora Södergatan 58A',
      addressLocality: 'Lund',
      postalCode: '222 23',
      addressCountry: 'SE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 55.7047,
      longitude: 13.191,
    },
    openingHours: ['Mo-Fr 10:00-19:00', 'Sa 10:00-17:00'],
    founder: { '@type': 'Person', name: 'Ioulietta Refene' },
    priceRange: '$$',
    sameAs: [],
  }

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{t('seo.title')}</title>
      <meta name="description" content={t('seo.description')} />
      <link rel="canonical" href="https://let-us-massage.se" />
      <meta property="og:title" content={t('seo.title')} />
      <meta property="og:description" content={t('seo.description')} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://let-us-massage.se" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
