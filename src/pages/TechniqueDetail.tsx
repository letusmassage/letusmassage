import { useParams, Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface TechniqueItem {
  id: string
  name: string
  tagline: string
  description: string
  benefits: string[]
}

interface TechniqueDetailData {
  intro: string
  what: string
  how: string
  whoFor?: string[]
  benefits: string[]
  afterSession?: string
  usedIn?: string[]
}

interface ServiceItem {
  id: string
  name: string
  tag: string
}

export default function TechniqueDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()

  const items = t('techniques.items', { returnObjects: true }) as TechniqueItem[]
  const item = items.find(s => s.id === id)
  const details = t('techniqueDetails', { returnObjects: true }) as Record<string, TechniqueDetailData>
  const detail = id ? details[id] : undefined

  if (!item || !detail) {
    return <Navigate to="/" replace />
  }

  const services = t('services.items', { returnObjects: true }) as ServiceItem[]
  const usedInServices = (detail.usedIn ?? [])
    .map(sid => services.find(s => s.id === sid))
    .filter((x): x is ServiceItem => Boolean(x))

  return (
    <main>
      <header className="relative pt-32 pb-16 px-4 bg-gradient-to-b from-stone-50 via-white to-sky-50">
        <div className="max-w-4xl mx-auto">
          <Link to="/#techniques" className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 mb-6">
            <span>←</span> {t('detail.backToTechniques')}
          </Link>

          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">{item.tagline}</p>
          <h1 className="font-serif text-5xl md:text-6xl text-slate-800 mb-6">{item.name}</h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">{detail.intro}</p>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <Block title={t('detail.whatTitle')} body={detail.what} />
          <Block title={t('detail.howTitle')} body={detail.how} />

          {detail.whoFor && detail.whoFor.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-slate-800 mb-4">{t('detail.whoTitle')}</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {detail.whoFor.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <span className="text-sky-500 mt-1">·</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-slate-800 mb-4">{t('detail.benefitsTitle')}</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {detail.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <svg className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {detail.afterSession && (
            <Block title={t('detail.afterTitle')} body={detail.afterSession} />
          )}

          {usedInServices.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-slate-800 mb-5">
                {t('detail.relatedTitle')}
              </h2>
              <div className="flex flex-wrap gap-3">
                {usedInServices.map(s => (
                  <Link
                    key={s.id}
                    to={`/behandlingar/${s.id}`}
                    className="px-5 py-2.5 bg-white border border-stone-200 hover:border-sky-300 rounded-full text-sm text-slate-700 hover:text-sky-700 transition-colors"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-stone-200 text-center">
            <a
              href="https://business.bokadirekt.se/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-medium px-10 py-4 rounded-full transition-colors shadow-sm"
            >
              {t('detail.bookNow')}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-serif text-2xl md:text-3xl text-slate-800 mb-4">{title}</h2>
      <p className="text-slate-600 leading-relaxed">{body}</p>
    </div>
  )
}
