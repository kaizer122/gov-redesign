import { useId, useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, SquaresFourIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { countriesByName, href, partnershipPeriod } from '../lib/content'

interface Result {
  id: string
  kind: 'area' | 'country'
  label: string
  detail: string
  iso?: string
  to: string
}

const INDEX: Result[] = [
  ...site.areas.map((area) => ({
    id: `area-${area.slug}`,
    kind: 'area' as const,
    label: area.title,
    detail: 'Area of cooperation',
    to: href('areas', { area: area.slug }),
  })),
  ...countriesByName.map((country) => ({
    id: `country-${country.id}`,
    kind: 'country' as const,
    label: country.name,
    detail: `Partner country · ${partnershipPeriod(country)}`,
    iso: country.iso,
    to: href('countries', { country: String(country.id) }),
  })),
]

const MAX_RESULTS = 8

/**
 * Client-side search across areas and partner countries, built as an ARIA 1.2 combobox:
 * arrow keys move through the listbox, Enter opens the highlighted result, Escape closes.
 */
export function QuickSearch() {
  const navigate = useNavigate()
  const uid = useId()
  const inputId = `${uid}-input`
  const listId = `${uid}-list`
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return INDEX.filter((r) => r.label.toLowerCase().includes(q)).slice(0, MAX_RESULTS)
  }, [query])

  const expanded = open && query.trim().length > 0

  function go(result: Result) {
    setOpen(false)
    setQuery('')
    setActive(-1)
    navigate(result.to)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      if (results.length) setActive((i) => (i + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      if (results.length) setActive((i) => (i <= 0 ? results.length - 1 : i - 1))
    } else if (event.key === 'Escape') {
      if (expanded) {
        event.preventDefault()
        setOpen(false)
        setActive(-1)
      } else {
        setQuery('')
      }
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const pick = results[active] ?? results[0]
    if (pick) go(pick)
  }

  return (
    <form role="search" onSubmit={onSubmit} className="relative" aria-label="Areas and countries">
      <div className="aegov-form-control control-lg">
        <label htmlFor={inputId} className="font-semibold text-aeblack-900">
          Search areas and partner countries
        </label>
        <p id={`${uid}-hint`} className="mb-2 text-sm text-aeblack-600">
          Use the arrow keys to move through suggestions and Enter to open one.
        </p>
        <div className="form-control-input">
          <span className="control-prefix">
            <MagnifyingGlassIcon aria-hidden="true" />
          </span>
          <input
            id={inputId}
            type="text"
            role="combobox"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-activedescendant={expanded && active >= 0 ? `${listId}-${results[active]?.id}` : undefined}
            aria-describedby={`${uid}-hint`}
            placeholder="e.g. Innovation, Kenya, Malta"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
              setActive(-1)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      <ul
        id={listId}
        role="listbox"
        aria-label="Search suggestions"
        hidden={!expanded}
        className="absolute inset-x-0 top-full z-30 mt-2 max-h-96 overflow-auto rounded-2xl border border-aeblack-100 bg-whitely-50 p-2 shadow-xl"
      >
        {results.map((result, index) => (
          <li
            key={result.id}
            id={`${listId}-${result.id}`}
            role="option"
            aria-selected={index === active}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => go(result)}
            onMouseEnter={() => setActive(index)}
            className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 ${index === active ? 'bg-primary-50 text-primary-800' : 'text-aeblack-800'}`}
          >
            {result.iso ? (
              <Flag iso={result.iso} alt="" className="h-5 w-7 shrink-0 rounded-sm object-cover ring-1 ring-aeblack-100" />
            ) : (
              <SquaresFourIcon aria-hidden="true" className="size-6 shrink-0 text-seablue-700" />
            )}
            <span className="min-w-0">
              <span className="block truncate font-semibold">{result.label}</span>
              <span className="block text-sm text-aeblack-600">{result.detail}</span>
            </span>
          </li>
        ))}
        {results.length === 0 && (
          <li role="option" aria-selected={false} aria-disabled="true" className="px-3 py-3 text-aeblack-600">
            No areas or countries match “{query.trim()}”.
          </li>
        )}
      </ul>
      <p className="sr-only" aria-live="polite">
        {expanded ? `${results.length} suggestion${results.length === 1 ? '' : 's'} available.` : ''}
      </p>
    </form>
  )
}
