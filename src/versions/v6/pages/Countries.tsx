import { useId, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GlobeHemisphereEast, ListBullets } from '@phosphor-icons/react'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import type { Region } from '../../../shared/geo'
import { compareText, formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { CountryPanel } from '../components/CountryPanel'
import { Globe } from '../components/Globe'
import { PageHero } from '../components/PageHero'
import { ParticipateCta } from '../components/ParticipateCta'
import {
  ACTIVE_PARTNERSHIPS,
  FIRST_PARTNERSHIP_YEAR,
  REGIONS,
  countryIdsForArea,
  countryStat,
  enCountry,
  partnershipPeriod,
  partnershipStatus,
  regionLabel,
  regionOf,
  useSite,
  type PartnershipStatus,
} from '../lib/content'
import { CONTAINER } from '../lib/ui'

const T = {
  title: { en: 'Participating countries', ar: 'الدول المشاركة' },
  lead: {
    en: 'Governments that have signed partnerships with the UAE Government through the programme. Explore them on the globe or as a list, filter by region, status or area of cooperation, and open a country for its partnership details.',
    ar: 'الحكومات التي وقّعت شراكات مع حكومة دولة الإمارات عبر البرنامج. استكشفها على الكرة الأرضية أو في قائمة، وصفِّها حسب المنطقة أو الحالة أو مجال التعاون، وافتح أي دولة للاطلاع على تفاصيل شراكتها.',
  },
  firstSigned: { en: 'First partnerships signed', ar: 'أول الشراكات الموقعة' },
  activePartnerships: { en: 'Active partnerships', ar: 'شراكة سارية' },
  regions: { en: 'Regions', ar: 'المناطق' },
  filters: { en: 'Filter participating countries', ar: 'تصفية الدول المشاركة' },
  name: { en: 'Country name', ar: 'اسم الدولة' },
  namePlaceholder: { en: 'e.g. Egypt', ar: 'مثال: مصر' },
  region: { en: 'Region', ar: 'المنطقة' },
  status: { en: 'Partnership status', ar: 'حالة الشراكة' },
  allStatuses: { en: 'All statuses', ar: 'جميع الحالات' },
  area: { en: 'Area of cooperation', ar: 'مجال التعاون' },
  allAreas: { en: 'All areas', ar: 'جميع المجالات' },
  newest: { en: 'Newest partnership first', ar: 'الأحدث شراكةً أولًا' },
  hours: { en: 'Most training hours', ar: 'الأكثر ساعات تدريب' },
  trainees: { en: 'Most trainees', ar: 'الأكثر متدربين' },
  byName: { en: 'Name', ar: 'الاسم' },
  view: { en: 'View', ar: 'طريقة العرض' },
  mapView: { en: 'Globe', ar: 'الكرة الأرضية' },
  listView: { en: 'List', ar: 'القائمة' },
  showing: { en: 'Showing {n} of {total} countries', ar: 'عرض {n} من أصل {total} دولة' },
  none: {
    en: 'No country matches these filters. Clear the filters or try another name.',
    ar: 'لا توجد دولة تطابق عوامل التصفية. امسح عوامل التصفية أو جرّب اسمًا آخر.',
  },
  globeLabel: { en: 'Matching partner countries on the globe', ar: 'الدول الشريكة المطابقة على الكرة الأرضية' },
  results: { en: 'Country results', ar: 'نتائج الدول' },
}

type SortKey = 'newest' | 'hours' | 'trainees' | 'name'
const SORTS: SortKey[] = ['newest', 'hours', 'trainees', 'name']

function sortCountries(countries: Country[], sort: SortKey, compare: (a: string, b: string) => number): Country[] {
  const metric = (c: Country) =>
    sort === 'hours' ? countryStat(c.id, 'Training hours') : sort === 'trainees' ? countryStat(c.id, 'Trainees') : undefined
  return [...countries].sort((a, b) => {
    if (sort === 'name') return compare(a.name, b.name)
    if (sort === 'newest') return Number(b.startYear ?? 0) - Number(a.startYear ?? 0) || compare(a.name, b.name)
    return (metric(b) ?? -1) - (metric(a) ?? -1) || compare(a.name, b.name)
  })
}

export default function CountriesPage() {
  const lang = useLang()
  const t = useT(T)
  const id = useId()
  const data = useSite()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const region = (params.get('region') ?? '') as Region | ''
  const areaSlug = params.get('area') ?? ''
  const status = (params.get('status') ?? '') as PartnershipStatus | ''
  const sortParam = params.get('sort') as SortKey | null
  const sort: SortKey = sortParam && SORTS.includes(sortParam) ? sortParam : 'newest'
  const view = params.get('view') === 'list' ? 'list' : 'map'
  const selected = data.countries.find((c) => String(c.id) === params.get('country'))

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

  const area = data.areas.find((a) => a.slug === areaSlug)
  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    const areaIds = area ? new Set(countryIdsForArea(area.slug)) : null
    const filtered = data.countries.filter(
      (c) =>
        (!term || c.name.toLowerCase().includes(term) || enCountry(c.id).name.toLowerCase().includes(term)) &&
        (!region || regionOf(c.id) === region) &&
        (!areaIds || areaIds.has(c.id)) &&
        (!status || partnershipStatus(c) === status),
    )
    return sortCountries(filtered, sort, compareText(lang))
  }, [data.countries, query, region, area, status, sort, lang])

  const filtersActive = Boolean(query || region || area || status)
  const open = (c: Country) => update('country', String(c.id))

  return (
    <main id="main" data-page="countries" tabIndex={-1}>
      <PageHero
        page="countries"
        title={t('title')}
        lead={t('lead')}
        facts={[
          { label: UI.partnerCountries[lang], value: formatNumber(data.countries.length, lang) },
          { label: t('activePartnerships'), value: formatNumber(ACTIVE_PARTNERSHIPS, lang) },
          { label: t('firstSigned'), value: FIRST_PARTNERSHIP_YEAR },
          { label: t('regions'), value: formatNumber(REGIONS.length, lang) },
        ]}
      />

      <section aria-labelledby={`${id}-filters-title`} className="v6-ivory">
        <div className={`${CONTAINER} py-10 md:py-14`}>
          <h2 id={`${id}-filters-title`} className="sr-only">
            {t('filters')}
          </h2>
          <form role="search" aria-label={t('filters')} onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div role="group" aria-label={t('region')} className="flex flex-wrap gap-2">
              <button type="button" className="v6-chip bg-whitely-50" aria-pressed={!region} onClick={() => update('region', '')}>
                {UI.all[lang]}
              </button>
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="v6-chip bg-whitely-50"
                  aria-pressed={region === r}
                  onClick={() => update('region', region === r ? '' : r)}
                >
                  {regionLabel(r, lang)}
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="aegov-form-control">
                <label htmlFor={`${id}-q`}>{t('name')}</label>
                <div className="form-control-input">
                  <input
                    type="search"
                    id={`${id}-q`}
                    value={query}
                    placeholder={t('namePlaceholder')}
                    onChange={(e) => update('q', e.target.value)}
                  />
                </div>
              </div>
              <div className="aegov-form-control">
                <label htmlFor={`${id}-area`}>{t('area')}</label>
                <div className="form-control-input">
                  <select id={`${id}-area`} value={areaSlug} onChange={(e) => update('area', e.target.value)}>
                    <option value="">{t('allAreas')}</option>
                    {data.areas.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="aegov-form-control">
                <label htmlFor={`${id}-status`}>{t('status')}</label>
                <div className="form-control-input">
                  <select id={`${id}-status`} value={status} onChange={(e) => update('status', e.target.value)}>
                    <option value="">{t('allStatuses')}</option>
                    <option value="active">{UI.active[lang]}</option>
                    <option value="completed">{UI.completed[lang]}</option>
                  </select>
                </div>
              </div>
              <div className="aegov-form-control">
                <label htmlFor={`${id}-sort`}>{UI.sortBy[lang]}</label>
                <div className="form-control-input">
                  <select
                    id={`${id}-sort`}
                    value={sort}
                    onChange={(e) => update('sort', e.target.value === 'newest' ? '' : e.target.value)}
                  >
                    {SORTS.map((s) => (
                      <option key={s} value={s}>
                        {t(s === 'name' ? 'byName' : s)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-primary-600/25 pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <p aria-live="polite" className="text-xl">
                {t('showing')
                  .replace('{n}', formatNumber(results.length, lang))
                  .replace('{total}', formatNumber(data.countries.length, lang))}
              </p>
              {filtersActive && (
                <button
                  type="button"
                  className="aegov-btn btn-link btn-sm"
                  onClick={() =>
                    setParams(
                      () => {
                        const next = new URLSearchParams()
                        if (sortParam) next.set('sort', sortParam)
                        if (view === 'list') next.set('view', 'list')
                        return next
                      },
                      { replace: true, preventScrollReset: true },
                    )
                  }
                >
                  {UI.clearFilters[lang]}
                </button>
              )}
            </div>
            <div role="group" aria-label={t('view')} className="flex gap-1 rounded-full border border-primary-600/40 bg-whitely-50 p-1">
              {(['map', 'list'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => update('view', v === 'list' ? 'list' : '')}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-lg ${view === v ? 'bg-[color:var(--egeep-charcoal)] text-[color:var(--egeep-ivory)]' : 'hover:bg-[color:var(--egeep-ivory)]'}`}
                >
                  {v === 'map' ? <GlobeHemisphereEast aria-hidden="true" className="size-5" /> : <ListBullets aria-hidden="true" className="size-5" />}
                  {v === 'map' ? t('mapView') : t('listView')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-label={t('results')} className={view === 'map' ? 'v6-dark' : ''}>
        <div className={`${CONTAINER} py-10 md:py-14`}>
          {results.length === 0 ? (
            <div role="status" className="aegov-alert alert-info v6-light rounded-2xl bg-[color:var(--egeep-ivory)] p-5">
              <div className="alert-content">
                <p>{t('none')}</p>
              </div>
            </div>
          ) : view === 'map' ? (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-start">
              <Globe ids={results.map((c) => c.id)} label={t('globeLabel')} onActivate={(cid) => update('country', String(cid))} className="mx-auto w-full max-w-[40rem]" />
              <ul className="max-h-[38rem] divide-y divide-whitely-50/10 overflow-y-auto border-y border-whitely-50/10 pe-2">
                {results.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={() => open(c)}
                      className="flex w-full items-center gap-4 py-3 text-start hover:bg-whitely-50/5"
                    >
                      <Flag iso={c.iso} alt="" className="h-6 w-9 shrink-0 rounded-sm object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg leading-snug">{c.name}</span>
                        <span className="block text-base text-[color:var(--v6-on-dark-muted)]">
                          <bdi>{partnershipPeriod(c)}</bdi> · {regionLabel(regionOf(c.id), lang)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((c) => (
                <li key={c.id}>
                  <CountryCard country={c} onOpen={open} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CountryPanel country={selected} onClose={() => update('country', '')} />
      <ParticipateCta />
    </main>
  )
}

function CountryCard({ country, onOpen }: { country: Country; onOpen: (c: Country) => void }) {
  const lang = useLang()
  const status = partnershipStatus(country)
  const hours = countryStat(country.id, 'Training hours')
  const trainees = countryStat(country.id, 'Trainees')
  return (
    <article className="aegov-card card-bordered relative flex h-full flex-col gap-4 bg-whitely-50 p-6 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <Flag iso={country.iso} alt="" className="h-8 w-12 rounded-sm object-cover ring-1 ring-aeblack-900/10" />
        <span className="aegov-badge">{status === 'active' ? UI.active[lang] : UI.completed[lang]}</span>
      </div>
      <h3 className="text-2xl leading-snug">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => onOpen(country)}
          className="text-start after:absolute after:inset-0 after:rounded-[1.25rem] hover:text-primary-800 hover:underline"
        >
          {country.name}
        </button>
      </h3>
      <p className="v6-muted text-base">
        <bdi>{partnershipPeriod(country)}</bdi> · {regionLabel(regionOf(country.id), lang)}
      </p>
      {(hours !== undefined || trainees !== undefined) && (
        <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-[color:var(--egeep-grey-light)] pt-4">
          {hours !== undefined && (
            <div className="flex flex-col-reverse">
              <dt className="v6-muted text-sm">{UI.trainingHours[lang]}</dt>
              <dd className="text-2xl text-primary-800">{formatNumber(hours, lang)}</dd>
            </div>
          )}
          {trainees !== undefined && (
            <div className="flex flex-col-reverse">
              <dt className="v6-muted text-sm">{UI.trainees[lang]}</dt>
              <dd className="text-2xl text-primary-800">{formatNumber(trainees, lang)}</dd>
            </div>
          )}
        </dl>
      )}
    </article>
  )
}
