import { useTranslation } from 'react-i18next'

interface WhyItem {
  title: string
  body: string
}

export default function WhyChooseUs() {
  const { t } = useTranslation()
  const items = t('why.items', { returnObjects: true }) as WhyItem[]

  return (
    <section id="why" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
            {t('why.subtitle')}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-slate-800">
            {t('why.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex gap-5">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-serif text-lg">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
