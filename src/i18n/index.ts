import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import sv from './locales/sv.json'
import el from './locales/el.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sv: { translation: sv },
      el: { translation: el },
    },
    fallbackLng: 'sv',
    supportedLngs: ['sv', 'en', 'el'],
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

// <html lang> följer valt språk (sätts annars bara statiskt till sv i index.html).
const syncHtmlLang = (lng: string) => { document.documentElement.lang = lng.split('-')[0] }
syncHtmlLang(i18n.resolvedLanguage ?? i18n.language ?? 'sv')
i18n.on('languageChanged', syncHtmlLang)

export default i18n
