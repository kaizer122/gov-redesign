import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { useLang, useT } from '../../../shared/i18n'
import { PAGES, pageLabel } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { COPY } from '../lib/copy'
import { useDismiss } from '../lib/hooks'

type Kind = 'kindPage' | 'kindArea' | 'kindCountry'

interface Entry {
  to: string
  label: string
  kind: Kind
  haystack: string
}

const MAX_RESULTS = 8

interface SiteSearchProps {
  className?: string
  /** Called after a result is chosen, e.g. to close the mobile menu. */
  onNavigate?: () => void
}

/** Header search over pages, areas of cooperation and partner countries, with instant results. */
export function SiteSearch({ className = '', onNavigate }: SiteSearchProps) {
  const id = useId()
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const navigate = useNavigate()
  const ref = useRef<HTMLFormElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  useDismiss(ref, open, () => setOpen(false))

  const index = useMemo<Entry[]>(() => {
    const data = getSite(lang)
    return [
      ...PAGES.map((p) => ({ to: href(p.key), label: pageLabel(p.key, lang), kind: 'kindPage' as const, haystack: pageLabel(p.key, lang) })),
      ...data.areas.map((a) => ({
        to: `${href('areas')}#${a.slug}`,
        label: a.title,
        kind: 'kindArea' as const,
        haystack: `${a.title} ${a.summary}`,
      })),
      ...data.countries.map((c) => ({
        to: `${href('countries')}?country=${c.id}`,
        label: c.name,
        kind: 'kindCountry' as const,
        haystack: `${c.name} ${(c.workstreams ?? []).join(' ')}`,
      })),
    ].map((e) => ({ ...e, haystack: e.haystack.toLowerCase() }))
  }, [lang, href])

  const term = query.trim().toLowerCase()
  const results = useMemo(() => {
    if (term.length < 2) return []
    const titleHits = index.filter((e) => e.label.toLowerCase().includes(term))
    const textHits = index.filter((e) => !titleHits.includes(e) && e.haystack.includes(term))
    return [...titleHits, ...textHits].slice(0, MAX_RESULTS)
  }, [term, index])

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
    <form ref={ref} role="search" aria-label={t('siteSearch')} onSubmit={onSubmit} className={`v7-search relative ${className}`}>
      <div className="aegov-form-control">
        <label htmlFor={`${id}-q`} className="sr-only">
          {t('searchSite')}
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
            <MagnifyingGlass aria-hidden="true" />
            <span className="sr-only">{UI.search[lang]}</span>
          </button>
        </div>
      </div>
      <p id={`${id}-status`} className="sr-only" aria-live="polite">
        {term.length >= 2 ? `${t('resultsFor')} ${query.trim()}: ${results.length}` : ''}
      </p>
      <div
        id={`${id}-results`}
        className={`aegov-dropdown absolute inset-x-0 top-full z-40 mt-2 max-h-96 overflow-y-auto border border-aeblack-100 py-2 ${showResults ? 'block!' : ''}`}
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
                  <span className="text-lg leading-snug">{r.label}</span>
                  <span className="text-base text-[var(--v7-muted)]">{t(r.kind)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-3 py-2 text-base text-[var(--v7-muted)]">{UI.noResults[lang]}</p>
        )}
      </div>
    </form>
  )
}
