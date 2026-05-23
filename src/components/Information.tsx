import { useTranslation } from 'react-i18next'

interface HoursRow {
  day: string
  time: string
}

export default function Information() {
  const { t } = useTranslation()
  const hoursItems = t('information.hours.items', { returnObjects: true }) as HoursRow[]
  const healthBullets = t('information.health.bullets', { returnObjects: true }) as string[]
  const paymentsBullets = t('information.payments.bullets', { returnObjects: true }) as string[]

  return (
    <section id="information" className="py-24 bg-stone-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600 mb-3">
            {t('information.subtitle')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800">
            {t('information.title')}
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-100 p-6 md:p-8">
            <h3 className="font-serif text-2xl text-slate-800 mb-4">
              {t('information.hours.title')}
            </h3>
            <div className="space-y-1 mb-4">
              {hoursItems.map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-sky-50 last:border-0"
                >
                  <span className="text-slate-600 text-sm">{row.day}</span>
                  <span className="text-sm font-medium text-sky-600">{row.time}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 italic leading-relaxed">
              {t('information.hours.note1')}
            </p>
            <p className="text-xs text-slate-400 italic leading-relaxed mt-1">
              {t('information.hours.note2')}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-6 md:p-8">
            <h3 className="font-serif text-2xl text-slate-800 mb-4">
              {t('information.cancellation.title')}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              {t('information.cancellation.p1')}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              {t('information.cancellation.p2')}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              {t('information.cancellation.p3')}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-6 md:p-8">
            <h3 className="font-serif text-2xl text-slate-800 mb-4">
              {t('information.arrival.title')}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              {t('information.arrival.p1')}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              {t('information.arrival.p2')}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-6 md:p-8">
            <h3 className="font-serif text-2xl text-slate-800 mb-4">
              {t('information.parking.title')}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              {t('information.parking.p1')}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              {t('information.parking.p2')}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-6 md:p-8">
            <h3 className="font-serif text-2xl text-slate-800 mb-4">
              {t('information.health.title')}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              {t('information.health.p1')}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              {t('information.health.p2')}
            </p>
            <ul className="text-slate-600 leading-relaxed text-sm space-y-1.5 list-disc pl-5">
              {healthBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-6 md:p-8">
            <h3 className="font-serif text-2xl text-slate-800 mb-4">
              {t('information.facilities.title')}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              {t('information.facilities.p1')}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              {t('information.facilities.p2')}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-6 md:p-8">
            <h3 className="font-serif text-2xl text-slate-800 mb-4">
              {t('information.payments.title')}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              {t('information.payments.p1')}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm mb-2">
              {t('information.payments.p2')}
            </p>
            <ul className="text-slate-600 leading-relaxed text-sm space-y-1.5 list-disc pl-5 mb-3">
              {paymentsBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              {t('information.payments.p3')}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              {t('information.payments.p4')}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              {t('information.payments.p5')}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-6 md:p-8">
            <h3 className="font-serif text-2xl text-slate-800 mb-4">
              {t('information.contact.title')}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <span className="text-slate-500 sm:w-24">{t('information.contact.phone_label')}</span>
                <a
                  href="tel:+46767690887"
                  className="text-sky-600 hover:text-sky-700 font-medium transition-colors"
                >
                  +46 76 769 08 87
                </a>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <span className="text-slate-500 sm:w-24">{t('information.contact.email_label')}</span>
                <a
                  href="mailto:let.us.massage.info@gmail.com"
                  className="text-sky-600 hover:text-sky-700 font-medium transition-colors break-all"
                >
                  let.us.massage.info@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
