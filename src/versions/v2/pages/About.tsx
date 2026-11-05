import { site } from '../../../data/site'
import { FigureList, Main, PageHeader, SectionHeading } from '../components/Page'
import { LeaderQuotes, ParticipateBand, StatBand, WorkflowSteps } from '../components/Blocks'
import { firstSigningYear, partners } from '../lib/data'
import { toolIcon } from '../components/toolIcons'

export default function About() {
  const { about, contact } = site
  const launchYear = about.launched.match(/\b(19|20)\d{2}\b/)?.[0] ?? String(firstSigningYear)

  return (
    <Main page="about">
      <PageHeader
        page="about"
        eyebrow="About the programme"
        title="A knowledge-sharing platform for government modernisation"
        lead={about.intro[0]}
        aside={
          <FigureList
            items={[
              { value: launchYear, label: 'Programme launched' },
              { value: String(partners.length), label: 'Partner profiles' },
              { value: String(site.areas.length), label: 'Areas of cooperation' },
              { value: String(about.tools.length), label: 'Knowledge-sharing tools' },
            ]}
          />
        }
      />

      <section aria-labelledby="v2-about-who" className="bg-whitely-50 py-16 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading id="v2-about-who" eyebrow="Who we are" title="Partnerships between governments" />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-aeblack-700">
              <p>{about.intro[1]}</p>
              <p>{about.launched}</p>
              <p>{about.methodology}</p>
            </div>
          </div>
          <aside aria-labelledby="v2-about-facts" className="lg:col-span-4 lg:col-start-9">
            <div className="rounded-2xl border border-aeblack-100 bg-aeblack-50 p-6">
              <h3 id="v2-about-facts" className="text-base font-bold text-techblue-950">
                At a glance
              </h3>
              <dl className="mt-4 divide-y divide-aeblack-100 text-sm">
                <div className="py-3">
                  <dt className="text-aeblack-600">Office</dt>
                  <dd className="mt-0.5 font-semibold text-aeblack-900">{contact.office}</dd>
                </div>
                <div className="py-3">
                  <dt className="text-aeblack-600">Launched by</dt>
                  <dd className="mt-0.5 font-semibold text-aeblack-900">
                    Prime Minister’s Office, Ministry of Cabinet Affairs
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-aeblack-600">Location</dt>
                  <dd className="mt-0.5 font-semibold text-aeblack-900">{contact.address}</dd>
                </div>
                <div className="py-3">
                  <dt className="text-aeblack-600">Model</dt>
                  <dd className="mt-0.5 font-semibold text-aeblack-900">Government-to-government partnerships</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="v2-about-values" className="border-t border-aeblack-100 bg-aeblack-50 py-16">
        <div className="container">
          <h2 id="v2-about-values" className="sr-only">
            Programme values
          </h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {about.slogan.map((word, i) => (
              <li key={word} className="relative flex items-center gap-5 overflow-hidden rounded-2xl bg-whitely-50 p-6 shadow-sm">
                <span className="v2-display text-5xl font-bold text-techblue-600" aria-hidden="true">
                  {`0${i + 1}`}
                </span>
                <span className="text-2xl font-extrabold text-techblue-950">{word}</span>
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-techblue-600 to-aegold-400" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <StatBand
        id="v2-about-numbers"
        eyebrow="By the numbers"
        title="The programme in numbers"
        intro="Cumulative figures as published by the Government Experience Exchange Office."
        stats={site.stats.byNumbers}
      />

      <section aria-labelledby="v2-about-tools" className="bg-whitely-50 py-16 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              id="v2-about-tools"
              eyebrow="Methodology"
              title="Knowledge-sharing tools"
              intro="Partners exchange key learnings through a mix of formats, from design-thinking workshops to published white papers."
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {about.tools.map((tool) => {
                const ToolIcon = toolIcon(tool)
                return (
                  <li key={tool} className="aegov-card card-bordered flex items-center gap-4 bg-whitely-50 p-5 *:mb-0">
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-techblue-50 text-techblue-700">
                      <ToolIcon size={26} aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-aeblack-900">{tool}</span>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <h3 className="text-xl font-extrabold text-techblue-950">How a partnership runs</h3>
            <div className="mt-6">
              <WorkflowSteps />
            </div>
          </div>
        </div>
      </section>

      <LeaderQuotes />
      <ParticipateBand />
    </Main>
  )
}
