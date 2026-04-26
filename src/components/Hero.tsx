import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #0EA5E9 0%, #7DD3FC 30%, #BAE6FD 60%, #E0F2FE 100%)',
        backgroundImage: "url('/hero.jpg'), linear-gradient(160deg, #0EA5E9 0%, #7DD3FC 30%, #BAE6FD 60%, #E0F2FE 100%)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-sky-800/20 to-transparent" />

      <div className="relative text-center px-4 max-w-3xl mx-auto">
        <p className="text-sky-100 text-sm uppercase tracking-[0.3em] mb-4 drop-shadow">
          Lund, Sverige
        </p>
        <h1 className="text-5xl md:text-7xl font-light text-white tracking-wide drop-shadow-lg mb-5">
          Let Us Massage
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-light mb-3 drop-shadow">
          {t('hero.headline')}
        </p>
        <p className="text-base md:text-lg text-white/70 mb-12 drop-shadow">
          {t('hero.subheadline')}
        </p>
        <a
          href="https://business.bokadirekt.se/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-sky-700 font-semibold px-10 py-4 rounded-full text-lg hover:bg-sky-50 transition-colors shadow-xl"
        >
          {t('hero.cta')}
        </a>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
