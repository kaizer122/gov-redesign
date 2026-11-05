import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUp, ArrowsDownUp } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { FactList, PageHeader } from '../components/PageHeader'
import { ParticipateCta } from '../components/ParticipateCta'
import { SectionHeading } from '../components/SectionHeading'
import { Tabs } from '../components/Tabs'
import { Workflow } from '../components/Workflow'
import {
  ACTIVE_PARTNERSHIPS,
  STATUS_LABEL,
  byName,
  countryHref,
  countryStat,
  href,
  partnershipPeriod,
  partnershipStatus,
} from '../lib/content'
import { TOOL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

const SECTIONS = [
  { id: 'formats', label: 'Activity formats' },
  { id: 'lifecycle', label: 'Partnership lifecycle' },
  { id: 'record', label: 'Partnership record' },
  { id: 'media', label: 'In the media' },
]

const METRICS = ['Training hours', 'Workshops', 'Trainees'] as const
type SortColumn = 'name' | 'start' | (typeof METRICS)[number]

/** Partnerships grouped by the year they were signed, newest year first. */
function bySigningYear(): [string, Country[]][] {
  const groups: Record<string, Country[]> = {}
  for (const c of site.countries) {
    const year = c.startYear ?? 'Undated'
    groups[year] = [...(groups[year] ?? []), c]
  }
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, countries]) => [year, byName(countries)])
}

export default function ActivitiesPage() {
  const media = site.media[0]
  const reporting = site.countries.filter((c) => METRICS.some((m) => countryStat(c, m) !== undefined)).length

  return (
    <main id="main" data-page="activities" tabIndex={-1}>
      <PageHeader
        page="activities"
        title="Activities"
        lead="How the programme turns signed partnerships into workshops, training and field work, and what each partnership has recorded so far."
        sections={SECTIONS}
        aside={
          <FactList
            facts={[
              { label: 'Active partnerships', value: ACTIVE_PARTNERSHIPS },
              { label: 'Partnerships reporting results', value: reporting },
            ]}
          />
        }
      />

      <section id="formats" aria-labelledby="formats-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading
          id="formats-title"
          eyebrow="What happens in a partnership"
          title="Activity formats"
          intro="Knowledge is exchanged through virtual and physical formats, from design-thinking workshops and field visits to capacity-building programmes and publications."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.about.tools.map((tool) => {
            const Icon = TOOL_ICONS[tool]
            return (
              <li key={tool} className="aegov-card card-bordered flex items-center gap-4 border-aeblack-100! p-5! [&>*]:m-0!">
                {Icon && (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <Icon aria-hidden="true" className="size-7" />
                  </span>
                )}
                <span className="font-semibold text-aeblack-900">{tool}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="lifecycle" aria-labelledby="lifecycle-title" className="scroll-mt-4 border-y border-aeblack-100 bg-aeblack-50">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="lifecycle-title"
            eyebrow="Partnership lifecycle"
            title="Five stages, from agreement to documented achievements"
            intro={site.about.methodology}
          />
          <Workflow />
        </div>
      </section>

      <section id="record" aria-labelledby="record-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading
          id="record-title"
          eyebrow="Partnership record"
          title="Partnerships by year and results"
          intro="Browse partnerships by the year they were signed, or compare the training hours, workshops and trainees each partnership has reported."
        />
        <Tabs
          label="Partnership record views"
          tabs={[
            { key: 'timeline', label: 'Timeline by signing year', content: <Timeline /> },
            { key: 'results', label: 'Results by partnership', content: <ResultsTable /> },
          ]}
        />
      </section>

      {media && (
        <section id="media" aria-labelledby="media-title" className="scroll-mt-4 border-t border-aeblack-100 bg-aeblack-50">
          <div className={`${CONTAINER} ${SECTION}`}>
            <SectionHeading id="media-title" eyebrow="In the media" title="Latest from the Media Center" />
            <article className="aegov-card card-news card-bordered overflow-hidden border-aeblack-100! bg-whitely-50 md:grid md:grid-cols-2">
              {media.image && <img src={media.image} alt="" className="h-full w-full object-cover" loading="lazy" />}
              <div className="card-content">
                <span className="aegov-badge">{media.type === 'photo' ? 'Photo' : media.type}</span>
                <h3 className="text-h6 text-aeblack-900">{media.title}</h3>
                <Link to={href('media')} className="aegov-link">
                  Visit the Media Center
                  <ArrowRight aria-hidden="true" className="link-icon" />
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      <ParticipateCta />
    </main>
  )
}

function Timeline() {
  return (
    <ol className="relative space-y-10 border-s-2 border-primary-200 ps-6 md:ps-10">
      {bySigningYear().map(([year, countries]) => (
        <li key={year} className="relative">
          <span
            aria-hidden="true"
            className="absolute top-1.5 -start-[calc(1.5rem+7px)] size-3 rounded-full bg-primary-600 ring-4 ring-primary-100 md:-start-[calc(2.5rem+7px)]"
          />
          <h3 className="mb-4 flex flex-wrap items-baseline gap-x-3 text-h6 text-aeblack-900">
            {year}
            <span className="text-sm font-normal text-aeblack-700">
              {countries.length} {countries.length === 1 ? 'partnership' : 'partnerships'} signed
            </span>
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {countries.map((c) => (
              <li key={c.id}>
                <Link
                  to={countryHref(c.id)}
                  className="flex items-center gap-3 rounded-lg border border-aeblack-100 p-3 text-aeblack-900 no-underline hover:border-primary-400 hover:bg-primary-50"
                >
                  <Flag iso={c.iso} alt="" className="h-6 w-9 shrink-0 rounded-sm object-cover ring-1 ring-aeblack-100" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{c.name}</span>
                    <span className="block text-xs text-aeblack-700">
                      {partnershipPeriod(c)} · {STATUS_LABEL[partnershipStatus(c)]}
                      {c.workstreams ? ` · ${c.workstreams.length} workstreams` : ''}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

function ResultsTable() {
  const [sort, setSort] = useState<{ column: SortColumn; descending: boolean }>({ column: 'Trainees', descending: true })

  const rows = useMemo(() => {
    const value = (c: Country): number | string =>
      sort.column === 'name'
        ? c.name
        : sort.column === 'start'
          ? Number(c.startYear ?? 0)
          : (countryStat(c, sort.column) ?? -1)
    return [...site.countries].sort((a, b) => {
      const va = value(a)
      const vb = value(b)
      const order = typeof va === 'string' ? va.localeCompare(vb as string) : va - (vb as number)
      return sort.descending ? -order : order
    })
  }, [sort])

  const header = (column: SortColumn, label: string, numeric = false) => {
    const activeSort = sort.column === column
    const Icon = !activeSort ? ArrowsDownUp : sort.descending ? ArrowDown : ArrowUp
    return (
      <th
        key={column}
        scope="col"
        aria-sort={activeSort ? (sort.descending ? 'descending' : 'ascending') : undefined}
        className={`px-4 py-3 font-semibold ${numeric ? 'text-end' : 'text-start'}`}
      >
        <button
          type="button"
          onClick={() =>
            setSort({ column, descending: activeSort ? !sort.descending : column !== 'name' })
          }
          className="inline-flex items-center gap-1.5 text-aeblack-900 hover:text-primary-800"
        >
          {label}
          <Icon aria-hidden="true" className={`size-4 ${activeSort ? 'text-primary-700' : 'text-aeblack-500'}`} />
        </button>
      </th>
    )
  }

  return (
    <div>
      <div
        role="region"
        aria-labelledby="v1-results-caption"
        tabIndex={0}
        className="overflow-x-auto rounded-xl border border-aeblack-100"
      >
        <table className="w-full min-w-[44rem] text-sm">
          <caption id="v1-results-caption" className="sr-only">
            Recorded results by partnership. Select a column heading to sort.
          </caption>
          <thead className="bg-aeblack-50 text-aeblack-900">
            <tr>
              {header('name', 'Country')}
              {header('start', 'Period')}
              {METRICS.map((m) => header(m, m, true))}
            </tr>
          </thead>
          <tbody className="divide-y divide-aeblack-100">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-primary-50">
                <th scope="row" className="px-4 py-3 text-start font-normal">
                  <Link
                    to={countryHref(c.id)}
                    className="inline-flex items-center gap-3 font-semibold text-aeblack-900 no-underline hover:text-primary-800 hover:underline"
                  >
                    <Flag iso={c.iso} alt="" className="h-4 w-6 shrink-0 rounded-sm object-cover ring-1 ring-aeblack-100" />
                    {c.name}
                  </Link>
                </th>
                <td className="px-4 py-3 whitespace-nowrap text-aeblack-800">{partnershipPeriod(c)}</td>
                {METRICS.map((m) => {
                  const text = c.stats?.find((s) => s.label === m)?.value
                  return (
                    <td key={m} className="px-4 py-3 text-end text-aeblack-800 tabular-nums">
                      {text ?? (
                        <>
                          <span aria-hidden="true">—</span>
                          <span className="sr-only">Not reported</span>
                        </>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-aeblack-700">
        Figures are as reported for each partnership. A dash means the partnership has not reported that figure.
      </p>
    </div>
  )
}
