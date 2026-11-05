import { Link } from 'react-router-dom'
import { Flag } from '../../../shared/Flag'
import { useLang } from '../../../shared/i18n'
import { countriesForArea, useLinks } from '../lib/content'
import { F } from '../lib/dict'

const MAX_FLAGS = 12

/** Flags of the partner countries whose partnership includes this area, each linking to its details. */
export function PartnerFlags({ slug }: { slug: string }) {
  const lang = useLang()
  const { href, countryHref } = useLinks()
  const countries = countriesForArea(slug, lang)
  if (!countries.length) return null
  const extra = countries.length - MAX_FLAGS

  return (
    <div>
      <p className="mb-3 text-base text-[var(--v5-muted)]">{F.sharedWith[lang](countries.length)}</p>
      <ul className="flex flex-wrap items-center gap-2">
        {countries.slice(0, MAX_FLAGS).map((c) => (
          <li key={c.id}>
            <Link to={countryHref(c.id)} title={c.name} className="block">
              <Flag iso={c.iso} alt={c.name} className="h-6 w-9 object-cover ring-1 ring-[var(--egeep-grey-light)]" />
            </Link>
          </li>
        ))}
        {extra > 0 && (
          <li>
            <Link
              to={`${href('countries')}?area=${slug}`}
              className="text-base text-[var(--color-primary-700)] hover:text-[var(--color-primary-900)]"
            >
              {F.moreCountries[lang](extra)}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}
