import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { countryIdsForArea, useLinks, useSite } from '../lib/content'
import { useReducedMotion } from '../lib/hooks'

const T = {
  carousel: { en: 'Areas of cooperation carousel', ar: 'عرض مجالات التعاون' },
  partners: { en: 'partner countries', ar: 'دولة شريكة' },
  of: { en: 'of', ar: 'من' },
}

/** Horizontal scroll-snap carousel of area photography cards. Runs right to left in Arabic. */
export function AreaCarousel() {
  const lang = useLang()
  const t = useT(T)
  const uid = useId()
  const links = useLinks()
  const reduced = useReducedMotion()
  const areas = useSite().areas
  const trackRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const measure = () => {
    const el = trackRef.current
    if (!el) return
    const progress = Math.abs(el.scrollLeft)
    setEdges({ start: progress < 4, end: progress + el.clientWidth >= el.scrollWidth - 4 })
  }

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const step = (direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('li')
    const amount = (card?.getBoundingClientRect().width ?? 320) + 24
    const sign = lang === 'ar' ? -1 : 1
    el.scrollBy({ left: direction * sign * amount, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label={t('carousel')}>
      <div className="mb-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={edges.start}
          aria-controls={`${uid}-track`}
          className="v6-icon-btn border border-primary-600 text-primary-800 disabled:opacity-30"
        >
          <ArrowLeft aria-hidden="true" className="size-5 rtl:-scale-x-100" />
          <span className="sr-only">{UI.previous[lang]}</span>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={edges.end}
          aria-controls={`${uid}-track`}
          className="v6-icon-btn border border-primary-600 text-primary-800 disabled:opacity-30"
        >
          <ArrowRight aria-hidden="true" className="size-5 rtl:-scale-x-100" />
          <span className="sr-only">{UI.next[lang]}</span>
        </button>
      </div>
      <ul
        id={`${uid}-track`}
        ref={trackRef}
        onScroll={measure}
        tabIndex={0}
        aria-label={t('carousel')}
        className="v6-snap -mx-5 flex gap-6 overflow-x-auto scroll-px-5 px-5 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-10 lg:scroll-px-10 lg:px-10"
      >
        {areas.map((area, i) => {
          const partners = countryIdsForArea(area.slug).length
          return (
            <li
              key={area.slug}
              aria-roledescription="slide"
              aria-label={`${formatNumber(i + 1, lang)} ${t('of')} ${formatNumber(areas.length, lang)}`}
              className="w-[82vw] shrink-0 sm:w-[24rem] xl:w-[26rem]"
            >
              <article className="aegov-card group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden p-6 text-[color:var(--egeep-ivory)]">
                {area.image && (
                  <img
                    src={area.image}
                    alt=""
                    width={930}
                    height={600}
                    loading="lazy"
                    className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  />
                )}
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-[color:var(--egeep-charcoal)] via-[color:var(--egeep-charcoal)]/75 to-[color:var(--egeep-charcoal)]/5" />
                <p className="text-base text-primary-200">
                  <bdi>{formatNumber(i + 1, lang, { minimumIntegerDigits: 2 })}</bdi>
                  {partners > 0 && (
                    <>
                      {' · '}
                      {formatNumber(partners, lang)} {t('partners')}
                    </>
                  )}
                </p>
                <h3 className="mt-2 text-3xl leading-tight">
                  <Link
                    to={links.area(area.slug)}
                    className="text-[color:var(--egeep-ivory)] no-underline after:absolute after:inset-0 after:rounded-[1.25rem] hover:underline focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-[color:var(--egeep-ivory)]"
                  >
                    {area.title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-3 text-lg text-[color:var(--v6-on-dark-muted)]">{area.summary}</p>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
