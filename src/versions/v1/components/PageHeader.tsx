import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { House } from '@phosphor-icons/react'
import type { PageKey } from '../../../shared/pages'
import { href, pageLabel } from '../lib/content'
import { CONTAINER } from '../lib/ui'

export interface InPageLink {
  id: string
  label: string
}

interface PageHeaderProps {
  page: PageKey
  title: string
  lead: string
  /** Key facts shown beside the title on wide screens. */
  aside?: ReactNode
  /** Jump links to the page's sections. */
  sections?: InPageLink[]
}

/** Inner-page masthead: DS breadcrumb, the page's single h1, a lead paragraph and in-page navigation. */
export function PageHeader({ page, title, lead, aside, sections }: PageHeaderProps) {
  return (
    <div className="border-b border-aeblack-100 bg-aeblack-50">
      <div className={`${CONTAINER} pt-4 pb-10 md:pb-12`}>
        <nav aria-label="Breadcrumb" className="aegov-breadcrumb with-seperator">
          <ol>
            <li>
              <Link to={href('home')} className="inline-flex! items-center gap-1.5">
                <House aria-hidden="true" className="mt-0! me-0!" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <span aria-current="page">{pageLabel(page)}</span>
            </li>
          </ol>
        </nav>
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end xl:gap-16">
          <div className="max-w-3xl">
            <h1 className="text-h4 md:text-h3 xl:text-h2 text-aeblack-900">{title}</h1>
            <p className="mt-4 text-lg text-aeblack-700 md:text-xl md:leading-8">{lead}</p>
          </div>
          {aside}
        </div>
        {sections && (
          <nav aria-label="On this page" className="mt-8">
            <p className="mb-3 text-sm font-semibold text-aeblack-700">On this page</p>
            <ul className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="aegov-badge badge-lg border border-primary-200 bg-whitely-50! text-primary-800! no-underline hover:border-primary-600"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  )
}

interface FactListProps {
  facts: { label: string; value: ReactNode }[]
}

/** Compact key-facts panel used in page headers. */
export function FactList({ facts }: FactListProps) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-aeblack-100 bg-aeblack-100">
      {facts.map((f) => (
        <div key={f.label} className="flex flex-col-reverse justify-end gap-1 bg-whitely-50 p-4">
          <dt className="text-sm text-aeblack-700">{f.label}</dt>
          <dd className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-primary-800">{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}
