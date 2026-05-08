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
  date: string
  readMin: number
  keywords: string[]
  relatedServices: string[]
  relatedTechniques: string[]
  intro: string
  blocks: ArticleBlock[]
}
