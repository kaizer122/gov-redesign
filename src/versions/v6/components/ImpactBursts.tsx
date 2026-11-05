import { useRef, type CSSProperties } from 'react'
import { useLang } from '../../../shared/i18n'
import { formatParsed, localizedStats, parseStat } from '../lib/content'
import { useCountUp, useRevealed } from '../lib/hooks'

const RAYS = 72
const INNER = 64

/** Ray end radii: irregular so the burst never reads as a mechanical target (DESIGN.md#pattern). */
const RAY_ENDS = Array.from({ length: RAYS }, (_, i) => 84 + 14 * Math.abs(Math.sin(i * 2.3) * Math.cos(i * 0.7)))

interface BurstProps {
  value: string
  label: string
  shown: boolean
  index: number
}

/** One figure inside a "Unified Impact" burst of thin gold rays; the number counts up when revealed. */
function Burst({ value, label, shown, index }: BurstProps) {
  const lang = useLang()
  const parsed = parseStat(value)
  const current = useCountUp(parsed?.value ?? 0, shown, 1600 + index * 150)
  const display = parsed ? formatParsed(parsed, current, lang) : value
  const long = value.length > 7

  return (
    <div className="flex flex-col-reverse items-center justify-end gap-3 text-center">
      <dt className="v6-muted max-w-[16rem] text-lg">{label}</dt>
      <dd className="relative grid aspect-square w-full max-w-[15rem] place-items-center">
        <svg
          viewBox="-100 -100 200 200"
          aria-hidden="true"
          focusable="false"
          className="v6-burst absolute inset-0 size-full"
          data-shown={shown || undefined}
        >
          {RAY_ENDS.map((end, i) => {
            const a = ((i / RAYS) * 360 + index * 11) * (Math.PI / 180)
            return (
              <line
                key={i}
                x1={Math.cos(a) * INNER}
                y1={Math.sin(a) * INNER}
                x2={Math.cos(a) * end}
                y2={Math.sin(a) * end}
                pathLength={1}
                strokeDasharray={1}
                strokeOpacity={0.35 + 0.5 * ((i * 7) % 5) / 4}
                style={{ '--i': i } as CSSProperties}
              />
            )
          })}
          <circle r={INNER - 6} fill="none" stroke="var(--color-primary-400)" strokeOpacity="0.35" strokeDasharray="0 5" strokeLinecap="round" strokeWidth="1.5" />
        </svg>
        <span aria-hidden="true" className={`relative ${long ? 'text-xl sm:text-3xl' : 'text-4xl sm:text-5xl'} leading-none`}>
          <bdi>{display}</bdi>
        </span>
        <span className="sr-only">
          <bdi>{value}</bdi>
        </span>
      </dd>
    </div>
  )
}

interface ImpactBurstsProps {
  group: 'headline' | 'byNumbers'
  className?: string
}

/** Programme figures as a definition list of Unified Impact bursts. */
export function ImpactBursts({ group, className = '' }: ImpactBurstsProps) {
  const lang = useLang()
  const ref = useRef<HTMLDListElement>(null)
  const shown = useRevealed(ref)
  const stats = localizedStats(group, lang)
  const cols = stats.length > 4 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'
  return (
    <dl ref={ref} className={`grid gap-x-6 gap-y-12 ${cols} ${className}`}>
      {stats.map(({ stat, en, label }, i) => (
        <Burst key={en.label} value={stat.value} label={label} shown={shown} index={i} />
      ))}
    </dl>
  )
}
