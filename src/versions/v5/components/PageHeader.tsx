import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { House } from '@phosphor-icons/react'
import { useLang, useT } from '../../../shared/i18n'
import { pageLabel, type PageKey } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { T } from '../lib/dict'
import { useLinks } from '../lib/content'
import { CONTAINER } from '../lib/ui'
import { EdgePattern } from './EdgePattern'

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
  /** Connected Circles entering from the end edge. */
  pattern?: boolean
}

/** Inner-page masthead: breadcrumb, the page's single h1, a lead, the gold hairline and in-page links. */
export function PageHeader({ page, title, lead, aside, sections, pattern = true }: PageHeaderProps) {
  const lang = useLang()
  const t = useT(T)
  const { href } = useLinks()
  return (
    <div className="relative overflow-hidden bg-[#fff]">
      {pattern && <EdgePattern />}
      <div className={`${CONTAINER} relative pt-6 pb-12 md:pt-8 md:pb-16`}>
        <nav aria-label={UI.breadcrumb[lang]} className="aegov-breadcrumb with-seperator">
          <ol>
            <li>
              <Link to={href('home')} className="inline-flex! items-center gap-1.5">
                <House aria-hidden="true" className="mt-0! me-0!" />
                <span>{pageLabel('home', lang)}</span>
              </Link>
            </li>
            <li>
              <span aria-current="page">{pageLabel(page, lang)}</span>
            </li>
          </ol>
        </nav>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end xl:gap-20">
          <div className="max-w-4xl">
            <h1 className="text-[2.75rem] leading-[1.15] text-[var(--egeep-gold)] md:text-6xl xl:text-[5rem] xl:leading-[1.05] rtl:leading-[1.4] rtl:xl:leading-[1.3]">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl text-[var(--egeep-charcoal)]">{lead}</p>
          </div>
          {aside}
        </div>
        <div className="v5-hairline mt-12" aria-hidden="true" />
        {sections && (
          <nav aria-label={t('onThisPage')} className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="v5-eyebrow">{t('onThisPage')}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="inline-block py-1 text-lg text-[var(--color-primary-700)] no-underline underline-offset-4 hover:text-[var(--color-primary-900)] hover:underline"
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

/** Key facts in gold-ruled cells, used in page headers. */
export function FactList({ facts }: FactListProps) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
      {facts.map((f) => (
        <div key={f.label} className="flex flex-col-reverse justify-end gap-1 border-t border-[var(--egeep-gold)] pt-3">
          <dt className="text-base text-[var(--v5-muted)]">{f.label}</dt>
          <dd className="text-4xl leading-none text-[var(--egeep-gold)]">{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}
