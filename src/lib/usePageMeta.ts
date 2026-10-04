import { useEffect } from 'react'
import { canonicalUrl, DEFAULT_OG_IMAGE } from './site'

interface PageMeta {
  title: string
  description: string
  /** Route-sökvägen, t.ex. '/recensioner' — canonical räknas ut med canonicalUrl(). */
  path: string
  ogType?: 'website' | 'article'
  ogImage?: string
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Sätter sidans title/description/canonical/og/twitter genom att uppdatera taggarna
 * som scripts/prerender.mjs redan bakat in — aldrig genom att lägga till nya.
 * (react-helmet-async 3 på React 19 renderar riktiga element utan dedupe, vilket
 * gav två–tre titlar och canonicals per sida.) Taggarna uppdateras även vid
 * navigering i klienten och vid språkbyte.
 */
export function usePageMeta(meta: PageMeta | null) {
  const { title, description, path, ogType = 'website', ogImage = DEFAULT_OG_IMAGE } = meta ?? ({} as Partial<PageMeta>)
  useEffect(() => {
    // null = sidan saknar innehåll och omdirigerar (t.ex. okänt behandlings-id) — rör inget.
    if (title === undefined || description === undefined || path === undefined) return
    const url = canonicalUrl(path)
    document.title = title
    setMeta('name', 'description', description)
    setCanonical(url)
    setMeta('property', 'og:type', ogType)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', ogImage)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', ogImage)
  }, [title, description, path, ogType, ogImage])
}
