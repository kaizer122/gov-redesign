import type { ReactNode } from 'react'
import { useLang } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'

interface ExternalLinkProps {
  href: string
  className?: string
  children: ReactNode
  /** Accessible name when the visible content is an icon only. */
  label?: string
}

/** Link to another website: opens in a new tab and says so to screen-reader users. */
export function ExternalLink({ href, className, children, label }: ExternalLinkProps) {
  const lang = useLang()
  const note = UI.opensInNewTab[lang]
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only">{label ? `${label} ${note}` : ` ${note}`}</span>
    </a>
  )
}
