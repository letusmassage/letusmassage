import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import FaqAccordion, { type FaqItem } from '../components/FaqAccordion'
import { BOKADIREKT_GIFTCARD, BOKADIREKT_PHYSICAL_GIFTCARD } from '../lib/bokadirekt'

const SITE = 'https://let-us-massage.se'
const CANONICAL = `${SITE}/presentkort`

export default function Gifts() {
  const { t, i18n } = useTranslation()

  const intro = t('gifts.intro', { returnObjects: true }) as string[]
  const occasions = t('gifts.occasions.items', { returnObjects: true }) as string[]
  const faqItems = t('gifts.faq.items', { returnObjects: true }) as FaqItem[]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: t('gifts.title'), item: CANONICAL },
    ],
  }

  return (
    <main>
      <Helmet>
        <title>{t('gifts.seo.title')}</title>
        <meta name="description" content={t('gifts.seo.description')} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={t('gifts.seo.title')} />
        <meta property="og:description" content={t('gifts.seo.description')} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="website" />
        <html lang={i18n.language} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Sidhuvud – text till vänster, foto på det fysiska presentkortet till höger */}
      <header className="relative pt-32 pb-16 px-4 bg-gradient-to-b from-stone-50 via-white to-sky-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
              {t('gifts.eyebrow')}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-slate-800 mb-4">
              {t('gifts.title')}
            </h1>
            <p className="text-xl text-slate-700 italic mb-5">{t('gifts.lede')}</p>
            <p className="font-serif text-2xl text-slate-800 italic mb-6">{t('gifts.quote')}</p>
            <div className="space-y-3 text-base md:text-lg text-slate-600 leading-relaxed">
              {intro.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          <div className="order-first md:order-last">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/presentkort-fysiskt.jpg"
                alt={t('gifts.imageAlt')}
                width={1400}
                height={1050}
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Ge bort något som verkligen uppskattas */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-6">
            {t('gifts.enjoy.title')}
          </h2>
          <div className="space-y-4 text-base md:text-lg text-slate-600 leading-relaxed">
            <p>{t('gifts.enjoy.p1')}</p>
            <p>{t('gifts.enjoy.p2')}</p>
          </div>
        </div>
      </section>

      {/* Två alternativ: digitalt och fysiskt presentkort */}
      <section className="pb-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800 text-center mb-12">
            {t('gifts.choose.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Digitalt */}
            <article className="bg-white border border-stone-200 rounded-2xl p-8 md:p-10 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xl mb-5">
                ✶
              </div>
              <h3 className="font-serif text-3xl text-slate-800 mb-4">{t('gifts.digital.title')}</h3>
              <p className="text-slate-600 leading-relaxed mb-3">{t('gifts.digital.p1')}</p>
              <p className="text-slate-600 leading-relaxed mb-8 flex-1">{t('gifts.digital.p2')}</p>

              <a
                href={BOKADIREKT_GIFTCARD}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-block text-center bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                {t('gifts.digital.cta')} →
              </a>
            </article>

            {/* Fysiskt */}
            <article className="bg-white border border-stone-200 rounded-2xl p-8 md:p-10 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-xl mb-5">
                ❀
              </div>
              <h3 className="font-serif text-3xl text-slate-800 mb-4">
                {t('gifts.physical.title')}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-3">{t('gifts.physical.p1')}</p>
              <p className="text-slate-600 leading-relaxed mb-3">{t('gifts.physical.p2')}</p>
              <p className="text-slate-600 leading-relaxed mb-3">{t('gifts.physical.p3')}</p>
              <p className="text-slate-600 leading-relaxed mb-8 flex-1">{t('gifts.physical.p4')}</p>

              <a
                href={BOKADIREKT_PHYSICAL_GIFTCARD}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-block text-center bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                {t('gifts.physical.cta')} →
              </a>
              <p className="text-xs text-slate-400 italic leading-relaxed mt-3 text-center">
                {t('gifts.physical.note')}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* En present för alla tillfällen */}
      <section className="py-20 px-4 bg-stone-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-8">
            {t('gifts.occasions.title')}
          </h2>

          <ul className="flex flex-wrap justify-center gap-2.5 mb-10">
            {occasions.map((occasion, i) => (
              <li
                key={i}
                className="bg-white border border-stone-200 text-slate-600 text-sm px-4 py-1.5 rounded-full"
              >
                {occasion}
              </li>
            ))}
          </ul>

          <div className="space-y-3 text-base md:text-lg text-slate-600 leading-relaxed mb-10">
            <p>{t('gifts.occasions.p1')}</p>
            <p>{t('gifts.occasions.p2')}</p>
          </div>

          <p className="font-serif text-2xl text-slate-800 mb-2">Let Us Massage</p>
          <p className="text-slate-600 italic">{t('gifts.closing.tagline')}</p>
        </div>
      </section>

      {/* Vanliga frågor */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-slate-800">
              {t('gifts.faq.title')}
            </h2>
          </div>
          <FaqAccordion items={faqItems} />
        </div>
      </section>
    </main>
  )
}
