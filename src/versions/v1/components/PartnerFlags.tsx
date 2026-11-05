import { Link } from 'react-router-dom'
import type { Area } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { countriesForArea, countryHref, href } from '../lib/content'

const MAX_FLAGS = 12

/** Flags of the partner countries whose partnership includes this area, each linking to its details. */
export function PartnerFlags({ area }: { area: Area }) {
  const countries = countriesForArea(area)
  if (!countries.length) return null
  const extra = countries.length - MAX_FLAGS

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-aeblack-800">
        Shared with {countries.length} partner {countries.length === 1 ? 'country' : 'countries'}
      </p>
      <ul className="flex flex-wrap items-center gap-2">
        {countries.slice(0, MAX_FLAGS).map((c) => (
          <li key={c.id}>
            <Link to={countryHref(c.id)} title={c.name} className="block rounded-sm">
              <Flag iso={c.iso} alt={c.name} className="h-6 w-9 rounded-sm object-cover ring-1 ring-aeblack-100" />
            </Link>
          </li>
        ))}
        {extra > 0 && (
          <li>
            <Link
              to={`${href('countries')}?area=${area.slug}`}
              className="text-sm font-semibold text-primary-700 hover:text-primary-800"
            >
              +{extra} more
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}
