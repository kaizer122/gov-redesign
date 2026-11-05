import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import type { Country } from '../../../data/site'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { CountryCard } from '../components/CountryCard'
import { CountryModal } from '../components/CountryModal'
import { HeroQuotes } from '../components/HeroQuotes'
import { ParticipateCta } from '../components/ParticipateCta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { StatsBand } from '../components/StatsBand'
import { VideoFacade } from '../components/VideoFacade'
import { Workflow } from '../components/Workflow'
import { ACTIVE_PARTNERSHIPS, LAUNCH_YEAR, byNewest, statsFor, useLinks } from '../lib/content'
import { F, T, type DictKey } from '../lib/dict'
import { CONTAINER, SECTION } from '../lib/ui'

const RECENT_COUNT = 8

const SLOGAN: { word: keyof typeof UI; line: DictKey }[] = [
  { word: 'communication', line: 'sloganCommunication' },
  { word: 'exchange', line: 'sloganExchange' },
  { word: 'development', line: 'sloganDevelopment' },
]

export default function HomePage() {
  const lang = useLang()
  const t = useT(T)
  const { href, areaHref } = useLinks()
  const site = getSite(lang)
  const [country, setCountry] = useState<Country>()
  const recent = byNewest(site.countries).slice(0, RECENT_COUNT)
  const quote = site.bestPracticesIntro.quote

  return (
    <main id="main" data-page="home" tabIndex={-1}>
      <HeroQuotes />

      <section aria-labelledby="v5-home-title" className={`${CONTAINER} ${SECTION}`}>
        <Reveal className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <p className="v5-eyebrow mb-4">{UI.officeName[lang]}</p>
            <h1 id="v5-home-title" className="text-[2.75rem] leading-[1.15] text-[var(--egeep-gold)] md:text-6xl rtl:leading-[1.4]">
              {UI.programmeName[lang]}
            </h1>
            <div className="v5-hairline mt-8 w-24" aria-hidden="true" />
            <p className="mt-8 text-xl text-[var(--egeep-charcoal)] md:text-2xl md:leading-[1.55]">{site.about.intro[0]}</p>
          </div>
          <div className="space-y-6 text-lg text-[var(--egeep-charcoal)] lg:border-s lg:border-[var(--egeep-gold)] lg:ps-10 lg:pt-16">
            <p>{site.about.launched}</p>
            <p>{site.about.intro[1]}</p>
            <Link to={href('about')} className="aegov-link">
              {t('aboutProgramme')}
              <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
            </Link>
          </div>
        </Reveal>

        <h2 className="sr-only">{t('sloganHeading')}</h2>
        <ol className="mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-12">
          {SLOGAN.map((item, i) => (
            <li key={item.word}>
              <Reveal delay={i * 120} className="border-t border-[var(--egeep-gold)] pt-6">
                <span className="v5-eyebrow block tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-2 block text-5xl text-[var(--egeep-gold)] md:text-6xl">{UI[item.word][lang]}</span>
                <span className="mt-4 block text-lg text-[var(--egeep-charcoal)]">{t(item.line)}</span>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <StatsBand
        id="v5-home-stats"
        title={t('atAGlance')}
        stats={statsFor('headline', lang)}
        note={LAUNCH_YEAR ? F.sinceLaunch[lang](LAUNCH_YEAR) : undefined}
      />

      <section aria-labelledby="v5-home-areas" className={`${CONTAINER} ${SECTION}`}>
        <SectionHeading
          id="v5-home-areas"
          eyebrow={t('whatWeShare')}
          title={UI.areasOfCooperation[lang]}
          intro={F.areasIntro[lang](site.areas.length)}
          action={
            <Link to={href('areas')} className="aegov-btn btn-outline btn-sm">
              {t('allAreas')}
            </Link>
          }
        />
        <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
          {site.areas.map((area, i) => (
            <li key={area.slug}>
              <Reveal delay={(i % 5) * 80} className="h-full">
                <article className="aegov-card card-bordered group relative flex h-full flex-col border-[var(--egeep-grey-light)]! bg-[#fff] p-0! transition-colors hover:border-[var(--egeep-gold)]! [&>*]:m-0!">
                  {area.image && (
                    <div className="aspect-[3/2] overflow-hidden">
                      <img
                        src={area.image}
                        alt=""
                        width={930}
                        height={600}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-4 p-3 sm:p-5">
                    {area.logo && (
                      <div className="flex h-12 items-center max-sm:hidden">
                        <img src={area.logo} alt="" loading="lazy" className="max-h-11 w-auto max-w-full object-contain" />
                      </div>
                    )}
                    <h3 className="text-xl leading-snug text-[var(--egeep-charcoal)] sm:text-2xl">
                      <Link
                        to={areaHref(area.slug)}
                        className="static text-[var(--egeep-charcoal)] no-underline after:absolute after:inset-0 group-hover:text-[var(--color-primary-800)]"
                      >
                        {area.title}
                      </Link>
                    </h3>
                    <p className="line-clamp-3 text-base text-[var(--v5-muted)] max-sm:hidden">{area.summary}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="v5-home-how" className="bg-[var(--egeep-ivory)]">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="v5-home-how"
            eyebrow={t('howItWorks')}
            title={t('fiveStagesTitle')}
            intro={site.about.methodology}
            action={
              <Link to={`${href('about')}#how-it-works`} className="aegov-link">
                {t('methodology')}
                <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
              </Link>
            }
          />
          <Reveal>
            <Workflow />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="v5-home-countries" className={`${CONTAINER} ${SECTION}`}>
        <SectionHeading
          id="v5-home-countries"
          eyebrow={UI.partnership[lang]}
          title={t('latestPartnerships')}
          intro={F.partnershipsIntro[lang](site.countries.length, ACTIVE_PARTNERSHIPS)}
          action={
            <Link to={href('countries')} className="aegov-btn btn-outline btn-sm">
              {F.allCountries[lang](site.countries.length)}
            </Link>
          }
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-sm:[&>li:nth-child(n+5)]:hidden">
          {recent.map((c, i) => (
            <li key={c.id}>
              <Reveal delay={(i % 4) * 80} className="h-full">
                <CountryCard country={c} onOpen={setCountry} />
              </Reveal>
            </li>
          ))}
        </ul>
        <CountryModal country={country} onClose={() => setCountry(undefined)} />
      </section>

      {quote && (
        <section aria-labelledby="v5-home-quote" className="bg-[var(--egeep-ivory)]">
          <div className={`${CONTAINER} ${SECTION}`}>
            <Reveal className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
              {quote.image && (
                <img
                  src={quote.image}
                  alt={F.portraitOf[lang](quote.author)}
                  width={1920}
                  height={1334}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              )}
              <div>
                <p className="v5-eyebrow mb-3">{t('wordsOfLeadership')}</p>
                <h2 id="v5-home-quote" className="text-4xl text-[var(--egeep-gold)] md:text-5xl">
                  {site.bestPracticesIntro.title}
                </h2>
                <div className="v5-hairline mt-8 mb-8" aria-hidden="true" />
                <figure>
                  <blockquote className="aegov-quote border-s-2! ps-6!">
                    <p className="text-2xl leading-[1.5] text-[var(--egeep-charcoal)] rtl:leading-[1.75]">{quote.text}</p>
                  </blockquote>
                  <figcaption className="mt-6 ps-6">
                    <span className="block text-xl text-[var(--egeep-charcoal)]">{quote.author}</span>
                    {quote.role && <span className="block text-base text-[var(--v5-muted)]">{quote.role}</span>}
                  </figcaption>
                </figure>
                <Link to={href('best-practices')} className="aegov-link mt-8">
                  {t('exploreBestPractices')}
                  <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section aria-labelledby="v5-home-film" className={`${CONTAINER} ${SECTION}`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <p className="v5-eyebrow mb-3">{t('featuredFilm')}</p>
            <h2 id="v5-home-film" className="text-4xl text-[var(--egeep-gold)] md:text-5xl">
              {t('filmHeading')}
            </h2>
            <div className="v5-hairline mt-8" aria-hidden="true" />
            <p className="mt-8 text-lg text-[var(--egeep-charcoal)]">{t('filmIntro')}</p>
            <Link to={href('media')} className="aegov-link mt-6">
              {t('visitMediaCenter')}
              <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
            </Link>
          </div>
          <Reveal>
            <VideoFacade />
          </Reveal>
        </div>
      </section>

      <ParticipateCta />
    </main>
  )
}
