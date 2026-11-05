import { useId, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { getSite, site } from '../../../data/site'
import { useLang, useT } from '../../../shared/i18n'
import { PAGES, pageLabel } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { useLinks } from '../lib/content'
import { F, T } from '../lib/dict'
import { useDismiss } from '../lib/hooks'

interface Entry {
  to: string
  label: string
  kind: string
  haystack: string
}

const MAX_RESULTS = 8

interface SiteSearchProps {
  className?: string
  /** Called after a result is chosen, e.g. to close the mobile menu. */
  onNavigate?: () => void
}

/** Header search over pages, areas of cooperation and partner countries, in both languages. */
export function SiteSearch({ className = '', onNavigate }: SiteSearchProps) {
  const id = useId()
  const lang = useLang()
  const t = useT(T)
  const { href, areaHref, countryHref } = useLinks()
  const navigate = useNavigate()
  const ref = useRef<HTMLFormElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  useDismiss(ref, open, () => setOpen(false))

  const term = query.trim().toLowerCase()
  let results: Entry[] = []
  if (term.length >= 2) {
    const local = getSite(lang)
    const index: Entry[] = [
      ...PAGES.map((p) => ({ to: href(p.key), label: pageLabel(p.key, lang), kind: t('kindPage'), haystack: `${p.label} ${p.labelAr}` })),
      ...local.areas.map((a, i) => ({
        to: areaHref(a.slug),
        label: a.title,
        kind: t('kindArea'),
        haystack: `${a.title} ${a.summary} ${site.areas[i].title}`,
      })),
      ...local.countries.map((c, i) => ({
        to: countryHref(c.id),
        label: c.name,
        kind: t('kindCountry'),
        haystack: `${c.name} ${site.countries[i].name} ${(c.workstreams ?? []).join(' ')}`,
      })),
    ].map((e) => ({ ...e, haystack: e.haystack.toLowerCase() }))
    const titleHits = index.filter((e) => e.label.toLowerCase().includes(term))
    const textHits = index.filter((e) => !titleHits.includes(e) && e.haystack.includes(term))
    results = [...titleHits, ...textHits].slice(0, MAX_RESULTS)
  }

  const choose = (to: string) => {
    setOpen(false)
    setQuery('')
    navigate(to)
    onNavigate?.()
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (results[0]) choose(results[0].to)
  }

  const showResults = open && term.length >= 2

  return (
    <form ref={ref} role="search" aria-label={UI.search[lang]} onSubmit={onSubmit} className={`relative ${className}`}>
      <div className="aegov-form-control">
        <label htmlFor={`${id}-q`} className="sr-only">
          {t('searchLabel')}
        </label>
        <div className="form-control-input">
          <input
            type="search"
            id={`${id}-q`}
            value={query}
            placeholder={UI.searchPlaceholder[lang]}
            autoComplete="off"
            aria-describedby={`${id}-status`}
            aria-controls={`${id}-results`}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
          />
          <button type="submit" className="control-suffix">
            <MagnifyingGlass aria-hidden="true" className="rtl:-scale-x-100" />
            <span className="sr-only">{UI.search[lang]}</span>
          </button>
        </div>
      </div>
      <p id={`${id}-status`} className="sr-only" aria-live="polite">
        {term.length >= 2 ? F.searchStatus[lang](results.length, query.trim()) : ''}
      </p>
      <div
        id={`${id}-results`}
        className={`aegov-dropdown absolute inset-x-0 top-full z-40 mt-2 max-h-96 overflow-y-auto border border-[var(--egeep-grey-light)] bg-[#fff] py-2 shadow-lg ${showResults ? 'block!' : ''}`}
      >
        {results.length ? (
          <ul>
            {results.map((r) => (
              <li key={`${r.kind}-${r.to}`}>
                <Link
                  to={r.to}
                  onClick={(e) => {
                    e.preventDefault()
                    choose(r.to)
                  }}
                  className="dropdown-item flex! flex-col items-start! gap-0! text-[var(--egeep-charcoal)]"
                >
                  <span className="text-base">{r.label}</span>
                  <span className="text-sm text-[var(--v5-muted)]">{r.kind}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-3 py-2 text-base text-[var(--v5-muted)]">{t('noMatches')}</p>
        )}
      </div>
    </form>
  )
}
