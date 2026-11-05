import { useId, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { site } from '../../../data/site'
import type { Country } from '../../../data/site'
import { CountryCard } from '../components/CountryCard'
import { CountryModal } from '../components/CountryModal'
import { FactList, PageHeader } from '../components/PageHeader'
import { ParticipateCta } from '../components/ParticipateCta'
import {
  ACTIVE_PARTNERSHIPS,
  FIRST_PARTNERSHIP_YEAR,
  STATUS_LABEL,
  areaMatchesWorkstream,
  byName,
  byNewest,
  partnershipStatus,
  type PartnershipStatus,
} from '../lib/content'
import { CONTAINER } from '../lib/ui'

type SortKey = 'name' | 'newest' | 'oldest'

const SORT_LABEL: Record<SortKey, string> = {
  name: 'Name (A–Z)',
  newest: 'Newest partnership first',
  oldest: 'Oldest partnership first',
}

function sortCountries(countries: Country[], sort: SortKey): Country[] {
  if (sort === 'name') return byName(countries)
  const newest = byNewest(countries)
  return sort === 'newest' ? newest : newest.reverse()
}

export default function CountriesPage() {
  const id = useId()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const areaSlug = params.get('area') ?? ''
  const status = (params.get('status') ?? '') as PartnershipStatus | ''
  const sort = (params.get('sort') as SortKey | null) ?? 'name'
  const selected = site.countries.find((c) => String(c.id) === params.get('country'))

  const update = (key: string, value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: key !== 'country' || !value, preventScrollReset: true },
    )

  const area = site.areas.find((a) => a.slug === areaSlug)
  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = site.countries.filter(
      (c) =>
        (!term || c.name.toLowerCase().includes(term)) &&
        (!area || c.workstreams?.some((w) => areaMatchesWorkstream(area, w))) &&
        (!status || partnershipStatus(c) === status),
    )
    return sortCountries(filtered, sort)
  }, [query, area, status, sort])

  const filtersActive = Boolean(query || area || status)

  return (
    <main id="main" data-page="countries" tabIndex={-1}>
      <PageHeader
        page="countries"
        title="Participating countries"
        lead="Governments that have signed partnerships with the UAE Government through the programme. Filter by area of cooperation or status, and select a country for its partnership period, workstreams and recorded results."
        aside={
          <FactList
            facts={[
              { label: 'Participating countries', value: site.countries.length },
              { label: 'Active partnerships', value: ACTIVE_PARTNERSHIPS },
              { label: 'First partnerships signed', value: FIRST_PARTNERSHIP_YEAR },
              { label: 'Areas of cooperation', value: site.areas.length },
            ]}
          />
        }
      />

      <section aria-labelledby={`${id}-results-title`} className={`${CONTAINER} py-10 md:py-12`}>
        <h2 id={`${id}-results-title`} className="sr-only">
          Country list
        </h2>
        <form
          role="search"
          aria-label="Filter participating countries"
          onSubmit={(e) => e.preventDefault()}
          className="mb-8 grid gap-4 rounded-xl border border-aeblack-100 bg-aeblack-50 p-4 md:grid-cols-2 md:p-6 xl:grid-cols-4"
        >
          <div className="aegov-form-control">
            <label htmlFor={`${id}-q`}>Country name</label>
            <div className="form-control-input">
              <input
                type="search"
                id={`${id}-q`}
                value={query}
                placeholder="e.g. Egypt"
                onChange={(e) => update('q', e.target.value)}
              />
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor={`${id}-area`}>Area of cooperation</label>
            <div className="form-control-input">
              <select id={`${id}-area`} value={areaSlug} onChange={(e) => update('area', e.target.value)}>
                <option value="">All areas</option>
                {site.areas.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor={`${id}-status`}>Partnership status</label>
            <div className="form-control-input">
              <select id={`${id}-status`} value={status} onChange={(e) => update('status', e.target.value)}>
                <option value="">All statuses</option>
                {(Object.keys(STATUS_LABEL) as PartnershipStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor={`${id}-sort`}>Sort by</label>
            <div className="form-control-input">
              <select
                id={`${id}-sort`}
                value={sort}
                onChange={(e) => update('sort', e.target.value === 'name' ? '' : e.target.value)}
              >
                {(Object.keys(SORT_LABEL) as SortKey[]).map((s) => (
                  <option key={s} value={s}>
                    {SORT_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-aeblack-800" aria-live="polite">
            Showing <strong>{results.length}</strong> of {site.countries.length} countries
            {area && (
              <>
                {' '}
                with <strong>{area.title}</strong>
              </>
            )}
          </p>
          {filtersActive && (
            <button
              type="button"
              className="aegov-btn btn-link btn-sm"
              onClick={() => setParams(sort === 'name' ? {} : { sort }, { replace: true, preventScrollReset: true })}
            >
              Clear filters
            </button>
          )}
        </div>

        {results.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((c) => (
              <li key={c.id}>
                <CountryCard country={c} onOpen={(country) => update('country', String(country.id))} />
              </li>
            ))}
          </ul>
        ) : (
          <div role="status" className="aegov-alert alert-info">
            <div className="alert-content">
              <p>No country matches these filters. Clear the filters or try another name.</p>
            </div>
          </div>
        )}
      </section>

      <CountryModal country={selected} onClose={() => update('country', '')} />
      <ParticipateCta />
    </main>
  )
}
