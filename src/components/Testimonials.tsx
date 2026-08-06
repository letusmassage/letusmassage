import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { reviews, reviewAggregate, reviewSource } from '../content/reviews'
import ReviewCard from './ReviewCard'

// Visar ett urval på startsidan; hela listan bor på /recensioner.
// JSON-LD (aggregateRating + review) bakas in statiskt av scripts/prerender.mjs
// och dupliceras medvetet INTE här på klienten.
const PREVIEW_COUNT = 6

export default function Testimonials() {
  const { t } = useTranslation()

  if (reviews.length === 0) return null

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">Lund</p>
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800">
            {t('testimonials.title')}
          </h2>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">{t('testimonials.subtitle')}</p>

          <p className="mt-6 text-slate-700">
            <span className="text-amber-400 text-lg align-middle" aria-hidden="true">
              ★★★★★
            </span>{' '}
            <strong className="font-semibold">
              {reviewAggregate.ratingValue.toFixed(1).replace('.', ',')}
            </strong>{' '}
            <span className="text-slate-500">
              {t('testimonials.aggregate', {
                total: reviewAggregate.ratingCount,
                source: reviewSource.name,
              })}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, PREVIEW_COUNT).map((r, i) => (
            <ReviewCard key={`${r.author}-${i}`} review={r} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/recensioner"
            className="inline-block border-2 border-sky-500 text-sky-700 hover:bg-sky-50 font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {t('testimonials.readAll')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
