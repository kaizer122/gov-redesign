import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { HouseIcon } from '@phosphor-icons/react'
import type { PageKey } from '../../../shared/pages'
import { href } from '../lib/content'
import { PageRating } from './PageRating'

interface PageProps {
  pageKey: PageKey
  children: ReactNode
}

/** The single <main> landmark of every v4 page, closed by the DS page-rating block. */
export function Page({ pageKey, children }: PageProps) {
  return (
    <main id="main" data-page={pageKey} tabIndex={-1} className="flex-1 outline-none">
      {children}
      <section aria-label="Page feedback" className="container py-12 md:py-16">
        <PageRating key={pageKey} />
      </section>
    </main>
  )
}

interface PageHeaderProps {
  title: string
  intro: ReactNode
  /** Breadcrumb label of the current page. */
  crumb: string
  eyebrow?: string
  actions?: ReactNode
  aside?: ReactNode
}

/** Breadcrumb, H1 and lead paragraph for inner pages. */
export function PageHeader({ title, intro, crumb, eyebrow, actions, aside }: PageHeaderProps) {
  return (
    <div className="v4-hero border-b border-aeblack-100">
      <div className="container py-8 md:py-12 lg:py-14">
        <nav aria-label="Breadcrumb" className="aegov-breadcrumb with-seperator mb-6">
          <ol>
            <li>
              <Link to={href('home')}>
                <HouseIcon aria-hidden="true" />
                Home
              </Link>
            </li>
            <li>
              <span aria-current="page">{crumb}</span>
            </li>
          </ol>
        </nav>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-seablue-800">{eyebrow}</p>}
            <h1 className="text-3xl font-bold leading-tight text-aeblack-950 md:text-4xl lg:text-5xl">{title}</h1>
            <div className="mt-4 text-lg text-aeblack-700">{intro}</div>
            {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
          </div>
          {aside}
        </div>
      </div>
    </div>
  )
}

interface SectionHeadingProps {
  id: string
  title: string
  intro?: ReactNode
  action?: ReactNode
}

export function SectionHeading({ id, title, intro, action }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h2 id={id} className="text-2xl font-bold text-aeblack-950 md:text-3xl">
          {title}
        </h2>
        {intro && <p className="mt-2 text-aeblack-600">{intro}</p>}
      </div>
      {action}
    </div>
  )
}
