import { useTranslation } from 'react-i18next'

interface ServiceItem {
  name: string
  duration: string
  description: string
}

export default function Services() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true }) as ServiceItem[]

  return (
    <section id="services" className="py-24 bg-sky-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-light text-sky-800 mb-3">{t('services.title')}</h2>
          <p className="text-gray-400">{t('services.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow border border-sky-50"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-sky-800">{item.name}</h3>
                <span className="text-xs text-sky-500 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full whitespace-nowrap ml-3">
                  {item.duration}
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{item.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-sky-50">
                <span className="text-xs text-gray-300 italic">{t('services.contact_price')}</span>
                <a
                  href="https://business.bokadirekt.se/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sky-500 hover:text-sky-700 font-medium transition-colors"
                >
                  {t('services.book_service')} →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://business.bokadirekt.se/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium px-8 py-3.5 rounded-full transition-colors shadow-sm"
          >
            {t('nav.book')}
          </a>
        </div>
      </div>
    </section>
  )
}
