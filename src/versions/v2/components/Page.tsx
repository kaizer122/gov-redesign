import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PAGES, pageHref, type PageKey } from '../../../shared/pages'

interface MainProps {
  page: PageKey
  children: ReactNode
}

/** The single `<main>` landmark for a page; focusable so the skip link moves focus into it. */
export function Main({ page, children }: MainProps) {
  return (
    <main id="main" data-page={page} tabIndex={-1} className="flex-1 outline-none">
      {children}
    </main>
  )
}

interface PageHeaderProps {
  page: PageKey
  eyebrow: string
  title: string
  lead: string
  /** Optional right-hand column, typically a compact set of key figures. */
  aside?: ReactNode
}

/** Dark atlas band with breadcrumb and the page's only `<h1>`. */
export function PageHeader({ page, eyebrow, title, lead, aside }: PageHeaderProps) {
  const label = PAGES.find((p) => p.key === page)?.label ?? title
  return (
    <div className="v2-dark v2-grid-bg relative overflow-hidden bg-techblue-950 text-whitely-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-40 -top-40 size-[32rem] rounded-full bg-techblue-700/30 blur-3xl"
      />
      <div className="container relative py-10 md:py-14 lg:py-16">
        <nav aria-label="Breadcrumb" className="aegov-breadcrumb with-seperator">
          <ol>
            <li>
              <Link to={pageHref('v2', 'home')}>Home</Link>
            </li>
            <li>
              <span aria-current="page">{label}</span>
            </li>
          </ol>
        </nav>
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className={aside ? 'lg:col-span-7' : 'lg:col-span-9'}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-aegold-200">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-whitely-50 md:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-techblue-100">{lead}</p>
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </div>
    </div>
  )
}

interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: string
  intro?: string
  dark?: boolean
}

export function SectionHeading({ id, eyebrow, title, intro, dark = false }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.18em] ${dark ? 'text-aegold-200' : 'text-techblue-700'}`}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-2 text-3xl font-extrabold leading-tight md:text-4xl ${dark ? 'text-whitely-50' : 'text-techblue-950'}`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-techblue-100' : 'text-aeblack-600'}`}>{intro}</p>
      )}
    </div>
  )
}

interface FigureListProps {
  items: { value: string; label: string }[]
}

/** Compact key-figure list used in page header asides. */
export function FigureList({ items }: FigureListProps) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-techblue-200/20 bg-techblue-200/20">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col-reverse gap-1 bg-techblue-950/90 p-5">
          <dt className="text-sm text-techblue-100">{item.label}</dt>
          <dd className="v2-display text-2xl font-bold text-whitely-50 sm:text-3xl">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
