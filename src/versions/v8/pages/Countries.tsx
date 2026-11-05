import { useId, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowDown, ArrowUp, ArrowsDownUp, GridFour, Rows, X } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { REGION_LABEL, type Region } from '../../../shared/geo'
import { compareText, formatNumber, useLang, useT, type Bilingual, type Lang } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { PageHeader, ParticipateCta } from '../components/Blocks'
import { CountryDrawer, StatusBadge } from '../components/Country'
import { CountryTile } from '../components/CountryTile'
import { Modal } from '../components/Modal'
import {
  ACTIVE_PARTNERSHIPS,
  FIRST_PARTNERSHIP_YEAR,
  METRICS,
  areasForCountry,
  countryInArea,
  countryRegion,
  countryStat,
  fill,
  localArea,
  partnershipPeriod,
  partnershipStatus,
  useSite,
  workstreamCount,
  type PartnershipStatus,
} from '../lib/content'
import { useSmoothUpdate } from '../lib/hooks'
import { METRIC_LABEL, REGIONS, STATUS_LABEL, T } from '../lib/t'
import { CONTAINER } from '../lib/ui'

const C = {
  title: { en: 'Participating countries', ar: 'الدول المشاركة' },
  lead: {
    en: 'Governments that have signed partnerships with the UAE Government through the programme. Filter, sort and compare them, or open a country for its period, workstreams and recorded results.',
    ar: 'الحكومات التي وقّعت شراكات مع حكومة دولة الإمارات عبر البرنامج. يمكنك تصفيتها وترتيبها ومقارنتها، أو فتح صفحة أي دولة للاطلاع على فترة الشراكة ومسارات العمل والنتائج المسجلة.',
  },
  factCountries: { en: 'Participating countries', ar: 'الدول المشاركة' },
  factActive: { en: 'Active partnerships', ar: 'الشراكات السارية' },
  factFirst: { en: 'First partnerships signed', ar: 'توقيع أولى الشراكات' },
  factAreas: { en: 'Areas of cooperation', ar: 'مجالات التعاون' },
  listTitle: { en: 'Country list', ar: 'قائمة الدول' },
  filters: { en: 'Filter participating countries', ar: 'تصفية الدول المشاركة' },
  name: { en: 'Country name', ar: 'اسم الدولة' },
  namePlaceholder: { en: 'e.g. Egypt', ar: 'مثال: مصر' },
  view: { en: 'View', ar: 'طريقة العرض' },
  grid: { en: 'Grid', ar: 'شبكة' },
  table: { en: 'Table', ar: 'جدول' },
  showing: { en: 'Showing {n} of {total} countries', ar: 'الدول المعروضة: {n} من {total}' },
  none: {
    en: 'No country matches these filters. Clear the filters or try another name.',
    ar: 'لا توجد دولة تطابق عوامل التصفية هذه. امسح عوامل التصفية أو جرّب اسمًا آخر.',
  },
  colCountry: { en: 'Country', ar: 'الدولة' },
  caption: {
    en: 'Participating countries and their reported results. Select a column heading to sort.',
    ar: 'الدول المشاركة والنتائج التي أفادت بها. اختر عنوان أي عمود للترتيب.',
  },
  ascending: { en: 'ascending', ar: 'تصاعدي' },
  descending: { en: 'descending', ar: 'تنازلي' },
  sortName: { en: 'Name', ar: 'الاسم' },
  sortYear: { en: 'Signing year', ar: 'سنة التوقيع' },
  compare: { en: 'Compare', ar: 'قارن' },
  compareCountry: { en: 'Compare {name}', ar: 'أضف {name} إلى المقارنة' },
  compareTitle: { en: 'Compare countries', ar: 'مقارنة الدول' },
  compareHint: { en: 'Select up to 3 countries to compare them side by side.', ar: 'اختر حتى 3 دول لمقارنتها جنبًا إلى جنب.' },
  compareFull: { en: 'You can compare up to 3 countries.', ar: 'يمكنك المقارنة بين 3 دول كحد أقصى.' },
  compareNeedTwo: { en: 'Select one more country to compare.', ar: 'اختر دولة أخرى لإجراء المقارنة.' },
  compareNow: { en: 'Compare ({n})', ar: 'قارن ({n})' },
  compareSelected: { en: 'Selected for comparison: {n} of 3', ar: 'الدول المختارة للمقارنة: {n} من 3' },
  remove: { en: 'Remove {name}', ar: 'إزالة {name}' },
  clear: { en: 'Clear', ar: 'مسح' },
  measure: { en: 'Measure', ar: 'المؤشر' },
  tray: { en: 'Comparison tray', ar: 'شريط المقارنة' },
  dataNote: {
    en: 'Figures are as reported for each partnership. A dash means the partnership has not reported that figure.',
    ar: 'الأرقام كما أفادت بها كل شراكة. تعني الشرطة أن الشراكة لم تُفد بهذا الرقم.',
  },
} satisfies Record<string, Bilingual>

type SortKey = 'name' | 'year' | 'workstreams' | 'hours' | 'workshops' | 'trainees'
type View = 'grid' | 'table'

const METRIC_SORT: Record<'hours' | 'workshops' | 'trainees', (typeof METRICS)[number]> = {
  hours: 'Training hours',
  workshops: 'Workshops',
  trainees: 'Trainees',
}

const SORT_KEYS: SortKey[] = ['name', 'year', 'workstreams', 'hours', 'workshops', 'trainees']
const MAX_COMPARE = 3

function sortValue(c: Country, key: SortKey): number | undefined {
  if (key === 'year') return Number(c.startYear ?? 0)
  if (key === 'workstreams') return workstreamCount(c)
  if (key === 'name') return undefined
  return countryStat(c, METRIC_SORT[key])
}

function sortCountries(countries: Country[], key: SortKey, descending: boolean, lang: Lang): Country[] {
  const compare = compareText(lang)
  return [...countries].sort((a, b) => {
    if (key === 'name') return descending ? compare(b.name, a.name) : compare(a.name, b.name)
    const va = sortValue(a, key)
    const vb = sortValue(b, key)
    // Unreported figures always sort last.
    if (va === undefined && vb === undefined) return compare(a.name, b.name)
    if (va === undefined) return 1
    if (vb === undefined) return -1
    return (descending ? vb - va : va - vb) || compare(a.name, b.name)
  })
}

export default function CountriesPage() {
  const lang = useLang()
  const t = useT(T)
  const c = useT(C)
  const id = useId()
  const local = useSite()
  const smooth = useSmoothUpdate()
  const [params, setParams] = useSearchParams()
  const [compare, setCompare] = useState<number[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  const query = params.get('q') ?? ''
  const status = (params.get('status') ?? '') as PartnershipStatus | ''
  const region = (params.get('region') ?? '') as Region | ''
  const areaSlug = params.get('area') ?? ''
  const view: View = params.get('view') === 'table' ? 'table' : 'grid'
  const sortParam = params.get('sort') as SortKey | null
  const sort: SortKey = sortParam && SORT_KEYS.includes(sortParam) ? sortParam : 'name'
  const descending = params.get('dir') ? params.get('dir') === 'desc' : sort !== 'name'
  const selectedId = Number(params.get('country')) || undefined
  const selected = site.countries.some((x) => x.id === selectedId) ? selectedId : undefined

  const update = (changes: Record<string, string>, push = false) => {
    const apply = () =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value)
            else next.delete(key)
          }
          return next
        },
        { replace: !push, preventScrollReset: true },
      )
    if ('country' in changes) apply()
    else smooth(apply)
  }

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = local.countries.filter(
      (x, i) =>
        (!term || x.name.toLowerCase().includes(term) || site.countries[i].name.toLowerCase().includes(term)) &&
        (!status || partnershipStatus(x) === status) &&
        (!region || countryRegion(x) === region) &&
        (!areaSlug || countryInArea(x, areaSlug)),
    )
    return sortCountries(filtered, sort, descending, lang)
  }, [local, query, status, region, areaSlug, sort, descending, lang])

  const filtersActive = Boolean(query || status || region || areaSlug)

  const toggleCompare = (countryId: number) =>
    setCompare((prev) =>
      prev.includes(countryId) ? prev.filter((x) => x !== countryId) : prev.length >= MAX_COMPARE ? prev : [...prev, countryId],
    )

  const setSort = (key: SortKey) => {
    const nextDesc = sort === key ? !descending : key !== 'name'
    const defaultDirection = nextDesc === (key !== 'name')
    update({ sort: key === 'name' ? '' : key, dir: defaultDirection ? '' : nextDesc ? 'desc' : 'asc' })
  }

  const compareControl = (x: Country) => {
    const checked = compare.includes(x.id)
    const disabled = !checked && compare.length >= MAX_COMPARE
    return (
      <div className="aegov-check-item">
        <input
          type="checkbox"
          id={`${id}-cmp-${x.id}`}
          checked={checked}
          disabled={disabled}
          onChange={() => toggleCompare(x.id)}
        />
        <label htmlFor={`${id}-cmp-${x.id}`} className="text-sm">
          <span aria-hidden="true">{c('compare')}</span>
          <span className="sr-only">{fill(c('compareCountry'), { name: x.name })}</span>
        </label>
      </div>
    )
  }

  return (
    <main id="main" data-page="countries" tabIndex={-1} className={compare.length ? 'pb-28' : ''}>
      <PageHeader
        page="countries"
        title={c('title')}
        lead={c('lead')}
        facts={[
          { label: c('factCountries'), value: String(site.countries.length) },
          { label: c('factActive'), value: String(ACTIVE_PARTNERSHIPS) },
          { label: c('factFirst'), value: String(FIRST_PARTNERSHIP_YEAR) },
          { label: c('factAreas'), value: String(site.areas.length) },
        ]}
      />

      <section aria-labelledby={`${id}-list`} className={`${CONTAINER} py-10 md:py-12`}>
        <h2 id={`${id}-list`} className="sr-only">
          {c('listTitle')}
        </h2>

        <form
          role="search"
          aria-label={c('filters')}
          onSubmit={(e) => e.preventDefault()}
          className="v8-tile mb-6 grid gap-4 p-4 md:grid-cols-2 md:p-5 xl:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]"
        >
          <div className="aegov-form-control">
            <label htmlFor={`${id}-q`}>{c('name')}</label>
            <div className="form-control-input">
              <input
                type="search"
                id={`${id}-q`}
                value={query}
                placeholder={c('namePlaceholder')}
                onChange={(e) => update({ q: e.target.value })}
              />
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor={`${id}-status`}>{t('status')}</label>
            <div className="form-control-input">
              <select id={`${id}-status`} value={status} onChange={(e) => update({ status: e.target.value })}>
                <option value="">{t('allStatuses')}</option>
                {(['active', 'completed'] as const).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s][lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor={`${id}-region`}>{t('region')}</label>
            <div className="form-control-input">
              <select id={`${id}-region`} value={region} onChange={(e) => update({ region: e.target.value })}>
                <option value="">{t('allRegions')}</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {REGION_LABEL[r][lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor={`${id}-area`}>{UI.areasOfCooperation[lang]}</label>
            <div className="form-control-input">
              <select id={`${id}-area`} value={areaSlug} onChange={(e) => update({ area: e.target.value })}>
                <option value="">{t('allAreas')}</option>
                {local.areas.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor={`${id}-sort`}>{UI.sortBy[lang]}</label>
            <div className="form-control-input">
              <select
                id={`${id}-sort`}
                value={`${sort}:${descending ? 'desc' : 'asc'}`}
                onChange={(e) => {
                  const [key, dir] = e.target.value.split(':') as [SortKey, string]
                  update({ sort: key === 'name' ? '' : key, dir })
                }}
              >
                {SORT_KEYS.flatMap((key) =>
                  (key === 'name' ? ['asc', 'desc'] : ['desc', 'asc']).map((dir) => (
                    <option key={`${key}:${dir}`} value={`${key}:${dir}`}>
                      {sortLabel(key, lang, c)} ({dir === 'desc' ? c('descending') : c('ascending')})
                    </option>
                  )),
                )}
              </select>
            </div>
          </div>
        </form>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p aria-live="polite">{fill(c('showing'), { n: results.length, total: site.countries.length })}</p>
            {filtersActive && (
              <button
                type="button"
                className="aegov-btn btn-link btn-sm"
                onClick={() => update({ q: '', status: '', region: '', area: '' })}
              >
                {UI.clearFilters[lang]}
              </button>
            )}
          </div>
          <div role="group" aria-label={c('view')} className="inline-flex gap-1 rounded-md border border-[var(--v8-line)] bg-[#fff] p-1">
            {(['grid', 'table'] as const).map((v) => {
              const Icon = v === 'grid' ? GridFour : Rows
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => update({ view: v === 'grid' ? '' : v })}
                  className={`inline-flex min-h-10 items-center gap-2 rounded px-3 text-sm ${view === v ? 'bg-[var(--egeep-charcoal)] text-[#fff]' : 'hover:bg-[var(--egeep-ivory)]'}`}
                >
                  <Icon aria-hidden="true" className="size-5" />
                  {c(v)}
                </button>
              )
            })}
          </div>
        </div>
        <p className="v8-muted mb-6 text-sm">{c('compareHint')}</p>

        {results.length === 0 ? (
          <div role="status" className="aegov-alert alert-info">
            <div className="alert-content">
              <p>{c('none')}</p>
            </div>
          </div>
        ) : view === 'grid' ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((x) => (
              <li key={x.id} style={{ viewTransitionName: `v8-c-${x.id}` }}>
                <CountryTile country={x} onOpen={(cid) => update({ country: String(cid) }, true)} extra={compareControl(x)} />
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <div
              role="region"
              aria-labelledby={`${id}-caption`}
              tabIndex={0}
              className="v8-tile overflow-x-auto"
            >
              <table className="w-full min-w-[64rem] text-base">
                <caption id={`${id}-caption`} className="sr-only">
                  {c('caption')}
                </caption>
                <thead className="border-b border-[var(--v8-line)] bg-[var(--egeep-ivory)]">
                  <tr>
                    <th scope="col" className="w-24 px-4 py-3 text-start">
                      <span className="sr-only">{c('compare')}</span>
                    </th>
                    <SortHeader label={c('colCountry')} sortKey="name" sort={sort} descending={descending} onSort={setSort} />
                    <th scope="col" className="px-4 py-3 text-start">
                      {t('status')}
                    </th>
                    <th scope="col" className="px-4 py-3 text-start">
                      {t('region')}
                    </th>
                    <SortHeader label={UI.partnershipPeriod[lang]} sortKey="year" sort={sort} descending={descending} onSort={setSort} />
                    <SortHeader label={UI.workstreams[lang]} sortKey="workstreams" sort={sort} descending={descending} onSort={setSort} numeric />
                    {(['hours', 'workshops', 'trainees'] as const).map((k) => (
                      <SortHeader
                        key={k}
                        label={METRIC_LABEL[METRIC_SORT[k]][lang]}
                        sortKey={k}
                        sort={sort}
                        descending={descending}
                        onSort={setSort}
                        numeric
                      />
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--v8-line)]">
                  {results.map((x) => (
                    <tr key={x.id} className="hover:bg-primary-50/50" style={{ viewTransitionName: `v8-r-${x.id}` }}>
                      <td className="px-4 py-2">{compareControl(x)}</td>
                      <th scope="row" className="px-4 py-2 text-start">
                        <button
                          type="button"
                          aria-haspopup="dialog"
                          onClick={() => update({ country: String(x.id) }, true)}
                          className="inline-flex items-center gap-3 text-start hover:text-primary-800 hover:underline"
                        >
                          <Flag iso={x.iso} alt="" className="h-4 w-6 shrink-0 rounded-sm object-cover ring-1 ring-[var(--v8-line)]" />
                          {x.name}
                        </button>
                      </th>
                      <td className="px-4 py-2">
                        <StatusBadge country={x} />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{REGION_LABEL[countryRegion(x)][lang]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <bdi dir="ltr">{partnershipPeriod(x)}</bdi>
                      </td>
                      <td className="px-4 py-2 text-end tabular-nums">
                        <Figure value={workstreamCount(x)} lang={lang} />
                      </td>
                      {(['hours', 'workshops', 'trainees'] as const).map((k) => (
                        <td key={k} className="px-4 py-2 text-end tabular-nums">
                          <Figure value={countryStat(x, METRIC_SORT[k])} lang={lang} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="v8-muted mt-3 text-sm">{c('dataNote')}</p>
          </div>
        )}
      </section>

      {compare.length > 0 && (
        <CompareTray
          ids={compare}
          onRemove={toggleCompare}
          onClear={() => setCompare([])}
          onOpen={() => setCompareOpen(true)}
        />
      )}
      <Modal open={compareOpen && compare.length > 1} onClose={() => setCompareOpen(false)} labelledBy={`${id}-cmp-title`} width="max-w-5xl">
        <CompareTable ids={compare} titleId={`${id}-cmp-title`} />
      </Modal>

      <CountryDrawer countryId={selected} onClose={() => update({ country: '' })} />
      <ParticipateCta />
    </main>
  )
}

function sortLabel(key: SortKey, lang: Lang, c: (k: keyof typeof C) => string): string {
  if (key === 'name') return c('sortName')
  if (key === 'year') return c('sortYear')
  if (key === 'workstreams') return UI.workstreams[lang]
  return METRIC_LABEL[METRIC_SORT[key]][lang]
}

function Figure({ value, lang }: { value: number | undefined; lang: Lang }) {
  if (value === undefined)
    return (
      <>
        <span aria-hidden="true">–</span>
        <span className="sr-only">{T.notReported[lang]}</span>
      </>
    )
  return <>{formatNumber(value, lang)}</>
}

interface SortHeaderProps {
  label: string
  sortKey: SortKey
  sort: SortKey
  descending: boolean
  onSort: (key: SortKey) => void
  numeric?: boolean
}

function SortHeader({ label, sortKey, sort, descending, onSort, numeric }: SortHeaderProps) {
  const active = sort === sortKey
  const Icon = !active ? ArrowsDownUp : descending ? ArrowDown : ArrowUp
  return (
    <th
      scope="col"
      aria-sort={active ? (descending ? 'descending' : 'ascending') : undefined}
      className={`px-4 py-3 ${numeric ? 'text-end' : 'text-start'}`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap hover:text-primary-800 ${active ? 'text-primary-900' : ''}`}
      >
        {label}
        <Icon aria-hidden="true" className={`size-4 ${active ? 'text-primary-700' : 'text-[var(--v8-text-2)]'}`} />
      </button>
    </th>
  )
}

interface CompareTrayProps {
  ids: number[]
  onRemove: (id: number) => void
  onClear: () => void
  onOpen: () => void
}

function CompareTray({ ids, onRemove, onClear, onOpen }: CompareTrayProps) {
  const c = useT(C)
  const local = useSite()
  const countries = ids.map((cid) => local.countries.find((x) => x.id === cid)!)
  return (
    <section
      aria-label={c('tray')}
      className="v8-fade-in fixed inset-x-0 bottom-0 z-40 border-t border-[var(--v8-line-strong)] bg-[#fff]/95 shadow-[0_-12px_32px_-20px_rgb(26_26_25/0.4)] backdrop-blur"
    >
      <div className={`${CONTAINER} flex flex-wrap items-center gap-3 py-3`}>
        <p className="v8-muted text-sm" aria-live="polite">
          {fill(c('compareSelected'), { n: ids.length })}
          {ids.length >= MAX_COMPARE && <span className="sr-only"> {c('compareFull')}</span>}
        </p>
        <ul className="flex flex-1 flex-wrap gap-2">
          {countries.map((x) => (
            <li key={x.id} className="inline-flex items-center gap-2 rounded-full border border-[var(--v8-line-strong)] bg-[#fff] ps-2 pe-1">
              <Flag iso={x.iso} alt="" className="h-4 w-6 rounded-sm object-cover" />
              <span className="max-w-[14rem] truncate text-sm">{x.name}</span>
              <button
                type="button"
                onClick={() => onRemove(x.id)}
                className="flex size-8 items-center justify-center rounded-full hover:bg-[var(--egeep-ivory)]"
              >
                <X aria-hidden="true" className="size-4" />
                <span className="sr-only">{fill(c('remove'), { name: x.name })}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onClear} className="aegov-btn btn-link btn-sm">
            {c('clear')}
          </button>
          <button
            type="button"
            onClick={onOpen}
            disabled={ids.length < 2}
            aria-describedby={ids.length < 2 ? 'v8-cmp-need' : undefined}
            aria-haspopup="dialog"
            className="aegov-btn btn-sm"
          >
            {fill(c('compareNow'), { n: ids.length })}
          </button>
          {ids.length < 2 && (
            <span id="v8-cmp-need" className="sr-only">
              {c('compareNeedTwo')}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

function CompareTable({ ids, titleId }: { ids: number[]; titleId: string }) {
  const lang = useLang()
  const t = useT(T)
  const c = useT(C)
  const local = useSite()
  const countries = ids.map((cid) => local.countries.find((x) => x.id === cid)!)
  const rows: { label: string; render: (x: Country) => ReactNode }[] = [
    { label: UI.partnershipPeriod[lang], render: (x) => <bdi dir="ltr">{partnershipPeriod(x)}</bdi> },
    { label: t('status'), render: (x) => STATUS_LABEL[partnershipStatus(x)][lang] },
    { label: t('region'), render: (x) => REGION_LABEL[countryRegion(x)][lang] },
    { label: UI.workstreams[lang], render: (x) => <Figure value={workstreamCount(x)} lang={lang} /> },
    ...METRICS.map((m) => ({
      label: METRIC_LABEL[m][lang],
      render: (x: Country) => <Figure value={countryStat(x, m)} lang={lang} />,
    })),
    {
      label: UI.areasOfCooperation[lang],
      render: (x) => {
        const slugs = areasForCountry(x)
        return slugs.length ? (
          <ul className="space-y-1 text-sm">
            {slugs.map((s) => (
              <li key={s}>{localArea(lang, s).title}</li>
            ))}
          </ul>
        ) : (
          <Figure value={undefined} lang={lang} />
        )
      },
    },
  ]
  return (
    <div className="space-y-5">
      <h2 id={titleId} className="pe-10 text-3xl">
        {c('compareTitle')}
      </h2>
      <div className="overflow-x-auto" role="region" aria-labelledby={titleId} tabIndex={0}>
        <table className="w-full min-w-[36rem] table-fixed">
          <thead>
            <tr className="border-b border-[var(--v8-line)]">
              <td className="w-44" />
              {countries.map((x) => (
                <th key={x.id} scope="col" className="px-3 pb-3 text-start align-bottom">
                  <Flag iso={x.iso} alt="" className="mb-2 h-8 w-12 rounded-sm object-cover ring-1 ring-[var(--v8-line)]" />
                  <span className="block text-xl leading-snug">{x.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--v8-line)]">
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row" className="v8-muted py-3 pe-3 text-start align-top text-sm">
                  {r.label}
                </th>
                {countries.map((x) => (
                  <td key={x.id} className="px-3 py-3 align-top">
                    {r.render(x)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
