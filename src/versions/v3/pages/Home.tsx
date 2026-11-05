import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { Blockquote } from '../components/Blockquote'
import { LeaderPortrait } from '../components/LeaderPortrait'
import { ParticipateBand } from '../components/ParticipateBand'
import { SectionHeading } from '../components/SectionHeading'
import {
  chapterNo,
  countriesAZ,
  countriesByStart,
  countryAnchor,
  href,
  indexName,
  paragraphs,
  quoteMbr,
  quoteMbz,
  quoteZayed,
  registration,
  sentences,
  years,
} from '../content'

const STAT_LABELS: Record<string, string> = {
  Country: 'Countries',
  'UAE Government Entity': 'UAE government entities',
  Expert: 'Experts',
  'Training Hour': 'Training hours',
  Workshop: 'Workshops',
  Trainee: 'Trainees',
}

const CONTENTS = [
  { key: 'about', title: 'The lead story', dek: 'Why the UAE shares what it has learned about modern government.' },
  { key: 'areas', title: 'Ten chapters of cooperation', dek: 'From government services to startups, the fields the exchange covers.' },
  { key: 'best-practices', title: 'The playbook', dek: 'The initiatives and methods partner governments adapt at home.' },
  { key: 'activities', title: 'Field notes', dek: 'Partnership by partnership: who signed, when, and what they work on.' },
  { key: 'countries', title: 'An atlas of partners', dek: 'Every participating government, indexed from A to Z.' },
  { key: 'media', title: 'Media centre', dek: 'Photographs, statements and channels from the programme.' },
] as const

export function Home() {
  const fieldNotes = countriesByStart.slice(0, 3)

  return (
    <main id="main" data-page="home">
      {/* Cover */}
      <section aria-labelledby="v3-cover-title" className="border-b v3-rule">
        <div className="v3-wrap grid gap-10 py-12 lg:grid-cols-12 lg:gap-14 lg:py-20">
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="v3-kicker v3-rise">The Exchange · {site.meta.siteName}</p>
            <h1
              id="v3-cover-title"
              className="v3-rise v3-rise-2 mt-6 text-[2.5rem] font-bold leading-[1.05] text-aeblack-950 sm:text-5xl lg:text-7xl"
            >
              How the UAE shares its government experience with the world
            </h1>
            <p className="v3-rise v3-rise-3 v3-measure mt-8 text-lg leading-relaxed text-aeblack-700 md:text-xl">
              {site.meta.description}
            </p>
            <p className="mt-8 border-t v3-rule pt-5 text-sm text-aeblack-600">
              {site.about.launched}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={href('about')} className="aegov-btn">
                Read the lead story
                <ArrowRightIcon aria-hidden="true" />
              </Link>
              <a href={registration.url} target="_blank" rel="noopener noreferrer" className="aegov-btn btn-outline">
                {registration.label}
                <ArrowUpRightIcon aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
          <figure className="lg:col-span-5">
            <div className="v3-zoom aspect-[4/5] overflow-hidden rounded-sm bg-aeblack-950 max-lg:aspect-[4/3]">
              <img
                src={site.hero.images[3]}
                alt="Earth at night seen from space, with the lights of the Gulf, Europe and Asia"
                className="h-full w-full object-cover object-[28%_50%]"
              />
            </div>
            <figcaption className="mt-3 border-l-2 border-aegold-600 pl-3 text-sm text-aeblack-600">
              {site.about.slogan.join(', ')}: the watchwords of every partnership.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* In this issue */}
      <section aria-labelledby="v3-contents" className="v3-wrap py-16 lg:py-20">
        <SectionHeading id="v3-contents" kicker="In this issue" title="Six ways into the programme" />
        <ol className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {CONTENTS.map((item, i) => (
            <li key={item.key} className="border-t-2 border-aeblack-900">
              <Link to={href(item.key)} className="group flex gap-5 py-6">
                <span className="v3-numeral text-3xl text-primary-700">{chapterNo(i)}</span>
                <span>
                  <span className="block font-[family-name:var(--font-alexandria)] text-xl font-semibold text-aeblack-950 group-hover:underline">
                    {item.title}
                  </span>
                  <span className="mt-2 block leading-relaxed text-aeblack-600">{item.dek}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Lead story */}
      <section aria-labelledby="v3-lead" className="v3-paper-deep">
        <div className="v3-wrap grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-4">
            <p className="v3-kicker">The lead story</p>
            <h2 id="v3-lead" className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              A government that chose to share what it knows
            </h2>
          </div>
          <div className="v3-prose v3-measure lg:col-span-7 lg:col-start-6">
            <p className="v3-dropcap">{site.about.intro[1]}</p>
            <p>{site.about.methodology}</p>
            <p>
              <Link to={href('about')} className="aegov-link">
                Read the full story
                <ArrowRightIcon aria-hidden="true" className="link-icon" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section aria-labelledby="v3-numbers" className="v3-wrap py-16 lg:py-24">
        <SectionHeading
          id="v3-numbers"
          kicker="By the numbers"
          title="The reach of the exchange"
          intro="Figures published by the Government Experience Exchange Office."
        />
        <dl className="mt-12 grid grid-cols-2 gap-x-6 border-t v3-rule md:grid-cols-3 md:gap-x-10 xl:grid-cols-6 xl:gap-x-8">
          {site.stats.headline.map((stat) => (
            <div key={stat.label} className="flex min-w-0 flex-col-reverse justify-end border-b v3-rule py-8 xl:border-b-0">
              <dt className="mt-3 text-sm font-medium uppercase tracking-wider text-aeblack-600">
                {STAT_LABELS[stat.label] ?? stat.label}
              </dt>
              <dd className="v3-numeral whitespace-nowrap text-[2rem] text-aeblack-950 sm:text-4xl md:text-5xl xl:text-[2.625rem]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <LeaderPortrait
        quote={quoteMbr}
        id="v3-voice-mbr"
        pageUrl={href('home')}
        kicker="In his words"
        tone="dark"
        imageSide="left"
      />

      {/* Chapters */}
      <section aria-labelledby="v3-chapters" className="v3-wrap py-16 lg:py-24">
        <SectionHeading
          id="v3-chapters"
          kicker="Areas of cooperation"
          title="Ten chapters of cooperation"
          intro="Each partnership draws on a set of fields where the UAE has built its own experience. Read them as chapters."
          action={
            <Link to={href('areas')} className="aegov-link">
              Read every chapter
              <ArrowRightIcon aria-hidden="true" className="link-icon" />
            </Link>
          }
        />
        <ol className="mt-12 grid gap-x-12 md:grid-cols-2">
          {site.areas.map((area, i) => (
            <li key={area.slug} className="border-t v3-rule">
              <Link to={`${href('areas')}#${area.slug}`} className="group grid grid-cols-[4rem_1fr] gap-4 py-7">
                <span className="v3-numeral text-4xl text-aegold-700">{chapterNo(i)}</span>
                <span>
                  <span className="block font-[family-name:var(--font-alexandria)] text-xl font-semibold text-aeblack-950 group-hover:underline">
                    {area.title}
                  </span>
                  <span className="mt-2 line-clamp-3 leading-relaxed text-aeblack-600">
                    {sentences(area.summary)[0]}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Field notes */}
      <section aria-labelledby="v3-notes" className="border-t v3-rule">
        <div className="v3-wrap py-16 lg:py-24">
          <SectionHeading
            id="v3-notes"
            kicker="Field notes"
            title="The newest partnerships"
            intro="The most recent agreements signed under the programme."
            action={
              <Link to={href('activities')} className="aegov-link">
                All field notes
                <ArrowRightIcon aria-hidden="true" className="link-icon" />
              </Link>
            }
          />
          <ul className="mt-12 grid gap-6 lg:grid-cols-3">
            {fieldNotes.map((country) => (
              <li key={country.id} className="aegov-card card-bordered flex flex-col bg-whitely-50">
                <div className="flex items-center gap-3">
                  <Flag iso={country.iso} alt="" className="h-6 w-9 rounded-sm object-cover shadow-sm" />
                  <span className="text-sm font-semibold text-primary-700">Signed {country.startYear}</span>
                </div>
                <h3 className="card-title">{indexName(country)}</h3>
                <p className="line-clamp-4 leading-relaxed text-aeblack-700">
                  {paragraphs(country.description)[0]}
                </p>
                <p className="mt-auto text-sm text-aeblack-600">Partnership term {years(country)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LeaderPortrait
        quote={quoteZayed}
        id="v3-voice-zayed"
        pageUrl={href('home')}
        kicker="The founding spirit"
        tone="light"
        imageSide="right"
      />

      {/* Atlas */}
      <section aria-labelledby="v3-atlas" className="v3-wrap grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <p className="v3-kicker">An atlas of partners</p>
          <h2 id="v3-atlas" className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
            From the Caribbean to Central Asia
          </h2>
          <Blockquote
            variant="pull"
            text={quoteMbz.text}
            author={quoteMbz.author}
            role={quoteMbz.role}
            cite={`${href('home')}#v3-atlas`}
            className="mt-8"
          />
        </div>
        <div className="lg:col-span-7">
          <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
            {countriesAZ.map((country) => (
              <li key={country.id}>
                <Link
                  to={`${href('countries')}#${countryAnchor(country)}`}
                  title={country.name}
                  className="block rounded-sm bg-whitely-50 p-1.5 shadow-sm ring-1 ring-aeblack-100 transition-transform hover:-translate-y-0.5"
                >
                  <Flag iso={country.iso} alt={country.name} className="aspect-[3/2] h-auto w-full object-cover" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link to={href('countries')} className="aegov-btn btn-outline">
              Browse the A–Z index
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <ParticipateBand />
    </main>
  )
}
