import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { formatNumber, useLang } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { partnershipPeriod, partnershipStatus } from '../lib/content'
import { StatusBadge } from './StatusBadge'

interface CountryCardProps {
  country: Country
  onOpen: (country: Country) => void
}

/** Partner-country card with flag and status; the whole card opens the country's detail dialog. */
export function CountryCard({ country, onOpen }: CountryCardProps) {
  const lang = useLang()
  const workstreams = country.workstreams?.length ?? 0

  return (
    <article className="aegov-card card-bordered group relative flex h-full flex-col gap-5 border-[var(--egeep-grey-light)]! bg-[#fff] p-6! transition-colors hover:border-[var(--egeep-gold)]! [&>*]:m-0!">
      <div className="flex items-start justify-between gap-3">
        <Flag iso={country.iso} alt="" className="h-9 w-[3.375rem] object-cover ring-1 ring-[var(--egeep-grey-light)]" />
        <StatusBadge status={partnershipStatus(country)} />
      </div>
      <h3 className="text-2xl leading-snug text-[var(--egeep-charcoal)]">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => onOpen(country)}
          className="static justify-start! text-start after:absolute after:inset-0 group-hover:text-[var(--color-primary-800)]"
        >
          {country.name}
        </button>
      </h3>
      <dl className="mt-auto flex flex-wrap gap-x-6 gap-y-1 border-t border-[var(--egeep-grey-light)] pt-4 text-base text-[var(--v5-muted)]">
        <div className="flex gap-2">
          <dt>{UI.partnership[lang]}</dt>
          <dd className="text-[var(--egeep-charcoal)]">{partnershipPeriod(country)}</dd>
        </div>
        {workstreams > 0 && (
          <div className="flex gap-2">
            <dt>{UI.workstreams[lang]}</dt>
            <dd className="text-[var(--egeep-charcoal)]">{formatNumber(workstreams, lang)}</dd>
          </div>
        )}
      </dl>
    </article>
  )
}
