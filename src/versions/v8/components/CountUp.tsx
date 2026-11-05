import { useEffect, useState } from 'react'
import { useInView, useReducedMotion } from '../lib/hooks'

const DURATION_MS = 1400

/** Splits "34.2+ مليون" into the number and the text around it. */
function parse(value: string) {
  const match = value.match(/\d[\d,]*(?:\.\d+)?/)
  if (!match || match.index === undefined) return undefined
  const raw = match[0]
  const after = value.slice(match.index + raw.length)
  const symbols = after.match(/^[+%]*/)?.[0] ?? ''
  return {
    raw,
    before: value.slice(0, match.index),
    symbols,
    after: after.slice(symbols.length),
    target: Number(raw.replace(/,/g, '')),
    decimals: raw.includes('.') ? raw.split('.')[1].length : 0,
    grouped: raw.includes(','),
  }
}

function format(n: number, decimals: number, grouped: boolean): string {
  const [int, frac] = n.toFixed(decimals).split('.')
  const intText = grouped ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : int
  return frac ? `${intText}.${frac}` : intText
}

/**
 * A figure that counts up from zero when it scrolls into view. Assistive tech reads the final value
 * only; the animated text is hidden from it. Reduced motion shows the final value at once. The
 * number and its "+" are isolated left-to-right so they keep their order inside Arabic text.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const reduced = useReducedMotion()
  const [ref, inView] = useInView<HTMLSpanElement>()
  const parsed = parse(value)
  const target = parsed?.target
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!inView || reduced || target === undefined) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS)
      setProgress(1 - Math.pow(1 - t, 3))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, target])

  const done = reduced || progress >= 1

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {parsed ? (
          <>
            {parsed.before}
            <bdi dir="ltr">
              {done ? parsed.raw : format(parsed.target * progress, parsed.decimals, parsed.grouped)}
              {parsed.symbols}
            </bdi>
            {parsed.after}
          </>
        ) : (
          value
        )}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
