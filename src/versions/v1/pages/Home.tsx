import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import type { Country } from '../../../data/site'
import { CountryCard } from '../components/CountryCard'
import { CountryModal } from '../components/CountryModal'
import { HeroCarousel } from '../components/HeroCarousel'
import { ParticipateCta } from '../components/ParticipateCta'
import { SectionHeading } from '../components/SectionHeading'
import { StatsBand } from '../components/StatsBand'
import { Workflow } from '../components/Workflow'
import { ACTIVE_PARTNERSHIPS, LAUNCH_YEAR, areaHref, byNewest, href } from '../lib/content'
import { CONTAINER, SECTION } from '../lib/ui'

const RECENT_COUNT = 8

export default function HomePage() {
  const [country, setCountry] = useState<Country>()
  const recent = byNewest(site.countries).slice(0, RECENT_COUNT)
  const quote = site.bestPracticesIntro.quote

  return (
    <main id="main" data-page="home" tabIndex={-1}>
      <div className={`${CONTAINER} pt-6 md:pt-8`}>
        <HeroCarousel />
      </div>

      <section aria-labelledby="v1-home-title" className={`${CONTAINER} py-12 md:py-16`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-wider text-primary-700 uppercase">
              {site.meta.shortName} · {site.about.slogan.join(' · ')}
            </p>
            <h1 id="v1-home-title" className="text-h4 md:text-h3 text-aeblack-900">
              {site.meta.siteName}
            </h1>
            <p className="mt-5 text-lg leading-8 text-aeblack-800 md:text-xl md:leading-9">{site.about.intro[0]}</p>
          </div>
          <div className="space-y-5 border-primary-200 lg:border-s lg:ps-10">
            <p className="text-aeblack-800">{site.about.launched}</p>
            <p className="text-aeblack-800">{site.about.intro[1]}</p>
            <Link to={href('about')} className="aegov-link">
              About the programme
              <ArrowRight aria-hidden="true" className="link-icon" />
            </Link>
          </div>
        </div>
      </section>

      <StatsBand
        id="v1-home-stats"
        title="The programme at a glance"
        stats={site.stats.headline}
        note={LAUNCH_YEAR ? `Since the programme's launch in ${LAUNCH_YEAR}` : undefined}
      />

      <section aria-labelledby="v1-home-areas" className={`${CONTAINER} ${SECTION}`}>
        <SectionHeading
          id="v1-home-areas"
          eyebrow="What we share"
          title="Areas of cooperation"
          intro={`${site.areas.length} fields in which the UAE Government transfers its experience, tools and best practices to partner governments.`}
          action={
            <Link to={href('areas')} className="aegov-btn btn-outline btn-sm">
              All areas of cooperation
            </Link>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {site.areas.map((area) => (
            <li key={area.slug}>
              <article className="aegov-card card-bordered card-glow relative flex h-full flex-col gap-4 border-aeblack-100! p-5! [&>*]:m-0!">
                <div className="flex h-16 items-center">
                  {area.logo && (
                    <img src={area.logo} alt="" className="max-h-14 w-auto max-w-full object-contain" loading="lazy" />
                  )}
                </div>
                <h3 className="text-base leading-snug font-bold text-aeblack-900">
                  <Link
                    to={areaHref(area.slug)}
                    className="static text-aeblack-900 no-underline after:absolute after:inset-0 after:rounded-xl hover:text-primary-800 hover:underline"
                  >
                    {area.title}
                  </Link>
                </h3>
                <p className="line-clamp-3 text-sm text-aeblack-700">{area.summary}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="v1-home-how" className="border-y border-aeblack-100 bg-aeblack-50">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="v1-home-how"
            eyebrow="How it works"
            title="From agreement to results in five stages"
            intro={site.about.methodology}
            action={
              <Link to={`${href('about')}#how-it-works`} className="aegov-link">
                Programme methodology
                <ArrowRight aria-hidden="true" className="link-icon" />
              </Link>
            }
          />
          <Workflow />
        </div>
      </section>

      <section aria-labelledby="v1-home-countries" className={`${CONTAINER} ${SECTION}`}>
        <SectionHeading
          id="v1-home-countries"
          eyebrow="Partnerships"
          title="Latest partnerships"
          intro={`${site.countries.length} participating countries have partnered with the UAE through the programme, and ${ACTIVE_PARTNERSHIPS} partnerships are active. Select a country for its partnership details.`}
          action={
            <Link to={href('countries')} className="aegov-btn btn-outline btn-sm">
              All {site.countries.length} countries
            </Link>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((c) => (
            <li key={c.id}>
              <CountryCard country={c} onOpen={setCountry} />
            </li>
          ))}
        </ul>
        <CountryModal country={country} onClose={() => setCountry(undefined)} />
      </section>

      {quote && (
        <section aria-labelledby="v1-home-quote" className="border-t border-aeblack-100">
          <div className={`${CONTAINER} ${SECTION} grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
            {quote.image && (
              <img
                src={quote.image}
                alt={`Portrait of ${quote.author}`}
                className="aspect-[4/3] w-full rounded-xl object-cover"
                loading="lazy"
              />
            )}
            <div>
              <h2 id="v1-home-quote" className="mb-6 text-h6 text-aeblack-900">
                {site.bestPracticesIntro.title}
              </h2>
              <figure>
                <blockquote className="aegov-quote quote-colored">
                  <p className="text-lg leading-8 text-aeblack-900">{quote.text}</p>
                </blockquote>
                <figcaption className="mt-4">
                  <span className="block font-semibold text-aeblack-900">{quote.author}</span>
                  {quote.role && <span className="block text-sm text-aeblack-700">{quote.role}</span>}
                </figcaption>
              </figure>
              <Link to={href('best-practices')} className="aegov-link mt-6">
                Explore UAE best practices
                <ArrowRight aria-hidden="true" className="link-icon" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <ParticipateCta />
    </main>
  )
}
