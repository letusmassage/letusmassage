import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

// Teaser som lägger sig i det mörka bandet under hero-bilden på mobil (bilden är
// `auto 80%` där, så ~80 px längst ned är tomma) och flyter över bildens nederkant
// på desktop. Hela kortet är en länk – ett enda träffområde på mobil.
export default function FriskvardTeaser() {
  const { t } = useTranslation()

  return (
    <section aria-label={t('friskvardTeaser.title')} className="relative z-10 -mt-16 px-4 md:-mt-14">
      <Link
        to="/friskvard"
        className="group mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-stone-100 bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl md:flex-row md:justify-between md:gap-6 md:px-8"
      >
        <div className="text-center md:text-left">
          <p className="text-[11px] uppercase tracking-[0.3em] text-sky-600">
            {t('friskvardTeaser.title')}
          </p>
          <p className="mt-0.5 text-sm text-slate-600">{t('friskvardTeaser.line')}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <img
              src="/partners/benifex.png"
              alt="Benifex"
              width={640}
              height={213}
              decoding="async"
              className="h-6 w-auto md:h-7"
            />
            <span className="text-[11px] text-slate-400">{t('friskvardTeaser.benifexNote')}</span>
          </span>
          <span aria-hidden="true" className="h-6 w-px bg-stone-200" />
          <img
            src="/partners/epassi.png"
            alt="Epassi"
            width={597}
            height={146}
            decoding="async"
            className="h-6 w-auto md:h-7"
          />
        </div>

        <span className="text-sm font-medium text-sky-600 transition-colors group-hover:text-sky-800">
          {t('friskvardTeaser.cta')} →
        </span>
      </Link>
    </section>
  )
}
