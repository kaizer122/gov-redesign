import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  ChalkboardTeacherIcon,
  ChartLineUpIcon,
  GlobeIcon,
  HandshakeIcon,
  SquaresFourIcon,
  UserPlusIcon,
} from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { Page, SectionHeading } from '../components/Page'
import { PartnershipSteps } from '../components/PartnershipSteps'
import { QuickSearch } from '../components/QuickSearch'
import { RoleChooser } from '../components/RoleChooser'
import { ServiceCard } from '../components/ServiceCard'
import { StatusBadge } from '../components/StatusBadge'
import { countriesByName, href, partnershipPeriod, partnershipStatus, signingYears } from '../lib/content'

const POPULAR_AREAS = ['government-innovation', 'government-services', 'programming', 'government-performance']

const latestYear = signingYears[0]
const newestPartners = countriesByName.filter((c) => c.startYear === latestYear)
const activeCount = site.countries.filter((c) => partnershipStatus(c) === 'active').length
const featuredQuote = site.quotes[1] ?? site.quotes[0]

export function HomePage() {
  return (
    <Page pageKey="home">
      <section className="v4-hero border-b border-aeblack-100" aria-labelledby="v4-home-title">
        <div className="container grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:py-20">
          <div className="min-w-0">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-seablue-50 px-3 py-1 text-sm font-semibold text-seablue-800">
              <GlobeIcon aria-hidden="true" className="size-4" />
              {site.meta.siteName}
            </p>
            <h1 id="v4-home-title" className="text-3xl font-extrabold leading-tight text-aeblack-950 md:text-5xl">
              {site.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-aeblack-700">
              Share in the UAE’s experience and best practices in government development and modernisation. Tell us
              who you are, or search for an area or country, and we will take you to the right place.
            </p>
            <div className="mt-8 max-w-xl">
              <QuickSearch />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-aeblack-600">Popular:</span>
                {POPULAR_AREAS.map((slug) => {
                  const area = site.areas.find((a) => a.slug === slug)
                  return area ? (
                    <Link
                      key={slug}
                      to={href('areas', { area: slug })}
                      className="inline-flex min-h-9 items-center rounded-full border border-aeblack-100 bg-whitely-50 px-3 text-sm font-semibold text-aeblack-800 no-underline hover:border-primary-300 hover:text-primary-700"
                    >
                      {area.title}
                    </Link>
                  ) : null
                })}
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <RoleChooser />
          </div>
        </div>
      </section>

      <section aria-labelledby="v4-home-numbers" className="bg-primary-900 text-whitely-50">
        <div className="container py-10 md:py-12">
          <h2 id="v4-home-numbers" className="sr-only">
            The programme in numbers
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 xl:grid-cols-6">
            {site.stats.headline.map((stat) => (
              <div key={stat.label} className="flex flex-col border-s-2 border-seablue-400 ps-4">
                <dt className="text-sm text-aegreen-100">{stat.label}</dt>
                <dd className="order-first text-3xl font-extrabold md:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="v4-home-services" className="container py-14 md:py-20">
        <SectionHeading
          id="v4-home-services"
          title="Popular services"
          intro="Start the most requested tasks directly. Each one takes you to the page or form you need."
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <ServiceCard
              icon={UserPlusIcon}
              title={site.hero.cta.label}
              description="Register on the participation platform to take part in the Government Experience Exchange Programme."
              to={site.hero.cta.url}
              action="Register"
              external
            />
          </li>
          <li>
            <ServiceCard
              icon={HandshakeIcon}
              title="Express interest in a partnership"
              description="For governments that want to exchange experience with the UAE. Tell us your priorities and we will be in touch."
              to={href('contact', { subject: 'Government Partnership' })}
              action="Start request"
            />
          </li>
          <li>
            <ServiceCard
              icon={ChalkboardTeacherIcon}
              title="Become a trainer in GEEP"
              description="Experts and trainers can offer their knowledge to partner governments through the programme."
              to={href('contact', { subject: 'Become a Trainer in GEEP' })}
              action="Apply"
            />
          </li>
          <li>
            <ServiceCard
              icon={SquaresFourIcon}
              title="Explore areas of cooperation"
              description={`Compare the ${site.areas.length} areas in which the UAE shares its experience, from services to innovation.`}
              to={href('areas')}
              action="Explore"
            />
          </li>
          <li>
            <ServiceCard
              icon={GlobeIcon}
              title="Find a partner country"
              description="Search participating countries and see each partnership’s period, status and workstreams."
              to={href('countries')}
              action="Search countries"
            />
          </li>
          <li>
            <ServiceCard
              icon={ChartLineUpIcon}
              title="Track partnerships"
              description="Follow partnerships by signing year, with their status and the number of workstreams."
              to={href('activities')}
              action="Open tracker"
            />
          </li>
        </ul>
      </section>

      <section aria-labelledby="v4-home-steps" className="border-y border-aeblack-100 bg-aeblack-50/50">
        <div className="container py-14 md:py-20">
          <SectionHeading
            id="v4-home-steps"
            title="How partnership works"
            intro={site.about.methodology}
            action={
              <Link to={href('about')} className="aegov-btn btn-outline btn-sm">
                About the programme
              </Link>
            }
          />
          <PartnershipSteps idPrefix="v4-home-steps" />
        </div>
      </section>

      <section aria-labelledby="v4-home-areas" className="container py-14 md:py-20">
        <SectionHeading
          id="v4-home-areas"
          title="Areas of cooperation"
          intro="Choose an area to see what the UAE shares and which partner countries work on it."
          action={
            <Link to={href('areas')} className="aegov-link">
              All areas
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          }
        />
        <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
          {site.areas.map((area) => (
            <li key={area.slug}>
              <Link
                to={href('areas', { area: area.slug })}
                className="aegov-card card-bordered card-glow card-service flex h-full flex-col gap-4 border-aeblack-100! p-5! no-underline"
              >
                {area.logo && (
                  <img src={area.logo} alt="" className="h-10 w-full object-contain object-left" loading="lazy" />
                )}
                <span className="mt-auto font-bold text-aeblack-900">{area.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="v4-home-partners" className="bg-seablue-50">
        <div className="container py-14 md:py-20">
          <SectionHeading
            id="v4-home-partners"
            title="Newest partnerships"
            intro={`${activeCount} of ${site.countries.length} listed partnerships are active in 2026. These were signed most recently, in ${latestYear}.`}
            action={
              <Link to={href('countries')} className="aegov-btn btn-sm">
                View all countries
              </Link>
            }
          />
          <ul className="grid gap-4 md:grid-cols-3">
            {newestPartners.map((country) => (
              <li key={country.id}>
                <Link
                  to={href('countries', { country: String(country.id) })}
                  className="aegov-card card-bordered card-glow flex h-full items-center gap-4 border-seablue-100! bg-whitely-50 p-5! no-underline"
                >
                  <Flag iso={country.iso} alt="" className="h-8 w-12 shrink-0 rounded object-cover ring-1 ring-aeblack-100" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-aeblack-900">{country.name}</span>
                    <span className="block text-sm text-aeblack-600">{partnershipPeriod(country)}</span>
                  </span>
                  <StatusBadge status={partnershipStatus(country)} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {featuredQuote && (
        <section aria-label="Leadership vision" className="container py-14 md:py-20">
          <div className="grid items-center gap-8 rounded-3xl border border-aeblack-100 p-6 md:grid-cols-[auto_minmax(0,1fr)] md:p-10">
            {featuredQuote.image && (
              <img
                src={featuredQuote.image}
                alt={featuredQuote.author}
                className="size-32 rounded-full object-cover object-top md:size-44"
                loading="lazy"
              />
            )}
            <blockquote className="aegov-quote quote-colored">
              <p>{featuredQuote.text}</p>
              <div className="quote-footer">
                <div className="quote-author">{featuredQuote.author}</div>
                {featuredQuote.role && <div className="quote-cite">{featuredQuote.role}</div>}
              </div>
            </blockquote>
          </div>
        </section>
      )}
    </Page>
  )
}
