import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

interface Review {
  author: string
  rating: number // 1–5
  text: string
  date?: string // ISO date, e.g. '2026-06-12'
}

// TODO(owner): paste REAL reviews from Google / Bokadirekt here. Never invent reviews or ratings.
// Example: { author: 'Anna S.', rating: 5, text: 'Fantastisk massage!', date: '2026-06-12' }
const reviews: Review[] = []

const BUSINESS_ID = 'https://let-us-massage.se/#business'

export default function Testimonials() {
  const { t } = useTranslation()

  // Renders nothing until real reviews are added — keeps the page unchanged and
  // avoids emitting empty/fabricated Review schema.
  if (reviews.length === 0) return null

  const average =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: 'Let Us Massage',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Number(average.toFixed(1)),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map(r => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: { '@type': 'Person', name: r.author },
      reviewBody: r.text,
      ...(r.date ? { datePublished: r.date } : {}),
    })),
  }

  return (
    <section id="testimonials" className="py-24 bg-white">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">Lund</p>
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800">
            {t('testimonials.title')}
          </h2>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="bg-stone-50 rounded-xl border border-stone-100 p-6 flex flex-col"
            >
              <div
                className="flex gap-0.5 mb-3"
                aria-label={`${r.rating} av 5`}
              >
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className={s < r.rating ? 'text-amber-400' : 'text-stone-300'}>
                    ★
                  </span>
                ))}
              </div>
              <blockquote className="text-slate-600 text-sm leading-relaxed flex-1">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-slate-800">
                {r.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
