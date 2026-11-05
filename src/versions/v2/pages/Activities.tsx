import { useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { pageHref } from '../../../shared/pages'
import { FigureList, Main, PageHeader, SectionHeading } from '../components/Page'
import { ParticipateBand, WorkflowSteps } from '../components/Blocks'
import { toolIcon } from '../components/toolIcons'
import {
  REFERENCE_YEAR,
  firstSigningYear,
  lastEndYear,
  partners,
  statNumber,
  statValue,
  timeline,
  type Partner,
} from '../lib/data'

const TABS = [
  { id: 'timeline', label: 'Partnership timeline' },
  { id: 'delivery', label: 'Reported delivery by partner' },
] as const

type TabId = (typeof TABS)[number]['id']

const DELIVERY_COLUMNS = ['Training hours', 'Workshops', 'Trainees'] as const

const deliveryRows = partners
  .filter((p) => DELIVERY_COLUMNS.some((label) => statValue(p.stats, label)))
  .sort((a, b) => statNumber(statValue(b.stats, 'Trainees')) - statNumber(statValue(a.stats, 'Trainees')))

const yearsWithEvents = timeline.filter((g) => g.signed.length > 0 || g.ending.length > 0)

export default function Activities() {
  const [tab, setTab] = useState<TabId>('timeline')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, Home: -index, End: TABS.length - 1 - index }
    if (!(e.key in keys)) return
    e.preventDefault()
    const next = (index + keys[e.key] + TABS.length) % TABS.length
    setTab(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <Main page="activities">
      <PageHeader
        page="activities"
        eyebrow="Activities"
        title="Programme activities and milestones"
        lead="Follow the programme year by year: the partnerships signed, the terms concluded, and the delivery partners report through workshops, training hours and trainees."
        aside={
          <FigureList
            items={[
              { value: String(partners.length), label: 'Partnerships on record' },
              { value: `${firstSigningYear}–${lastEndYear}`, label: 'Span of partnership terms' },
              { value: String(deliveryRows.length), label: 'Partners reporting delivery' },
              { value: String(site.about.tools.length), label: 'Knowledge-sharing tools' },
            ]}
          />
        }
      />

      <section aria-labelledby="v2-activity-formats" className="bg-whitely-50 py-16 md:py-20">
        <div className="container">
          <SectionHeading
            id="v2-activity-formats"
            eyebrow="Activity formats"
            title="How experience is exchanged"
            intro="The programme’s methodology draws on these knowledge-sharing tools to exchange key learnings in the areas of cooperation agreed with each partner government."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {site.about.tools.map((tool) => {
              const ToolIcon = toolIcon(tool)
              return (
                <li key={tool} className="aegov-card card-bordered flex items-center gap-4 bg-whitely-50 p-5 *:mb-0">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-techblue-950 text-aegold-200">
                    <ToolIcon size={26} aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-aeblack-900">{tool}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="v2-activity-records" className="border-t border-aeblack-100 bg-aeblack-50 py-16 md:py-20">
        <div className="container">
          <SectionHeading
            id="v2-activity-records"
            eyebrow="Partnership records"
            title="Milestones across the network"
            intro={`Built from the signing and term-end years published on each country profile. Terms ending in ${REFERENCE_YEAR} or later are shown as scheduled.`}
          />

          <div className="aegov-tab mt-10">
            <div className="tab-items gap-6 max-xl:overflow-auto" role="tablist" aria-label="Activity views">
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`v2-tab-${t.id}`}
                  aria-controls={`v2-panel-${t.id}`}
                  aria-selected={tab === t.id}
                  tabIndex={tab === t.id ? 0 : -1}
                  className={`tab-link whitespace-nowrap ${tab === t.id ? 'tab-active' : ''}`}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="tab-content pt-8"
            role="tabpanel"
            id="v2-panel-timeline"
            aria-labelledby="v2-tab-timeline"
            hidden={tab !== 'timeline'}
            tabIndex={0}
          >
            <nav aria-label="Jump to year" className="flex flex-wrap gap-2">
              {yearsWithEvents.map((g) => (
                <a
                  key={g.year}
                  href={`#v2-year-${g.year}`}
                  className="rounded-full border border-techblue-200 bg-whitely-50 px-3 py-1 text-sm font-semibold text-techblue-800 hover:bg-techblue-50"
                >
                  {g.year}
                </a>
              ))}
            </nav>
            <ol className="relative mt-10 border-s-2 border-techblue-200 ps-6 md:ms-32 md:ps-10">
              {yearsWithEvents.map((g) => (
                <li key={g.year} id={`v2-year-${g.year}`} className="relative scroll-mt-6 pb-12 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute -start-[33px] top-1 size-4 rounded-full border-4 border-aeblack-50 md:-start-[49px] ${
                      g.year < REFERENCE_YEAR ? 'bg-techblue-600' : 'bg-aegold-400'
                    }`}
                  />
                  <h3 className="v2-display text-3xl font-bold text-techblue-950 md:absolute md:-start-40 md:top-0 md:w-24 md:text-end">
                    {g.year}
                  </h3>
                  <div className="mt-3 space-y-6 md:mt-0">
                    {g.signed.length > 0 && (
                      <YearGroupList
                        title={`${g.signed.length} ${g.signed.length === 1 ? 'partnership' : 'partnerships'} signed`}
                        partners={g.signed}
                        tone="signed"
                      />
                    )}
                    {g.ending.length > 0 && (
                      <YearGroupList
                        title={`${g.ending.length} ${g.ending.length === 1 ? 'term' : 'terms'} ${g.year < REFERENCE_YEAR ? 'concluded' : 'scheduled to conclude'}`}
                        partners={g.ending}
                        tone="ending"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div
            className="tab-content pt-8"
            role="tabpanel"
            id="v2-panel-delivery"
            aria-labelledby="v2-tab-delivery"
            hidden={tab !== 'delivery'}
            tabIndex={0}
          >
            <p className="max-w-3xl text-aeblack-700">
              {`Figures as reported on ${deliveryRows.length} country profiles, sorted by trainees. A dash means the profile does not report that figure.`}
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-aeblack-100 bg-whitely-50" role="region" aria-label="Reported delivery table" tabIndex={0}>
              <table className="w-full min-w-[600px] text-sm">
                <caption className="sr-only">Training hours, workshops and trainees reported per partner</caption>
                <thead className="bg-techblue-950 text-whitely-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Partner</th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Signed</th>
                    {DELIVERY_COLUMNS.map((c) => (
                      <th key={c} scope="col" className="px-4 py-3 text-end font-semibold">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-aeblack-100">
                  {deliveryRows.map((p) => (
                    <tr key={p.id}>
                      <th scope="row" className="px-4 py-3 text-start font-normal">
                        <Link
                          to={`${pageHref('v2', 'countries')}?country=${p.id}`}
                          className="flex items-center gap-3 font-semibold text-techblue-800 underline-offset-4 hover:underline"
                        >
                          <Flag iso={p.iso} alt="" className="h-5 w-[30px] shrink-0 rounded-sm object-cover ring-1 ring-aeblack-900/10" />
                          {p.shortName}
                        </Link>
                      </th>
                      <td className="px-4 py-3 text-aeblack-800">{p.startYear ?? '–'}</td>
                      {DELIVERY_COLUMNS.map((c) => (
                        <td key={c} className="v2-display px-4 py-3 text-end text-aeblack-900">
                          {statValue(p.stats, c) ?? '–'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="v2-activity-workflow" className="bg-whitely-50 py-16 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="v2-activity-workflow"
              eyebrow="Inside every partnership"
              title="The five-step workflow"
              intro="The programme’s partnership workflow runs from agreeing the areas of cooperation to periodic meetings that document achievements."
            />
            {site.media[0] && (
              <article className="aegov-card card-news mt-10 overflow-hidden bg-aeblack-50 *:mb-0">
                {site.media[0].image && <img src={site.media[0].image} alt="" loading="lazy" className="card-image rounded-none" />}
                <div className="card-content p-5 *:mb-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-techblue-700">From the media centre</p>
                  <h3 className="card-title mt-2 text-lg">{site.media[0].title}</h3>
                  <Link to={pageHref('v2', 'media')} className="aegov-link mt-3">
                    Visit the media centre
                    <ArrowRightIcon size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            )}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-2xl border border-aeblack-100 p-6 sm:p-8">
              <WorkflowSteps />
            </div>
          </div>
        </div>
      </section>

      <ParticipateBand />
    </Main>
  )
}

interface YearGroupListProps {
  title: string
  partners: Partner[]
  tone: 'signed' | 'ending'
}

function YearGroupList({ title, partners: list, tone }: YearGroupListProps) {
  return (
    <div>
      <p className={`text-sm font-bold uppercase tracking-wider ${tone === 'signed' ? 'text-techblue-700' : 'text-aegold-800'}`}>
        {title}
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <li key={p.id}>
            <Link
              to={`${pageHref('v2', 'countries')}?country=${p.id}`}
              className={`flex items-center gap-3 rounded-lg border bg-whitely-50 px-3 py-2.5 transition-colors hover:border-techblue-400 ${
                tone === 'signed' ? 'border-aeblack-100' : 'border-dashed border-aegold-400'
              }`}
            >
              <Flag iso={p.iso} alt="" className="h-6 w-9 shrink-0 rounded-sm object-cover ring-1 ring-aeblack-900/10" />
              <span className="min-w-0">
                <span className="block truncate font-semibold text-aeblack-900">{p.shortName}</span>
                <span className="block text-xs text-aeblack-600">
                  {tone === 'signed'
                    ? `${p.workstreams?.length ?? 0} workstreams listed · term to ${p.endYear ?? 'n/a'}`
                    : `Signed ${p.startYear ?? 'n/a'}`}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
