import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, LinkSimple, X } from '@phosphor-icons/react'
import type { Area, Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { REGION_LABEL } from '../../../shared/geo'
import { useLang, useT, type Bilingual } from '../../../shared/i18n'
import { PROGRAMMES, UI } from '../../../shared/strings'
import {
  AREA_PARTNER_IDS,
  areasForCountry,
  countryParagraphs,
  countryRegion,
  fill,
  localArea,
  localCountry,
  partnershipPeriod,
  partnershipStatus,
  workstreamCount,
} from '../lib/content'
import { useLinks, useModalFocus } from '../lib/hooks'
import { STATUS_LABEL, T } from '../lib/t'

const DRAWER_T = {
  copyLink: { en: 'Copy link to this country', ar: 'انسخ رابط هذه الدولة' },
  linkCopied: { en: 'Link copied', ar: 'تم نسخ الرابط' },
  countryDetails: { en: 'Partnership details', ar: 'تفاصيل الشراكة' },
} satisfies Record<string, Bilingual>

const MOU = PROGRAMMES.find((p) => p.key === 'mou')!

/** Status as a DS badge with text (never colour alone). */
export function StatusBadge({ country }: { country: Country }) {
  const lang = useLang()
  const status = partnershipStatus(country)
  return (
    <span className={`aegov-badge badge-sm ${status === 'active' ? 'badge-success' : ''}`}>{STATUS_LABEL[status][lang]}</span>
  )
}

/** "MOU Signings" programme tag in the programme's burgundy. */
export function MouTag({ children }: { children?: string }) {
  const lang = useLang()
  return (
    <span className="v8-prog-tag" style={{ color: MOU.color }}>
      {children ?? MOU.name[lang]}
    </span>
  )
}

interface CountryDrawerProps {
  /** Id of the open country, or undefined when closed. */
  countryId: number | undefined
  onClose: () => void
}

/** Side panel with a partnership's details. Opens from the end edge; deep-linkable through ?country=. */
export function CountryDrawer({ countryId, onClose }: CountryDrawerProps) {
  if (countryId === undefined) return null
  return <Drawer key={countryId} countryId={countryId} onClose={onClose} />
}

function Drawer({ countryId, onClose }: { countryId: number; onClose: () => void }) {
  const lang = useLang()
  const t = useT(T)
  const d = useT(DRAWER_T)
  const { areaHref, href } = useLinks()
  const panelRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  useModalFocus(panelRef, true, onClose)

  const country = localCountry(lang, countryId)
  const paragraphs = countryParagraphs(country)
  const areas = areasForCountry(country)
  const count = workstreamCount(country)
  const titleId = 'v8-country-title'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <div className="aegov-modal-backdrop" aria-hidden="true" onMouseDown={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="v8-drawer fixed inset-y-0 end-0 z-50 flex w-full max-w-xl flex-col bg-[#fff] shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--v8-line)] px-5 py-3 md:px-7">
          <p className="v8-eyebrow">{d('countryDetails')}</p>
          <button
            type="button"
            onClick={onClose}
            className="aegov-modal-close static! flex size-11 items-center justify-center"
            data-autofocus
          >
            <X aria-hidden="true" className="size-6" />
            <span className="sr-only">{UI.close[lang]}</span>
          </button>
        </div>
        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 md:px-7">
          <header className="flex items-start gap-4">
            <Flag iso={country.iso} alt="" className="mt-1 h-12 w-18 shrink-0 rounded object-cover ring-1 ring-[var(--v8-line)]" />
            <div className="space-y-2">
              <h2 id={titleId} className="text-3xl">
                {country.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge country={country} />
                <MouTag>{fill(t('signedIn'), { year: country.startYear ?? '' })}</MouTag>
              </div>
            </div>
          </header>

          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-[var(--v8-radius)] border border-[var(--v8-line)] bg-[var(--v8-line)]">
            <div className="bg-[var(--egeep-ivory)] p-3">
              <dt className="v8-muted text-sm">{UI.partnershipPeriod[lang]}</dt>
              <dd className="text-xl">
                <bdi dir="ltr">{partnershipPeriod(country)}</bdi>
              </dd>
            </div>
            <div className="bg-[var(--egeep-ivory)] p-3">
              <dt className="v8-muted text-sm">{t('region')}</dt>
              <dd className="text-xl">{REGION_LABEL[countryRegion(country)][lang]}</dd>
            </div>
            <div className="bg-[var(--egeep-ivory)] p-3">
              <dt className="v8-muted text-sm">{UI.workstreams[lang]}</dt>
              <dd className="text-xl">{count ?? '–'}</dd>
            </div>
          </dl>

          {country.stats && country.stats.length > 0 && (
            <section aria-labelledby="v8-country-results">
              <h3 id="v8-country-results" className="mb-3 text-xl">
                {t('recordedResults')}
              </h3>
              <dl className="grid grid-cols-2 gap-3">
                {country.stats.map((s, i) => (
                  <div key={i} className="flex flex-col-reverse rounded-md border border-[var(--v8-line)] p-3">
                    <dt className="v8-muted text-sm">{s.label}</dt>
                    <dd className="v8-gold-title text-3xl">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {paragraphs.length > 0 && (
            <div className="space-y-3">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {areas.length > 0 && (
            <section aria-labelledby="v8-country-areas">
              <h3 id="v8-country-areas" className="mb-3 text-xl">
                {t('areasInPartnership')}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {areas.map((slug) => (
                  <li key={slug}>
                    <Link
                      to={areaHref(slug)}
                      onClick={onClose}
                      className="inline-flex min-h-9 items-center rounded-full border border-primary-300 px-3 text-sm text-primary-800 no-underline hover:bg-primary-50"
                    >
                      {localArea(lang, slug).title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {country.workstreams && country.workstreams.length > 0 && (
            <section aria-labelledby="v8-country-workstreams">
              <h3 id="v8-country-workstreams" className="mb-3 text-xl">
                {t('workstreamsListed')}
              </h3>
              <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                {country.workstreams.map((w) => (
                  <li key={w} className="flex gap-2">
                    <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-[var(--egeep-gold)]" />
                    {w}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--v8-line)] px-5 py-4 md:px-7">
          <Link to={href('contact')} className="aegov-btn btn-sm">
            {t('askAboutPartnership')}
          </Link>
          <button type="button" onClick={copy} className="aegov-btn btn-outline btn-sm">
            {copied ? <Check aria-hidden="true" className="size-4" /> : <LinkSimple aria-hidden="true" className="size-4" />}
            {copied ? d('linkCopied') : d('copyLink')}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? d('linkCopied') : ''}
          </span>
        </div>
      </div>
    </>
  )
}

const MAX_FLAGS = 14

/** Flags of the partner countries whose partnership includes an area, each opening that country. */
export function PartnerFlags({ area, max = MAX_FLAGS }: { area: Area; max?: number }) {
  const lang = useLang()
  const t = useT(T)
  const { countryHref, href } = useLinks()
  const ids = AREA_PARTNER_IDS[area.slug] ?? []
  if (!ids.length) return <p className="v8-muted text-sm">{t('noPartnersYet')}</p>
  const extra = ids.length - max

  return (
    <div>
      <p className="mb-3 text-sm">{fill(t('sharedWith'), { n: ids.length })}</p>
      <ul className="flex flex-wrap items-center gap-1.5">
        {ids.slice(0, max).map((id) => {
          const c = localCountry(lang, id)
          return (
            <li key={id}>
              <Link to={countryHref(id)} title={c.name} className="block rounded-sm p-0.5">
                <Flag iso={c.iso} alt={c.name} className="h-6 w-9 rounded-sm object-cover ring-1 ring-[var(--v8-line)]" />
              </Link>
            </li>
          )
        })}
        {extra > 0 && (
          <li>
            <Link to={`${href('countries')}?area=${area.slug}`} className="px-1 text-sm text-primary-800 hover:text-primary-950">
              {fill(t('moreCountries'), { n: extra })}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}
