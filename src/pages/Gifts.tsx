import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

interface FaqItem {
  q: string
  a: string
}

export default function Gifts() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState<number | null>(0)

  const digitalBullets = t('gifts.digital.bullets', { returnObjects: true }) as string[]
  const printedBullets = t('gifts.printed.bullets', { returnObjects: true }) as string[]
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
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://let-us-massage.se/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('gifts.title'),
        item: 'https://let-us-massage.se/presentkort',
      },
    ],
  }

  return (
    <main>
      <Helmet>
        <title>{t('gifts.seo.title')}</title>
        <meta name="description" content={t('gifts.seo.description')} />
        <link rel="canonical" href="https://let-us-massage.se/presentkort" />
        <meta property="og:title" content={t('gifts.seo.title')} />
        <meta property="og:description" content={t('gifts.seo.description')} />
        <meta property="og:url" content="https://let-us-massage.se/presentkort" />
        <meta property="og:type" content="website" />
        <html lang={i18n.language} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Hero */}
      <header className="relative pt-32 pb-16 px-4 bg-gradient-to-b from-stone-50 via-white to-sky-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
            {t('gifts.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-800 mb-6">
            {t('gifts.title')}
          </h1>
          <p className="text-xl text-slate-700 italic mb-6">{t('gifts.lede')}</p>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-4">
            {t('gifts.intro1')}
          </p>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {t('gifts.intro2')}
          </p>
        </div>
      </header>

      {/* Two-card section: Digital + Printed */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Digital */}
          <article className="bg-white border border-stone-200 rounded-2xl p-8 md:p-10 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xl mb-5">
              ✶
            </div>
            <h2 className="font-serif text-3xl text-slate-800 mb-4">
              {t('gifts.digital.title')}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-3">{t('gifts.digital.p1')}</p>
            <p className="text-slate-600 leading-relaxed mb-6">{t('gifts.digital.p2')}</p>

            <ul className="space-y-2 mb-8">
              {digitalBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                  <span className="text-sky-500 flex-shrink-0 mt-0.5">✔</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://www.bokadirekt.se/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block text-center bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              {t('gifts.digital.cta')} →
            </a>
          </article>

          {/* Printed */}
          <article className="bg-white border border-stone-200 rounded-2xl p-8 md:p-10 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-xl mb-5">
              ❀
            </div>
            <h2 className="font-serif text-3xl text-slate-800 mb-4">
              {t('gifts.printed.title')}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-3">{t('gifts.printed.p1')}</p>
            <p className="text-slate-600 leading-relaxed mb-3">{t('gifts.printed.p2')}</p>
            <p className="text-slate-600 leading-relaxed mb-6">{t('gifts.printed.p3')}</p>

            <ul className="space-y-2 mb-8">
              {printedBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                  <span className="text-sky-500 flex-shrink-0 mt-0.5">✔</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <a
              href="/#location"
              className="mt-auto inline-block text-center border-2 border-sky-500 text-sky-700 hover:bg-sky-50 font-medium px-6 py-3 rounded-lg transition-colors"
            >
              {t('gifts.printed.cta')} →
            </a>
          </article>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-stone-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-slate-800">
              {t('gifts.faq.title')}
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, i) => {
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
    </main>
  )
}
