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

export default i18n
