import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-white/30" />

      <img
        src="/logo.png"
        alt="Let Us Massage"
        className="absolute top-20 left-4 md:top-24 md:left-10 w-20 md:w-28 h-auto drop-shadow-lg z-10"
      />

      <div className="relative z-10 pt-28 md:pt-32 px-4 text-center max-w-3xl mx-auto">
        <p className="text-white/90 text-xs uppercase tracking-[0.4em] mb-3 drop-shadow">
          {t('hero.eyebrow')}
        </p>
        <p className="font-serif text-3xl md:text-5xl text-white font-light mb-2 drop-shadow italic">
          {t('hero.headline')}
        </p>
        <p className="text-sm md:text-base text-white/85 max-w-xl mx-auto drop-shadow">
          {t('hero.subheadline')}
        </p>
      </div>

      <div className="absolute bottom-16 right-6 md:bottom-24 md:right-12 z-10">
        <a
          href="https://business.bokadirekt.se/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white/95 hover:bg-white text-slate-800 font-medium px-8 py-3.5 rounded-full text-sm md:text-base hover:scale-[1.02] transition-all shadow-xl backdrop-blur-sm"
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
