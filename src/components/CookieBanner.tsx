import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg px-4 py-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-gray-500 flex-1 text-center sm:text-left">{t('cookie.text')}</p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => { localStorage.setItem('cookie_consent', 'declined'); setVisible(false) }}
            className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2 border border-gray-200 rounded-lg transition-colors"
          >
            {t('cookie.decline')}
          </button>
          <button
            onClick={() => { localStorage.setItem('cookie_consent', 'accepted'); setVisible(false) }}
            className="text-sm text-white bg-sky-500 hover:bg-sky-600 px-5 py-2 rounded-lg transition-colors"
          >
            {t('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
