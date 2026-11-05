import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { STATUS_LABEL, partnershipPeriod, partnershipStatus } from '../lib/content'

interface CountryCardProps {
  country: Country
  onOpen: (country: Country) => void
}

/** Partner-country card; the whole card opens the country's detail dialog. */
export function CountryCard({ country, onOpen }: CountryCardProps) {
  const status = partnershipStatus(country)
  const workstreams = country.workstreams?.length ?? 0

  return (
    <article className="aegov-card card-bordered card-glow relative h-full border-aeblack-100! p-5!">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <Flag iso={country.iso} alt="" className="h-8 w-12 rounded-sm object-cover ring-1 ring-aeblack-100" />
          <span className={`aegov-badge text-xs! ${status === 'active' ? 'badge-success' : ''}`}>
            {STATUS_LABEL[status]}
          </span>
        </div>
        <h3 className="text-base leading-snug font-bold text-aeblack-900">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => onOpen(country)}
            className="static justify-start! text-start after:absolute after:inset-0 after:rounded-xl hover:text-primary-800 hover:underline"
          >
            {country.name}
          </button>
        </h3>
        <dl className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm text-aeblack-700">
          <div className="flex gap-1">
            <dt>Partnership</dt>
            <dd className="font-semibold text-aeblack-800">{partnershipPeriod(country)}</dd>
          </div>
          {workstreams > 0 && (
            <div className="flex gap-1">
              <dt>Workstreams</dt>
              <dd className="font-semibold text-aeblack-800">{workstreams}</dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  )
}
