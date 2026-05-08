import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

const PATTERN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g

export function renderInline(text: string): ReactNode {
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let i = 0

  while ((m = PATTERN.exec(text)) !== null) {
    if (m.index > last) {
      out.push(text.slice(last, m.index))
    }
    if (m[1] !== undefined && m[2] !== undefined) {
      const label = m[1]
      const href = m[2]
      const isInternal = href.startsWith('/')
      out.push(
        isInternal ? (
          <Link key={i++} to={href} className="text-sky-700 underline underline-offset-2 hover:text-sky-900">
            {label}
          </Link>
        ) : (
          <a
            key={i++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-700 underline underline-offset-2 hover:text-sky-900"
          >
            {label}
          </a>
        )
      )
    } else if (m[3] !== undefined) {
      out.push(<strong key={i++}>{m[3]}</strong>)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}
