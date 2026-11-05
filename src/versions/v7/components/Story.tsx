import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { usePageHref } from '../../../shared/BilingualVersion'
import { formatNumber, useLang } from '../../../shared/i18n'
import { pageLabel, type PageKey } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { parseFigure } from '../lib/content'
import { useCountUp, useReducedMotion } from '../lib/hooks'
import { CONTAINER } from '../lib/ui'

/** Small caption above a heading: Latin small caps with tracking in English, plain in Arabic. */
export function Eyebrow({ children, dark = false, className = '' }: { children: ReactNode; dark?: boolean; className?: string }) {
  return <p className={`v7-eyebrow ${dark ? 'v7-eyebrow-dark' : ''} ${className}`}>{children}</p>
}

interface ChapterHeadingProps {
  id: string
  eyebrow?: ReactNode
  title: ReactNode
  intro?: ReactNode
  dark?: boolean
  /** Chapter numeral shown beside the eyebrow, e.g. "01". */
  numeral?: string
  className?: string
}

/** Section heading: eyebrow, gold hairline, very large light title and an optional lead. */
export function ChapterHeading({ id, eyebrow, title, intro, dark = false, numeral, className = '' }: ChapterHeadingProps) {
  return (
    <div className={`v7-reveal mb-12 max-w-4xl md:mb-16 ${className}`}>
      {(eyebrow || numeral) && (
        <div className="mb-5 flex items-center gap-4">
          {numeral && (
            <span aria-hidden="true" className={`v7-numeral ${dark ? 'text-primary-300' : 'text-primary-700'}`}>
              {numeral}
            </span>
          )}
          <span aria-hidden="true" className="v7-rule w-12" />
          {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
        </div>
      )}
      <h2 id={id} className={`v7-h2 ${dark ? 'text-[var(--egeep-ivory)]' : 'text-[var(--egeep-charcoal)]'}`}>
        {title}
      </h2>
      {intro && <div className={`v7-lead mt-6 ${dark ? 'text-[var(--v7-on-dark-muted)]' : 'text-[var(--v7-muted)]'}`}>{intro}</div>}
    </div>
  )
}

interface PageOpeningProps {
  page: PageKey
  title: string
  lead: ReactNode
  eyebrow?: ReactNode
  /** Key facts beside the title. */
  facts?: { label: string; value: ReactNode }[]
  children?: ReactNode
}

/** Inner-page opening: DS breadcrumb, the page's single h1 set very large, lead and key facts. */
export function PageOpening({ page, title, lead, eyebrow, facts, children }: PageOpeningProps) {
  const lang = useLang()
  const href = usePageHref()
  return (
    <div className="v7-opening relative overflow-hidden border-b border-[var(--v7-hairline)]">
      <div aria-hidden="true" className="v7-opening-pattern" />
      <div className={`${CONTAINER} relative pt-6 pb-14 md:pb-20`}>
        <nav aria-label={UI.breadcrumb[lang]} className="aegov-breadcrumb with-seperator">
          <ol>
            <li>
              <Link to={href('home')}>{pageLabel('home', lang)}</Link>
            </li>
            <li>
              <span aria-current="page">{pageLabel(page, lang)}</span>
            </li>
          </ol>
        </nav>
        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:items-end lg:gap-16">
          <div>
            {eyebrow && (
              <div className="mb-6 flex items-center gap-4">
                <span aria-hidden="true" className="v7-rule w-12" />
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            <h1 className="v7-display text-[var(--egeep-charcoal)]">{title}</h1>
            <div className="v7-lead mt-8 max-w-3xl text-[var(--v7-muted)]">{lead}</div>
          </div>
          {facts && (
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--egeep-gold)] pt-6">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col-reverse justify-end gap-1">
                  <dt className="text-base leading-snug text-[var(--v7-muted)]">{f.label}</dt>
                  <dd className="v7-figure-sm text-primary-800">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

/** In-page chapter links under a page opening. */
export function ChapterLinks({ label, items }: { label: string; items: { id: string; label: string }[] }) {
  return (
    <nav aria-label={label} className="mt-12">
      <ol className="flex flex-wrap gap-x-8 gap-y-3 border-t border-[var(--v7-hairline)] pt-5">
        {items.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="v7-chapter-link">
              <span aria-hidden="true" className="v7-numeral-sm">
                {formatNumber(i + 1, 'en', { minimumIntegerDigits: 2 })}
              </span>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

interface PhotoProps {
  src: string
  alt: string
  width: number
  height: number
  caption?: ReactNode
  className?: string
  imgClassName?: string
  lazy?: boolean
  /** Slow drift of the image inside its frame while scrolling. */
  parallax?: boolean
}

/** Photograph with a clip reveal on entering the viewport and an optional caption below a hairline. */
export function Photo({ src, alt, width, height, caption, className = '', imgClassName = '', lazy = true, parallax = false }: PhotoProps) {
  return (
    <figure className={className}>
      <div className="v7-clip relative overflow-hidden bg-[var(--egeep-grey-light)]">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={lazy ? 'lazy' : undefined}
          decoding="async"
          className={`h-full w-full object-cover ${parallax ? 'v7-parallax' : ''} ${imgClassName}`}
        />
      </div>
      {caption && <figcaption className="v7-caption mt-3">{caption}</figcaption>}
    </figure>
  )
}

/**
 * A figure such as "34.2+M" or "48+" counting up from 0 when scrolled into view. Assistive tech
 * reads the final value only.
 */
export function CountUp({ value, className = '' }: { value: string; className?: string }) {
  const lang = useLang()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  // "34.2+ مليون" → the figure "34.2+" (kept left-to-right) and the unit word set smaller.
  const [, token = value, unit = ''] = value.match(/^([\d.,]+\+?[A-Z]?)\s*(.*)$/) ?? []
  const figure = parseFigure(token)
  const current = useCountUp(ref, figure?.number ?? 0, reduced || !figure)
  if (!figure) return <bdi className={className}>{value}</bdi>
  const shown =
    current >= figure.number
      ? token
      : `${figure.prefix}${formatNumber(current, lang, { minimumFractionDigits: figure.decimals, maximumFractionDigits: figure.decimals })}${figure.suffix}`
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        <bdi dir="ltr">{shown}</bdi>
        {unit && <span className="v7-figure-unit"> {unit}</span>}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
