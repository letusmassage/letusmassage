import { useState } from 'react'

export interface FaqItem {
  q: string
  a: string
}

interface Props {
  items: FaqItem[]
}

// Delad dragspels-FAQ. Används av startsidan, presentkortssidan och friskvårdssidan
// så att alla tre ser likadana ut och beter sig likadant.
export default function FaqAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="bg-white rounded-xl border border-stone-100 overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
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
              <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">{item.a}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
