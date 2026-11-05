import { Link } from 'react-router-dom'
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { pageHref } from '../../../shared/pages'
import { Main, SectionHeading } from '../components/Page'
import { NetworkConstellation } from '../components/NetworkConstellation'
import { AreaReachChart, SigningYearChart, StatusSplit } from '../components/Charts'
import { LeaderQuotes, ParticipateBand, StatBand, WorkflowSteps } from '../components/Blocks'
import {
  firstSigningYear,
  lastSigningYear,
  partners,
  peakSigningCount,
  registration,
  signingYears,
} from '../lib/data'

export default function Home() {
  const peakYears = signingYears.filter((g) => g.signed.length === peakSigningCount).map((g) => g.year)
  return (
    <Main page="home">
      <section aria-labelledby="v2-home-title" className="v2-dark relative overflow-hidden bg-techblue-950 text-whitely-50">
        <img
          src={site.hero.images[3]}
          alt=""
          className="absolute inset-0 size-full object-cover object-left opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-techblue-950 via-techblue-950/85 to-techblue-950/40"
        />
        <div className="container relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-aegold-300/40 bg-techblue-900/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-aegold-200">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-aegold-300" />
              {site.meta.siteName}
            </p>
            <h1 id="v2-home-title" className="mt-6 text-4xl font-extrabold leading-[1.1] text-whitely-50 md:text-5xl xl:text-6xl">
              Sharing the UAE’s government experience with{' '}
              <span className="text-aegold-200">{`${partners.length} partner governments`}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-techblue-100">{site.about.intro[0]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={registration.url} target="_blank" rel="noopener noreferrer" className="aegov-btn v2-btn-gold">
                {registration.label}
                <ArrowUpRightIcon size={20} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <Link to={pageHref('v2', 'countries')} className="aegov-btn btn-outline v2-btn-ghost">
                Explore the network
                <ArrowRightIcon size={20} aria-hidden="true" />
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-techblue-200/20 pt-6">
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-xs text-techblue-100">Partner profiles</dt>
                <dd className="v2-display text-2xl font-bold">{partners.length}</dd>
              </div>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-xs text-techblue-100">First agreements</dt>
                <dd className="v2-display text-2xl font-bold">{firstSigningYear}</dd>
              </div>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-xs text-techblue-100">Areas of cooperation</dt>
                <dd className="v2-display text-2xl font-bold">{site.areas.length}</dd>
              </div>
            </dl>
          </div>
          <figure className="lg:col-span-6">
            <div className="mx-auto max-w-[560px]">
              <NetworkConstellation />
            </div>
            <figcaption className="mx-auto mt-4 max-w-md text-center text-sm text-techblue-100">
              {`Each ring is a signing year, ${firstSigningYear} at the centre to ${lastSigningYear} at the edge; each flag is a partner government.`}
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="v2-home-years" className="bg-whitely-50 py-16 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="v2-home-years"
              eyebrow="Partnerships by signing year"
              title={`New partners signed every year from ${firstSigningYear} to ${lastSigningYear}`}
              intro={`Every flag below is one partnership, stacked in the year its agreement was signed. Signings peaked in ${peakYears.join(' and ')}, with ${peakSigningCount} new partners in each year.`}
            />
            <div className="mt-8 rounded-xl border border-aeblack-100 bg-aeblack-50 p-6">
              <h3 className="text-base font-bold text-techblue-950">Partnership status</h3>
              <p className="mt-1 text-sm text-aeblack-600">Based on each partnership’s published term end year.</p>
              <div className="mt-5">
                <StatusSplit />
              </div>
            </div>
            <Link to={pageHref('v2', 'activities')} className="aegov-link mt-6">
              View the partnership timeline
              <ArrowRightIcon size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-aeblack-100 bg-whitely-50 p-4 shadow-sm sm:p-8">
              <SigningYearChart />
            </div>
          </div>
        </div>
      </section>

      <StatBand
        id="v2-home-stats"
        eyebrow="The programme in figures"
        title="Knowledge exchange at scale"
        intro="Headline figures published by the Government Experience Exchange Office."
        stats={site.stats.headline}
      />

      <section aria-labelledby="v2-home-areas" className="bg-whitely-50 py-16 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="v2-home-areas"
              eyebrow="Areas of cooperation"
              title="Where the network concentrates"
              intro={`The programme shares UAE practice across ${site.areas.length} areas, from government services to programming. The chart counts the partner countries whose listed workstreams match each area.`}
            />
            <Link to={pageHref('v2', 'areas')} className="aegov-btn btn-outline mt-8">
              Explore all areas
              <ArrowRightIcon size={20} aria-hidden="true" />
            </Link>
          </div>
          <div className="lg:col-span-7">
            <AreaReachChart />
          </div>
        </div>
      </section>

      <section aria-labelledby="v2-home-how" className="border-t border-aeblack-100 bg-aeblack-50 py-16 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              id="v2-home-how"
              eyebrow="How it works"
              title="From agreement to documented results"
              intro={site.about.methodology}
            />
            <h3 className="mt-10 text-base font-bold text-techblue-950">Knowledge-sharing tools</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {site.about.tools.map((tool) => (
                <li key={tool} className="aegov-badge">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="rounded-2xl bg-whitely-50 p-6 shadow-sm sm:p-8">
              <h3 className="mb-6 text-base font-bold text-techblue-950">The partnership workflow</h3>
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
