import { useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import { CaretDown, Table } from '@phosphor-icons/react'
import { dirOf, useLang, useT } from '../../../shared/i18n'
import { useElementWidth, useInView } from '../lib/hooks'
import { T } from '../lib/t'

export interface Datum {
  key: string
  label: string
  value: number
  /** Formatted value for labels, tooltips and the table. */
  display: string
}

interface ChartFrameProps {
  title: string
  description: string
  /** Column headers of the data-table alternative. */
  headers: [string, string]
  data: Datum[]
  /** Controls shown under the title (e.g. a metric toggle). */
  controls?: ReactNode
  children: (props: ChartState) => ReactNode
  className?: string
}

export interface ChartState {
  width: number
  rtl: boolean
  active: number | null
  setActive: (i: number | null) => void
  onKeyDown: (e: KeyboardEvent<SVGSVGElement>) => void
  label: string
  descId: string
}

/**
 * Chart tile: title, description, the SVG (one keyboard stop; arrow keys move between values in the
 * visual direction and a live region reads them), a tooltip on hover/focus and a data table.
 */
export function ChartFrame({ title, description, headers, data, controls, children, className = '' }: ChartFrameProps) {
  const lang = useLang()
  const t = useT(T)
  const id = useId()
  const rtl = dirOf(lang) === 'rtl'
  const [sizeRef, width] = useElementWidth<HTMLDivElement>()
  const [viewRef, inView] = useInView<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const [tableOpen, setTableOpen] = useState(false)

  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    const last = data.length - 1
    const current = active ?? -1
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight'
    const back = rtl ? 'ArrowRight' : 'ArrowLeft'
    const moves: Record<string, number> = {
      [forward]: Math.min(last, current + 1),
      [back]: Math.max(0, current - 1),
      ArrowDown: Math.min(last, current + 1),
      ArrowUp: Math.max(0, current - 1),
      Home: 0,
      End: last,
    }
    if (e.key in moves) {
      e.preventDefault()
      setActive(moves[e.key])
    } else if (e.key === 'Escape') setActive(null)
  }

  const current = active !== null ? data[active] : undefined

  return (
    <figure className={`v8-tile flex flex-col p-5 md:p-6 ${className}`} aria-labelledby={`${id}-title`}>
      <figcaption className="mb-4 space-y-1">
        <h3 id={`${id}-title`} className="text-2xl">
          {title}
        </h3>
        <p id={`${id}-desc`} className="v8-muted text-sm">
          {description} {t('chartKeys')}
        </p>
      </figcaption>
      {controls}
      <div ref={viewRef} className="v8-chart relative mt-2 flex-1" data-in={inView}>
        <div ref={sizeRef} className="w-full">
          {width > 0 &&
            children({
              width,
              rtl,
              active,
              setActive,
              onKeyDown,
              label: title,
              descId: `${id}-desc`,
            })}
        </div>
        <p className="sr-only" aria-live="polite">
          {current ? `${current.label}: ${current.display}` : ''}
        </p>
      </div>
      <div className="mt-4 border-t border-[var(--v8-line)] pt-3">
        <button
          type="button"
          aria-expanded={tableOpen}
          aria-controls={`${id}-table`}
          onClick={() => setTableOpen((o) => !o)}
          className="inline-flex min-h-11 items-center gap-2 text-primary-800 hover:text-primary-950"
        >
          <Table aria-hidden="true" className="size-5" />
          {tableOpen ? t('hideTable') : t('showTable')}
          <CaretDown aria-hidden="true" className={`size-4 transition-transform ${tableOpen ? 'rotate-180' : ''}`} />
        </button>
        <div id={`${id}-table`} hidden={!tableOpen} className="mt-3 max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-[var(--v8-line)]">
                <th scope="col" className="py-2 text-start">
                  {headers[0]}
                </th>
                <th scope="col" className="py-2 text-end">
                  {headers[1]}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.key} className="border-b border-[var(--v8-line)] last:border-0">
                  <th scope="row" className="py-1.5 text-start">
                    {d.label}
                  </th>
                  <td className="py-1.5 text-end tabular-nums">{d.display}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  )
}

function Tooltip({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div className="v8-tooltip" style={{ left: x, top: y }} aria-hidden="true">
      {children}
    </div>
  )
}

const COLUMN_HEIGHT = 240
const PAD_TOP = 28
const PAD_BOTTOM = 34

/** Vertical columns, e.g. partnerships signed per year. Runs right to left in Arabic. */
export function ColumnChart({ data, state }: { data: Datum[]; state: ChartState }) {
  const { width, rtl, active, setActive, onKeyDown, label, descId } = state
  const max = Math.max(1, ...data.map((d) => d.value))
  const innerH = COLUMN_HEIGHT - PAD_TOP - PAD_BOTTOM
  const slot = width / data.length
  const barW = Math.min(slot * 0.58, 56)
  const xOf = (i: number) => {
    const x = i * slot + (slot - barW) / 2
    return rtl ? width - x - barW : x
  }
  const ticks = [0.25, 0.5, 0.75, 1]
  const current = active !== null ? data[active] : undefined

  return (
    <>
      <svg
        width={width}
        height={COLUMN_HEIGHT}
        role="img"
        aria-label={label}
        aria-describedby={descId}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => setActive(active ?? data.length - 1)}
        onBlur={() => setActive(null)}
        onMouseLeave={() => setActive(null)}
        className="block overflow-visible"
      >
        {ticks.map((tk) => (
          <line
            key={tk}
            x1={0}
            x2={width}
            y1={PAD_TOP + innerH * (1 - tk)}
            y2={PAD_TOP + innerH * (1 - tk)}
            stroke="var(--v8-line)"
            strokeWidth={1}
          />
        ))}
        {data.map((d, i) => {
          const h = (d.value / max) * innerH
          const x = xOf(i)
          const y = PAD_TOP + innerH - h
          return (
            <g key={d.key} data-active={active === i} onMouseEnter={() => setActive(i)}>
              <rect x={x - (slot - barW) / 2} y={PAD_TOP} width={slot} height={innerH} fill="transparent" />
              <rect
                className="v8-bar v8-bar-col"
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={3}
                fill={active === i ? 'var(--color-primary-700)' : 'var(--egeep-gold)'}
              />
              <text x={x + barW / 2} y={y - 8} textAnchor="middle" fontSize="18" fill="var(--v8-text)">
                {d.display}
              </text>
              <text
                x={x + barW / 2}
                y={COLUMN_HEIGHT - 10}
                textAnchor="middle"
                fontSize="18"
                fill={active === i ? 'var(--color-primary-800)' : 'var(--v8-text-2)'}
              >
                {d.label}
              </text>
            </g>
          )
        })}
        <line x1={0} x2={width} y1={PAD_TOP + innerH} y2={PAD_TOP + innerH} stroke="var(--v8-line-strong)" />
      </svg>
      {current && active !== null && (
        <Tooltip x={xOf(active) + barW / 2} y={PAD_TOP + innerH - (current.value / max) * innerH - 22}>
          {current.label}: {current.display}
        </Tooltip>
      )}
    </>
  )
}

const ROW_H = 52

/** Horizontal bars with the label above each bar. Bars grow from the reading start. */
export function BarChart({ data, state, max: fixedMax }: { data: Datum[]; state: ChartState; max?: number }) {
  const { width, rtl, active, setActive, onKeyDown, label, descId } = state
  const max = fixedMax ?? Math.max(1, ...data.map((d) => d.value))
  const valueSpace = 92
  const track = Math.max(40, width - valueSpace)
  const height = data.length * ROW_H
  const startX = rtl ? width : 0
  const current = active !== null ? data[active] : undefined
  const barLen = (d: Datum) => Math.max(d.value > 0 ? 3 : 0, (d.value / max) * track)

  return (
    <>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={label}
        aria-describedby={descId}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => setActive(active ?? 0)}
        onBlur={() => setActive(null)}
        onMouseLeave={() => setActive(null)}
        className="block overflow-visible"
      >
        {data.map((d, i) => {
          const y = i * ROW_H
          const len = barLen(d)
          const barX = rtl ? width - len : 0
          const valueX = rtl ? width - len - 8 : len + 8
          return (
            <g key={d.key} data-active={active === i} onMouseEnter={() => setActive(i)}>
              <rect x={0} y={y} width={width} height={ROW_H} fill="transparent" />
              <text x={startX} y={y + 19} textAnchor="start" fontSize="18" fill="var(--v8-text)">
                {d.label}
              </text>
              <rect x={rtl ? width - track : 0} y={y + 28} width={track} height={12} rx={2} fill="var(--egeep-ivory)" />
              <rect
                className="v8-bar v8-bar-row"
                y={y + 28}
                height={12}
                rx={2}
                style={{
                  x: barX,
                  width: len,
                  transition: 'width 600ms var(--v8-ease), x 600ms var(--v8-ease), transform 900ms var(--v8-ease)',
                }}
                fill={active === i ? 'var(--color-primary-700)' : 'var(--egeep-gold)'}
              />
              <text
                x={valueX}
                y={y + 40}
                textAnchor="start"
                fontSize="18"
                fill="var(--v8-text)"
                style={{ transition: 'x 600ms var(--v8-ease)' }}
              >
                {d.display}
              </text>
            </g>
          )
        })}
      </svg>
      {current && active !== null && (
        <Tooltip x={rtl ? width - barLen(current) / 2 : barLen(current) / 2} y={active * ROW_H + 26}>
          {current.label}: {current.display}
        </Tooltip>
      )}
    </>
  )
}

interface SegmentedProps<K extends string> {
  label: string
  options: { key: K; label: string }[]
  value: K
  onChange: (key: K) => void
}

/** A small toggle group (aria-pressed buttons) for switching a chart's measure. */
export function Segmented<K extends string>({ label, options, value, onChange }: SegmentedProps<K>) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-md border border-[var(--v8-line)] bg-[var(--egeep-ivory)] p-1">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
          className={`min-h-9 rounded px-3 text-sm transition-colors ${value === o.key ? 'bg-[#fff] text-primary-900 shadow-sm ring-1 ring-[var(--v8-line-strong)]' : 'text-[var(--v8-text-2)] hover:text-[var(--v8-text)]'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
