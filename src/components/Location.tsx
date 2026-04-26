import { useTranslation } from 'react-i18next'

export default function Location() {
  const { t } = useTranslation()

  return (
    <section id="location" className="py-24 bg-sky-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-sky-800 mb-3">{t('location.title')}</h2>
          <p className="text-gray-600 font-medium">{t('location.address')}</p>
          <p className="text-gray-400 text-sm mt-1">{t('location.building')}</p>
          <a
            href="https://maps.google.com/?q=Stora+S%C3%B6dergatan+58A,+222+23+Lund,+Sweden"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sky-500 hover:text-sky-700 text-sm font-medium transition-colors"
          >
            {t('location.directions')} →
          </a>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-sm h-80 border border-sky-100">
          <iframe
            title="Let Us Massage location"
            src="https://maps.google.com/maps?q=Stora+S%C3%B6dergatan+58A,+222+23+Lund,+Sweden&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
