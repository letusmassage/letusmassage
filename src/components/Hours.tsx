import { useTranslation } from 'react-i18next'

export default function Hours() {
  const { t } = useTranslation()

  const schedule = [
    { day: t('hours.days.mon_fri'), time: t('hours.times.mon_fri') },
    { day: t('hours.days.sat'), time: t('hours.times.sat') },
    { day: t('hours.days.sun'), time: t('hours.times.sun'), closed: true },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-sm mx-auto px-4 text-center">
        <h2 className="text-3xl font-light text-sky-800 mb-10">{t('hours.title')}</h2>
        <div className="space-y-1">
          {schedule.map((row, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-3.5 border-b border-sky-50 last:border-0"
            >
              <span className="text-gray-600 text-sm">{row.day}</span>
              <span className={`text-sm font-medium ${row.closed ? 'text-gray-300' : 'text-sky-600'}`}>
                {row.time}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-300 mt-8 italic leading-relaxed">{t('hours.note')}</p>
      </div>
    </section>
  )
}
