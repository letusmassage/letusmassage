import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getArticle, ARTICLES } from '../content/articles'
import { renderInline } from '../lib/renderInline'
import type { ArticleBlock } from '../content/articles/types'

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mt-12 mb-5">{block.text}</h2>
      )
    case 'h3':
      return (
        <h3 className="font-serif text-xl md:text-2xl text-slate-800 mt-8 mb-3">{block.text}</h3>
      )
    case 'p':
      return <p className="text-slate-700 leading-relaxed mb-5">{renderInline(block.text)}</p>
    case 'ul':
      return (
        <ul className="space-y-2 mb-6">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700 leading-relaxed">
              <span className="text-sky-500 mt-1.5">·</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <div className="my-8 bg-sky-50 border-l-4 border-sky-300 px-6 py-5 rounded-r-lg">
          <p className="text-slate-700 leading-relaxed italic">{renderInline(block.text)}</p>
        </div>
      )
    case 'faq':
      return (
        <div className="my-6 space-y-3">
          {block.items.map((item, i) => (
            <details key={i} className="group bg-stone-50 border border-stone-200 rounded-xl">
              <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4">
                <span className="font-medium text-slate-800">{item.q}</span>
                <span className="text-sky-600 transition-transform group-open:rotate-45 text-xl">+</span>
              </summary>
              <div className="px-5 pb-4 text-slate-700 leading-relaxed text-sm">
                {renderInline(item.a)}
              </div>
            </details>
          ))}
        </div>
      )
  }
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticle(slug) : undefined

  if (!article) return <Navigate to="/artiklar" replace />

  const url = `https://let-us-massage.se/artiklar/${article.slug}`
  const related = ARTICLES.filter(a => a.slug !== article.slug).slice(0, 3)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: { '@type': 'Person', name: 'Ioulietta Refene' },
    publisher: {
      '@type': 'Organization',
      name: 'Let Us Massage',
      logo: { '@type': 'ImageObject', url: 'https://let-us-massage.se/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: article.keywords.join(', '),
    inLanguage: 'sv-SE',
    about: { '@type': 'LocalBusiness', name: 'Let Us Massage', address: 'Stora Södergatan 58A, 222 23 Lund' },
  }

  const faqBlock = article.blocks.find(b => b.type === 'faq')
  const faqSchema =
    faqBlock && faqBlock.type === 'faq'
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqBlock.items.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') },
          })),
        }
      : null

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
      { '@type': 'ListItem', position: 3, name: article.title, item: url },
    ],
  }

  return (
    <main>
      <Helmet>
        <title>{article.title} | Let Us Massage Lund</title>
        <meta name="description" content={article.description} />
        <meta name="keywords" content={article.keywords.join(', ')} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="article:published_time" content={article.date} />
        <meta property="article:author" content="Ioulietta Refene" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <header className="relative pt-28 pb-12 px-4 bg-gradient-to-b from-stone-50 via-white to-sky-50">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/artiklar"
            className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 mb-6"
          >
            <span>←</span> Alla artiklar
          </Link>

          <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString('sv-SE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{article.readMin} min läsning</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-slate-800 mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">{article.intro}</p>
        </div>
      </header>

      <article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {article.blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}

          <div className="mt-12 pt-8 border-t border-stone-200 text-center">
            <a
              href="https://www.bokadirekt.se/places/let-us-massage-lund-135622"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-medium px-10 py-4 rounded-full transition-colors shadow-sm"
            >
              Boka tid via Bokadirekt
            </a>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-16 px-4 bg-stone-50 border-t border-stone-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-800 mb-6">Läs också</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map(r => (
                <Link
                  key={r.slug}
                  to={`/artiklar/${r.slug}`}
                  className="block bg-white border border-stone-200 hover:border-sky-300 rounded-xl p-5 hover:shadow-sm transition-all"
                >
                  <h3 className="font-serif text-lg text-slate-800 mb-2 leading-snug">{r.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
