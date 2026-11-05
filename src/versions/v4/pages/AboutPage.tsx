import { Link } from 'react-router-dom'
import {
  BookOpenTextIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  LightbulbIcon,
  MapTrifoldIcon,
  VideoConferenceIcon,
  type Icon,
} from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Page, PageHeader, SectionHeading } from '../components/Page'
import { PartnershipSteps } from '../components/PartnershipSteps'
import { href } from '../lib/content'
import { CtaBand } from '../components/CtaBand'

/** Icon and one-line explanation for each entry of site.about.tools, in order. */
const TOOL_DETAILS: { icon: Icon; text: string }[] = [
  { icon: LightbulbIcon, text: 'Collaborative sessions where teams frame challenges and shape solutions together.' },
  { icon: VideoConferenceIcon, text: 'Knowledge-sharing sessions held online or in person, to suit the partner’s teams.' },
  { icon: MapTrifoldIcon, text: 'Visits that let partner teams see practices at work first hand.' },
  { icon: GraduationCapIcon, text: 'Structured programmes that build the skills of government employees.' },
  { icon: BriefcaseIcon, text: 'Documented models of how initiatives are designed and run, ready to adapt.' },
  { icon: BookOpenTextIcon, text: 'Publications that capture lessons learned so they can be reused.' },
]

export function AboutPage() {
  return (
    <Page pageKey="about">
      <PageHeader
        crumb="About"
        eyebrow={site.meta.shortName}
        title="About the programme"
        intro={<p>{site.about.intro[0]}</p>}
        aside={
          <ul className="flex flex-wrap gap-2 lg:flex-col" aria-label="Programme values">
            {site.about.slogan.map((word, index) => (
              <li
                key={word}
                className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-whitely-50 px-4 py-3 font-bold text-primary-800"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary-600 text-sm text-whitely-50" aria-hidden="true">
                  {index + 1}
                </span>
                {word}
              </li>
            ))}
          </ul>
        }
      />

      <section aria-labelledby="v4-about-overview" className="container py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="v4-about-overview" className="text-2xl font-bold text-aeblack-950 md:text-3xl">
              A knowledge-sharing partnership between governments
            </h2>
            <div className="mt-5 space-y-4 text-lg text-aeblack-700">
              {site.about.intro.slice(1).map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>{site.about.launched}</p>
              <p>{site.about.methodology}</p>
            </div>
          </div>
          {site.hero.images[3] && (
            <img
              src={site.hero.images[3]}
              alt=""
              className="aspect-[4/3] w-full rounded-3xl object-cover"
              loading="lazy"
            />
          )}
        </div>
      </section>

      <section aria-labelledby="v4-about-numbers" className="bg-primary-50">
        <div className="container py-14 md:py-16">
          <SectionHeading id="v4-about-numbers" title="The programme by numbers" />
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {site.stats.byNumbers.map((stat) => (
              <div key={stat.label} className="aegov-card card-bordered flex flex-col border-primary-100! bg-whitely-50 p-5!">
                <dt className="text-aeblack-600">{stat.label}</dt>
                <dd className="order-first text-2xl font-extrabold text-primary-700 md:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="v4-about-steps" id="how-it-works" className="container py-14 md:py-20">
        <SectionHeading
          id="v4-about-steps"
          title="How partnership works"
          intro="Every partnership follows the same five steps, from choosing the areas of cooperation to documenting what was achieved."
        />
        <PartnershipSteps idPrefix="v4-about-steps" />
      </section>

      <section aria-labelledby="v4-about-tools" className="border-t border-aeblack-100 bg-aeblack-50/50">
        <div className="container py-14 md:py-20">
          <SectionHeading
            id="v4-about-tools"
            title="Knowledge-sharing tools"
            intro="Partnerships combine these tools in each action plan."
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {site.about.tools.map((tool, index) => {
              const detail = TOOL_DETAILS[index]
              const ToolIcon = detail?.icon
              return (
                <li key={tool} className="aegov-card card-bordered card-service h-full border-aeblack-100! bg-whitely-50">
                  {ToolIcon && (
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-seablue-50 text-seablue-700">
                      <ToolIcon aria-hidden="true" className="size-7" />
                    </span>
                  )}
                  <h3 className="card-title font-bold text-aeblack-900">{tool}</h3>
                  {detail && <p className="text-aeblack-600">{detail.text}</p>}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="v4-about-leadership" className="container py-14 md:py-20">
        <SectionHeading id="v4-about-leadership" title="Guided by the UAE’s leadership" />
        <ul className="grid gap-6 lg:grid-cols-3">
          {site.quotes.map((quote) => (
            <li key={quote.author} className="aegov-card card-bordered flex flex-col border-aeblack-100!">
              {quote.image && (
                <img
                  src={quote.image}
                  alt={quote.author}
                  className="aspect-[4/3] w-full rounded-xl object-cover object-top"
                  loading="lazy"
                />
              )}
              <blockquote className="aegov-quote">
                <p>{quote.text}</p>
                <div className="quote-footer">
                  <div className="quote-author">{quote.author}</div>
                  {quote.role && <div className="quote-cite">{quote.role}</div>}
                </div>
              </blockquote>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        title="Ready to take part?"
        text="Register on the participation platform, or tell us about your government’s priorities first."
        secondary={
          <Link to={href('contact', { subject: 'Government Partnership' })} className="aegov-btn btn-outline">
            Express interest
          </Link>
        }
      />
    </Page>
  )
}
