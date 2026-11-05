import { useRef, type ElementType, type ReactNode } from 'react'
import { useRevealed } from '../lib/hooks'

interface RevealProps {
  as?: ElementType
  className?: string
  children: ReactNode
}

/** Fades and lifts its content in once it scrolls into view (final state under reduced motion). */
export function Reveal({ as: Tag = 'div', className = '', children }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const shown = useRevealed(ref)
  return (
    <Tag ref={ref} className={`v6-reveal ${className}`} data-shown={shown || undefined}>
      {children}
    </Tag>
  )
}
