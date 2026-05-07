import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 md:order-1">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
              {t('about.title')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-800 mb-6 leading-tight">
              {t('about.lede')}
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
              <p>{t('about.p4')}</p>
            </div>

            <blockquote className="mt-8 pl-6 border-l-2 border-sky-300 italic font-serif text-xl text-slate-700">
              "{t('about.quote')}"
              <footer className="not-italic font-sans text-sm text-slate-500 mt-2 tracking-wide">
                — Ioulietta Refene
              </footer>
            </blockquote>

            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <img
                src="/kroppsterapeuterna.png"
                alt="Kroppsterapeuterna sigill"
                className="h-16 w-auto"
              />
              <p className="text-sm text-slate-500 max-w-xs">
                {t('about.credentials')}
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/ioulietta.jpg"
                alt="Ioulietta Refene — Massageterapeut"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-5 py-3 shadow-lg">
              <p className="text-xs uppercase tracking-widest text-sky-600">Sedan 2009</p>
              <p className="text-sm text-slate-700 font-medium mt-0.5">Certifierad terapeut</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
