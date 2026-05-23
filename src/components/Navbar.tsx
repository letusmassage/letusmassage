import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const languages = [
  { code: 'sv', label: 'SV' },
  { code: 'en', label: 'EN' },
  { code: 'el', label: 'ΕΛ' },
]

const navLinks = [
  { key: 'nav.about', href: '/#about' },
  { key: 'nav.services', href: '/#services' },
  { key: 'nav.techniques', href: '/#techniques' },
  { key: 'nav.gifts', href: '/presentkort' },
  { key: 'nav.why', href: '/#why' },
  { key: 'nav.faq', href: '/#faq' },
  { key: 'nav.information', href: '/#information' },
  { key: 'nav.location', href: '/#location' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const currentLang = languages.find(l => i18n.language.startsWith(l.code.toLowerCase()))?.label ?? 'SV'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-sky-700 font-semibold text-lg tracking-wide">
          <img
            src="/logo-blue.png"
            alt="Let Us Massage – logotyp"
            className="h-12 md:h-14 w-auto"
          />
          <span className="hidden sm:inline">Let Us Massage</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(link => (
            <Link
              key={link.key}
              to={link.href}
              className="text-gray-600 hover:text-sky-600 text-sm transition-colors"
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-sky-600 border border-gray-200 rounded px-2.5 py-1.5"
            >
              {currentLang}
              <span className="text-xs opacity-60">▾</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false) }}
                    className={`block w-full px-5 py-2 text-sm text-left hover:bg-sky-50 transition-colors ${
                      i18n.language.startsWith(lang.code) ? 'text-sky-600 font-medium bg-sky-50' : 'text-gray-600'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="https://business.bokadirekt.se/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
          >
            {t('nav.book')}
          </a>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className={`w-5 h-0.5 bg-current transition-all mb-1.5 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-5 h-0.5 bg-current transition-all mb-1.5 ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <Link
              key={link.key}
              to={link.href}
              className="text-gray-600 text-sm py-1"
              onClick={() => setMenuOpen(false)}
            >
              {t(link.key)}
            </Link>
          ))}
          <a
            href="https://business.bokadirekt.se/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg text-center mt-1"
          >
            {t('nav.book')}
          </a>
        </div>
      )}
    </nav>
  )
}
