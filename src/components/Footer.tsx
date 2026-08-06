import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="bg-sky-900 text-white py-14">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <img
              src="/logo.png"
              alt="Let Us Massage – logotyp"
              className="h-20 md:h-24 w-auto mb-4 brightness-0 invert opacity-95"
            />
            <h3 className="text-lg font-semibold mb-2">Let Us Massage</h3>
            <p className="text-sky-200 text-sm leading-relaxed">{t('footer.tagline')}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-sky-400">
              {t('contact.title')}
            </h4>
            <p className="text-sky-100 text-sm mb-1">Stora Södergatan 58A</p>
            <p className="text-sky-100 text-sm mb-1">222 23 Lund, Sverige</p>
            <p className="text-sky-300 text-sm mt-3">
              {t('contact.phone_label')}:{' '}
              <a href="tel:+46767690887" className="text-sky-100 hover:text-white transition-colors">
                +46 76 769 08 87
              </a>
            </p>
            <p className="text-sky-300 text-sm">
              {t('contact.email_label')}:{' '}
              <a
                href="mailto:let.us.massage.info@gmail.com"
                className="text-sky-100 hover:text-white transition-colors break-all"
              >
                let.us.massage.info@gmail.com
              </a>
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-sky-400">
              {t('nav.book')}
            </h4>
            <a
              href="https://www.bokadirekt.se/places/let-us-massage-lund-135622"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-sky-800 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-sky-50 transition-colors"
            >
              Bokadirekt →
            </a>
          </div>
        </div>

        <div className="border-t border-sky-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-sky-500">
          <p>© {year} Let Us Massage. {t('footer.rights')}.</p>
          <div className="flex items-center gap-4">
            <a href="/presentkort" className="hover:text-sky-300 transition-colors">{t('nav.gifts')}</a>
            <a href="/recensioner" className="hover:text-sky-300 transition-colors">{t('nav.reviews')}</a>
            <a href="/artiklar" className="hover:text-sky-300 transition-colors">Kunskapsbank</a>
            <a href="#privacy" className="hover:text-sky-300 transition-colors">{t('footer.privacy')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
