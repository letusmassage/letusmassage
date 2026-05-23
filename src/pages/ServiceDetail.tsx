import { useParams, Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

interface ServiceItem {
  id: string
  name: string
  duration: string
  tag: string
  friskvard: boolean
  description: string
}

interface Session {
  name: string
  description: string
}

interface ServiceDetailData {
  intro: string
  what: string
  how: string
  whoFor: string[]
  benefits: string[]
  sessions: Session[]
  important?: string
  related?: string[]
}

interface TechniqueItem {
  id: string
  name: string
  tagline: string
}

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()

  const services = t('services.items', { returnObjects: true }) as ServiceItem[]
  const item = services.find(s => s.id === id)
  const details = t('serviceDetails', { returnObjects: true }) as Record<string, ServiceDetailData>
  const detail = id ? details[id] : undefined

  if (!item || !detail) {
    return <Navigate to="/" replace />
  }

  const techniques = t('techniques.items', { returnObjects: true }) as TechniqueItem[]
  const relatedTechniques = (detail.related ?? [])
    .map(rid => techniques.find(t => t.id === rid))
    .filter((x): x is TechniqueItem => Boolean(x))

  const url = `https://let-us-massage.se/behandlingar/${id}`
  const pageTitle = `${item.name} i Lund — ${item.duration} | Let Us Massage`
  const pageDescription = `${item.description} Boka ${item.name.toLowerCase()} hos Let Us Massage på Stora Södergatan 58A i Lund.`

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: item.name,
    description: item.description,
    provider: { '@id': 'https://let-us-massage.se/#business' },
    areaServed: { '@type': 'City', name: 'Lund' },
    url,
    serviceType: 'Massage',
    image: `https://let-us-massage.se/services/${id}.jpg`,
    availableLanguage: ['sv', 'en', 'el'],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hem', item: 'https://let-us-massage.se/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Behandlingar',
        item: 'https://let-us-massage.se/#services',
      },
      { '@type': 'ListItem', position: 3, name: item.name, item: url },
    ],
  }

  return (
    <main>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`https://let-us-massage.se/services/${id}.jpg`} />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <header className="relative pt-28 pb-12 px-4 bg-gradient-to-b from-sky-50 via-white to-stone-50">
        <div className="max-w-6xl mx-auto">
          <Link to="/#services" className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 mb-6">
            <span>←</span> {t('detail.backToServices')}
          </Link>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">{item.tag}</p>
              <h1 className="font-serif text-4xl md:text-5xl text-slate-800 mb-4">{item.name}</h1>
              <div className="flex items-center gap-3 flex-wrap mb-6">
                <span className="text-sm text-slate-500 bg-white border border-stone-200 px-4 py-1.5 rounded-full">{item.duration}</span>
                {item.friskvard && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {t('services.friskvard_badge')}
                  </span>
                )}
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">{detail.intro}</p>
            </div>
            <div className="aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
              <img
                src={`/services/${id}.jpg`}
                alt={`${item.name} – Massage i Lund hos Let Us Massage`}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <Block title={t('detail.whatTitle')} body={detail.what} />
          <Block title={t('detail.howTitle')} body={detail.how} />

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

          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-slate-800 mb-5">{t('detail.sessionsTitle')}</h2>
            <div className="space-y-3">
              {detail.sessions.map((s, i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-xl p-5">
                  <h3 className="font-medium text-slate-800 mb-1">{s.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {detail.important && (
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-6">
              <h2 className="font-serif text-xl text-sky-800 mb-2">{t('detail.importantTitle')}</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{detail.important}</p>
            </div>
          )}

          {relatedTechniques.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-slate-800 mb-5">{t('detail.relatedTitle')}</h2>
              <div className="flex flex-wrap gap-3">
                {relatedTechniques.map(t => (
                  <Link
                    key={t.id}
                    to={`/metoder/${t.id}`}
                    className="px-5 py-2.5 bg-white border border-stone-200 hover:border-sky-300 rounded-full text-sm text-slate-700 hover:text-sky-700 transition-colors"
                  >
                    {t.name}
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
