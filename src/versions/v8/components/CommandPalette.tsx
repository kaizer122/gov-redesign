import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowElbowDownLeft, FileText, GridFour, MagnifyingGlass, X } from '@phosphor-icons/react'
import { getSite, site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { useLang, useT, type Lang } from '../../../shared/i18n'
import { PAGES, pageLabel } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { fill } from '../lib/content'
import { useLinks, useModalFocus } from '../lib/hooks'
import { T } from '../lib/t'

type Kind = 'page' | 'area' | 'country'

interface Entry {
  key: string
  to: string
  label: string
  kind: Kind
  iso?: string
  /** Searchable text in both languages, normalized. */
  title: string
  haystack: string
}

/** Lower-cases and folds Arabic letter variants and diacritics, so "إ" finds "ا" and so on. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u064b-\u0652\u0640]/g, '')
    .replace(/[إأآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
}

const MAX_RESULTS = 10

function useIndex(lang: Lang): Entry[] {
  const { href, areaHref, countryHref } = useLinks()
  return useMemo(() => {
    const ar = getSite('ar')
    const local = getSite(lang)
    return [
      ...PAGES.map((p) => ({
        key: `page-${p.key}`,
        to: href(p.key),
        label: pageLabel(p.key, lang),
        kind: 'page' as const,
        title: normalize(`${p.label} ${p.labelAr}`),
        haystack: '',
      })),
      ...site.areas.map((a, i) => ({
        key: `area-${a.slug}`,
        to: areaHref(a.slug),
        label: local.areas[i].title,
        kind: 'area' as const,
        title: normalize(`${a.title} ${ar.areas[i].title}`),
        haystack: normalize(`${a.summary} ${ar.areas[i].summary}`),
      })),
      ...site.countries.map((c, i) => ({
        key: `country-${c.id}`,
        to: countryHref(c.id),
        label: local.countries[i].name,
        kind: 'country' as const,
        iso: c.iso,
        title: normalize(`${c.name} ${ar.countries[i].name}`),
        haystack: normalize([...(c.workstreams ?? []), ...(ar.countries[i].workstreams ?? [])].join(' ')),
      })),
    ]
  }, [lang, href, areaHref, countryHref])
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

/** Site search as a command palette: a dialog with a combobox over pages, areas and countries. */
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  if (!open) return null
  return <Palette onClose={onClose} />
}

function Palette({ onClose }: { onClose: () => void }) {
  const lang = useLang()
  const t = useT(T)
  const id = useId()
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const index = useIndex(lang)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  useModalFocus(panelRef, true, onClose)

  const term = normalize(query.trim())
  const results = useMemo(() => {
    if (!term) return index.filter((e) => e.kind === 'page')
    const titleHits = index.filter((e) => e.title.includes(term))
    const textHits = index.filter((e) => !titleHits.includes(e) && e.haystack.includes(term))
    return [...titleHits, ...textHits].slice(0, MAX_RESULTS)
  }, [term, index])

  const kindLabel: Record<Kind, string> = { page: t('kindPage'), area: t('kindArea'), country: t('kindCountry') }
  const optionId = (i: number) => `${id}-opt-${i}`

  const choose = (entry: Entry | undefined) => {
    if (!entry) return
    onClose()
    navigate(entry.to)
  }

  const move = (next: number) => {
    const i = (next + results.length) % results.length
    setActive(i)
    document.getElementById(optionId(i))?.scrollIntoView({ block: 'nearest' })
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      move(active + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      move(active - 1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(results[active])
    }
  }

  return (
    <>
      <div className="aegov-modal-backdrop" aria-hidden="true" />
      <div
        className="aegov-modal z-50 flex items-start justify-center px-3 pt-[8vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div ref={panelRef} className="v8-fade-in v8-tile flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden shadow-2xl">
          <h2 id={`${id}-title`} className="sr-only">
            {t('searchSite')}
          </h2>
          <div className="aegov-form-control border-b border-[var(--v8-line)] p-3">
            <label htmlFor={`${id}-q`} className="sr-only">
              {UI.searchPlaceholder[lang]}
            </label>
            <div className="form-control-input control-prefix-icon">
              <span className="control-prefix">
                <MagnifyingGlass aria-hidden="true" className="size-5" />
              </span>
              <input
                id={`${id}-q`}
                type="search"
                role="combobox"
                aria-expanded="true"
                aria-controls={`${id}-list`}
                aria-autocomplete="list"
                aria-activedescendant={results.length ? optionId(active) : undefined}
                aria-describedby={`${id}-hint`}
                autoComplete="off"
                placeholder={UI.searchPlaceholder[lang]}
                value={query}
                data-autofocus
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                onKeyDown={onKeyDown}
              />
            </div>
          </div>
          <p id={`${id}-status`} className="sr-only" aria-live="polite">
            {term ? (results.length ? fill(t('resultCount'), { n: results.length }) : t('noMatch')) : ''}
          </p>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {!term && <p className="v8-muted px-3 pt-1 pb-2 text-sm">{t('groupPages')}</p>}
            {results.length ? (
              <ul ref={listRef} id={`${id}-list`} role="listbox" aria-label={UI.searchResults[lang]}>
                {results.map((r, i) => (
                  <li
                    key={r.key}
                    id={optionId(i)}
                    role="option"
                    aria-selected={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={() => choose(r)}
                    className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 ${i === active ? 'bg-primary-50 text-primary-900' : ''}`}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded border border-[var(--v8-line)] bg-[#fff]">
                      {r.kind === 'country' && r.iso ? (
                        <Flag iso={r.iso} alt="" className="h-4 w-6 object-cover" />
                      ) : r.kind === 'area' ? (
                        <GridFour aria-hidden="true" className="size-4 text-primary-700" />
                      ) : (
                        <FileText aria-hidden="true" className="size-4 text-primary-700" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{r.label}</span>
                      <span className="v8-muted block text-sm">{kindLabel[r.kind]}</span>
                    </span>
                    {i === active && <ArrowElbowDownLeft aria-hidden="true" className="size-4 shrink-0 rtl:-scale-x-100" />}
                  </li>
                ))}
              </ul>
            ) : (
              <p id={`${id}-list`} className="px-3 py-6 text-center">
                {t('noMatch')}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[var(--v8-line)] bg-[var(--egeep-ivory)] px-4 py-2">
            <p id={`${id}-hint`} className="v8-muted text-sm">
              {t('paletteHint')}
            </p>
            <button type="button" onClick={onClose} className="inline-flex items-center gap-1 rounded p-1 text-sm">
              <X aria-hidden="true" className="size-4" />
              <span>{UI.close[lang]}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
