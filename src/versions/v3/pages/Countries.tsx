import { CaretDownIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { PageMasthead } from '../components/PageMasthead'
import { ParticipateBand } from '../components/ParticipateBand'
import { countriesAZ, countryAnchor, indexLetter, indexName, paragraphs, years } from '../content'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function CountryEntry({ country }: { country: Country }) {
  const [open, setOpen] = useState(false)
  const anchor = countryAnchor(country)
  const short = indexName(country)
  const notes = paragraphs(country.description)
  const term = years(country)

  return (
    <li id={anchor} className="scroll-mt-28 border-t v3-rule py-8 first:border-t-0 first:pt-0">
      <article aria-labelledby={`${anchor}-name`}>
        <div className="flex flex-wrap items-start gap-x-5 gap-y-3">
          <Flag iso={country.iso} alt="" className="h-10 w-15 shrink-0 rounded-sm object-cover shadow-sm ring-1 ring-aeblack-100" />
          <div className="min-w-0 flex-1">
            <h3 id={`${anchor}-name`} className="text-2xl font-bold leading-tight text-aeblack-950">
              {short}
            </h3>
            {short !== country.name && <p className="mt-1 text-aeblack-600">{country.name}</p>}
          </div>
          {term && (
            <p className="v3-numeral rounded-sm bg-aeblack-950 px-3 py-2 text-sm text-whitely-50">
              <span className="sr-only">Partnership term </span>
              {term}
            </p>
          )}
        </div>

        {country.workstreams && country.workstreams.length > 0 && (
          <ul aria-label="Workstreams" className="mt-5 flex flex-wrap gap-2">
            {country.workstreams.map((ws) => (
              <li key={ws} className="aegov-badge">
                {ws}
              </li>
            ))}
          </ul>
        )}

        {notes.length > 0 && (
          <div className="mt-5 v3-measure">
            <div id={`${anchor}-note`} className="space-y-3 leading-relaxed text-aeblack-800">
              {open ? notes.map((p) => <p key={p}>{p}</p>) : <p className="line-clamp-2">{notes[0]}</p>}
            </div>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`${anchor}-note`}
              onClick={() => setOpen((v) => !v)}
              className="aegov-btn btn-link btn-sm mt-2 ps-0!"
            >
              {open ? 'Show less' : 'Read the partnership note'}
              <CaretDownIcon aria-hidden="true" className={open ? 'rotate-180' : undefined} />
              <span className="sr-only"> for {short}</span>
            </button>
          </div>
        )}

        {country.stats && country.stats.length > 0 && (
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {country.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-xs font-semibold uppercase tracking-wider text-aeblack-600">{stat.label}</dt>
                <dd className="v3-numeral text-xl text-aeblack-950">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </article>
    </li>
  )
}

export function Countries() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const shown = q
    ? countriesAZ.filter((c) =>
        [c.name, indexName(c), ...(c.workstreams ?? [])].some((text) => text.toLowerCase().includes(q)),
      )
    : countriesAZ

  const groups = new Map<string, Country[]>()
  for (const country of shown) {
    const letter = indexLetter(country)
    groups.set(letter, [...(groups.get(letter) ?? []), country])
  }

  return (
    <main id="main" data-page="countries">
      <PageMasthead
        crumb="Participating Countries"
        kicker="An atlas of partners"
        title="Participating countries"
        standfirst={
          <p>
            Every government that has signed a partnership with the UAE under the programme, filed from A to Z. Jump to
            a letter, search by name or workstream, and open an entry to read its partnership note.
          </p>
        }
      >
        <div className="aegov-form-control">
          <label htmlFor="v3-country-search">Search countries or workstreams</label>
          <div className="form-control-input">
            <input
              id="v3-country-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Kenya or Programming"
              autoComplete="off"
            />
            <span className="control-suffix" aria-hidden="true">
              <MagnifyingGlassIcon />
            </span>
          </div>
        </div>
      </PageMasthead>

      <nav aria-label="Jump to letter" className="sticky top-0 z-20 border-b v3-rule bg-camel-50/95 backdrop-blur">
        <ul className="v3-wrap grid grid-cols-13 gap-y-1 py-2 md:flex md:gap-1 md:py-3">
          {ALPHABET.map((letter) => (
            <li key={letter} className="md:shrink-0">
              {groups.has(letter) ? (
                <a
                  href={`#letter-${letter}`}
                  className="flex h-8 items-center justify-center rounded-sm font-[family-name:var(--font-alexandria)] font-bold text-aeblack-950 hover:bg-aeblack-950 hover:text-whitely-50 md:size-9"
                >
                  {letter}
                </a>
              ) : (
                <span aria-hidden="true" className="flex h-8 items-center justify-center text-aeblack-300 md:size-9">
                  {letter}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="v3-wrap py-12 lg:py-16">
        <p role="status" className="text-sm text-aeblack-600">
          {q
            ? shown.length > 0
              ? `${shown.length} ${shown.length === 1 ? 'entry matches' : 'entries match'} “${query.trim()}”.`
              : `No entries match “${query.trim()}”. Try a country name or a workstream such as Capacity Building.`
            : 'Partner governments, filed A to Z by short name.'}
        </p>
        {[...groups].map(([letter, countries]) => (
          <section
            key={letter}
            id={`letter-${letter}`}
            aria-labelledby={`letter-${letter}-title`}
            className="mt-10 grid scroll-mt-24 gap-6 border-t-2 border-aeblack-900 pt-8 lg:grid-cols-12 lg:gap-10"
          >
            <h2
              id={`letter-${letter}-title`}
              className="v3-numeral text-6xl text-aegold-700 lg:sticky lg:top-24 lg:col-span-2 lg:self-start lg:text-8xl"
            >
              {letter}
            </h2>
            <ul className="lg:col-span-10">
              {countries.map((country) => (
                <CountryEntry key={country.id} country={country} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <ParticipateBand />
    </main>
  )
}
