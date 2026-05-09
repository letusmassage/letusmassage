import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

const SITE = 'https://let-us-massage.se'
const BUSINESS_ID = `${SITE}/#business`
const PERSON_ID = `${SITE}/#ioulietta`

const SERVICES = [
  {
    id: 'relax',
    name: 'Relaxmassage',
    description: 'Avslappnande svensk massage för stresshantering och välbefinnande.',
    therapeutic: false,
  },
  {
    id: 'klassisk',
    name: 'Klassisk Massage',
    description:
      'Förebyggande friskvårdsmassage med svensk massage, deep tissue och myofasciell release. Godkänd för friskvårdsbidrag.',
    therapeutic: false,
  },
  {
    id: 'massageterapi',
    name: 'Massageterapi',
    description:
      'Terapeutisk massage med trigger point therapy, neuromuskulär terapi, deep tissue och myofasciell release för smärta och nedsatt rörlighet.',
    therapeutic: true,
  },
  {
    id: 'prenatal',
    name: 'Gravidmassage',
    description:
      'Mjuk, säker massage anpassad för gravida från andra trimestern. Sidoläge med fullt kuddstöd.',
    therapeutic: false,
  },
]

const localeMap: Record<string, string> = { sv: 'sv_SE', en: 'en_US', el: 'el_GR' }

export default function SEO() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
        '@id': BUSINESS_ID,
        name: 'Let Us Massage',
        legalName: 'Let Us Massage',
        description: t('seo.description'),
        url: SITE,
        slogan: t('hero.headline'),
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
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 55.7047,
          longitude: 13.191,
        },
        hasMap:
          'https://www.google.com/maps/search/?api=1&query=Stora+S%C3%B6dergatan+58A%2C+222+23+Lund',
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
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '10:00',
            closes: '19:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '10:00',
            closes: '17:00',
          },
        ],
        priceRange: '550-1295 SEK',
        currenciesAccepted: 'SEK',
        paymentAccepted: 'Cash, Credit Card, Epassi, Benify, ActiWay',
        knowsLanguage: ['sv', 'en', 'el'],
        sameAs: [],
        makesOffer: SERVICES.map(s => ({
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
        alternateName: [
          'Joulietta Refene',
          'Louiletta Refene',
          'Julietta Refene',
          'Iuletta Refene',
          'Juliette Refene',
          'Ιουλιέττα Ρεφενέ',
          'Joulietta',
          'Louiletta',
          'Julietta',
        ],
        jobTitle: 'Certifierad medicinsk massageterapeut',
        worksFor: { '@id': BUSINESS_ID },
        image: `${SITE}/letta.jpg`,
        nationality: { '@type': 'Country', name: 'Greece' },
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'Natural Health Science',
          address: 'Athens, Greece',
        },
        memberOf: {
          '@type': 'Organization',
          name: 'Kroppsterapeuternas Yrkesförbund',
          identifier: '36786',
          url: 'https://www.kroppsterapeuterna.se',
        },
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'certification',
          name: 'Certifierad medicinsk massageterapeut',
          recognizedBy: {
            '@type': 'Organization',
            name: 'Kroppsterapeuternas Yrkesförbund',
          },
        },
        knowsLanguage: ['sv', 'en', 'el'],
        knowsAbout: [
          'Svensk massage',
          'Deep tissue massage',
          'Myofascial release',
          'Neuromuscular therapy',
          'Trigger point therapy',
          'Prenatal massage',
          'Sports massage',
          'Anatomy',
        ],
      },
      ...SERVICES.map(s => ({
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
  }

  return (
    <Helmet>
      <html lang={lang} />
      <title>{t('seo.title')}</title>
      <meta name="description" content={t('seo.description')} />
      <link rel="canonical" href={SITE} />
      <link rel="alternate" hrefLang="sv" href={SITE} />
      <link rel="alternate" hrefLang="en" href={SITE} />
      <link rel="alternate" hrefLang="x-default" href={SITE} />
      <meta property="og:title" content={t('seo.title')} />
      <meta property="og:description" content={t('seo.description')} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE} />
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
      <meta name="geo.position" content="55.7047;13.191" />
      <meta name="ICBM" content="55.7047, 13.191" />
      <meta name="author" content="Ioulietta Refene" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
