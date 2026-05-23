import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ARTICLES } from '../content/articles'

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Hem', item: 'https://let-us-massage.se/' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Kunskapsbank',
      item: 'https://let-us-massage.se/artiklar',
    },
  ],
}

export default function Articles() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kunskapsbank — Artiklar om massage i Lund',
    description:
      'Artiklar och guider om massage, friskvård, spänningshuvudvärk, gravidmassage och förebyggande kroppsvård i Lund.',
    url: 'https://let-us-massage.se/artiklar',
    inLanguage: 'sv-SE',
    isPartOf: { '@id': 'https://let-us-massage.se/#business' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: ARTICLES.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://let-us-massage.se/artiklar/${a.slug}`,
        name: a.title,
      })),
    },
  }

  return (
    <main>
      <Helmet>
        <title>Kunskapsbank — Artiklar om massage i Lund | Let Us Massage</title>
        <meta
          name="description"
          content="Artiklar och guider om massage, friskvård, spänningshuvudvärk, gravidmassage och förebyggande kroppsvård i Lund."
        />
        <link rel="canonical" href="https://let-us-massage.se/artiklar" />
        <meta property="og:title" content="Kunskapsbank — Artiklar om massage i Lund" />
        <meta
          property="og:description"
          content="Guider och fördjupning kring massage, friskvård och kroppsvård i Lund."
        />
        <meta property="og:url" content="https://let-us-massage.se/artiklar" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <header className="relative pt-32 pb-16 px-4 bg-gradient-to-b from-stone-50 via-white to-sky-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">Kunskapsbank</p>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-800 mb-6">
            Artiklar om massage, kropp och välbefinnande
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            Fördjupande texter om massage, friskvård, spänningar och kroppsvård — skrivna utifrån
            erfarenheter från mottagningen i Lund.
          </p>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {ARTICLES.map(a => (
            <Link
              key={a.slug}
              to={`/artiklar/${a.slug}`}
              className="block group bg-white border border-stone-200 hover:border-sky-300 rounded-2xl p-7 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                <time dateTime={a.date}>
                  {new Date(a.date).toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>{a.readMin} min läsning</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-slate-800 group-hover:text-sky-700 transition-colors mb-3">
                {a.title}
              </h2>
              <p className="text-slate-600 leading-relaxed">{a.description}</p>
              <span className="inline-block mt-4 text-sm text-sky-600 group-hover:text-sky-800">
                Läs artikeln →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
