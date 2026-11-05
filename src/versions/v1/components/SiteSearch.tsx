import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { PAGES } from '../../../shared/pages'
import { areaHref, countryHref, href } from '../lib/content'
import { useDismiss } from '../lib/hooks'

interface Entry {
  to: string
  label: string
  kind: 'Page' | 'Area of cooperation' | 'Partner country'
  haystack: string
}

const INDEX: Entry[] = [
  ...PAGES.map((p) => ({ to: href(p.key), label: p.label, kind: 'Page' as const, haystack: p.label })),
  ...site.areas.map((a) => ({
    to: areaHref(a.slug),
    label: a.title,
    kind: 'Area of cooperation' as const,
    haystack: `${a.title} ${a.summary}`,
  })),
  ...site.countries.map((c) => ({
    to: countryHref(c.id),
    label: c.name,
    kind: 'Partner country' as const,
    haystack: `${c.name} ${(c.workstreams ?? []).join(' ')}`,
  })),
].map((e) => ({ ...e, haystack: e.haystack.toLowerCase() }))

const MAX_RESULTS = 8

interface SiteSearchProps {
  className?: string
  /** Called after a result is chosen, e.g. to close the mobile menu. */
  onNavigate?: () => void
}

/** Header search over pages, areas of cooperation and partner countries, with instant results. */
export function SiteSearch({ className = '', onNavigate }: SiteSearchProps) {
  const id = useId()
  const navigate = useNavigate()
  const ref = useRef<HTMLFormElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  useDismiss(ref, open, () => setOpen(false))

  const term = query.trim().toLowerCase()
  const results = useMemo(() => {
    if (term.length < 2) return []
    const titleHits = INDEX.filter((e) => e.label.toLowerCase().includes(term))
    const textHits = INDEX.filter((e) => !titleHits.includes(e) && e.haystack.includes(term))
    return [...titleHits, ...textHits].slice(0, MAX_RESULTS)
  }, [term])

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
    <form ref={ref} role="search" aria-label="Site search" onSubmit={onSubmit} className={`relative ${className}`}>
      <div className="aegov-form-control">
        <label htmlFor={`${id}-q`} className="sr-only">
          Search the website
        </label>
        <div className="form-control-input">
          <input
            type="search"
            id={`${id}-q`}
            value={query}
            placeholder="Search countries, areas, pages"
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
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
      <p id={`${id}-status`} className="sr-only" aria-live="polite">
        {term.length >= 2 ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for ${query.trim()}` : ''}
      </p>
      <div
        id={`${id}-results`}
        className={`aegov-dropdown absolute inset-x-0 top-full mt-2 max-h-96 overflow-y-auto border border-aeblack-100 py-2 ${showResults ? 'block!' : ''}`}
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
                  className="dropdown-item flex! flex-col items-start! gap-0! text-aeblack-900"
                >
                  <span className="text-sm font-semibold">{r.label}</span>
                  <span className="text-xs text-aeblack-600">{r.kind}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-3 py-2 text-sm text-aeblack-700">No matches. Try a country or area name.</p>
        )}
      </div>
    </form>
  )
}
