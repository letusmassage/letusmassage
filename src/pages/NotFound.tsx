import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Okänd adress. På Netlify serveras dist/404.html (status 404 + noindex, skapas av
// scripts/prerender.mjs); här sätts noindex även när man hamnar fel via klientnavigering.
export default function NotFound() {
  const { t } = useTranslation()

  useEffect(() => {
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const previous = robots?.content
    document.title = t('notFound.seoTitle')
    if (robots) robots.content = 'noindex, follow'
    return () => {
      if (robots && previous) robots.content = previous
    }
  }, [t])

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 pt-32 pb-16 bg-gradient-to-b from-stone-50 via-white to-sky-50">
      <div className="max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">404</p>
        <h1 className="font-serif text-4xl md:text-5xl text-slate-800 mb-6">{t('notFound.title')}</h1>
        <p className="text-slate-600 mb-8">{t('notFound.text')}</p>
        <Link
          to="/"
          className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          {t('notFound.home')}
        </Link>
      </div>
    </main>
  )
}
