import { useTranslation } from 'react-i18next'
import FaqAccordion, { type FaqItem } from './FaqAccordion'

export default function FAQ() {
  const { t } = useTranslation()
  const items = t('faq.items', { returnObjects: true }) as FaqItem[]

  return (
    <section id="faq" className="py-24 bg-stone-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
            {t('faq.subtitle')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800">
            {t('faq.title')}
          </h2>
        </div>

        <FaqAccordion items={items} />
      </div>
    </section>
  )
}
