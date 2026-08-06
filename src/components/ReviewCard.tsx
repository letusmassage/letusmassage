import type { Review } from '../content/reviews'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-3" role="img" aria-label={`${rating} av 5 stjärnor`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true" className={i < rating ? 'text-amber-400' : 'text-stone-300'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="bg-stone-50 rounded-xl border border-stone-100 p-6 flex flex-col h-full">
      <Stars rating={review.rating} />
      <blockquote
        lang={review.lang}
        className="text-slate-600 text-sm leading-relaxed flex-1 whitespace-pre-line"
      >
        {review.text}
      </blockquote>
      <figcaption className="mt-4 text-sm">
        <span className="font-medium text-slate-800">{review.author}</span>
        <time dateTime={review.date} className="block text-xs text-slate-400 mt-0.5">
          {new Date(review.date).toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
          })}
        </time>
      </figcaption>
    </figure>
  )
}
