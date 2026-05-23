import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FaqItem {
  q: string
  a: string
}

export default function FAQ() {
  const { t } = useTranslation()
  const items = t('faq.items', { returnObjects: true }) as FaqItem[]
  const [open, setOpen] = useState<number | null>(0)

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

        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-stone-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left px-6 py-5 hover:bg-stone-50 transition-colors"
                >
                  <span className="font-medium text-slate-800 pr-4">{item.q}</span>
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-sm transition-transform ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
