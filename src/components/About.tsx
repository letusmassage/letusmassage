import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()
  const [showStory, setShowStory] = useState(false)
  const storyParagraphs = t('about.nameStoryParagraphs', { returnObjects: true }) as string[]

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-1 relative max-w-[85%] mx-auto md:mx-0 md:ml-auto">
            <div className="aspect-[2/3] overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/letta.jpg"
                alt="Ioulietta Refene — certifierad medicinsk massageterapeut hos Let Us Massage i Lund"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl px-5 py-3 shadow-lg">
              <p className="text-xs uppercase tracking-widest text-sky-600">Sedan 2009</p>
              <p className="text-sm text-slate-700 font-medium mt-0.5">Certifierad terapeut</p>
            </div>
          </div>

          <div className="order-2 relative">
            <button
              onClick={() => setShowStory(!showStory)}
              className="absolute -top-2 right-0 bg-white border border-sky-200 text-sky-700 text-[11px] tracking-widest font-medium uppercase px-3 py-1.5 rounded-full hover:bg-sky-50 hover:border-sky-300 transition-colors shadow-sm z-10"
            >
              {showStory ? t('about.nameStoryBack') : t('about.nameStoryButton')}
            </button>

            {showStory ? (
              <div className="pt-10">
                <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
                  {t('about.title')}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-slate-800 mb-6 leading-tight">
                  {t('about.nameStoryTitle')}
                </h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  {storyParagraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <p className="mt-8 font-serif italic text-lg text-slate-700 border-l-2 border-sky-300 pl-6">
                  {t('about.nameStoryClosing')}
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
                  {t('about.title')}
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-3 leading-tight">
                  {t('about.lede')}
                </h2>
                <p className="text-sm text-slate-400 italic mb-6">{t('about.nameVariants')}</p>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>{t('about.p1')}</p>
                  <p>{t('about.p2')}</p>
                  <p>{t('about.p3')}</p>
                  <p>{t('about.p4')}</p>
                </div>

                <blockquote className="mt-8 pl-6 border-l-2 border-sky-300 italic font-serif text-xl text-slate-700">
                  "{t('about.quote')}"
                  <footer className="not-italic font-sans text-sm text-slate-500 mt-2 tracking-wide">
                    — <span className="font-serif font-bold text-base">I</span>oulietta Refene
                  </footer>
                </blockquote>

                <div className="mt-8 flex items-center gap-4 flex-wrap">
                  <img
                    src="/kroppsterapeuterna.png"
                    alt="Kroppsterapeuterna – yrkesförbund för certifierade massageterapeuter i Sverige"
                    className="h-16 w-auto"
                  />
                  <p className="text-sm text-slate-500 max-w-xs">
                    {t('about.credentials')}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
