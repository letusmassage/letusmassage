import { useTranslation } from 'react-i18next'

export default function AboutCompany() {
  const { t } = useTranslation()

  return (
    <section id="about-company" className="py-24 bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-4">
          {t('aboutCompany.title')}
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-8 leading-tight">
          {t('aboutCompany.lede')}
        </h2>
        <div className="space-y-5 text-slate-600 leading-relaxed text-base md:text-lg">
          <p>{t('aboutCompany.p1')}</p>
          <p>{t('aboutCompany.p2')}</p>
          <p>{t('aboutCompany.p3')}</p>
          <p>{t('aboutCompany.p4')}</p>
        </div>
      </div>
    </section>
  )
}
