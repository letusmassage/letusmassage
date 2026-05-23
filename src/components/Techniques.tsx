import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface Technique {
  id: string
  name: string
  tagline: string
  description: string
  benefits: string[]
}

export default function Techniques() {
  const { t } = useTranslation()
  const items = t('techniques.items', { returnObjects: true }) as Technique[]

  return (
    <section id="techniques" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
            {t('techniques.subtitle')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-5">
            {t('techniques.title')}
          </h2>
          <p className="text-slate-600 leading-relaxed">
            {t('techniques.intro')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className="group bg-stone-50 hover:bg-white rounded-2xl p-7 border border-stone-100 hover:border-sky-200 hover:shadow-md transition-all flex flex-col"
            >
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-widest text-sky-600 mb-1">
                  {item.tagline}
                </p>
                <h3 className="font-serif text-2xl text-slate-800">{item.name}</h3>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-5 flex-1">
                {item.description}
              </p>

              <ul className="space-y-1.5 pt-4 border-t border-stone-200 mb-4">
                {item.benefits.slice(0, 3).map((benefit, j) => (
                  <li key={j} className="text-xs text-slate-500 flex items-start gap-2">
                    <span className="text-sky-500 mt-0.5">·</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={`/metoder/${item.id}`}
                className="text-sm text-sky-600 hover:text-sky-800 font-medium transition-colors mt-auto"
              >
                {t('detail.readMore')} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
