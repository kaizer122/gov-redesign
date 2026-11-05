import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, House } from '@phosphor-icons/react'
import { PATTERNS } from '../../../shared/brand'
import { useLang, useT } from '../../../shared/i18n'
import { pageLabel, type PageKey } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { REGISTER_URL, fill, useSite } from '../lib/content'
import { useLinks } from '../lib/hooks'
import { T } from '../lib/t'
import { CONTAINER } from '../lib/ui'
import { CountUp } from './CountUp'
import { ExternalLink } from './ExternalLink'

interface SectionHeadingProps {
  id: string
  title: string
  eyebrow?: string
  intro?: ReactNode
  /** Link or button aligned to the heading's end on wide screens. */
  action?: ReactNode
}

export function SectionHeading({ id, title, eyebrow, intro, action }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="v8-eyebrow mb-3">{eyebrow}</p>}
        <h2 id={id} className="text-4xl md:text-5xl">
          {title}
        </h2>
        {intro && <p className="v8-muted mt-4 text-lg">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/** Gold text link with a direction-aware arrow. */
export function ArrowLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={`aegov-link ${className}`}>
      {children}
      <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
    </Link>
  )
}

export interface Fact {
  label: string
  value: string
}

interface PageHeaderProps {
  page: PageKey
  title: string
  lead: string
  facts?: Fact[]
  /** Jump links to the page's sections. */
  sections?: { id: string; label: string }[]
}

/** Inner-page masthead on the structural grid: DS breadcrumb, the page's h1, lead, fact tiles, jump links. */
export function PageHeader({ page, title, lead, facts, sections }: PageHeaderProps) {
  const lang = useLang()
  const t = useT(T)
  const { href } = useLinks()
  return (
    <div className="v8-gridlines relative overflow-hidden border-b border-[var(--v8-line)]">
      <div
        aria-hidden="true"
        className="v8-pattern -end-24 -top-24 size-96 max-md:hidden"
        style={{ backgroundImage: `url(${PATTERNS.connectedCircles})` }}
      />
      <div className={`${CONTAINER} relative pt-5 pb-10 md:pb-14`}>
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
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end xl:gap-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl text-[var(--v8-text)] md:text-6xl">{title}</h1>
            <div aria-hidden="true" className="mt-5 h-0.5 w-16 bg-[var(--egeep-gold)]" />
            <p className="v8-muted mt-5 text-xl">{lead}</p>
          </div>
          {facts && facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--v8-radius)] border border-[var(--v8-line)] bg-[var(--v8-line)]">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col-reverse justify-end gap-1 bg-[#fff] p-4">
                  <dt className="v8-muted text-sm">{f.label}</dt>
                  <dd className="v8-gold-title text-4xl">
                    <CountUp value={f.value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {sections && (
          <nav aria-label={t('onThisPage')} className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-[var(--v8-line-strong)] bg-[#fff] px-4 text-sm text-[var(--v8-text)] no-underline hover:border-primary-600 hover:text-primary-800"
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

/** The five-stage partnership workflow as a row of connected tiles. */
export function Workflow() {
  const t = useT(T)
  const site = useSite()
  const steps = site.about.workflow
  return (
    <div className="aegov-step">
      <ol className="grid gap-3 md:grid-cols-5">
        {steps.map((step, i) => (
          <li key={step} className="v8-tile relative flex gap-4 p-5 md:block">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--egeep-gold)] text-xl text-primary-800"
            >
              {i + 1}
            </span>
            <div className="md:mt-5">
              <p className="v8-muted text-sm">{fill(t('stage'), { n: i + 1 })}</p>
              <p className="mt-1 text-xl leading-snug">{step}</p>
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-[2.85rem] -end-3 z-10 hidden h-px w-3 bg-[var(--egeep-gold)] md:block"
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Closing call to action on charcoal: register on the external platform or contact the office. */
export function ParticipateCta() {
  const lang = useLang()
  const t = useT(T)
  const site = useSite()
  const { href } = useLinks()
  return (
    <section aria-labelledby="v8-participate-title" className="v8-dark bg-[var(--egeep-charcoal)] text-[var(--egeep-ivory)]">
      <div aria-hidden="true" className="h-1 bg-[var(--egeep-gold)]" />
      <div className={`${CONTAINER} grid gap-8 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center`}>
        <div className="max-w-3xl">
          <p className="v8-eyebrow mb-4">{site.about.slogan.join(' · ')}</p>
          <h2 id="v8-participate-title" className="text-4xl text-[#fff] md:text-5xl">
            {site.hero.title}
          </h2>
          <p className="mt-5 text-lg text-[#d9d6cd]">{t('ctaBody')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <ExternalLink href={REGISTER_URL} className="aegov-btn btn-lg">
            {site.hero.cta.label}
          </ExternalLink>
          <Link to={href('contact')} className="aegov-btn btn-outline btn-lg">
            {UI.contactUs[lang]}
          </Link>
        </div>
      </div>
    </section>
  )
}
