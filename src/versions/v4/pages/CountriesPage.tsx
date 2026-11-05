import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretDownIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { CtaBand } from '../components/CtaBand'
import { Page, PageHeader } from '../components/Page'
import { StatusBadge } from '../components/StatusBadge'
import {
  REFERENCE_YEAR,
  countriesByName,
  countryStats,
  href,
  paragraphs,
  partnershipPeriod,
  partnershipStatus,
  workstreamCount,
  type PartnershipStatus,
} from '../lib/content'
import { useDeepLink } from '../lib/useDeepLink'

type StatusFilter = 'all' | PartnershipStatus

const activeTotal = site.countries.filter((c) => partnershipStatus(c) === 'active').length

export function CountriesPage() {
  const selected = useDeepLink('country', 'country-')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [expanded, setExpanded] = useState<number[]>(selected ? [Number(selected)] : [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return countriesByName.filter(
      (c) =>
        (status === 'all' || partnershipStatus(c) === status) &&
        (!q || c.name.toLowerCase().includes(q) || c.workstreams?.some((w) => w.toLowerCase().includes(q))),
    )
  }, [query, status])

  function toggle(id: number) {
    setExpanded((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))
  }

  return (
    <Page pageKey="countries">
      <PageHeader
        crumb="Participating countries"
        eyebrow="Partner directory"
        title="Participating countries"
        intro={
          <p>
            Governments that have signed partnerships with the UAE under the programme. Search by country or workstream,
            filter by status, and open a country to see its workstreams and results.
          </p>
        }
        aside={
          <dl className="grid grid-cols-2 gap-3 sm:w-80">
            <div className="flex flex-col rounded-2xl border border-primary-100 bg-whitely-50 p-4">
              <dt className="text-sm text-aeblack-600">Active in {REFERENCE_YEAR}</dt>
              <dd className="order-first text-3xl font-extrabold text-primary-700">{activeTotal}</dd>
            </div>
            <div className="flex flex-col rounded-2xl border border-aeblack-100 bg-whitely-50 p-4">
              <dt className="text-sm text-aeblack-600">Completed</dt>
              <dd className="order-first text-3xl font-extrabold text-aeblack-800">{site.countries.length - activeTotal}</dd>
            </div>
          </dl>
        }
      />

      <section aria-labelledby="v4-countries-list" className="container py-10 md:py-14">
        <h2 id="v4-countries-list" className="sr-only">
          Country list
        </h2>
        <div className="mb-6 grid gap-4 rounded-2xl border border-aeblack-100 bg-aeblack-50/50 p-4 md:grid-cols-[minmax(0,1fr)_16rem] md:p-6">
          <div className="aegov-form-control">
            <label htmlFor="v4-country-search">Search countries or workstreams</label>
            <div className="form-control-input">
              <span className="control-prefix">
                <MagnifyingGlassIcon aria-hidden="true" />
              </span>
              <input
                id="v4-country-search"
                type="search"
                placeholder="e.g. Kenya or Artificial Intelligence"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor="v4-country-status">Partnership status</label>
            <div className="form-control-input">
              <select
                id="v4-country-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as StatusFilter)}
              >
                <option value="all">All partnerships</option>
                <option value="active">Active in {REFERENCE_YEAR}</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <p className="mb-4 text-sm font-semibold text-aeblack-700" aria-live="polite">
          Showing {visible.length} of {site.countries.length} countries
        </p>

        <div
          aria-hidden="true"
          className="hidden grid-cols-[minmax(0,1fr)_9rem_8rem_8rem_2rem] gap-4 border-b border-aeblack-100 px-4 pb-3 text-xs font-semibold uppercase tracking-wider text-aeblack-600 md:grid"
        >
          <span>Country</span>
          <span>Period</span>
          <span>Workstreams</span>
          <span>Status</span>
          <span />
        </div>
        <ul className="divide-y divide-aeblack-100 border-b border-aeblack-100">
          {visible.map((country) => {
            const open = expanded.includes(country.id)
            const panelId = `country-panel-${country.id}`
            const count = workstreamCount(country)
            const stats = countryStats(country)
            return (
              <li key={country.id}>
                <h3 className="text-base font-semibold leading-normal">
                  <button
                    type="button"
                    id={`country-${country.id}`}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(country.id)}
                    className={`grid w-full scroll-mt-6 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-4 text-start transition-colors hover:bg-primary-50 md:grid-cols-[minmax(0,1fr)_9rem_8rem_8rem_2rem] ${open ? 'bg-primary-50' : ''}`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Flag iso={country.iso} alt="" className="h-6 w-9 shrink-0 rounded-sm object-cover ring-1 ring-aeblack-100" />
                      <span className="font-semibold text-aeblack-900">{country.name}</span>
                    </span>
                    <span className="text-sm text-aeblack-700 max-md:col-start-1 max-md:row-start-2 max-md:ps-12">
                      <span className="md:sr-only">Period: </span>
                      {partnershipPeriod(country)}
                    </span>
                    <span className="text-sm text-aeblack-700 max-md:hidden">
                      {count > 0 ? count : <span aria-hidden="true">—</span>}{' '}
                      <span className="sr-only">{count > 0 ? 'workstreams' : 'Workstreams not published'}</span>
                    </span>
                    <span className="max-md:col-start-2 max-md:row-start-1">
                      <StatusBadge status={partnershipStatus(country)} />
                    </span>
                    <CaretDownIcon
                      aria-hidden="true"
                      className={`size-5 text-aeblack-600 transition-transform max-md:hidden ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                </h3>
                <div id={panelId} hidden={!open} className="px-4 pb-6 pt-2 md:ps-16">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                    <div className="space-y-3 text-aeblack-700">
                      {paragraphs(country.description).length > 0 ? (
                        paragraphs(country.description).map((p) => <p key={p}>{p}</p>)
                      ) : (
                        <p>A summary of this partnership has not been published yet.</p>
                      )}
                    </div>
                    <div className="space-y-5">
                      {country.workstreams && country.workstreams.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-aeblack-600">
                            Workstreams ({count})
                          </h4>
                          <ul className="flex flex-wrap gap-2">
                            {country.workstreams.map((w) => (
                              <li key={w} className="aegov-badge v4-badge-blue whitespace-normal!">
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {stats.length > 0 && (
                        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {stats.map((s) => (
                            <div key={s.label} className="flex min-w-0 flex-col rounded-xl bg-aeblack-50 p-3">
                              <dt className="text-xs text-aeblack-600">{s.label}</dt>
                              <dd className="order-first text-lg font-bold text-aeblack-900">{s.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {country.startYear && (
                        <Link to={href('activities', { year: country.startYear })} className="aegov-link">
                          See partnerships signed in {country.startYear}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        {visible.length === 0 && (
          <div role="status" className="aegov-alert alert-info mt-6">
            <div className="alert-content">
              <p>No countries match your search. Try another name or clear the status filter.</p>
            </div>
          </div>
        )}
      </section>

      <CtaBand
        title="Want your government on this list?"
        text="Express interest in a partnership and the programme team will guide you through the next steps."
        secondary={
          <Link to={href('contact', { subject: 'Government Partnership' })} className="aegov-btn btn-outline">
            Express interest
          </Link>
        }
      />
    </Page>
  )
}
