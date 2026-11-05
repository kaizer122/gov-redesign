import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUp, ArrowsDownUp } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { compareText, formatNumber, useLang, useT, type Lang } from '../../../shared/i18n'
import { PROGRAMMES, UI } from '../../../shared/strings'
import { FactList, PageHeader } from '../components/PageHeader'
import { ParticipateCta } from '../components/ParticipateCta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Tabs } from '../components/Tabs'
import { ToolList } from '../components/ToolList'
import { Workflow } from '../components/Workflow'
import {
  ACTIVE_PARTNERSHIPS,
  STATUS_LABEL,
  byName,
  countryStat,
  countryStatText,
  partnershipPeriod,
  partnershipStatus,
  useLinks,
} from '../lib/content'
import { F, T } from '../lib/dict'
import { CONTAINER, SECTION } from '../lib/ui'

/** Partnerships derive from MOU signings: the MOU Signings programme colour identifies them. */
const MOU = PROGRAMMES[2]

const METRICS = [
  { key: 'Training hours', label: UI.trainingHours },
  { key: 'Workshops', label: UI.workshops },
  { key: 'Trainees', label: UI.trainees },
] as const

type SortColumn = 'name' | 'start' | (typeof METRICS)[number]['key']

/** Partnerships grouped by the year they were signed, newest year first. */
function bySigningYear(countries: Country[], lang: Lang): [string, Country[]][] {
  const groups: Record<string, Country[]> = {}
  for (const c of countries) {
    const year = c.startYear ?? ''
    groups[year] = [...(groups[year] ?? []), c]
  }
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, list]) => [year, byName(list, lang)])
}

export default function ActivitiesPage() {
  const lang = useLang()
  const t = useT(T)
  const { href } = useLinks()
  const site = getSite(lang)
  const media = site.media[0]
  const reporting = site.countries.filter((c) => METRICS.some((m) => countryStat(c, m.key) !== undefined)).length

  return (
    <main id="main" data-page="activities" tabIndex={-1}>
      <PageHeader
        page="activities"
        title={t('activitiesTitle')}
        lead={t('activitiesLead')}
        sections={[
          { id: 'formats', label: t('activityFormats') },
          { id: 'lifecycle', label: t('partnershipLifecycle') },
          { id: 'record', label: t('partnershipRecord') },
          { id: 'media', label: t('inTheMedia') },
        ]}
        aside={
          <FactList
            facts={[
              { label: t('activePartnerships'), value: formatNumber(ACTIVE_PARTNERSHIPS, lang) },
              { label: t('reportingResults'), value: formatNumber(reporting, lang) },
            ]}
          />
        }
      />

      <section id="formats" aria-labelledby="formats-title" className={`${CONTAINER} ${SECTION} scroll-mt-4 pt-4!`}>
        <SectionHeading
          id="formats-title"
          eyebrow={t('whatHappens')}
          title={t('activityFormats')}
          intro={t('activityFormatsIntro')}
        />
        <ToolList tools={site.about.tools} />
      </section>

      <section id="lifecycle" aria-labelledby="lifecycle-title" className="scroll-mt-4 bg-[var(--egeep-ivory)]">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="lifecycle-title"
            eyebrow={t('partnershipLifecycle')}
            title={t('lifecycleTitle')}
            intro={site.about.methodology}
          />
          <Reveal>
            <Workflow />
          </Reveal>
        </div>
      </section>

      <section id="record" aria-labelledby="record-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading
          id="record-title"
          eyebrow={t('partnershipRecord')}
          title={t('recordTitle')}
          intro={t('recordIntro')}
        />
        <Tabs
          label={t('recordViews')}
          tabs={[
            { key: 'timeline', label: t('timelineTab'), content: <Timeline countries={site.countries} /> },
            { key: 'results', label: t('resultsTab'), content: <ResultsTable countries={site.countries} /> },
          ]}
        />
      </section>

      {media && (
        <section id="media" aria-labelledby="media-title" className="scroll-mt-4 bg-[var(--egeep-ivory)]">
          <div className={`${CONTAINER} ${SECTION}`}>
            <SectionHeading id="media-title" eyebrow={t('inTheMedia')} title={t('latestFromMedia')} />
            <article className="aegov-card card-news grid border-0! bg-[#fff] p-0! md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] [&>*]:m-0!">
              {media.image && (
                <img src={media.image} alt="" width={512} height={512} loading="lazy" className="aspect-square w-full object-cover md:aspect-auto md:h-full" />
              )}
              <div className="card-content flex flex-col justify-center gap-5 p-8 md:p-12">
                <span className="v5-eyebrow">{t('typePhoto')}</span>
                <h3 className="text-3xl text-[var(--egeep-charcoal)]">{media.title}</h3>
                <Link to={href('media')} className="aegov-link">
                  {t('visitMediaCenter')}
                  <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
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

function Timeline({ countries }: { countries: Country[] }) {
  const lang = useLang()
  const { countryHref } = useLinks()
  return (
    <div>
      <p className="mb-8 flex items-center gap-3 text-lg text-[var(--egeep-charcoal)]">
        <span aria-hidden="true" className="size-3 rotate-45" style={{ backgroundColor: MOU.color }} />
        {F.timelineLegend[lang](MOU.name[lang])}
      </p>
      <ol className="relative space-y-12 border-s border-[var(--egeep-gold)] ps-8 md:ps-12">
        {bySigningYear(countries, lang).map(([year, list]) => (
          <li key={year} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-3 -start-[calc(2rem+6px)] size-3 rotate-45 md:-start-[calc(3rem+6px)]"
              style={{ backgroundColor: MOU.color }}
            />
            <h3 className="mb-5 flex flex-wrap items-baseline gap-x-4 text-4xl text-[var(--egeep-gold)]">
              {year}
              <span className="text-lg text-[var(--v5-muted)]">{F.signedCount[lang](list.length)}</span>
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((c) => (
                <li key={c.id}>
                  <Link
                    to={countryHref(c.id)}
                    className="flex items-center gap-4 border border-[var(--egeep-grey-light)] p-4 text-[var(--egeep-charcoal)] no-underline hover:border-[var(--egeep-gold)]"
                  >
                    <Flag iso={c.iso} alt="" className="h-6 w-9 shrink-0 object-cover ring-1 ring-[var(--egeep-grey-light)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg">{c.name}</span>
                      <span className="block text-base text-[var(--v5-muted)]">
                        {partnershipPeriod(c)} · {STATUS_LABEL[partnershipStatus(c)][lang]}
                        {c.workstreams ? ` · ${F.workstreamCount[lang](c.workstreams.length)}` : ''}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ResultsTable({ countries }: { countries: Country[] }) {
  const lang = useLang()
  const t = useT(T)
  const { countryHref } = useLinks()
  const [sort, setSort] = useState<{ column: SortColumn; descending: boolean }>({ column: 'Trainees', descending: true })

  const rows = useMemo(() => {
    const compare = compareText(lang)
    const value = (c: Country): number | string =>
      sort.column === 'name' ? c.name : sort.column === 'start' ? Number(c.startYear ?? 0) : (countryStat(c, sort.column) ?? -1)
    return [...countries].sort((a, b) => {
      const va = value(a)
      const vb = value(b)
      const order = typeof va === 'string' ? compare(va, vb as string) : va - (vb as number)
      return sort.descending ? -order : order
    })
  }, [sort, countries, lang])

  const header = (column: SortColumn, label: string, numeric = false) => {
    const activeSort = sort.column === column
    const Icon = !activeSort ? ArrowsDownUp : sort.descending ? ArrowDown : ArrowUp
    return (
      <th
        key={column}
        scope="col"
        aria-sort={activeSort ? (sort.descending ? 'descending' : 'ascending') : undefined}
        className={`px-4 py-4 ${numeric ? 'text-end' : 'text-start'}`}
      >
        <button
          type="button"
          onClick={() => setSort({ column, descending: activeSort ? !sort.descending : column !== 'name' })}
          className="inline-flex items-center gap-2 text-lg text-[var(--egeep-charcoal)] hover:text-[var(--color-primary-800)]"
        >
          {label}
          <Icon aria-hidden="true" className={`size-4 ${activeSort ? 'text-[var(--color-primary-700)]' : 'text-[var(--v5-muted)]'}`} />
        </button>
      </th>
    )
  }

  return (
    <div>
      <div role="region" aria-labelledby="v5-results-caption" tabIndex={0} className="overflow-x-auto border-t border-[var(--egeep-gold)]">
        <table className="w-full min-w-[46rem] text-lg">
          <caption id="v5-results-caption" className="sr-only">
            {t('resultsCaption')}
          </caption>
          <thead className="bg-[var(--egeep-ivory)]">
            <tr>
              {header('name', UI.partnerCountries[lang])}
              {header('start', UI.partnershipPeriod[lang])}
              {METRICS.map((m) => header(m.key, m.label[lang], true))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--egeep-grey-light)]">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-[var(--egeep-ivory)]">
                <th scope="row" className="px-4 py-3 text-start">
                  <Link
                    to={countryHref(c.id)}
                    className="inline-flex items-center gap-3 text-[var(--egeep-charcoal)] no-underline hover:text-[var(--color-primary-800)] hover:underline"
                  >
                    <Flag iso={c.iso} alt="" className="h-4 w-6 shrink-0 object-cover ring-1 ring-[var(--egeep-grey-light)]" />
                    {c.name}
                  </Link>
                </th>
                <td className="px-4 py-3 whitespace-nowrap text-[var(--egeep-charcoal)]">{partnershipPeriod(c)}</td>
                {METRICS.map((m) => {
                  const text = countryStatText(c, m.key)
                  return (
                    <td key={m.key} className="px-4 py-3 text-end text-[var(--egeep-charcoal)] tabular-nums">
                      {text ? (
                        <bdi>{text}</bdi>
                      ) : (
                        <>
                          <span aria-hidden="true">-</span>
                          <span className="sr-only">{t('notReported')}</span>
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
      <p className="mt-4 text-base text-[var(--v5-muted)]">{t('resultsNote')}</p>
    </div>
  )
}
