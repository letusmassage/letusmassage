export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'callout'; text: string }
  | { type: 'faq'; items: { q: string; a: string }[] }

export interface Article {
  slug: string
  title: string
  description: string
  /** Kortare <title> (utan " | Let Us Massage") när title är för lång för sökresultaten. */
  seoTitle?: string
  /** Meta description när den synliga description är längre än ~158 tecken. */
  seoDescription?: string
  date: string
  /** Senaste betydande ändring (ISO) — dateModified i schemat och lastmod i sitemapen. */
  updated?: string
  readMin: number
  keywords: string[]
  relatedServices: string[]
  relatedTechniques: string[]
  intro: string
  blocks: ArticleBlock[]
}
