import type { Article } from './types'
import { article as a1 } from './spanningshuvudvark'
import { article as a2 } from './friskvardsbidrag'
import { article as a3 } from './klassisk-vs-massageterapi'
import { article as a4 } from './gravidmassage'
import { article as a5 } from './deep-tissue-vs-svensk'
import { article as a6 } from './triggerpunkter'
import { article as a7 } from './stillasittande-arbete'
import { article as a8 } from './massage-lund-guide'

export const ARTICLES: Article[] = [a1, a2, a3, a4, a5, a6, a7, a8].sort(
  (x, y) => (x.date < y.date ? 1 : -1)
)

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug)
}
