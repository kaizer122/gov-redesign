import { useEffect, useRef, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { XIcon } from '@phosphor-icons/react'
import { Flag } from '../../../shared/Flag'
import { pageHref } from '../../../shared/pages'
import {
  REFERENCE_YEAR,
  firstSigningYear,
  lastEndYear,
  paragraphs,
  type Partner,
} from '../lib/data'
import { StatusBadge } from './StatusBadge'

interface CountryModalProps {
  partner: Partner
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** DS modal with a partnership profile; traps focus, closes on Escape or backdrop click. */
export function CountryModal({ partner, onClose }: CountryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const span = lastEndYear - firstSigningYear
  const offset = (year: number) => `${((year - firstSigningYear) / span) * 100}%`
  const titleId = `v2-country-${partner.id}-title`

  return (
    <>
      <div className="aegov-modal-backdrop" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="aegov-modal z-50 flex items-start justify-center sm:py-10"
        onKeyDown={onKeyDown}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div className="relative w-full max-w-3xl">
          <div className="aegov-modal-wrapper overflow-hidden">
            <button
              ref={closeRef}
              type="button"
              className="aegov-modal-close end-3 top-3 z-10 text-whitely-50 hover:bg-techblue-800 hover:text-whitely-50"
              onClick={onClose}
            >
              <XIcon size={20} aria-hidden="true" />
              <span className="sr-only">Close partnership profile</span>
            </button>

            <div className="v2-dark v2-grid-bg bg-techblue-950 px-5 py-6 text-whitely-50 md:px-8">
              <div className="flex items-center gap-4 pe-10">
                <Flag iso={partner.iso} alt="" className="h-10 w-[60px] shrink-0 rounded object-cover ring-1 ring-whitely-50/30" />
                <div className="min-w-0">
                  <h2 id={titleId} className="text-2xl font-extrabold text-whitely-50">
                    {partner.shortName}
                  </h2>
                  {partner.shortName !== partner.name && (
                    <p className="text-sm text-techblue-100">{partner.name}</p>
                  )}
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <StatusBadge status={partner.status} />
                <span className="aegov-badge bg-techblue-800! text-whitely-50!">
                  {partner.startYear && partner.endYear
                    ? `${partner.startYear} – ${partner.endYear}`
                    : `Signed ${partner.startYear ?? 'year not published'}`}
                </span>
              </div>
              {partner.start !== null && partner.end !== null && (
                <div className="mt-6" aria-hidden="true">
                  <div className="relative h-2 rounded-full bg-techblue-800">
                    <span
                      className="absolute inset-y-0 rounded-full bg-gradient-to-r from-techblue-400 to-aegold-300"
                      style={{ left: offset(partner.start), right: `calc(100% - ${offset(partner.end)})` }}
                    />
                    <span
                      className="absolute -top-1.5 h-5 w-0.5 bg-whitely-50"
                      style={{ left: offset(REFERENCE_YEAR) }}
                    />
                  </div>
                  <div className="relative mt-2 h-4 text-xs text-techblue-200">
                    <span className="absolute start-0">{firstSigningYear}</span>
                    <span className="absolute -translate-x-1/2 font-semibold text-whitely-50" style={{ left: offset(REFERENCE_YEAR) }}>
                      {REFERENCE_YEAR}
                    </span>
                    <span className="absolute end-0">{lastEndYear}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8 px-5 py-6 md:px-8">
              <section aria-labelledby={`${titleId}-about`}>
                <h3 id={`${titleId}-about`} className="text-lg font-bold text-techblue-950">
                  About the partnership
                </h3>
                <div className="mt-2 space-y-3 text-aeblack-700">
                  {paragraphs(partner.description).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>

              {partner.stats && partner.stats.length > 0 && (
                <section aria-labelledby={`${titleId}-stats`}>
                  <h3 id={`${titleId}-stats`} className="text-lg font-bold text-techblue-950">
                    Reported figures
                  </h3>
                  <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {partner.stats.map((stat) => (
                      <div key={stat.label} className="flex flex-col-reverse rounded-lg bg-techblue-50 p-4">
                        <dt className="text-xs font-medium text-aeblack-600">{stat.label}</dt>
                        <dd className="v2-display text-xl font-bold text-techblue-900">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <section aria-labelledby={`${titleId}-ws`}>
                <h3 id={`${titleId}-ws`} className="text-lg font-bold text-techblue-950">
                  Workstreams
                </h3>
                {partner.workstreams && partner.workstreams.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {partner.workstreams.map((w) => (
                      <li key={w} className="aegov-badge">
                        {w}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-aeblack-600">
                    Workstreams for this partnership are not itemised on its profile; see the description above.
                  </p>
                )}
              </section>
            </div>

            <div className="flex flex-col gap-3 border-t border-aeblack-100 px-5 py-4 sm:flex-row-reverse md:px-8">
              <button type="button" className="aegov-btn btn-sm w-full sm:w-auto" onClick={onClose}>
                Close
              </button>
              <Link to={pageHref('v2', 'contact')} className="aegov-btn btn-sm btn-outline w-full sm:w-auto">
                Contact the programme office
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
