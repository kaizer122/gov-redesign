import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { getSite, site } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { AreaIndex } from '../components/AreaIndex'
import { ExternalLink } from '../components/ExternalLink'
import { AmbientFilm, FeaturedFilm } from '../components/Films'
import { ParticipateCta } from '../components/ParticipateCta'
import { QuoteSplit } from '../components/QuoteSplit'
import { ChapterHeading, CountUp, Eyebrow, Photo } from '../components/Story'
import { Workflow } from '../components/Workflow'
import { YearsTimeline } from '../components/YearsTimeline'
import { COPY, STAT_LABEL } from '../lib/copy'
import { FIRST_YEAR, LATEST_YEAR, LAUNCH_YEAR, REGISTER_URL } from '../lib/content'
import { CONTAINER, FLIP, SECTION } from '../lib/ui'

const CHAPTERS = [
  { id: 'communication', word: UI.communication },
  { id: 'exchange', word: UI.exchange },
  { id: 'development', word: UI.development },
] as const

export default function HomePage() {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const data = getSite(lang)
  const [zayed, mbr, mbz] = data.quotes

  return (
    <main id="main" data-page="home" tabIndex={-1}>
      {/* Opening film */}
      <section aria-labelledby="v7-home-title" className="v7-film relative isolate flex min-h-[min(52rem,calc(100svh-5rem))] flex-col overflow-hidden">
        <AmbientFilm className="-z-20" />
        <div aria-hidden="true" className="v7-film-shade absolute inset-0 -z-10" />
        <div className={`${CONTAINER} flex flex-1 flex-col justify-end pt-24 pb-24 md:pb-28`}>
          <div className="max-w-5xl">
            <h1 id="v7-home-title" className="text-[var(--egeep-ivory)]">
              <span className="v7-eyebrow v7-eyebrow-dark mb-6 flex items-center gap-4">
                <span aria-hidden="true" className="v7-rule w-12" />
                {UI.programmeName[lang]}
              </span>
              <span className="v7-mega block">
                {CHAPTERS.map((c, i) => (
                  <span key={c.id} className="v7-mega-line block" style={{ animationDelay: `${i * 180}ms` }}>
                    {c.word[lang]}.
                  </span>
                ))}
              </span>
            </h1>
            <p className="v7-lead mt-8 max-w-2xl text-[var(--egeep-ivory)]">{data.meta.description}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#communication" className="aegov-btn v7-btn-ivory">
                {t('beginStory')}
                <ArrowDown aria-hidden="true" className="size-5" />
              </a>
              <ExternalLink href={REGISTER_URL} className="aegov-btn btn-outline v7-btn-ghost">
                {data.hero.cta.label}
                <ArrowUpRight aria-hidden="true" className={`size-5 ${FLIP}`} />
              </ExternalLink>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter index */}
      <nav aria-label={t('chapters')} className="v7-dark border-t border-[var(--egeep-gold)]">
        <ol className={`${CONTAINER} grid grid-cols-3`}>
          {CHAPTERS.map((c, i) => (
            <li key={c.id} className="border-e border-[var(--v7-hairline-dark)] first:border-s">
              <a href={`#${c.id}`} className="v7-chapter-tab">
                <span className="v7-numeral-sm text-primary-300">{formatNumber(i + 1, 'en', { minimumIntegerDigits: 2 })}</span>
                <span>{c.word[lang]}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Chapter 1: Communication, the origins */}
      <section id="communication" aria-labelledby="v7-ch1" className={`${SECTION} scroll-mt-4`}>
        <div className={CONTAINER}>
          <ChapterHeading
            id="v7-ch1"
            numeral="01"
            eyebrow={t('chapterOrigins')}
            title={UI.communication[lang]}
            intro={data.about.launched}
          />
          <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            <div className="v7-reveal space-y-6">
              <dl className="grid grid-cols-2 gap-6 border-y border-[var(--egeep-gold)] py-6">
                <div className="flex flex-col-reverse gap-1">
                  <dt className="text-base text-[var(--v7-muted)]">{t('launched')}</dt>
                  <dd className="v7-figure-md text-primary-800">
                    <bdi>{LAUNCH_YEAR}</bdi>
                  </dd>
                </div>
                <div className="flex flex-col-reverse gap-1">
                  <dt className="text-base text-[var(--v7-muted)]">{UI.partnerCountries[lang]}</dt>
                  <dd className="v7-figure-md text-primary-800">
                    <bdi>{formatNumber(site.countries.length, lang)}</bdi>
                  </dd>
                </div>
              </dl>
              <p className="text-lg text-[var(--v7-muted)]">{UI.parentEntity[lang]}</p>
            </div>
            <div className="v7-body v7-reveal space-y-5 text-[var(--egeep-charcoal)]">
              {data.about.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>{data.about.methodology}</p>
              <Link to={href('about')} className="aegov-link v7-link">
                {t('readTheStory')}
                <ArrowRight aria-hidden="true" className={`link-icon ${FLIP}`} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {zayed && <QuoteSplit quote={zayed} />}

      {/* Chapter 2: Exchange, the areas of cooperation */}
      <section id="exchange" aria-labelledby="v7-ch2" className={`${SECTION} scroll-mt-4`}>
        <div className={CONTAINER}>
          <ChapterHeading
            id="v7-ch2"
            numeral="02"
            eyebrow={UI.areasOfCooperation[lang]}
            title={UI.exchange[lang]}
            intro={t('exchangeLead')}
          />
          <AreaIndex />
          <div className="mt-24 md:mt-32">
            <div className="v7-reveal mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow className="mb-4">{t('howPartnershipsWork')}</Eyebrow>
                <h3 className="v7-h3 max-w-3xl text-[var(--egeep-charcoal)]">{t('fiveStages')}</h3>
              </div>
              <Link to={`${href('about')}#stages`} className="aegov-link v7-link">
                {t('aboutTheStages')}
                <ArrowRight aria-hidden="true" className={`link-icon ${FLIP}`} />
              </Link>
            </div>
            <Workflow />
          </div>
        </div>
      </section>

      {/* Chapter 3: Development, the impact */}
      <section id="development" aria-labelledby="v7-ch3" className={`v7-dark relative overflow-hidden ${SECTION} scroll-mt-4`}>
        <div aria-hidden="true" className="v7-impact-pattern" />
        <div className={`${CONTAINER} relative`}>
          <ChapterHeading
            id="v7-ch3"
            numeral="03"
            eyebrow={t('chapterImpact')}
            title={UI.development[lang]}
            intro={t('developmentLead')}
            dark
          />
          <ul className="v7-figures grid grid-cols-2 lg:grid-cols-3">
            {data.stats.headline.map((s, i) => (
              <li key={site.stats.headline[i].label} className="v7-reveal v7-figure-cell">
                <CountUp value={s.value} className="v7-figure" />
                <span className="mt-3 block text-xl text-[var(--v7-on-dark-muted)]">{STAT_LABEL[site.stats.headline[i].label]?.[lang] ?? s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Years of partnership */}
      <section aria-labelledby="v7-years" className={`${SECTION} overflow-hidden`}>
        <div className={CONTAINER}>
          <ChapterHeading
            id="v7-years"
            eyebrow={
              <bdi dir="ltr">
                {FIRST_YEAR}–{LATEST_YEAR}
              </bdi>
            }
            title={t('yearsOfPartnership')}
            intro={t('yearsLead')}
          />
          <YearsTimeline />
          <div className="mt-10">
            <Link to={href('countries')} className="aegov-link v7-link">
              {t('openAtlas')}
              <ArrowRight aria-hidden="true" className={`link-icon ${FLIP}`} />
            </Link>
          </div>
        </div>
      </section>

      {mbr && <QuoteSplit quote={mbr} reverse />}
      {mbz && <QuoteSplit quote={mbz} light />}

      {/* Featured film */}
      <section aria-labelledby="v7-film-title" className={`v7-dark ${SECTION}`}>
        <div className={CONTAINER}>
          <ChapterHeading id="v7-film-title" eyebrow={t('onFilm')} title={t('filmTitle')} intro={t('filmLead')} dark />
          <div className="v7-reveal">
            <FeaturedFilm headingId="v7-film-title" />
          </div>
        </div>
      </section>

      {/* Media pointer */}
      {data.media[0]?.image && (
        <section aria-labelledby="v7-latest" className={SECTION}>
          <div className={`${CONTAINER} grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
            <Photo
              src={data.media[0].image}
              alt=""
              width={512}
              height={512}
              className="v7-reveal"
              imgClassName="aspect-square"
            />
            <div className="v7-reveal">
              <Eyebrow className="mb-4">{t('fromMediaCentre')}</Eyebrow>
              <h2 id="v7-latest" className="v7-h3 text-[var(--egeep-charcoal)]">
                {data.media[0].title}
              </h2>
              <Link to={href('media')} className="aegov-link v7-link mt-8">
                {t('visitMediaCentre')}
                <ArrowRight aria-hidden="true" className={`link-icon ${FLIP}`} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <ParticipateCta />
    </main>
  )
}
