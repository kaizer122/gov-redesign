import { useId, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getSite, site } from '../../../data/site'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { pageLabel } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { CountryPanel } from '../components/CountryPanel'
import { ParticipateCta } from '../components/ParticipateCta'
import { PageOpening } from '../components/Story'
import { COPY } from '../lib/copy'
import {
  ACTIVE_PARTNERSHIPS,
  ALPHABET,
  FIRST_YEAR,
  atlasGroups,
  countriesForArea,
  partnershipPeriod,
  partnershipStatus,
  type PartnershipStatus,
} from '../lib/content'
import { CONTAINER } from '../lib/ui'

export default function CountriesPage() {
  const id = useId()
  const lang = useLang()
  const t = useT(COPY)
  const data = getSite(lang)
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const areaSlug = params.get('area') ?? ''
  const status = (params.get('status') ?? '') as PartnershipStatus | ''
  const selectedId = Number(params.get('country'))

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

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase()
    const inArea = areaSlug ? new Set(countriesForArea('en', areaSlug).map((c) => c.id)) : undefined
    const keep = (c: Country) =>
      (!term || c.name.toLowerCase().includes(term) || (site.countries.find((e) => e.id === c.id)?.name.toLowerCase().includes(term) ?? false)) &&
      (!inArea || inArea.has(c.id)) &&
      (!status || partnershipStatus(c) === status)
    return atlasGroups(lang)
      .map(([letter, countries]) => [letter, countries.filter(keep)] as const)
      .filter(([, countries]) => countries.length > 0)
  }, [lang, query, areaSlug, status])

  const ordered = groups.flatMap(([, countries]) => countries)
  const total = ordered.length
  const letters = new Set(groups.map(([letter]) => letter))
  const alphabet = [...ALPHABET[lang], ...groups.map(([l]) => l).filter((l) => !ALPHABET[lang].includes(l))]
  const selected = data.countries.find((c) => c.id === selectedId)
  const position = selected ? ordered.findIndex((c) => c.id === selected.id) : -1
  const filtersActive = Boolean(query || areaSlug || status)
  const letterId = (letter: string) => `v7-letter-${alphabet.indexOf(letter)}`

  return (
    <main id="main" data-page="countries" tabIndex={-1}>
      <PageOpening
        page="countries"
        eyebrow={t('atlasEyebrow')}
        title={pageLabel('countries', lang)}
        lead={t('countriesLead')}
        facts={[
          { label: UI.partnerCountries[lang], value: <bdi>{formatNumber(site.countries.length, lang)}</bdi> },
          { label: t('activePartnerships'), value: <bdi>{formatNumber(ACTIVE_PARTNERSHIPS, lang)}</bdi> },
          { label: t('firstSigned'), value: <bdi>{FIRST_YEAR}</bdi> },
          { label: UI.areasOfCooperation[lang], value: <bdi>{formatNumber(site.areas.length, lang)}</bdi> },
        ]}
      />

      <section aria-labelledby={`${id}-atlas`} className={`${CONTAINER} py-14 md:py-20`}>
        <h2 id={`${id}-atlas`} className="sr-only">
          {t('atlasIndex')}
        </h2>

        <form
          role="search"
          aria-label={t('filterCountries')}
          onSubmit={(e) => e.preventDefault()}
          className="grid gap-5 border-y border-[var(--egeep-gold)] py-6 md:grid-cols-3"
        >
          <div className="aegov-form-control">
            <label htmlFor={`${id}-q`}>{t('countryName')}</label>
            <div className="form-control-input">
              <input type="search" id={`${id}-q`} value={query} onChange={(e) => update('q', e.target.value)} />
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor={`${id}-area`}>{UI.areasOfCooperation[lang]}</label>
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
        </form>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p aria-live="polite" className="text-lg text-[var(--v7-muted)]">
            {t('countriesShown')}: <bdi>{formatNumber(total, lang)}</bdi>
          </p>
          {filtersActive && (
            <button
              type="button"
              className="aegov-btn btn-link btn-sm v7-link"
              onClick={() => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })}
            >
              {UI.clearFilters[lang]}
            </button>
          )}
        </div>

        <nav aria-label={t('jumpToLetter')} className="mt-10">
          <ul className="v7-alphabet flex flex-wrap">
            {alphabet.map((letter) => (
              <li key={letter}>
                {letters.has(letter) ? (
                  <a href={`#${letterId(letter)}`} className="v7-letter">
                    {letter}
                  </a>
                ) : (
                  <span className="v7-letter is-empty" aria-disabled="true">
                    {letter}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {groups.length ? (
          <div className="mt-12">
            {groups.map(([letter, countries]) => (
              <section
                key={letter}
                id={letterId(letter)}
                aria-labelledby={`${letterId(letter)}-h`}
                className="grid scroll-mt-6 gap-6 border-t border-[var(--v7-hairline-strong)] py-8 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-10"
              >
                <h3 id={`${letterId(letter)}-h`} className="v7-atlas-letter">
                  {letter}
                </h3>
                <ul className="grid gap-x-10 sm:grid-cols-2 xl:grid-cols-3">
                  {countries.map((c) => {
                    const st = partnershipStatus(c)
                    return (
                      <li key={c.id} className="border-b border-[var(--v7-hairline)]">
                        <button
                          type="button"
                          className="v7-atlas-entry"
                          aria-haspopup="dialog"
                          onClick={() => update('country', String(c.id))}
                        >
                          <Flag iso={c.iso} alt="" className="h-6 w-9 shrink-0 object-cover ring-1 ring-black/10" />
                          <span className="min-w-0 flex-1 text-start">
                            <span className="block text-xl leading-snug text-[var(--egeep-charcoal)]">{c.name}</span>
                            <span className="mt-0.5 block text-base text-[var(--v7-muted)]">
                              <bdi dir="ltr">{partnershipPeriod(c)}</bdi> · {UI[st][lang]}
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-xl text-[var(--egeep-charcoal)]">{t('noCountries')}</p>
        )}
      </section>

      {selected && (
        <CountryPanel
          key="panel"
          country={selected}
          previous={position > 0 ? ordered[position - 1] : undefined}
          next={position >= 0 && position < ordered.length - 1 ? ordered[position + 1] : undefined}
          onSelect={(next) => update('country', String(next))}
          onClose={() => update('country', '')}
        />
      )}

      <ParticipateCta />
    </main>
  )
}
