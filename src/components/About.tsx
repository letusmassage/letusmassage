import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-light text-sky-800 mb-10">{t('about.title')}</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-5">{t('about.p1')}</p>
        <p className="text-gray-600 text-lg leading-relaxed mb-12">{t('about.p2')}</p>
        <div className="inline-block border border-sky-100 rounded-2xl px-8 py-5 bg-sky-50">
          <p className="text-xs uppercase tracking-widest text-sky-400 mb-1">{t('about.address_label')}</p>
          <p className="text-gray-700 font-medium">Stora Södergatan 58A, 222 23 Lund</p>
          <p className="text-gray-400 text-sm mt-1">Ioulietta Refene</p>
        </div>
      </div>
    </section>
  )
}
