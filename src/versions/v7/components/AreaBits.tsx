import { Link } from 'react-router-dom'
import type { Area } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { Flag } from '../../../shared/Flag'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { COPY } from '../lib/copy'
import { countriesForArea, structureBody } from '../lib/content'

/** An area's description, with "...:" paragraphs and the short lines after them set as lists. */
export function AreaBody({ area, className = '' }: { area: Area; className?: string }) {
  return (
    <div className={`v7-body space-y-4 ${className}`}>
      {structureBody(area.slug, area.body).map((block, i) =>
        block.kind === 'p' ? (
          <p key={i}>{block.text}</p>
        ) : (
          <div key={i}>
            <p>{block.intro}</p>
            <ul className="mt-3 space-y-1 border-s border-[var(--egeep-gold)] ps-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ),
      )}
    </div>
  )
}

/** Partner countries whose workstreams include this area, as flag links into the atlas. */
export function PartnerFlags({ area, dark = false }: { area: Area; dark?: boolean }) {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const countries = countriesForArea(lang, area.slug)
  if (!countries.length) return null
  return (
    <div>
      <p className={`v7-eyebrow mb-3 ${dark ? 'v7-eyebrow-dark' : ''}`}>
        {t('partnersInArea')} · <bdi>{formatNumber(countries.length, lang)}</bdi>
      </p>
      <ul className="flex flex-wrap gap-2">
        {countries.map((c) => (
          <li key={c.id}>
            <Link to={`${href('countries')}?country=${c.id}`} className="v7-flag-link" title={c.name}>
              <Flag iso={c.iso} alt={c.name} className="h-6 w-9 object-cover" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
