import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, CaretDownIcon, InfoIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { pageHref } from '../../../shared/pages'
import { FigureList, Main, PageHeader, SectionHeading } from '../components/Page'
import { AreaReachChart } from '../components/Charts'
import { ParticipateBand } from '../components/Blocks'
import {
  areaReach,
  areaReachRanked,
  bodyBlocks,
  partners,
  partnersWithWorkstreams,
  workstreamTotal,
  type AreaReach,
} from '../lib/data'

const FLAG_PREVIEW = 8

export default function Areas() {
  const top = areaReachRanked[0]
  return (
    <Main page="areas">
      <PageHeader
        page="areas"
        eyebrow="Areas of cooperation"
        title="Ten areas of UAE government practice"
        lead="Partner governments choose the areas of cooperation at the start of every partnership. Each area draws on a UAE initiative, from Government Accelerators to the One Million Arab Coders."
        aside={
          <FigureList
            items={[
              { value: String(site.areas.length), label: 'Areas of cooperation' },
              { value: String(workstreamTotal), label: 'Workstreams listed on profiles' },
              { value: String(partnersWithWorkstreams.length), label: 'Profiles listing workstreams' },
              { value: String(top.partners.length), label: `Partners in ${top.area.title}` },
            ]}
          />
        }
      />

      <section aria-labelledby="v2-areas-reach" className="bg-whitely-50 py-16 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="v2-areas-reach"
              eyebrow="Derived data"
              title="How many partners work in each area"
              intro="Country profiles list the workstreams agreed with each partner. Matching those workstreams to the ten areas shows where demand for UAE experience is strongest."
            />
            <div role="note" className="aegov-alert alert-info mt-8">
              <div className="alert-icon">
                <InfoIcon size={28} weight="fill" aria-hidden="true" />
              </div>
              <div className="alert-content">
                <p className="alert-title font-semibold">How these counts are derived</p>
                <p>
                  {`A partner is counted for an area when one of its listed workstreams contains one of the area’s keywords (shown on each card). ${partners.length - partnersWithWorkstreams.length} of ${partners.length} profiles do not itemise workstreams and are not counted. These are indicative figures, not official programme statistics.`}
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <AreaReachChart />
          </div>
        </div>
      </section>

      <section aria-labelledby="v2-areas-list" className="border-t border-aeblack-100 bg-aeblack-50 py-16 md:py-20">
        <div className="container">
          <SectionHeading id="v2-areas-list" eyebrow="Area profiles" title="What each area shares" />
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {areaReach.map((reach) => (
              <li key={reach.area.slug}>
                <AreaCard reach={reach} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ParticipateBand />
    </Main>
  )
}

function AreaCard({ reach }: { reach: AreaReach }) {
  const { area, keywords, partners: matched } = reach
  const [open, setOpen] = useState(false)
  const bodyId = `v2-area-${area.slug}-body`
  const headId = `v2-area-${area.slug}-head`
  const share = (matched.length / partnersWithWorkstreams.length) * 100

  return (
    <article
      className="aegov-card card-bordered flex h-full flex-col overflow-hidden bg-whitely-50 p-0! *:mb-0"
      aria-labelledby={`v2-area-${area.slug}`}
    >
      <div className="relative h-48 bg-techblue-950">
        {area.image && <img src={area.image} alt="" loading="lazy" className="size-full object-cover" />}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-techblue-950/70 to-transparent" />
        {area.logo && (
          <span className="absolute bottom-4 start-5 inline-flex max-w-[70%] rounded-lg bg-whitely-50 px-3 py-2 shadow">
            <img src={area.logo} alt={`${area.title} logo`} loading="lazy" className="h-7 w-auto max-w-full object-contain object-left" />
          </span>
        )}
      </div>
      <div className="card-content flex flex-1 flex-col p-6">
        <h3 id={`v2-area-${area.slug}`} className="card-title text-techblue-950">
          {area.title}
        </h3>

        <div className="mt-4 flex items-end gap-4 rounded-xl bg-techblue-950 p-4 text-whitely-50">
          <p className="v2-display text-4xl font-bold leading-none">{matched.length}</p>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-techblue-100">partner countries with matching workstreams</p>
            <div className="mt-2 h-1.5 rounded-full bg-whitely-50/15" aria-hidden="true">
              <div className="v2-bar h-full rounded-full bg-aegold-300" style={{ width: `${share}%` }} />
            </div>
          </div>
        </div>

        <p className="mt-4 text-aeblack-700">{area.summary}</p>

        <p className="mt-4 text-xs text-aeblack-600">
          <span className="font-semibold text-aeblack-800">Matched keywords: </span>
          {keywords.map((k) => `“${k}”`).join(', ')}
        </p>

        {matched.length > 0 && (
          <ul className="mt-3 flex flex-wrap items-center gap-1.5" aria-label={`Partners with ${area.title} workstreams`}>
            {matched.slice(0, FLAG_PREVIEW).map((p) => (
              <li key={p.id} className="leading-none">
                <Flag iso={p.iso} alt={p.shortName} className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-aeblack-900/10" />
              </li>
            ))}
            {matched.length > FLAG_PREVIEW && (
              <li className="text-xs font-semibold text-aeblack-600">{`+${matched.length - FLAG_PREVIEW} more`}</li>
            )}
          </ul>
        )}

        <div className="aegov-accordion mt-auto pt-5">
          <div className="accordion-item">
            <div className="accordion-title" id={headId}>
              <button type="button" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((v) => !v)}>
                <span>{open ? 'Hide full description' : 'Read full description'}</span>
                <CaretDownIcon size={20} aria-hidden="true" className={open ? 'rotate-180' : ''} />
              </button>
            </div>
            <div id={bodyId} className="accordion-content" hidden={!open} aria-labelledby={headId}>
              <div className="accordion-content-body space-y-3 text-aeblack-700">
                {bodyBlocks(area.body).map((block) =>
                  block.kind === 'p' ? (
                    <p key={block.text}>{block.text}</p>
                  ) : (
                    <ul key={block.items.join('|')} className="list-disc space-y-1 ps-5">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}
                <Link to={pageHref('v2', 'best-practices')} className="aegov-link">
                  See it in Best Practices
                  <ArrowRightIcon size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
