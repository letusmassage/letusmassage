import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface ServiceItem {
  id: string
  name: string
  duration: string
  tag: string
  friskvard: boolean
  description: string
}

export default function Services() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true }) as ServiceItem[]

  return (
    <section id="services" className="py-24 bg-stone-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
            {t('services.subtitle')}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-slate-800">
            {t('services.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-stone-100 flex flex-col overflow-hidden"
            >
              <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                <img
                  src={`/services/${item.id}.jpg`}
                  alt={`${item.name} – ${item.tag} hos Let Us Massage i Lund`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div className="p-7 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-sky-600 mb-1">
                    {item.tag}
                  </p>
                  <h3 className="font-serif text-2xl text-slate-800">{item.name}</h3>
                </div>
                <span className="text-xs text-slate-500 bg-stone-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                  {item.duration}
                </span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                {item.description}
              </p>

              {item.friskvard && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {t('services.friskvard_badge')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <Link
                  to={`/behandlingar/${item.id}`}
                  className="text-sm text-slate-500 hover:text-sky-600 font-medium transition-colors"
                >
                  {t('detail.readMore')}
                </Link>
                <a
                  href="https://business.bokadirekt.se/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sky-600 hover:text-sky-800 font-medium transition-colors"
                >
                  {t('services.book_service')} →
                </a>
              </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://business.bokadirekt.se/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-medium px-8 py-3.5 rounded-full transition-colors shadow-sm"
          >
            {t('nav.book')}
          </a>
        </div>
      </div>
    </section>
  )
}
