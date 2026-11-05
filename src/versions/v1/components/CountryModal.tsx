import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { STATUS_LABEL, countryParagraphs, href, partnershipPeriod, partnershipStatus } from '../lib/content'
import { Modal } from './Modal'

interface CountryModalProps {
  country: Country | undefined
  onClose: () => void
}

/** Partnership details for one country: period, status, description, results and workstreams. */
export function CountryModal({ country, onClose }: CountryModalProps) {
  return (
    <Modal open={country !== undefined} onClose={onClose} labelledBy="v1-country-title">
      {country && <CountryDetails country={country} />}
    </Modal>
  )
}

function CountryDetails({ country }: { country: Country }) {
  const status = partnershipStatus(country)
  const paragraphs = countryParagraphs(country)

  return (
    <article className="space-y-6">
      <header className="flex items-center gap-4 pe-10">
        <Flag iso={country.iso} alt="" className="h-12 w-18 shrink-0 rounded object-cover ring-1 ring-aeblack-100" />
        <div>
          <p className="mb-1 text-sm font-semibold tracking-wide text-primary-700 uppercase">Partner country</p>
          <h2 id="v1-country-title" className="text-h6 md:text-h5 text-aeblack-900">
            {country.name}
          </h2>
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-aeblack-50 p-3">
          <dt className="text-xs text-aeblack-700">Partnership period</dt>
          <dd className="font-semibold text-aeblack-900">{partnershipPeriod(country)}</dd>
        </div>
        <div className="rounded-lg bg-aeblack-50 p-3">
          <dt className="text-xs text-aeblack-700">Status</dt>
          <dd className="font-semibold text-aeblack-900">{STATUS_LABEL[status]}</dd>
        </div>
        {country.workstreams && (
          <div className="rounded-lg bg-aeblack-50 p-3">
            <dt className="text-xs text-aeblack-700">Workstreams</dt>
            <dd className="font-semibold text-aeblack-900">{country.workstreams.length}</dd>
          </div>
        )}
      </dl>

      {paragraphs.length > 0 && (
        <div className="space-y-3 text-aeblack-800">
          {paragraphs.map((p, i) => (
            <p key={i}>
              {p}
            </p>
          ))}
        </div>
      )}

      {country.stats && country.stats.length > 0 && (
        <section aria-labelledby="v1-country-results">
          <h3 id="v1-country-results" className="mb-3 text-base font-bold text-aeblack-900">
            Recorded results
          </h3>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {country.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-lg border border-primary-200 bg-primary-50 p-3">
                <dt className="text-sm text-aeblack-700">{s.label}</dt>
                <dd className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-primary-800">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {country.workstreams && (
        <section aria-labelledby="v1-country-workstreams">
          <h3 id="v1-country-workstreams" className="mb-3 text-base font-bold text-aeblack-900">
            Areas of cooperation in this partnership
          </h3>
          <ul className="flex flex-wrap gap-2">
            {country.workstreams.map((w) => (
              <li key={w} className="aegov-badge whitespace-normal!">
                {w}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="flex flex-wrap items-center gap-4 border-t border-aeblack-100 pt-5">
        <Link to={href('contact')} className="aegov-btn btn-sm">
          Ask about this partnership
        </Link>
        <Link to={href('activities')} className="aegov-link">
          See all partnership activity
          <ArrowRight aria-hidden="true" className="link-icon" />
        </Link>
      </footer>
    </article>
  )
}
