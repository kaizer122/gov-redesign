import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Accordion } from '../components/Accordion'
import { AreaBody } from '../components/AreaBody'
import { FactList, PageHeader } from '../components/PageHeader'
import { ParticipateCta } from '../components/ParticipateCta'
import { PartnerFlags } from '../components/PartnerFlags'
import { SectionHeading } from '../components/SectionHeading'
import { areaHref, href } from '../lib/content'
import { TOOL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

/** The flagship practice each area's description introduces, named as the source text names it. */
const PRACTICE_NAMES: Record<string, string> = {
  'government-accelerators': 'Government Accelerators: results in short periods of time',
  'government-innovation': 'Mohammed Bin Rashid Centre for Government Innovation',
  programming: 'One Million Arab Coders',
  'startup-and-entrepreneurship': 'AREA 2071 innovation ecosystem',
  'government-services': 'Proactive, seven-star government services',
  'government-excellence': 'A culture of quality and government excellence',
  'government-performance': 'Government performance framework and National Agenda',
  'competitiveness-and-statistics': 'Managing and monitoring global competitiveness reports',
  'leadership-and-capacity-building': 'Creating change agents within government',
  'government-human-resources': 'International standards in government human resources',
}

const SECTIONS = [
  { id: 'approach', label: 'Our approach' },
  { id: 'practices', label: 'Featured practices' },
  { id: 'transfer', label: 'How practices are transferred' },
]

export default function BestPracticesPage() {
  const intro = site.bestPracticesIntro
  const quote = intro.quote

  return (
    <main id="main" data-page="best-practices" tabIndex={-1}>
      <PageHeader
        page="best-practices"
        title="Best practices"
        lead="Proven UAE government practices that partner governments can learn from, adapt and build on, drawn from each area of cooperation."
        sections={SECTIONS}
        aside={
          <FactList
            facts={[
              { label: 'Featured practices', value: site.areas.length },
              { label: 'Transfer formats', value: site.about.tools.length },
            ]}
          />
        }
      />

      <section id="approach" aria-labelledby="approach-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <h2 id="approach-title" className="mb-6 text-h5 md:text-h4 text-aeblack-900">
              {intro.title}
            </h2>
            <div className="space-y-5 text-lg leading-8 text-aeblack-800">
              {intro.body.map((p) => (
                <p key={p}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          {quote && (
            <figure className="self-start overflow-hidden rounded-xl border border-aeblack-100">
              {quote.image && (
                <img
                  src={quote.image}
                  alt={`Portrait of ${quote.author}`}
                  className="aspect-[16/10] w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-6">
                <blockquote className="aegov-quote quote-colored">
                  <p className="leading-7 text-aeblack-900">{quote.text}</p>
                </blockquote>
                <figcaption className="mt-4">
                  <span className="block font-semibold text-aeblack-900">{quote.author}</span>
                  {quote.role && <span className="block text-sm text-aeblack-700">{quote.role}</span>}
                </figcaption>
              </div>
            </figure>
          )}
        </div>
      </section>

      <section id="practices" aria-labelledby="practices-title" className="scroll-mt-4 border-y border-aeblack-100 bg-aeblack-50">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="practices-title"
            eyebrow="What partners can adopt"
            title="Featured practices"
            intro="One flagship practice from each area of cooperation. Expand a practice to read how it works in the UAE and which partner countries have taken it up."
          />
          <div className="rounded-xl border border-aeblack-100 bg-whitely-50 px-2 md:px-4">
            <Accordion
              defaultOpen={[site.areas[0].slug]}
              items={site.areas.map((area) => ({
                key: area.slug,
                title: (
                  <span className="flex flex-col gap-1 text-start">
                    <span className="text-lg text-aeblack-900">{PRACTICE_NAMES[area.slug] ?? area.title}</span>
                    <span className="text-sm font-normal text-aeblack-700">Area: {area.title}</span>
                  </span>
                ),
                content: (
                  <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_14rem]">
                    <div className="space-y-6">
                      <AreaBody area={area} />
                      <PartnerFlags area={area} />
                      <Link to={areaHref(area.slug)} className="aegov-link">
                        Go to {area.title}
                        <ArrowRight aria-hidden="true" className="link-icon" />
                      </Link>
                    </div>
                    {area.logo && (
                      <div className="flex h-28 items-center justify-center rounded-lg border border-aeblack-100 bg-whitely-50 p-4 max-md:order-first">
                        <img src={area.logo} alt="" className="max-h-full w-auto max-w-full object-contain" loading="lazy" />
                      </div>
                    )}
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      <section id="transfer" aria-labelledby="transfer-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading
          id="transfer-title"
          eyebrow="From the UAE to partner governments"
          title="How practices are transferred"
          intro={site.about.methodology}
          action={
            <Link to={`${href('about')}#how-it-works`} className="aegov-link">
              The five partnership stages
              <ArrowRight aria-hidden="true" className="link-icon" />
            </Link>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.about.tools.map((tool) => {
            const Icon = TOOL_ICONS[tool]
            return (
              <li key={tool} className="flex items-center gap-4 rounded-xl border border-aeblack-100 p-5">
                {Icon && <Icon aria-hidden="true" className="size-8 shrink-0 text-primary-700" />}
                <span className="font-semibold text-aeblack-900">{tool}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <ParticipateCta />
    </main>
  )
}
