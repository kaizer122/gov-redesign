import type { ReactNode } from 'react'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { REGION_LABEL } from '../../../shared/geo'
import { useLang } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { countryRegion, partnershipPeriod, workstreamCount } from '../lib/content'
import { T } from '../lib/t'
import { StatusBadge } from './Country'

interface CountryTileProps {
  country: Country
  onOpen: (id: number) => void
  /** Extra control rendered above the stretched link layer (e.g. a compare checkbox). */
  extra?: ReactNode
}

/** Partner-country tile; the whole tile opens the country's detail drawer. */
export function CountryTile({ country, onOpen, extra }: CountryTileProps) {
  const lang = useLang()
  const workstreams = workstreamCount(country)
  return (
    <article className="v8-tile v8-lift flex h-full flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <Flag iso={country.iso} alt="" className="h-8 w-12 rounded-sm object-cover ring-1 ring-[var(--v8-line)]" />
        <StatusBadge country={country} />
      </div>
      <h3 className="text-xl leading-snug">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => onOpen(country.id)}
          className="text-start after:absolute after:inset-0 after:rounded-[var(--v8-radius)] hover:text-primary-800"
        >
          {country.name}
        </button>
      </h3>
      <dl className="mt-auto grid grid-cols-2 gap-x-4 border-t border-[var(--v8-line)] pt-3 text-sm">
        <div>
          <dt className="v8-muted">{UI.partnershipPeriod[lang]}</dt>
          <dd>
            <bdi dir="ltr">{partnershipPeriod(country)}</bdi>
          </dd>
        </div>
        <div>
          <dt className="v8-muted">{UI.workstreams[lang]}</dt>
          <dd>{workstreams ?? '–'}</dd>
        </div>
        <div className="col-span-2 mt-1">
          <dt className="sr-only">{T.region[lang]}</dt>
          <dd className="v8-muted">{REGION_LABEL[countryRegion(country)][lang]}</dd>
        </div>
      </dl>
      {extra && <div className="relative z-10 -mt-1">{extra}</div>}
    </article>
  )
}
