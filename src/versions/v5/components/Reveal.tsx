import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useInView, useStill } from '../lib/hooks'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger in milliseconds. */
  delay?: number
}

/** Fades and rises its content in once it scrolls into view. Static under reduced motion. */
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const still = useStill()
  const seen = useInView(ref, still)
  const style: CSSProperties | undefined = delay && !still ? { transitionDelay: `${delay}ms` } : undefined
  return (
    <div ref={ref} className={`${still ? '' : 'v5-reveal'} ${seen ? 'v5-in' : ''} ${className}`} style={style}>
      {children}
    </div>
  )
}
