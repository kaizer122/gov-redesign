import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { usePageHref } from '../../../shared/BilingualVersion'
import { Flag } from '../../../shared/Flag'
import { useLang, useT } from '../../../shared/i18n'
import { COPY } from '../lib/copy'
import { signingYears } from '../lib/content'
import { useReducedMotion } from '../lib/hooks'

/**
 * "Years of partnership": one column per signing year with the flags and names of the countries
 * that signed. Scroll-snapped, with previous/next buttons; runs right-to-left in Arabic.
 */
export function YearsTimeline() {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const id = useId()
  const reduced = useReducedMotion()
  const years = signingYears(lang)
  const ref = useRef<HTMLOListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const travelled = Math.abs(el.scrollLeft)
    setEdges({ start: travelled < 4, end: travelled + el.clientWidth >= el.scrollWidth - 4 })
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure, lang])

  const step = (forward: boolean) => {
    const el = ref.current
    if (!el) return
    const column = el.querySelector('li')?.getBoundingClientRect().width ?? el.clientWidth
    const sign = (forward ? 1 : -1) * (lang === 'ar' ? -1 : 1)
    el.scrollBy({ left: sign * column, behavior: reduced ? 'auto' : 'smooth' })
  }

  const Back = lang === 'ar' ? ArrowRight : ArrowLeft
  const Forward = lang === 'ar' ? ArrowLeft : ArrowRight

  return (
    <div>
      <div className="mb-6 flex items-center justify-end gap-2">
        <button type="button" className="v7-round-btn" onClick={() => step(false)} disabled={edges.start} aria-controls={id}>
          <Back aria-hidden="true" className="size-5" />
          <span className="sr-only">{t('earlierYears')}</span>
        </button>
        <button type="button" className="v7-round-btn" onClick={() => step(true)} disabled={edges.end} aria-controls={id}>
          <Forward aria-hidden="true" className="size-5" />
          <span className="sr-only">{t('laterYears')}</span>
        </button>
      </div>
      <ol
        id={id}
        ref={ref}
        onScroll={measure}
        tabIndex={0}
        aria-label={t('yearsOfPartnership')}
        className="v7-years v7-scroll flex items-start snap-x snap-mandatory overflow-x-auto scroll-smooth motion-reduce:scroll-auto"
      >
        {years.map(({ year, countries }) => (
          <li key={year} className={`v7-year-col shrink-0 snap-start ${countries.length > 6 ? 'is-wide' : ''}`}>
            <h3 className="v7-year">
              <bdi>{year}</bdi>
            </h3>
            <p className="mt-2 text-base text-[var(--v7-col-muted)]">
              {t('signedLabel')}: <bdi>{countries.length}</bdi>
            </p>
            <ul className={`mt-6 gap-x-8 border-t border-[var(--v7-col-rule)] pt-5 ${countries.length > 6 ? 'sm:columns-2' : ''}`}>
              {countries.map((c) => (
                <li key={c.id} className="mb-3 break-inside-avoid">
                  <Link to={`${href('countries')}?country=${c.id}`} className="v7-year-country">
                    <Flag iso={c.iso} alt="" className="h-5 w-[1.875rem] shrink-0 object-cover ring-1 ring-black/10" />
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
