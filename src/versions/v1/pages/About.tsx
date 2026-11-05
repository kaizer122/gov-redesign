import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { FactList, PageHeader } from '../components/PageHeader'
import { ParticipateCta } from '../components/ParticipateCta'
import { SectionHeading } from '../components/SectionHeading'
import { StatsBand } from '../components/StatsBand'
import { Workflow } from '../components/Workflow'
import { LAUNCH_YEAR, href } from '../lib/content'
import { TOOL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'tools', label: 'Knowledge-transfer tools' },
  { id: 'how-it-works', label: 'How partnerships work' },
  { id: 'by-the-numbers', label: 'By the numbers' },
]

export default function AboutPage() {
  const { about } = site
  const leader = site.quotes[1]

  return (
    <main id="main" data-page="about" tabIndex={-1}>
      <PageHeader
        page="about"
        title="About the programme"
        lead={about.intro[0]}
        sections={SECTIONS}
        aside={
          <FactList
            facts={[
              { label: 'Launched', value: LAUNCH_YEAR ?? '—' },
              { label: 'Participating countries', value: site.countries.length },
              { label: 'Areas of cooperation', value: site.areas.length },
              { label: 'Partnership stages', value: about.workflow.length },
            ]}
          />
        }
      />

      <section id="overview" aria-labelledby="overview-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <h2 id="overview-title" className="mb-6 text-h5 md:text-h4 text-aeblack-900">
              Overview
            </h2>
            <div className="space-y-5 text-lg leading-8 text-aeblack-800">
              <p>{about.launched}</p>
              <p>{about.intro[1]}</p>
            </div>
          </div>
          <div className="rounded-xl border border-primary-200 bg-primary-50 p-6 md:p-8">
            <h3 id="slogan-title" className="mb-5 text-sm font-semibold tracking-wider text-primary-800 uppercase">
              The programme in three words
            </h3>
            <ol className="space-y-4">
              {about.slogan.map((word, i) => (
                <li key={word} className="flex items-center gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-600 font-bold text-whitely-50">
                    {i + 1}
                  </span>
                  <span className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-aeblack-900">
                    {word}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="methodology" aria-labelledby="methodology-title" className="scroll-mt-4 border-y border-aeblack-100 bg-aeblack-50">
        <div className={`${CONTAINER} ${SECTION} grid gap-10 lg:grid-cols-2 lg:gap-16`}>
          <div>
            <h2 id="methodology-title" className="mb-6 text-h5 md:text-h4 text-aeblack-900">
              Methodology
            </h2>
            <p className="text-lg leading-8 text-aeblack-800">{about.methodology}</p>
          </div>
          {leader && (
            <figure className="self-center">
              <blockquote className="aegov-quote quote-colored">
                <p className="text-lg leading-8 text-aeblack-900">{leader.text}</p>
              </blockquote>
              <figcaption className="mt-4">
                <span className="block font-semibold text-aeblack-900">{leader.author}</span>
                {leader.role && <span className="block text-sm text-aeblack-700">{leader.role}</span>}
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <section id="tools" aria-labelledby="tools-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading
          id="tools-title"
          eyebrow="How knowledge is transferred"
          title="Knowledge-transfer tools"
          intro={`The programme shares UAE experience through ${about.tools.length} formats, from hands-on workshops and field visits to published white papers.`}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {about.tools.map((tool) => {
            const Icon = TOOL_ICONS[tool]
            return (
              <li key={tool} className="aegov-card card-bordered flex items-center gap-4 border-aeblack-100! p-5! [&>*]:m-0!">
                {Icon && (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <Icon aria-hidden="true" className="size-7" />
                  </span>
                )}
                <span className="font-semibold text-aeblack-900">{tool}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-4 border-t border-aeblack-100">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="how-title"
            eyebrow="Partnership lifecycle"
            title="How partnerships work"
            intro="Every partnership between the UAE Government and a participating country follows the same five stages."
            action={
              <Link to={href('activities')} className="aegov-link">
                See partnership activity
                <ArrowRight aria-hidden="true" className="link-icon" />
              </Link>
            }
          />
          <Workflow />
        </div>
      </section>

      <div id="by-the-numbers" className="scroll-mt-4">
        <StatsBand id="numbers-title" title="The programme by the numbers" stats={site.stats.byNumbers} />
      </div>

      <ParticipateCta />
    </main>
  )
}
