import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, ArrowsDownUp } from '@phosphor-icons/react'
import { getSite, site } from '../../../data/site'
import type { Country } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { Flag } from '../../../shared/Flag'
import { compareText, formatNumber, useLang, useT } from '../../../shared/i18n'
import { PROGRAMMES, UI } from '../../../shared/strings'
import { ParticipateCta } from '../components/ParticipateCta'
import { ChapterHeading, ChapterLinks, PageOpening } from '../components/Story'
import { Workflow } from '../components/Workflow'
import { COPY } from '../lib/copy'
import {
  ACTIVE_PARTNERSHIPS,
  FIRST_YEAR,
  LATEST_YEAR,
  METRICS,
  countryStat,
  partnershipPeriod,
  partnershipStatus,
  signingYears,
  type Metric,
} from '../lib/content'
import { TOOL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

const MOU = PROGRAMMES.find((p) => p.key === 'mou')!

const METRIC_LABEL: Record<Metric, keyof typeof UI> = {
  'Training hours': 'trainingHours',
  Workshops: 'workshops',
  Trainees: 'trainees',
}

export default function ActivitiesPage() {
  const lang = useLang()
  const t = useT(COPY)
  const { about } = getSite(lang)
  const years = signingYears(lang)

  return (
    <main id="main" data-page="activities" tabIndex={-1}>
      <PageOpening
        page="activities"
        eyebrow={t('chronicleEyebrow')}
        title={t('activitiesTitle')}
        lead={t('activitiesLead')}
        facts={[
          { label: t('signingsRecorded'), value: <bdi>{formatNumber(site.countries.length, lang)}</bdi> },
          { label: t('activePartnerships'), value: <bdi>{formatNumber(ACTIVE_PARTNERSHIPS, lang)}</bdi> },
          {
            label: t('yearsCovered'),
            value: (
              <bdi dir="ltr">
                {FIRST_YEAR}–{LATEST_YEAR}
              </bdi>
            ),
          },
          { label: t('activityFormats'), value: <bdi>{formatNumber(about.tools.length, lang)}</bdi> },
        ]}
      >
        <ChapterLinks
          label={t('onThisPage')}
          items={[
            { id: 'chronicle', label: t('chronicleTitle') },
            { id: 'formats', label: t('activityFormats') },
            { id: 'lifecycle', label: t('aboutStages') },
            { id: 'results', label: t('resultsTitle') },
          ]}
        />
      </PageOpening>

      <section id="chronicle" aria-labelledby="chronicle-title" className={`${SECTION} scroll-mt-4`}>
        <div className={CONTAINER}>
          <ChapterHeading id="chronicle-title" numeral="01" eyebrow={MOU.name[lang]} title={t('chronicleTitle')} intro={t('chronicleLead')} />
          <p className="mb-12 flex items-center gap-3 text-lg text-[var(--v7-muted)]">
            <span aria-hidden="true" className="inline-block size-3 rounded-full" style={{ background: MOU.color }} />
            {t('mouLegend')}
          </p>
          <ol className="v7-chronicle">
            {years.map(({ year, countries }) => (
              <li key={year} className="v7-chronicle-year grid gap-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12 lg:grid-cols-[16rem_minmax(0,1fr)]">
                <div className="md:sticky md:top-8 md:self-start">
                  <h3 className="v7-year text-[var(--egeep-charcoal)]">
                    <bdi>{year}</bdi>
                  </h3>
                  <p className="mt-1 text-lg text-[var(--v7-muted)]">
                    {t('signedLabel')}: <bdi>{formatNumber(countries.length, lang)}</bdi>
                  </p>
                </div>
                <ul className="space-y-0">
                  {countries.map((c) => (
                    <ChronicleEntry key={c.id} country={c} />
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="formats" aria-labelledby="formats-title" className={`v7-dark ${SECTION} scroll-mt-4`}>
        <div className={CONTAINER}>
          <ChapterHeading id="formats-title" numeral="02" dark eyebrow={t('whatHappens')} title={t('activityFormats')} intro={about.methodology} />
          <ul className="grid border-t border-[var(--egeep-gold)] sm:grid-cols-2 lg:grid-cols-3">
            {about.tools.map((tool, i) => {
              const Icon = TOOL_ICONS[site.about.tools[i]]
              return (
                <li key={site.about.tools[i]} className="v7-reveal flex items-center gap-5 border-b border-[var(--v7-hairline-dark)] py-7 sm:pe-6">
                  {Icon && <Icon aria-hidden="true" weight="thin" className="size-10 shrink-0 text-primary-300" />}
                  <span className="text-xl text-[var(--egeep-ivory)]">{tool}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section id="lifecycle" aria-labelledby="lifecycle-title" className={`${SECTION} scroll-mt-4`}>
        <div className={CONTAINER}>
          <ChapterHeading id="lifecycle-title" numeral="03" eyebrow={t('howPartnershipsWork')} title={t('aboutStages')} />
          <Workflow />
        </div>
      </section>

      <section id="results" aria-labelledby="results-title" className={`bg-[var(--v7-surface)] ${SECTION} scroll-mt-4`}>
        <div className={CONTAINER}>
          <ChapterHeading id="results-title" numeral="04" eyebrow={t('partnershipRecord')} title={t('resultsTitle')} intro={t('resultsLead')} />
          <ResultsTable />
        </div>
      </section>

      <ParticipateCta />
    </main>
  )
}

function ChronicleEntry({ country }: { country: Country }) {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const status = partnershipStatus(country)
  return (
    <li className="v7-chronicle-entry v7-reveal">
      <span aria-hidden="true" className="v7-chronicle-dot" style={{ background: MOU.color }} />
      <Link to={`${href('countries')}?country=${country.id}`} className="v7-chronicle-link">
        <Flag iso={country.iso} alt="" className="h-8 w-12 shrink-0 object-cover ring-1 ring-black/10" />
        <span className="min-w-0 flex-1">
          <span className="block text-base text-[var(--v7-muted)]">{t('mouSigned')}</span>
          <span className="block text-2xl leading-snug text-[var(--egeep-charcoal)]">{country.name}</span>
          <span className="mt-1 block text-base text-[var(--v7-muted)]">
            {UI.partnershipPeriod[lang]} <bdi dir="ltr">{partnershipPeriod(country)}</bdi> · {UI[status][lang]}
            {country.workstreams ? (
              <>
                {' · '}
                {UI.workstreams[lang]}: <bdi>{formatNumber(country.workstreams.length, lang)}</bdi>
              </>
            ) : null}
          </span>
        </span>
      </Link>
    </li>
  )
}

type SortColumn = 'name' | 'start' | Metric

function ResultsTable() {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const { countries } = getSite(lang)
  const [sort, setSort] = useState<{ column: SortColumn; descending: boolean }>({ column: 'Trainees', descending: true })

  const rows = useMemo(() => {
    const compare = compareText(lang)
    return [...countries].sort((a, b) => {
      let order: number
      if (sort.column === 'name') order = compare(a.name, b.name)
      else if (sort.column === 'start') order = Number(a.startYear ?? 0) - Number(b.startYear ?? 0)
      else order = (countryStat(a.id, sort.column) ?? -1) - (countryStat(b.id, sort.column) ?? -1)
      return sort.descending ? -order : order
    })
  }, [sort, countries, lang])

  const header = (column: SortColumn, label: string, numeric = false) => {
    const active = sort.column === column
    const Icon = !active ? ArrowsDownUp : sort.descending ? ArrowDown : ArrowUp
    return (
      <th
        key={column}
        scope="col"
        aria-sort={active ? (sort.descending ? 'descending' : 'ascending') : undefined}
        className={`px-4 py-4 font-normal ${numeric ? 'text-end' : 'text-start'}`}
      >
        <button
          type="button"
          onClick={() => setSort({ column, descending: active ? !sort.descending : column !== 'name' })}
          className="inline-flex items-center gap-1.5 text-lg text-[var(--egeep-charcoal)] hover:text-primary-800"
        >
          {label}
          <Icon aria-hidden="true" className={`size-4 ${active ? 'text-primary-700' : 'text-[var(--v7-muted)]'}`} />
        </button>
      </th>
    )
  }

  return (
    <div>
      <div role="region" aria-labelledby="v7-results-caption" tabIndex={0} className="relative overflow-x-auto border-y border-[var(--egeep-gold)]">
        <table className="w-full min-w-[46rem] text-lg">
          <caption id="v7-results-caption" className="sr-only">
            {t('resultsCaption')}
          </caption>
          <thead className="border-b border-[var(--v7-hairline-strong)]">
            <tr>
              {header('name', t('country'))}
              {header('start', UI.partnershipPeriod[lang])}
              {METRICS.map((m) => header(m, UI[METRIC_LABEL[m]][lang], true))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--v7-hairline)]">
            {rows.map((c) => (
              <tr key={c.id}>
                <th scope="row" className="px-4 py-3 text-start font-normal">
                  <Link to={`${href('countries')}?country=${c.id}`} className="inline-flex items-center gap-3 text-[var(--egeep-charcoal)] hover:text-primary-800 hover:underline">
                    <Flag iso={c.iso} alt="" className="h-4 w-6 shrink-0 object-cover ring-1 ring-black/10" />
                    {c.name}
                  </Link>
                </th>
                <td className="px-4 py-3 whitespace-nowrap text-[var(--v7-muted)]">
                  <bdi dir="ltr">{partnershipPeriod(c)}</bdi>
                </td>
                {METRICS.map((m) => {
                  const value = countryStat(c.id, m)
                  return (
                    <td key={m} className="px-4 py-3 text-end text-[var(--egeep-charcoal)] tabular-nums">
                      {value === undefined ? (
                        <>
                          <span aria-hidden="true">–</span>
                          <span className="sr-only">{t('notReported')}</span>
                        </>
                      ) : (
                        <bdi>{formatNumber(value, lang)}</bdi>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-base text-[var(--v7-muted)]">{t('resultsNote')}</p>
    </div>
  )
}
