import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import FaqAccordion, { type FaqItem } from '../components/FaqAccordion'
import { BOKADIREKT_PLACE } from '../lib/bokadirekt'

const SITE = 'https://let-us-massage.se'
const CANONICAL = `${SITE}/friskvard`

interface Step {
  title: string
  p1: string
  p2?: string
  listIntro?: string
  list?: string[]
  important?: string
}

interface Treatment {
  id: string
  name: string
  text: string
}

// Logotyperna visas både här i sidhuvudet och i steg 1 – det är via Benifex/Epassi
// besökaren faktiskt köper behandlingen.
function PartnerLogos({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const { t } = useTranslation()
  const h = size === 'lg' ? 'h-10 md:h-12' : 'h-6'

  // Logotyperna får inte plats bredvid varandra på mobil – där staplas de i stället,
  // och den lodräta avdelaren döljs så att den inte hänger löst på egen rad.
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-5 gap-y-3">
      <span className="flex items-center gap-2">
        <img
          src="/partners/benifex.png"
          alt="Benifex"
          width={640}
          height={213}
          decoding="async"
          className={`${h} w-auto`}
        />
        <span className="text-xs text-slate-400">{t('friskvardPage.benifexNote')}</span>
      </span>
      <span aria-hidden="true" className={`hidden sm:block ${h} w-px bg-stone-200`} />
      <img
        src="/partners/epassi.png"
        alt="Epassi"
        width={597}
        height={146}
        decoding="async"
        className={`${h} w-auto`}
      />
    </div>
  )
}

// FAQPage-schemat för den här sidan bakas in statiskt av scripts/prerender.mjs,
// precis som för startsidan. Här läggs bara brödsmulorna till.
export default function Friskvard() {
  const { t, i18n } = useTranslation()

  const steps = t('friskvardPage.how.steps', { returnObjects: true }) as Step[]
  const treatments = t('friskvardPage.treatments.items', { returnObjects: true }) as Treatment[]
  const faqItems = t('friskvardPage.faq.items', { returnObjects: true }) as FaqItem[]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: t('friskvardPage.title'), item: CANONICAL },
    ],
  }

  return (
    <main>
      <Helmet>
        <title>{t('friskvardPage.seo.title')}</title>
        <meta name="description" content={t('friskvardPage.seo.description')} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={t('friskvardPage.seo.title')} />
        <meta property="og:description" content={t('friskvardPage.seo.description')} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="website" />
        <html lang={i18n.language} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Sidhuvud */}
      <header className="relative pt-32 pb-16 px-4 bg-gradient-to-b from-stone-50 via-white to-sky-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
            {t('friskvardPage.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-800 mb-6">
            {t('friskvardPage.title')}
          </h1>
          <p className="text-xl text-slate-700 italic mb-6">{t('friskvardPage.lede')}</p>
          <p className="font-serif text-2xl text-slate-800 mb-5">{t('friskvardPage.question')}</p>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-4">
            {t('friskvardPage.intro1')}
          </p>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-10">
            {t('friskvardPage.intro2')}
          </p>

          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400 mb-4">
            {t('friskvardPage.partnersLabel')}
          </p>
          <PartnerLogos />
        </div>
      </header>

      {/* Så fungerar det */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-4">
              {t('friskvardPage.how.title')}
            </h2>
            <p className="text-slate-600 leading-relaxed">{t('friskvardPage.how.intro')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-serif text-lg">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{step.p1}</p>
                  {step.p2 && (
                    <p className="text-slate-600 leading-relaxed text-sm mt-2">{step.p2}</p>
                  )}

                  {i === 0 && (
                    <div className="mt-4">
                      <PartnerLogos size="sm" />
                    </div>
                  )}

                  {step.listIntro && (
                    <p className="text-slate-600 leading-relaxed text-sm mt-3">{step.listIntro}</p>
                  )}
                  {step.list && (
                    <ol className="text-slate-600 leading-relaxed text-sm space-y-1.5 list-decimal pl-5 mt-2">
                      {step.list.map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ol>
                  )}
                  {step.important && (
                    <p className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
                      {step.important}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={BOKADIREKT_PLACE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-medium px-8 py-3.5 rounded-full transition-colors shadow-sm"
            >
              {t('detail.bookNow')} →
            </a>
          </div>
        </div>
      </section>

      {/* Godkända behandlingar */}
      <section className="py-20 px-4 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-4">
              {t('friskvardPage.treatments.title')}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {t('friskvardPage.treatments.intro')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {treatments.map(item => (
              <article
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-stone-100 flex flex-col overflow-hidden"
              >
                <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                  <picture className="contents">
                    <source srcSet={`/services/${item.id}.webp`} type="image/webp" />
                    <img
                      src={`/services/${item.id}.jpg`}
                      alt={`${item.name} – godkänd för friskvårdsbidrag hos Let Us Massage i Lund`}
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={360}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                </div>

                <div className="p-7 flex flex-col flex-1">
                  <h3 className="font-serif text-2xl text-slate-800 mb-3">{item.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">{item.text}</p>

                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t('services.friskvard_badge')}
                    </span>
                  </div>

                  <Link
                    to={`/behandlingar/${item.id}`}
                    className="text-sm text-sky-600 hover:text-sky-800 font-medium transition-colors pt-4 border-t border-stone-100"
                  >
                    {t('detail.readMore')} →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/#services"
              className="text-sm text-sky-600 hover:text-sky-800 font-medium transition-colors"
            >
              {t('friskvardPage.treatments.all')} →
            </Link>
          </div>
        </div>
      </section>

      {/* Friskvård och massage */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-8">
            {t('friskvardPage.why.title')}
          </h2>
          <div className="space-y-5 text-slate-600 leading-relaxed text-base md:text-lg">
            <p>{t('friskvardPage.why.p1')}</p>
            <p>{t('friskvardPage.why.p2')}</p>
            <p>{t('friskvardPage.why.p3')}</p>
          </div>
        </div>
      </section>

      {/* Vanliga frågor */}
      <section className="py-20 px-4 bg-stone-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-slate-800">
              {t('friskvardPage.faq.title')}
            </h2>
          </div>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* Avslutande uppmaning */}
      <section className="py-20 px-4 bg-sky-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-4">
            {t('friskvardPage.cta.title')}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8">{t('friskvardPage.cta.body')}</p>
          <a
            href={BOKADIREKT_PLACE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium px-8 py-3.5 rounded-full transition-colors shadow-sm"
          >
            {t('friskvardPage.cta.button')} →
          </a>
        </div>
      </section>
    </main>
  )
}
