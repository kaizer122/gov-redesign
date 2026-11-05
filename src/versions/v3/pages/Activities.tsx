import { ArrowRightIcon } from '@phosphor-icons/react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { site, type Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { PageMasthead } from '../components/PageMasthead'
import { ParticipateBand } from '../components/ParticipateBand'
import { Toolkit, Workflow } from '../components/Programme'
import { SectionHeading } from '../components/SectionHeading'
import { countriesByStart, countryAnchor, href, indexName, paragraphs, years } from '../content'

const ALL = 'all'
const SIGNING_YEARS = [...new Set(countriesByStart.map((c) => c.startYear).filter((y): y is string => Boolean(y)))]
const TABS = [ALL, ...SIGNING_YEARS]

/** Asymmetric rhythm for the editorial grid: a wide lead and a narrow column, then a row of three. */
const SPANS = ['md:col-span-6 lg:col-span-7', 'md:col-span-6 lg:col-span-5', 'md:col-span-3 lg:col-span-4', 'md:col-span-3 lg:col-span-4', 'md:col-span-6 lg:col-span-4']

function FieldNote({ country, feature }: { country: Country; feature: boolean }) {
  const note = paragraphs(country.description)[0]
  const term = years(country)
  return (
    <article
      aria-labelledby={`note-${country.id}`}
      className={`aegov-card card-bordered flex h-full flex-col ${feature ? 'v3-dark border-aeblack-950!' : 'bg-whitely-50'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <Flag iso={country.iso} alt="" className="h-8 w-12 rounded-sm object-cover ring-1 ring-aeblack-200" />
        {country.startYear && (
          <p className={`text-sm font-semibold ${feature ? 'text-aegold-300' : 'text-primary-700'}`}>
            Signed {country.startYear}
          </p>
        )}
      </div>
      <div>
        <h3 id={`note-${country.id}`} className={`card-title ${feature ? 'text-3xl! md:text-4xl!' : ''}`}>
          {indexName(country)}
        </h3>
        {term && (
          <p className={`mt-1 text-sm ${feature ? 'text-aeblack-100' : 'text-aeblack-600'}`}>Partnership term {term}</p>
        )}
      </div>
      {note && (
        <p className={`leading-relaxed ${feature ? 'line-clamp-5 text-lg text-aeblack-50' : 'line-clamp-3 text-aeblack-700'}`}>{note}</p>
      )}
      {country.workstreams && country.workstreams.length > 0 && (
        <ul aria-label="Workstreams" className="flex flex-wrap gap-2">
          {country.workstreams.map((ws) => (
            <li key={ws} className={`aegov-badge ${feature ? 'badge-solid' : ''}`}>
              {ws}
            </li>
          ))}
        </ul>
      )}
      {country.stats && country.stats.length > 0 && (
        <dl
          className={`mt-auto grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4 ${feature ? 'border-aeblack-700 sm:grid-cols-4' : 'v3-rule'}`}
        >
          {country.stats.map((stat) => (
            <div key={stat.label} className="flex min-w-0 flex-col-reverse justify-end gap-0.5">
              <dt className={`text-xs uppercase tracking-wider ${feature ? 'text-aeblack-100' : 'text-aeblack-600'}`}>{stat.label}</dt>
              <dd className="v3-numeral text-xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <p>
        <Link
          to={`${href('countries')}#${countryAnchor(country)}`}
          className={`aegov-link ${feature ? 'text-aegold-300! hover:text-whitely-50!' : ''}`}
        >
          Read the partnership note<span className="sr-only"> for {indexName(country)}</span>
          <ArrowRightIcon aria-hidden="true" className="link-icon" />
        </Link>
      </p>
    </article>
  )
}

export function Activities() {
  const [tab, setTab] = useState<string>(ALL)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const notes = tab === ALL ? countriesByStart : countriesByStart.filter((c) => c.startYear === tab)
  const media = site.media[0]

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TABS.length - 1 }
    if (!(event.key in moves)) return
    const target = (moves[event.key] + TABS.length) % TABS.length
    event.preventDefault()
    setTab(TABS[target])
    tabRefs.current[target]?.focus()
  }

  return (
    <main id="main" data-page="activities">
      <PageMasthead
        crumb="Activities"
        kicker="Field notes"
        title="Activities and field notes"
        standfirst={
          <p>
            The programme at work: each partnership as it was signed, the workstreams it covers and the results
            recorded so far, alongside the tools and steps used to deliver them.
          </p>
        }
      />

      <section aria-labelledby="v3-field-notes" className="v3-wrap py-14 lg:py-20">
        <SectionHeading
          id="v3-field-notes"
          kicker="Partnerships"
          title="Notes from the field"
          intro="Browse by signing year, newest first."
        />
        <div className="aegov-tab mt-10">
          <div role="tablist" aria-label="Signing year" className="tab-items gap-4 overflow-x-auto md:gap-6">
            {TABS.map((t, i) => (
              <button
                key={t}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`v3-tab-${t}`}
                aria-selected={tab === t}
                aria-controls="v3-notes-panel"
                tabIndex={tab === t ? 0 : -1}
                onClick={() => setTab(t)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`tab-link whitespace-nowrap ${tab === t ? 'tab-active' : ''}`}
              >
                {t === ALL ? 'All years' : t}
              </button>
            ))}
          </div>
        </div>
        <div id="v3-notes-panel" role="tabpanel" aria-labelledby={`v3-tab-${tab}`} tabIndex={0} className="pt-10">
          <ul className="grid gap-6 md:grid-cols-6 lg:grid-cols-12">
            {notes.map((country, i) => (
              <li key={country.id} className={SPANS[i % SPANS.length]}>
                <FieldNote country={country} feature={i % SPANS.length === 0} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="v3-method" className="v3-dark">
        <div className="v3-wrap grid gap-14 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <SectionHeading
              id="v3-method"
              kicker="How the work is done"
              title="From agreement to achievement"
              intro={site.about.methodology}
            />
            <div className="mt-10 ps-5">
              <Workflow dark />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Tools in the field</h3>
            <p className="mt-3 text-aeblack-100">Each partnership draws on the same set of knowledge-sharing formats.</p>
            <div className="mt-8">
              <Toolkit dark />
            </div>
          </div>
        </div>
      </section>

      {media && (
        <section aria-labelledby="v3-from-media" className="v3-wrap py-16 lg:py-24">
          <SectionHeading id="v3-from-media" kicker="From the media centre" title="On the record" />
          <Link to={href('media')} className="group mt-10 grid gap-8 md:grid-cols-12 md:items-center">
            {media.image && (
              <span className="v3-zoom block aspect-square overflow-hidden rounded-sm md:col-span-4">
                <img src={media.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </span>
            )}
            <span className="md:col-span-8">
              <span className="aegov-badge">Photo</span>
              <span className="mt-4 block font-[family-name:var(--font-alexandria)] text-2xl font-semibold leading-snug text-aeblack-950 group-hover:underline md:text-3xl">
                {media.title}
              </span>
              <span className="mt-4 inline-flex items-center gap-2 font-medium text-primary-700">
                Visit the media centre
                <ArrowRightIcon aria-hidden="true" />
              </span>
            </span>
          </Link>
        </section>
      )}

      <ParticipateBand />
    </main>
  )
}
