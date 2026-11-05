import type { ReactNode } from 'react'

interface ExternalLinkProps {
  href: string
  className?: string
  children: ReactNode
  /** Accessible name when the visible content is an icon only. */
  label?: string
}

/** Link to another website: opens in a new tab and says so to screen-reader users. */
export function ExternalLink({ href, className, children, label }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only">{label ? `${label} (opens in a new tab)` : ' (opens in a new tab)'}</span>
    </a>
  )
}
