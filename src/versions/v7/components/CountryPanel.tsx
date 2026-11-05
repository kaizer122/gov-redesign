import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react'
import type { Country } from '../../../data/site'
import { site } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { Flag } from '../../../shared/Flag'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { COPY } from '../lib/copy'
import { areasForCountry, paragraphs, partnershipPeriod, partnershipStatus } from '../lib/content'
import { useModalFocus } from '../lib/hooks'

interface CountryPanelProps {
  country: Country
  /** Neighbours in the atlas order, for reading on without closing. */
  previous?: Country
  next?: Country
  onSelect: (id: number) => void
  onClose: () => void
}

/** Reading panel for one partner country, opened from the atlas and deep-linkable with ?country=<id>. */
export function CountryPanel({ country, previous, next, onSelect, onClose }: CountryPanelProps) {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const ref = useRef<HTMLDivElement>(null)
  useModalFocus(ref, true, onClose)
  const status = partnershipStatus(country)
  const areas = areasForCountry(lang, country.id)
  const en = site.countries.find((c) => c.id === country.id)
  const titleId = `v7-country-${country.id}-title`
  const text = paragraphs(country.description)
  const Back = lang === 'ar' ? ArrowRight : ArrowLeft
  const Forward = lang === 'ar' ? ArrowLeft : ArrowRight

  return (
    <>
      <div className="aegov-modal-backdrop v7-backdrop" aria-hidden="true" onMouseDown={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="v7-panel fixed inset-y-0 end-0 z-50 flex w-full max-w-2xl flex-col bg-[var(--egeep-ivory)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--v7-hairline)] px-6 py-4 md:px-10">
          <p className="v7-eyebrow">{UI.partnership[lang]}</p>
          <button type="button" onClick={onClose} className="v7-icon-btn v7-icon-btn-light" data-autofocus>
            <X aria-hidden="true" className="size-6" />
            <span className="sr-only">{UI.close[lang]}</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
          <Flag iso={country.iso} alt="" className="h-12 w-[4.5rem] object-cover ring-1 ring-black/10" />
          <h2 id={titleId} className="v7-h3 mt-6 text-[var(--egeep-charcoal)]">
            {country.name}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className={`aegov-badge ${status === 'active' ? 'v7-badge-active' : 'v7-badge-done'}`}>{UI[status][lang]}</span>
            <span className="text-lg text-[var(--v7-muted)]">
              {UI.partnershipPeriod[lang]}: <bdi dir="ltr">{partnershipPeriod(country)}</bdi>
            </span>
          </div>

          {country.stats && country.stats.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-px border-y border-[var(--egeep-gold)] bg-[var(--v7-hairline)] sm:grid-cols-4">
              {country.stats.map((s, i) => (
                <div key={en?.stats?.[i]?.label ?? s.label} className="flex flex-col-reverse justify-end gap-1 bg-[var(--egeep-ivory)] py-4 pe-3">
                  <dt className="text-base leading-snug text-[var(--v7-muted)]">{s.label}</dt>
                  <dd className="v7-figure-sm text-primary-800">
                    <bdi>{s.value}</bdi>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {text.length > 0 && (
            <div className="v7-body mt-8 space-y-4 text-[var(--egeep-charcoal)]">
              {text.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          )}

          {country.workstreams && country.workstreams.length > 0 && (
            <section aria-labelledby={`${titleId}-ws`} className="mt-10">
              <h3 id={`${titleId}-ws`} className="v7-eyebrow mb-4">
                {UI.workstreams[lang]}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {country.workstreams.map((w) => (
                  <li key={w} className="border border-[var(--v7-hairline-strong)] px-3 py-1 text-base text-[var(--egeep-charcoal)]">
                    {w}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {areas.length > 0 && (
            <section aria-labelledby={`${titleId}-areas`} className="mt-10">
              <h3 id={`${titleId}-areas`} className="v7-eyebrow mb-4">
                {t('matchingAreas')}
              </h3>
              <ul className="divide-y divide-[var(--v7-hairline)] border-y border-[var(--v7-hairline)]">
                {areas.map((a) => (
                  <li key={a.slug}>
                    <Link to={`${href('areas')}#${a.slug}`} className="v7-index-link py-3 text-lg" onClick={onClose}>
                      {a.title}
                      <Forward aria-hidden="true" className="size-5 shrink-0 text-primary-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-[var(--v7-hairline)] px-6 py-4 md:px-10">
          {previous ? (
            <button type="button" className="v7-text-btn" onClick={() => onSelect(previous.id)}>
              <Back aria-hidden="true" className="size-5 shrink-0" />
              <span>
                <span className="sr-only">{UI.previous[lang]}: </span>
                {previous.name}
              </span>
            </button>
          ) : (
            <span />
          )}
          {next && (
            <button type="button" className="v7-text-btn text-end" onClick={() => onSelect(next.id)}>
              <span>
                <span className="sr-only">{UI.next[lang]}: </span>
                {next.name}
              </span>
              <Forward aria-hidden="true" className="size-5 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
