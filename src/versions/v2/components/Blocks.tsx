import { Link } from 'react-router-dom'
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import type { Quote, Stat } from '../../../data/site'
import { pageHref } from '../../../shared/pages'
import { registration } from '../lib/data'
import { SectionHeading } from './Page'

/** Plural, reader-friendly labels for the programme's published figures. */
const STAT_LABELS: Record<string, string> = {
  Country: 'Countries',
  'UAE Government Entity': 'UAE government entities',
  Expert: 'Experts',
  'Training Hour': 'Training hours',
  Workshop: 'Workshops',
  Trainee: 'Trainees',
  'Area of cooperation': 'Areas of cooperation',
}

interface StatBandProps {
  id: string
  eyebrow: string
  title: string
  intro?: string
  stats: Stat[]
}

/** Dark band of large published figures. */
export function StatBand({ id, eyebrow, title, intro, stats }: StatBandProps) {
  return (
    <section aria-labelledby={id} className="v2-dark v2-grid-bg bg-techblue-950 py-16 text-whitely-50 md:py-20">
      <div className="container">
        <SectionHeading id={id} eyebrow={eyebrow} title={title} intro={intro} dark />
        <dl
          className={`mt-10 grid grid-cols-2 border-t border-techblue-200/20 md:grid-cols-3 ${
            stats.length > 4 ? 'xl:grid-cols-6' : 'xl:grid-cols-4'
          }`}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-2 border-b border-techblue-200/20 py-6 pe-4">
              <dt className="text-sm text-techblue-100">{STAT_LABELS[stat.label] ?? stat.label}</dt>
              <dd className="v2-display text-2xl font-bold break-words text-whitely-50 sm:text-3xl lg:text-4xl">
                <span className="me-1 inline-block h-6 w-1 rounded-full bg-aegold-300 align-baseline" aria-hidden="true" />
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function QuoteIcon() {
  return (
    <svg className="quote-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M29.25 10.5H40.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H29.25V30a6 6 0 0 0 6 6 1.5 1.5 0 0 1 0 3 9 9 0 0 1-9-9V13.5a3 3 0 0 1 3-3Zm0 15H40.5v-12H29.25v12ZM7.5 10.5h11.25a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7.5V30a6 6 0 0 0 6 6 1.5 1.5 0 0 1 0 3 9 9 0 0 1-9-9V13.5a3 3 0 0 1 3-3Zm0 15h11.25v-12H7.5v12Z"
        fill="currentColor"
      />
    </svg>
  )
}

interface LeaderQuoteProps {
  quote: Quote
  dark?: boolean
}

export function LeaderQuote({ quote, dark = false }: LeaderQuoteProps) {
  return (
    <div className="flex h-full flex-col">
      {quote.image && (
        <img
          src={quote.image}
          alt={quote.author}
          loading="lazy"
          className="aspect-[3/2] w-full rounded-xl object-cover object-top"
        />
      )}
      <blockquote className={`aegov-quote mt-6 flex-1 ${dark ? 'v2-quote-dark' : ''}`}>
        <QuoteIcon />
        <p>{quote.text}</p>
        <div className="quote-footer">
          <span className="quote-author block">{quote.author}</span>
          {quote.role && <span className="quote-cite block">{quote.role}</span>}
        </div>
      </blockquote>
    </div>
  )
}

export function LeaderQuotes() {
  return (
    <section aria-labelledby="v2-quotes" className="v2-dark bg-aeblack-950 py-16 text-whitely-50 md:py-20">
      <div className="container">
        <SectionHeading
          id="v2-quotes"
          eyebrow="Leadership vision"
          title="Why the UAE shares its government experience"
          dark
        />
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {site.quotes.map((quote) => (
            <LeaderQuote key={quote.author} quote={quote} dark />
          ))}
        </div>
      </div>
    </section>
  )
}

/** The programme's five-step partnership workflow as a vertical DS step list. */
export function WorkflowSteps() {
  const steps = site.about.workflow
  return (
    <ol className="aegov-step">
      {steps.map((step, i) => (
        <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
          {i < steps.length - 1 && <div className="step-connector-vertical bg-techblue-200" aria-hidden="true" />}
          <span
            className="step-badge border-techblue-600! bg-techblue-600! font-bold text-whitely-50!"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <div className="pt-1">
            <span className="block text-xs font-semibold uppercase tracking-wider text-techblue-700">{`Step ${i + 1}`}</span>
            <span className="mt-0.5 block font-semibold text-aeblack-900">{step}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Closing call to action: register interest or contact the office. */
export function ParticipateBand() {
  return (
    <section aria-labelledby="v2-participate" className="bg-whitely-50 py-16 md:py-20">
      <div className="container">
        <div className="v2-dark v2-grid-bg relative overflow-hidden rounded-2xl bg-techblue-900 px-6 py-12 text-whitely-50 md:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -end-24 size-80 rounded-full border-[40px] border-aegold-300/20"
          />
          <div className="relative max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-aegold-200">Join the network</p>
            <h2 id="v2-participate" className="mt-2 text-3xl font-extrabold text-whitely-50 md:text-4xl">
              {site.hero.title}
            </h2>
            <p className="mt-4 text-lg text-techblue-100">
              Governments interested in a partnership can register through the programme platform or reach the
              Government Experience Exchange Office directly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={registration.url} target="_blank" rel="noopener noreferrer" className="aegov-btn v2-btn-gold">
                {registration.label}
                <ArrowUpRightIcon size={20} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <Link to={pageHref('v2', 'contact')} className="aegov-btn btn-outline v2-btn-ghost">
                Contact the office
                <ArrowRightIcon size={20} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
