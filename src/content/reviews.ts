// Enda källan till kundomdömen på sajten. Datan ligger i reviews.json så att
// både klienten (Vite-import) och byggskriptet scripts/prerender.mjs (readFileSync)
// kan läsa exakt samma texter — schemat på sidan får aldrig säga något annat än
// det besökaren ser.
import data from './reviews.json'

export interface Review {
  author: string
  rating: number
  /** ISO-datum, härlett från Bokadirekts relativa tidsangivelse (±1 dag). */
  date: string
  lang: 'sv' | 'en'
  text: string
}

export interface ReviewSource {
  name: string
  url: string
  lastFetched: string
}

export const reviewSource = data.source as ReviewSource

/** Totalbetyg från Bokadirekt — inkluderar även omdömen utan text. */
export const reviewAggregate = data.aggregate as {
  ratingValue: number
  ratingCount: number
  bestRating: number
  worstRating: number
}

/** Omdömen med skriven text, nyast först. */
export const reviews: Review[] = (data.items as Review[])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date))
