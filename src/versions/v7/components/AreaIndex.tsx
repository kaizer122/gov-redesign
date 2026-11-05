import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { formatNumber, useLang } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { countriesForArea } from '../lib/content'
import { FLIP } from '../lib/ui'

/**
 * Areas of cooperation as an editorial index. Hovering or focusing a row brings its photograph
 * into the sticky frame beside the list (wide screens); small screens show a thumbnail per row.
 */
export function AreaIndex() {
  const lang = useLang()
  const href = usePageHref()
  const { areas } = getSite(lang)
  const [active, setActive] = useState(0)
  const current = areas[active]

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
      <ol className="border-t border-[var(--egeep-gold)]">
        {areas.map((area, i) => {
          const partners = countriesForArea(lang, area.slug).length
          return (
            <li key={area.slug} className="border-b border-[var(--v7-hairline)]">
              <Link
                to={`${href('areas')}#${area.slug}`}
                className={`v7-index-row group ${active === i ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span aria-hidden="true" className="v7-numeral-sm w-10 shrink-0">
                  {formatNumber(i + 1, 'en', { minimumIntegerDigits: 2 })}
                </span>
                {area.image && (
                  <img
                    src={area.image}
                    alt=""
                    width={930}
                    height={600}
                    loading="lazy"
                    className="h-14 w-20 shrink-0 object-cover lg:hidden"
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="v7-index-title block">{area.title}</span>
                  {partners > 0 && (
                    <span className="mt-1 block text-base text-[var(--v7-muted)]">
                      {UI.partnerCountries[lang]}: <bdi>{formatNumber(partners, lang)}</bdi>
                    </span>
                  )}
                </span>
                <ArrowRight aria-hidden="true" className={`v7-index-arrow size-6 shrink-0 ${FLIP}`} />
              </Link>
            </li>
          )
        })}
      </ol>
      <div className="hidden lg:block">
        <figure className="sticky top-8">
          <div className="relative aspect-[31/20] overflow-hidden bg-[var(--egeep-grey-light)]">
            {areas.map((area, i) =>
              area.image ? (
                <img
                  key={area.slug}
                  src={area.image}
                  alt=""
                  width={930}
                  height={600}
                  loading="lazy"
                  className={`v7-crossfade absolute inset-0 h-full w-full object-cover ${active === i ? 'is-shown' : ''}`}
                />
              ) : null,
            )}
          </div>
          <figcaption className="v7-caption mt-4">
            <span className="text-[var(--egeep-charcoal)]">{current.title}</span>
            <span className="mt-2 line-clamp-3 block">{current.summary}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}
