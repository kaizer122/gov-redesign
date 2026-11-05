import { useRef } from 'react'
import { formatNumber, useLang } from '../../../shared/i18n'
import { useRevealed } from '../lib/hooks'

interface RingsProps {
  items: string[]
  /** Small caption above each item, e.g. "Stage"; numbers follow it. */
  caption?: string
  /** Lay out in a row from lg up (otherwise always a column). */
  row?: boolean
  dark?: boolean
}

/**
 * A sequence drawn as the brand's Connected Circles: open gold rings that overlap their
 * neighbours, with the two intersection points marked (collaboration between stages).
 * Ring r = 7.5rem, overlap 2.75rem → intersections 1.375rem in, 7.5 ± 4.33rem across.
 */
export function Rings({ items, caption, row = true, dark = false }: RingsProps) {
  const lang = useLang()
  const ref = useRef<HTMLOListElement>(null)
  const shown = useRevealed(ref)
  const dot = `absolute size-2.5 rounded-full ${dark ? 'bg-primary-300' : 'bg-primary-600'} ring-4 ${dark ? 'ring-[color:var(--egeep-charcoal)]' : 'ring-[color:var(--egeep-ivory)]'}`

  return (
    <ol
      ref={ref}
      className={`v6-rings flex flex-col items-center ${row ? 'is-row lg:flex-row lg:justify-center' : ''}`}
    >
      {items.map((item, i) => (
        <li
          key={item}
          className={`v6-reveal relative grid shrink-0 place-items-center rounded-full border text-center ${dark ? 'border-primary-400/70' : 'border-primary-600/70'}`}
          data-shown={shown || undefined}
          style={{ transitionDelay: `${i * 120}ms` }}
        >
          <div className="max-w-[10.5rem] px-2">
            {caption && (
              <p className={`text-base ${dark ? 'text-primary-300' : 'text-primary-800'}`}>
                {caption} {formatNumber(i + 1, lang)}
              </p>
            )}
            <p className={`mt-1 text-xl leading-snug ${dark ? 'text-[color:var(--egeep-ivory)]' : 'text-[color:var(--egeep-charcoal)]'}`}>
              {item}
            </p>
          </div>
          {i > 0 && (
            <>
              {/* column layout: the overlap is above */}
              <span className={`${dot} -translate-1/2 top-[1.375rem] start-[3.172rem] ${row ? 'lg:hidden' : ''} rtl:translate-x-1/2`} />
              <span className={`${dot} -translate-1/2 top-[1.375rem] start-[11.828rem] ${row ? 'lg:hidden' : ''} rtl:translate-x-1/2`} />
              {row && (
                <>
                  <span className={`${dot} -translate-1/2 top-[3.172rem] start-[1.375rem] max-lg:hidden rtl:translate-x-1/2`} />
                  <span className={`${dot} -translate-1/2 top-[11.828rem] start-[1.375rem] max-lg:hidden rtl:translate-x-1/2`} />
                </>
              )}
            </>
          )}
        </li>
      ))}
    </ol>
  )
}
