import { useRef } from 'react'
import { formatNumber, useLang, type Lang } from '../../../shared/i18n'
import { parseFigure, type LabelledStat } from '../lib/content'
import { useCountUp, useInView, useStill } from '../lib/hooks'
import { CONTAINER } from '../lib/ui'

interface StatsBandProps {
  id: string
  title: string
  stats: LabelledStat[]
  note?: string
}

/** Headline figures on an ivory band between gold hairlines; each figure counts up once in view. */
export function StatsBand({ id, title, stats, note }: StatsBandProps) {
  const lang = useLang()
  const ref = useRef<HTMLDListElement>(null)
  const still = useStill()
  const seen = useInView(ref, still)

  return (
    <section aria-labelledby={id} className="border-y border-[var(--egeep-gold)] bg-[var(--egeep-ivory)]">
      <div className={`${CONTAINER} py-16 md:py-20`}>
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id={id} className="text-4xl text-[var(--egeep-gold)] md:text-5xl">
            {title}
          </h2>
          {note && <p className="text-lg text-[var(--v5-muted)]">{note}</p>}
        </div>
        <dl
          ref={ref}
          className={`grid grid-cols-2 gap-x-6 gap-y-10 md:gap-x-10 ${stats.length > 4 ? 'md:grid-cols-3 xl:grid-cols-6' : 'md:grid-cols-4'}`}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse justify-end gap-2 border-t border-[var(--egeep-gold)]/50 pt-4">
              <dt className="text-lg text-[var(--egeep-charcoal)]">{s.label}</dt>
              <dd className="text-[2.5rem] leading-none text-[var(--egeep-gold)] sm:text-5xl xl:text-[3.5rem]">
                <Figure value={s.value} start={seen} still={still} lang={lang} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

interface FigureProps {
  value: string
  start: boolean
  still: boolean
  lang: Lang
}

/** Counts up to the figure; assistive tech always reads the final value. */
export function Figure({ value, start, still, lang }: FigureProps) {
  const parsed = parseFigure(value)
  const current = useCountUp(parsed?.number ?? 0, start, still || !parsed)
  if (!parsed) return <bdi>{value}</bdi>
  const shown = formatNumber(current, lang, {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
  })
  // Keep "34.2+" together left-to-right; an Arabic unit word ("مليون") follows it, set smaller.
  const suffix = parsed.suffix.trim()
  const word = /[\u0600-\u06FF]/.test(suffix) ? suffix.replace(/^[+%]+\s*/, '') : ''
  const symbols = word ? suffix.slice(0, suffix.length - word.length).trim() : parsed.suffix
  return (
    <>
      <span aria-hidden="true">
        <bdi dir="ltr" className="tabular-nums">
          {parsed.prefix}
          {shown}
          {symbols}
        </bdi>
        {word && <span className="ms-2 text-[0.55em]">{word}</span>}
      </span>
      <span className="sr-only">{value}</span>
    </>
  )
}
