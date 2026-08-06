import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { reviews, reviewAggregate, reviewSource } from '../content/reviews'
import ReviewCard from '../components/ReviewCard'

const SITE = 'https://let-us-massage.se'
const CANONICAL = `${SITE}/recensioner`

// Google Business Profile. TODO(owner): byt till den korta "skriv omdöme"-länken
// (https://g.page/r/.../review) som finns i GBP-adminen — den öppnar formuläret direkt.
const GOOGLE_REVIEW_URL = 'https://maps.app.goo.gl/v66Jk7S2g5QqUKn56'

// JSON-LD för aggregateRating + review bakas in statiskt av scripts/prerender.mjs.
// Här läggs bara breadcrumb till, i linje med övriga undersidor.
export default function Reviews() {
  const { t, i18n } = useTranslation()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: t('reviewsPage.title'), item: CANONICAL },
    ],
  }

  const formattedRating = reviewAggregate.ratingValue.toFixed(1).replace('.', ',')

  return (
    <main>
      <Helmet>
        <title>{t('reviewsPage.seo.title')}</title>
        <meta name="description" content={t('reviewsPage.seo.description')} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={t('reviewsPage.seo.title')} />
        <meta property="og:description" content={t('reviewsPage.seo.description')} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="website" />
        <html lang={i18n.language} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <header className="relative pt-32 pb-16 px-4 bg-gradient-to-b from-stone-50 via-white to-sky-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
            {t('reviewsPage.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-800 mb-6">
            {t('reviewsPage.title')}
          </h1>

          <div className="flex flex-col items-center gap-2 mb-8">
            <span className="text-amber-400 text-3xl tracking-wide" aria-hidden="true">
              ★★★★★
            </span>
            <p className="text-slate-700">
              <strong className="text-2xl font-semibold">{formattedRating}</strong>{' '}
              <span className="text-slate-500">
                {t('reviewsPage.aggregate', {
                  total: reviewAggregate.ratingCount,
                  source: reviewSource.name,
                })}
              </span>
            </p>
          </div>

          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-4">
            {t('reviewsPage.intro1')}
          </p>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {t('reviewsPage.intro2')}
          </p>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="sr-only">{t('reviewsPage.listHeading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <ReviewCard key={`${r.author}-${i}`} review={r} />
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            {t('reviewsPage.attribution', { source: reviewSource.name })}{' '}
            <a
              href={reviewSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600"
            >
              {t('reviewsPage.attributionLink')}
            </a>
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-stone-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-4">
            {t('reviewsPage.leave.title')}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8">{t('reviewsPage.leave.body')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              {t('reviewsPage.leave.google')} →
            </a>
            <a
              href={reviewSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-sky-500 text-sky-700 hover:bg-sky-50 font-medium px-6 py-3 rounded-lg transition-colors"
            >
              {t('reviewsPage.leave.bokadirekt')} →
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
