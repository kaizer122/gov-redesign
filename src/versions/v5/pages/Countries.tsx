import { useId, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getSite } from '../../../data/site'
import type { Country } from '../../../data/site'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { CountryCard } from '../components/CountryCard'
import { CountryModal } from '../components/CountryModal'
import { FactList, PageHeader } from '../components/PageHeader'
import { ParticipateCta } from '../components/ParticipateCta'
import {
  ACTIVE_PARTNERSHIPS,
  FIRST_PARTNERSHIP_YEAR,
  STATUS_LABEL,
  byName,
  byNewest,
  countryHasArea,
  english,
  partnershipStatus,
  type PartnershipStatus,
} from '../lib/content'
import { F, T, type DictKey } from '../lib/dict'
import { CONTAINER } from '../lib/ui'

type SortKey = 'name' | 'newest' | 'oldest'

const SORT_LABEL: Record<SortKey, DictKey> = {
  name: 'sortName',
  newest: 'sortNewest',
  oldest: 'sortOldest',
}

export default function CountriesPage() {
  const id = useId()
  const lang = useLang()
  const t = useT(T)
  const site = getSite(lang)
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
      (c: Country) =>
        (!term || c.name.toLowerCase().includes(term) || english(c).name.toLowerCase().includes(term)) &&
        (!area || countryHasArea(c, area.slug)) &&
        (!status || partnershipStatus(c) === status),
    )
    if (sort === 'name') return byName(filtered, lang)
    const newest = byNewest(filtered)
    return sort === 'newest' ? newest : newest.reverse()
  }, [site, query, area, status, sort, lang])

  const filtersActive = Boolean(query || area || status)

  return (
    <main id="main" data-page="countries" tabIndex={-1}>
      <PageHeader
        page="countries"
        title={t('countriesTitle')}
        lead={t('countriesLead')}
        aside={
          <FactList
            facts={[
              { label: t('participatingCountries'), value: formatNumber(site.countries.length, lang) },
              { label: t('activePartnerships'), value: formatNumber(ACTIVE_PARTNERSHIPS, lang) },
              { label: t('firstSigned'), value: String(FIRST_PARTNERSHIP_YEAR) },
              { label: UI.areasOfCooperation[lang], value: formatNumber(site.areas.length, lang) },
            ]}
          />
        }
      />

      <section aria-labelledby={`${id}-results-title`} className={`${CONTAINER} pt-4 pb-20 md:pb-28`}>
        <h2 id={`${id}-results-title`} className="sr-only">
          {t('countryList')}
        </h2>
        <form
          role="search"
          aria-label={t('filterCountries')}
          onSubmit={(e) => e.preventDefault()}
          className="mb-10 grid gap-5 border-y border-[var(--egeep-gold)] bg-[var(--egeep-ivory)] p-5 md:grid-cols-2 md:p-8 xl:grid-cols-4"
        >
          <div className="aegov-form-control">
            <label htmlFor={`${id}-q`}>{t('countryName')}</label>
            <div className="form-control-input">
              <input
                type="search"
                id={`${id}-q`}
                value={query}
                placeholder={t('countryNameExample')}
                onChange={(e) => update('q', e.target.value)}
              />
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor={`${id}-area`}>{t('areaOfCooperation')}</label>
            <div className="form-control-input">
              <select id={`${id}-area`} value={areaSlug} onChange={(e) => update('area', e.target.value)}>
                <option value="">{t('allAreas')}</option>
                {site.areas.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor={`${id}-status`}>{t('partnershipStatus')}</label>
            <div className="form-control-input">
              <select id={`${id}-status`} value={status} onChange={(e) => update('status', e.target.value)}>
                <option value="">{t('allStatuses')}</option>
                {(Object.keys(STATUS_LABEL) as PartnershipStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s][lang]}
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
                value={sort}
                onChange={(e) => update('sort', e.target.value === 'name' ? '' : e.target.value)}
              >
                {(Object.keys(SORT_LABEL) as SortKey[]).map((s) => (
                  <option key={s} value={s}>
                    {t(SORT_LABEL[s])}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg text-[var(--egeep-charcoal)]" aria-live="polite">
            {F.showing[lang](results.length, site.countries.length, area?.title)}
          </p>
          {filtersActive && (
            <button
              type="button"
              className="aegov-btn btn-link btn-sm"
              onClick={() => setParams(sort === 'name' ? {} : { sort }, { replace: true, preventScrollReset: true })}
            >
              {UI.clearFilters[lang]}
            </button>
          )}
        </div>

        {results.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((c) => (
              <li key={c.id}>
                <CountryCard country={c} onOpen={(country) => update('country', String(country.id))} />
              </li>
            ))}
          </ul>
        ) : (
          <div role="status" className="aegov-alert alert-info">
            <div className="alert-content">
              <p>{t('noCountryMatch')}</p>
            </div>
          </div>
        )}
      </section>

      <CountryModal country={selected} onClose={() => update('country', '')} />
      <ParticipateCta />
    </main>
  )
}
