import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CaretRight } from '@phosphor-icons/react'
import { usePageHref } from '../../../shared/BilingualVersion'
import { useLang } from '../../../shared/i18n'
import { pageLabel, type PageKey } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { CONTAINER } from '../lib/ui'
import { GlobeArt } from './GlobeArt'

export interface InPageLink {
  id: string
  label: string
}

interface PageHeroProps {
  page: PageKey
  title: string
  lead: ReactNode
  eyebrow?: string
  /** Key facts shown beside the title. */
  facts?: { label: string; value: ReactNode }[]
  /** Jump links to the page's sections. */
  sections?: InPageLink[]
  sectionsLabel?: string
}

/** Inner-page masthead on Deep Charcoal: DS breadcrumb, the page's single h1, lead, key facts and a globe drifting in from the edge. */
export function PageHero({ page, title, lead, eyebrow, facts, sections, sectionsLabel }: PageHeroProps) {
  const lang = useLang()
  const href = usePageHref()
  return (
    <div className="v6-dark relative isolate overflow-hidden">
      <GlobeArt
        arcs
        className="pointer-events-none absolute -end-40 -top-24 -z-10 w-[44rem] text-primary-400 opacity-30 max-md:-end-72 max-md:opacity-20"
      />
      <div className={`${CONTAINER} pt-6 pb-14 md:pt-8 md:pb-20`}>
        <nav aria-label={UI.breadcrumb[lang]} className="aegov-breadcrumb">
          <ol className="gap-2">
            <li>
              <Link to={href('home')}>{pageLabel('home', lang)}</Link>
            </li>
            <li aria-hidden="true">
              <CaretRight className="size-4 text-primary-400 rtl:-scale-x-100" />
            </li>
            <li>
              <span aria-current="page">{pageLabel(page, lang)}</span>
            </li>
          </ol>
        </nav>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end xl:gap-20">
          <div className="max-w-4xl">
            {eyebrow && <p className="v6-eyebrow mb-5">{eyebrow}</p>}
            <h1 className="text-5xl text-[color:var(--egeep-ivory)] md:text-6xl xl:text-7xl">{title}</h1>
            <div className="mt-6 max-w-3xl text-xl text-[color:var(--v6-on-dark-muted)]">{lead}</div>
          </div>
          {facts && facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-primary-400/40 pt-6">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col-reverse gap-1">
                  <dt className="text-base text-[color:var(--v6-on-dark-muted)]">{f.label}</dt>
                  <dd className="text-5xl leading-none text-primary-300">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {sections && (
          <nav aria-label={sectionsLabel} className="mt-12">
            <ul className="flex flex-wrap gap-3">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="v6-chip no-underline">
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
