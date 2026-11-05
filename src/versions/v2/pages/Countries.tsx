import { useId, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  RowsIcon,
  SquaresFourIcon,
} from '@phosphor-icons/react'
import { Flag } from '../../../shared/Flag'
import { FigureList, Main, PageHeader } from '../components/Page'
import { CountryModal } from '../components/CountryModal'
import { StatusBadge } from '../components/StatusBadge'
import {
  REFERENCE_YEAR,
  activeCount,
  completedCount,
  findPartner,
  partners,
  partnersWithWorkstreams,
  signingYears,
  type Partner,
} from '../lib/data'

type StatusFilter = 'all' | 'active' | 'completed'
type SortKey = 'name' | 'newest' | 'oldest'
type View = 'grid' | 'list'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All partnerships' },
  { value: 'active', label: `Active (runs to ${REFERENCE_YEAR} or later)` },
  { value: 'completed', label: `Completed (ended before ${REFERENCE_YEAR})` },
]

export default function Countries() {
  const [query, setQuery] = useState('')
  const [year, setYear] = useState('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [withWorkstreams, setWithWorkstreams] = useState(false)
  const [sort, setSort] = useState<SortKey>('name')
  const [view, setView] = useState<View>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const triggerRef = useRef<HTMLElement | null>(null)
  const uid = useId()

  const selected = findPartner(Number(searchParams.get('country')))

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = partners.filter(
      (p) =>
        (q === '' ||
          p.name.toLowerCase().includes(q) ||
          p.shortName.toLowerCase().includes(q) ||
          (p.workstreams ?? []).some((w) => w.toLowerCase().includes(q))) &&
        (year === 'all' || p.startYear === year) &&
        (status === 'all' || p.status === status) &&
        (!withWorkstreams || (p.workstreams?.length ?? 0) > 0),
    )
    if (sort === 'name') return filtered
    const dir = sort === 'newest' ? -1 : 1
    return [...filtered].sort((a, b) => dir * ((a.start ?? 0) - (b.start ?? 0)) || a.shortName.localeCompare(b.shortName))
  }, [query, year, status, withWorkstreams, sort])

  const activeFilterCount = [query.trim() !== '', year !== 'all', status !== 'all', withWorkstreams].filter(Boolean).length

  const clearFilters = () => {
    setQuery('')
    setYear('all')
    setStatus('all')
    setWithWorkstreams(false)
  }

  const openPartner = (partner: Partner, trigger: HTMLElement) => {
    triggerRef.current = trigger
    setSearchParams({ country: String(partner.id) }, { preventScrollReset: true })
  }

  const closePartner = () => {
    setSearchParams({}, { preventScrollReset: true })
    triggerRef.current?.focus()
  }

  return (
    <Main page="countries">
      <PageHeader
        page="countries"
        eyebrow="Country explorer"
        title="Participating countries"
        lead="Search and filter the governments that have signed strategic partnerships with the UAE. Open any profile to see its term, workstreams and reported figures."
        aside={
          <FigureList
            items={[
              { value: String(partners.length), label: 'Partner profiles' },
              { value: String(activeCount), label: `Active in ${REFERENCE_YEAR}` },
              { value: String(completedCount), label: 'Completed terms' },
              { value: String(partnersWithWorkstreams.length), label: 'Profiles listing workstreams' },
            ]}
          />
        }
      />

      <section aria-labelledby="v2-explorer" className="bg-aeblack-50 py-12 md:py-16">
        <h2 id="v2-explorer" className="sr-only">
          Partner explorer
        </h2>
        <div className="container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4 xl:col-span-3">
            <button
              type="button"
              className="aegov-btn btn-outline btn-block lg:hidden"
              aria-expanded={filtersOpen}
              aria-controls="v2-filters"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <FunnelIcon size={20} aria-hidden="true" />
              {filtersOpen ? 'Hide filters' : 'Show filters'}
              {activeFilterCount > 0 && <span className="aegov-badge badge-base">{activeFilterCount}</span>}
            </button>
            <form
              id="v2-filters"
              role="search"
              aria-label="Filter partner countries"
              className={`${filtersOpen ? 'block' : 'hidden'} mt-4 space-y-6 rounded-2xl border border-aeblack-100 bg-whitely-50 p-5 lg:sticky lg:top-6 lg:mt-0 lg:block`}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="aegov-form-control">
                <label htmlFor={`${uid}-q`}>Search</label>
                <div className="form-control-input">
                  <span className="control-prefix">
                    <MagnifyingGlassIcon aria-hidden="true" />
                  </span>
                  <input
                    type="search"
                    id={`${uid}-q`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Country or workstream"
                    aria-describedby={`${uid}-q-help`}
                  />
                </div>
                <p id={`${uid}-q-help`} className="mt-2 text-xs leading-5 text-aeblack-600">
                  Try “Brazil” or “Programming”.
                </p>
              </div>

              <div className="aegov-form-control">
                <label htmlFor={`${uid}-year`}>Signing year</label>
                <div className="form-control-input">
                  <select id={`${uid}-year`} value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="all">All years</option>
                    {signingYears.map((g) => (
                      <option key={g.year} value={String(g.year)}>
                        {`${g.year} (${g.signed.length})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-aeblack-800">Partnership status</legend>
                <div className="space-y-3">
                  {STATUS_OPTIONS.map((option) => (
                    <div key={option.value} className="aegov-check-item">
                      <input
                        type="radio"
                        id={`${uid}-status-${option.value}`}
                        name={`${uid}-status`}
                        value={option.value}
                        checked={status === option.value}
                        onChange={() => setStatus(option.value)}
                      />
                      <label htmlFor={`${uid}-status-${option.value}`}>{option.label}</label>
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-aeblack-800">Workstreams</legend>
                <div className="aegov-check-item">
                  <input
                    type="checkbox"
                    id={`${uid}-ws`}
                    checked={withWorkstreams}
                    onChange={(e) => setWithWorkstreams(e.target.checked)}
                  />
                  <label htmlFor={`${uid}-ws`}>Only profiles that list workstreams</label>
                </div>
              </fieldset>

              <button
                type="button"
                className="aegov-btn btn-sm btn-soft btn-block"
                onClick={clearFilters}
                disabled={activeFilterCount === 0}
              >
                Clear all filters
              </button>
            </form>
          </div>

          <div className="min-w-0 lg:col-span-8 xl:col-span-9">
            <div className="flex flex-col gap-4 border-b border-aeblack-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-sm text-aeblack-700" role="status" aria-live="polite">
                Showing <strong className="text-techblue-950">{results.length}</strong> of {partners.length} partners
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <div className="aegov-form-control control-sm">
                  <label htmlFor={`${uid}-sort`} className="sr-only">
                    Sort by
                  </label>
                  <div className="form-control-input">
                    <select id={`${uid}-sort`} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                      <option value="name">Sort: Name A–Z</option>
                      <option value="newest">Sort: Newest signing</option>
                      <option value="oldest">Sort: Oldest signing</option>
                    </select>
                  </div>
                </div>
                <div role="group" aria-label="Results layout" className="flex rounded-lg border border-aeblack-200 bg-whitely-50 p-1">
                  <button
                    type="button"
                    aria-pressed={view === 'grid'}
                    onClick={() => setView('grid')}
                    className={`inline-flex size-10 items-center justify-center rounded-md ${view === 'grid' ? 'bg-techblue-600 text-whitely-50' : 'text-aeblack-700 hover:bg-techblue-50'}`}
                  >
                    <SquaresFourIcon size={20} aria-hidden="true" />
                    <span className="sr-only">Grid view</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={view === 'list'}
                    onClick={() => setView('list')}
                    className={`inline-flex size-10 items-center justify-center rounded-md ${view === 'list' ? 'bg-techblue-600 text-whitely-50' : 'text-aeblack-700 hover:bg-techblue-50'}`}
                  >
                    <RowsIcon size={20} aria-hidden="true" />
                    <span className="sr-only">List view</span>
                  </button>
                </div>
              </div>
            </div>

            {results.length === 0 ? (
              <div role="alert" className="aegov-alert alert-info mt-6">
                <div className="alert-content">
                  <p className="alert-title font-semibold">No partners match these filters</p>
                  <p>Try a different search term or clear the filters to see all {partners.length} partners.</p>
                  <button type="button" className="aegov-btn btn-sm mt-3" onClick={clearFilters}>
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : view === 'grid' ? (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((partner) => (
                  <li key={partner.id}>
                    <PartnerCard partner={partner} onOpen={openPartner} />
                  </li>
                ))}
              </ul>
            ) : (
              <PartnerTable partners={results} onOpen={openPartner} />
            )}
          </div>
        </div>
      </section>

      {selected && <CountryModal partner={selected} onClose={closePartner} />}
    </Main>
  )
}

interface PartnerViewProps {
  onOpen: (partner: Partner, trigger: HTMLElement) => void
}

function PartnerCard({ partner, onOpen }: PartnerViewProps & { partner: Partner }) {
  const workstreams = partner.workstreams ?? []
  return (
    <article className="aegov-card card-bordered relative flex h-full flex-col bg-whitely-50 p-0! transition-shadow focus-within:shadow-lg hover:shadow-lg">
      <div className="card-content flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <Flag iso={partner.iso} alt="" className="h-8 w-12 rounded object-cover ring-1 ring-aeblack-900/10" />
          <StatusBadge status={partner.status} />
        </div>
        <h3 className="card-title mt-4 text-xl! leading-snug">
          <button
            type="button"
            className="text-start text-techblue-950 after:absolute after:inset-0 after:rounded-xl after:content-[''] hover:text-techblue-700"
            onClick={(e) => onOpen(partner, e.currentTarget)}
          >
            {partner.shortName}
          </button>
        </h3>
        {partner.shortName !== partner.name && <p className="text-sm text-aeblack-600">{partner.name}</p>}
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-aeblack-100 pt-4 text-sm">
          <div className="flex flex-col-reverse">
            <dt className="text-xs text-aeblack-600">Term</dt>
            <dd className="font-semibold text-aeblack-900">
              {partner.startYear && partner.endYear ? `${partner.startYear} – ${partner.endYear}` : partner.startYear ?? '–'}
            </dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className="text-xs text-aeblack-600">Workstreams listed</dt>
            <dd className="font-semibold text-aeblack-900">{workstreams.length}</dd>
          </div>
        </dl>
        {workstreams.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Selected workstreams">
            {workstreams.slice(0, 3).map((w) => (
              <li key={w} className="rounded bg-techblue-50 px-2 py-0.5 text-xs font-medium text-techblue-800">
                {w}
              </li>
            ))}
            {workstreams.length > 3 && (
              <li className="rounded px-2 py-0.5 text-xs font-medium text-aeblack-600">{`+${workstreams.length - 3} more`}</li>
            )}
          </ul>
        )}
        <p className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-techblue-700" aria-hidden="true">
          View partnership
          <ArrowRightIcon size={16} />
        </p>
      </div>
    </article>
  )
}

function PartnerTable({ partners: rows, onOpen }: PartnerViewProps & { partners: Partner[] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-aeblack-100 bg-whitely-50" role="region" aria-label="Partner list" tabIndex={0}>
      <table className="w-full min-w-[640px] text-start text-sm">
        <caption className="sr-only">Partner countries with signing year, term end, status and workstreams</caption>
        <thead className="bg-techblue-950 text-whitely-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-start font-semibold">Country</th>
            <th scope="col" className="px-4 py-3 text-start font-semibold">Signed</th>
            <th scope="col" className="px-4 py-3 text-start font-semibold">Term ends</th>
            <th scope="col" className="px-4 py-3 text-start font-semibold">Status</th>
            <th scope="col" className="px-4 py-3 text-start font-semibold">Workstreams</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-aeblack-100">
          {rows.map((partner) => (
            <tr key={partner.id} className="hover:bg-techblue-50/60">
              <th scope="row" className="px-4 py-3 text-start font-normal">
                <button
                  type="button"
                  className="flex items-center gap-3 text-start font-semibold text-techblue-800 underline-offset-4 hover:underline"
                  onClick={(e) => onOpen(partner, e.currentTarget)}
                >
                  <Flag iso={partner.iso} alt="" className="h-5 w-[30px] shrink-0 rounded-sm object-cover ring-1 ring-aeblack-900/10" />
                  {partner.shortName}
                </button>
              </th>
              <td className="px-4 py-3 text-aeblack-800">{partner.startYear ?? '–'}</td>
              <td className="px-4 py-3 text-aeblack-800">{partner.endYear ?? '–'}</td>
              <td className="px-4 py-3">
                <StatusBadge status={partner.status} />
              </td>
              <td className="px-4 py-3 text-aeblack-800">{partner.workstreams?.length ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
