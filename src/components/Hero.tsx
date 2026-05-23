import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
    >
      <div
        className="absolute inset-0 hero-bg bg-slate-900"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-white/30" />

      <div className="absolute inset-y-0 left-0 w-1/3 md:w-1/4 bg-gradient-to-r from-slate-900/45 via-slate-900/15 to-transparent pointer-events-none z-[2]" />
      <div className="absolute inset-y-0 right-0 w-1/3 md:w-1/4 bg-gradient-to-l from-slate-900/45 via-slate-900/15 to-transparent pointer-events-none z-[2]" />

      <img
        src="/logo.png"
        alt="Let Us Massage – Massageterapi i Lund"
        className="hidden md:block absolute md:top-1/2 -translate-y-1/2 md:left-6 md:w-64 h-auto drop-shadow-2xl z-10"
      />

      <div className="relative z-10 pt-32 md:pt-28 px-4 text-center max-w-3xl mx-auto">
        <p className="text-white/90 text-xs uppercase tracking-[0.4em] mb-3 drop-shadow">
          {t('hero.eyebrow')}
        </p>
        <p className="font-serif text-2xl md:text-4xl text-white font-light mb-2 drop-shadow italic">
          {t('hero.headline')}
        </p>
        <p className="text-sm md:text-base text-white/85 max-w-xl mx-auto drop-shadow">
          {t('hero.subheadline')}
        </p>
      </div>

      <div className="hidden md:block absolute top-72 -translate-y-1/2 right-2 md:top-1/2 md:right-6 z-10">
        <a
          href="https://business.bokadirekt.se/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white/95 hover:bg-white text-slate-800 font-medium px-6 md:px-8 py-3 md:py-3.5 rounded-full text-sm md:text-base hover:scale-[1.02] transition-all shadow-xl backdrop-blur-sm"
        >
          {t('hero.cta')}
        </a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
