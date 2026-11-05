import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRightIcon, CalendarBlankIcon, StackIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { Page, PageHeader, SectionHeading } from '../components/Page'
import { StatusBadge } from '../components/StatusBadge'
import {
  REFERENCE_YEAR,
  countriesByName,
  countryStats,
  href,
  partnershipPeriod,
  partnershipProgress,
  partnershipStatus,
  signingYears,
  workstreamCount,
  type PartnershipStatus,
} from '../lib/content'

type StatusFilter = 'all' | PartnershipStatus

export function ActivitiesPage() {
  const [params] = useSearchParams()
  const initialYear = params.get('year')
  const [year, setYear] = useState(initialYear && signingYears.includes(initialYear) ? initialYear : 'all')
  const [status, setStatus] = useState<StatusFilter>('all')

  const filtered = useMemo(
    () =>
      countriesByName.filter(
        (c) => (year === 'all' || c.startYear === year) && (status === 'all' || partnershipStatus(c) === status),
      ),
    [year, status],
  )

  const groups = signingYears
    .map((y) => ({ year: y, countries: filtered.filter((c) => c.startYear === y) }))
    .filter((g) => g.countries.length > 0)

  const activeShown = filtered.filter((c) => partnershipStatus(c) === 'active').length
  const workstreamsShown = filtered.reduce((sum, c) => sum + workstreamCount(c), 0)
  const mediaItem = site.media[0]

  return (
    <Page pageKey="activities">
      <PageHeader
        crumb="Activities"
        eyebrow="Partnership tracker"
        title="Activities"
        intro={
          <p>
            Follow the programme’s partnerships year by year: when each was signed, whether it is active in{' '}
            {REFERENCE_YEAR}, and how many workstreams it covers.
          </p>
        }
      />

      <section aria-labelledby="v4-act-tracker" className="container py-10 md:py-14">
        <h2 id="v4-act-tracker" className="sr-only">
          Partnership tracker
        </h2>
        <div className="mb-8 grid gap-4 rounded-2xl border border-aeblack-100 bg-aeblack-50/50 p-4 sm:grid-cols-2 md:p-6 lg:grid-cols-[16rem_16rem_minmax(0,1fr)] lg:items-end">
          <div className="aegov-form-control">
            <label htmlFor="v4-act-year">Year signed</label>
            <div className="form-control-input">
              <select id="v4-act-year" value={year} onChange={(event) => setYear(event.target.value)}>
                <option value="all">All years</option>
                {signingYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor="v4-act-status">Status in {REFERENCE_YEAR}</label>
            <div className="form-control-input">
              <select
                id="v4-act-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as StatusFilter)}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-3 sm:col-span-2 lg:col-span-1" aria-live="polite">
            <div className="flex flex-col rounded-xl bg-whitely-50 p-3">
              <dt className="text-xs text-aeblack-600">Partnerships</dt>
              <dd className="order-first text-2xl font-extrabold text-aeblack-900">{filtered.length}</dd>
            </div>
            <div className="flex flex-col rounded-xl bg-whitely-50 p-3">
              <dt className="text-xs text-aeblack-600">Active</dt>
              <dd className="order-first text-2xl font-extrabold text-primary-700">{activeShown}</dd>
            </div>
            <div className="flex flex-col rounded-xl bg-whitely-50 p-3">
              <dt className="text-xs text-aeblack-600">Workstreams</dt>
              <dd className="order-first text-2xl font-extrabold text-seablue-800">{workstreamsShown}</dd>
            </div>
          </dl>
        </div>

        {groups.length === 0 && (
          <div role="status" className="aegov-alert alert-info">
            <div className="alert-content">
              <p>No partnerships match these filters. Choose another year or status.</p>
            </div>
          </div>
        )}

        <ol className="space-y-12">
          {groups.map((group) => (
            <li key={group.year}>
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary-600 text-whitely-50">
                  <CalendarBlankIcon aria-hidden="true" className="size-6" />
                </span>
                <h3 id={`v4-act-year-${group.year}`} className="text-xl font-bold text-aeblack-950 md:text-2xl">
                  Signed in {group.year}
                  <span className="ms-2 text-base font-semibold text-aeblack-600">
                    ({group.countries.length} {group.countries.length === 1 ? 'partnership' : 'partnerships'})
                  </span>
                </h3>
              </div>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.countries.map((country) => {
                  const progress = Math.round(partnershipProgress(country) * 100)
                  const stats = countryStats(country)
                  return (
                    <li key={country.id} className="aegov-card card-bordered flex h-full flex-col border-aeblack-100! bg-whitely-50 p-5!">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <Flag iso={country.iso} alt="" className="h-7 w-10 shrink-0 rounded-sm object-cover ring-1 ring-aeblack-100" />
                          <h4 className="text-base font-bold leading-snug text-aeblack-900">{country.name}</h4>
                        </div>
                        <StatusBadge status={partnershipStatus(country)} />
                      </div>
                      <div>
                        <div className="mb-1.5 flex justify-between text-sm text-aeblack-700">
                          <span>{partnershipPeriod(country)}</span>
                          <span className="inline-flex items-center gap-1">
                            <StackIcon aria-hidden="true" className="size-4" />
                            {workstreamCount(country) > 0 ? `${workstreamCount(country)} workstreams` : 'Workstreams not published'}
                          </span>
                        </div>
                        <div
                          role="progressbar"
                          aria-label={`Share of the ${country.name} partnership period elapsed by ${REFERENCE_YEAR}`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={progress}
                          className="h-2 overflow-hidden rounded-full bg-aeblack-100"
                        >
                          <div className="h-full rounded-full bg-primary-600" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                      {stats.length > 0 && (
                        <dl className="grid grid-cols-3 gap-2 text-center">
                          {stats.map((s) => (
                            <div key={s.label} className="flex min-w-0 flex-col rounded-lg bg-aeblack-50 px-1 py-2">
                              <dt className="text-xs text-aeblack-600">{s.label}</dt>
                              <dd className="order-first truncate text-sm font-bold text-aeblack-900">{s.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <Link to={href('countries', { country: String(country.id) })} className="aegov-link mt-auto text-sm">
                        Partnership details
                        <span className="sr-only">: {country.name}</span>
                        <ArrowRightIcon aria-hidden="true" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="v4-act-formats" className="border-t border-aeblack-100 bg-aeblack-50/50">
        <div className="container grid gap-10 py-14 md:py-20 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="v4-act-formats"
              title="How activities are delivered"
              intro="Within each partnership’s action plan, activities take these forms."
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {site.about.tools.map((tool) => (
                <li key={tool} className="rounded-2xl border border-aeblack-100 bg-whitely-50 px-4 py-3 font-semibold text-aeblack-800">
                  {tool}
                </li>
              ))}
            </ul>
            <Link to={href('about')} className="aegov-link mt-6">
              See how a partnership is set up
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </div>
          {mediaItem && (
            <div>
              <h2 className="mb-8 text-2xl font-bold text-aeblack-950 md:text-3xl">From the media centre</h2>
              <div className="aegov-card card-news card-bordered border-aeblack-100! bg-whitely-50 sm:flex">
                {mediaItem.image && (
                  <img
                    src={mediaItem.image}
                    alt=""
                    width={512}
                    height={512}
                    className="aspect-square w-full object-cover sm:w-48 sm:shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="card-content">
                  <span className="aegov-badge">Photo</span>
                  <h3 className="text-lg font-bold text-aeblack-950">{mediaItem.title}</h3>
                  <Link to={href('media')} className="aegov-link">
                    Visit the media centre
                    <ArrowRightIcon aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Page>
  )
}
