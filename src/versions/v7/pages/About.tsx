import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { getSite, site } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { pageLabel } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { ParticipateCta } from '../components/ParticipateCta'
import { QuoteSplit } from '../components/QuoteSplit'
import { CountUp, PageOpening, Photo } from '../components/Story'
import { Workflow } from '../components/Workflow'
import { COPY, STAT_LABEL } from '../lib/copy'
import { LAUNCH_YEAR } from '../lib/content'
import { TOOL_ICONS } from '../lib/icons'
import { CONTAINER, FLIP } from '../lib/ui'

const CHAPTERS = ['overview', 'slogan', 'methodology', 'tools', 'stages', 'numbers'] as const
type ChapterId = (typeof CHAPTERS)[number]

const CHAPTER_LABEL: Record<ChapterId, keyof typeof COPY> = {
  overview: 'aboutOverview',
  slogan: 'aboutSlogan',
  methodology: 'aboutMethodology',
  tools: 'aboutTools',
  stages: 'aboutStages',
  numbers: 'aboutNumbers',
}

/** Reading progress through the article (0–1) and the chapter currently being read. */
function useReading(article: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState<ChapterId>('overview')
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = article.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      setProgress(total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1)
      const line = window.innerHeight * 0.3
      let active: ChapterId = 'overview'
      for (const id of CHAPTERS) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= line) active = id
      }
      setCurrent(active)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [article])
  return { progress, current }
}

export default function AboutPage() {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const data = getSite(lang)
  const { about } = data
  const article = useRef<HTMLDivElement>(null)
  const { progress, current } = useReading(article)

  return (
    <main id="main" data-page="about" tabIndex={-1}>
      <div aria-hidden="true" className="v7-progress" style={{ transform: `scaleX(${progress})` }} />
      <PageOpening
        page="about"
        eyebrow={UI.programmeName[lang]}
        title={t('aboutTitle')}
        lead={about.intro[0]}
        facts={[
          { label: t('launched'), value: <bdi>{LAUNCH_YEAR}</bdi> },
          { label: UI.partnerCountries[lang], value: <bdi>{formatNumber(site.countries.length, lang)}</bdi> },
          { label: UI.areasOfCooperation[lang], value: <bdi>{formatNumber(site.areas.length, lang)}</bdi> },
          { label: t('partnershipStages'), value: <bdi>{formatNumber(about.workflow.length, lang)}</bdi> },
        ]}
      />

      <div ref={article} className={`${CONTAINER} grid gap-12 py-16 md:py-24 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20 xl:grid-cols-[17rem_minmax(0,1fr)]`}>
        <nav aria-label={t('inThisStory')} className="lg:sticky lg:top-8 lg:self-start">
          <p className="v7-eyebrow mb-4">{t('inThisStory')}</p>
          <ol className="v7-toc border-s border-[var(--v7-hairline-strong)]">
            {CHAPTERS.map((id, i) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={current === id ? 'location' : undefined} className="v7-toc-link">
                  <span aria-hidden="true" className="v7-numeral-sm">
                    {formatNumber(i + 1, 'en', { minimumIntegerDigits: 2 })}
                  </span>
                  {t(CHAPTER_LABEL[id])}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="min-w-0 space-y-24 md:space-y-32">
          <section id="overview" aria-labelledby="overview-title" className="scroll-mt-8">
            <h2 id="overview-title" className="v7-h2 v7-reveal text-[var(--egeep-charcoal)]">
              {t('aboutOverview')}
            </h2>
            <div className="v7-body v7-dropcap mt-8 max-w-3xl space-y-5 text-[var(--egeep-charcoal)]">
              <p>{about.launched}</p>
              <p>{about.intro[1]}</p>
            </div>
            <Photo
              src="/media/media/mohammed-bin-rashid-attends-graduation-of-first-cohorts-of-global-government.jpg"
              alt=""
              width={512}
              height={512}
              className="v7-reveal mt-12 max-w-md"
              imgClassName="aspect-square"
              caption={data.media[0]?.title}
            />
          </section>

          <section id="slogan" aria-labelledby="slogan-title" className="scroll-mt-8">
            <h2 id="slogan-title" className="v7-eyebrow mb-8">
              {t('aboutSlogan')}
            </h2>
            <ol className="space-y-2">
              {about.slogan.map((word, i) => (
                <li key={site.about.slogan[i]} className="v7-reveal flex items-baseline gap-6 border-b border-[var(--v7-hairline)] pb-4">
                  <span aria-hidden="true" className="v7-numeral text-primary-700">
                    {formatNumber(i + 1, 'en', { minimumIntegerDigits: 2 })}
                  </span>
                  <span className="v7-mega-dark">{word}</span>
                </li>
              ))}
            </ol>
          </section>

          <section id="methodology" aria-labelledby="methodology-title" className="scroll-mt-8">
            <h2 id="methodology-title" className="v7-h2 v7-reveal text-[var(--egeep-charcoal)]">
              {t('aboutMethodology')}
            </h2>
            <p className="v7-pull v7-reveal mt-8 max-w-4xl">{about.methodology}</p>
          </section>

          <section id="tools" aria-labelledby="tools-title" className="scroll-mt-8">
            <h2 id="tools-title" className="v7-h2 v7-reveal text-[var(--egeep-charcoal)]">
              {t('aboutTools')}
            </h2>
            <p className="v7-lead mt-6 max-w-3xl text-[var(--v7-muted)]">{t('toolsLead')}</p>
            <ul className="mt-10 grid border-t border-[var(--egeep-gold)] sm:grid-cols-2">
              {about.tools.map((tool, i) => {
                const Icon = TOOL_ICONS[site.about.tools[i]]
                return (
                  <li key={site.about.tools[i]} className="v7-reveal flex items-center gap-5 border-b border-[var(--v7-hairline)] py-6 sm:pe-6">
                    {Icon && <Icon aria-hidden="true" weight="thin" className="size-10 shrink-0 text-primary-700" />}
                    <span className="text-xl text-[var(--egeep-charcoal)]">{tool}</span>
                  </li>
                )
              })}
            </ul>
          </section>

          <section id="stages" aria-labelledby="stages-title" className="scroll-mt-8">
            <h2 id="stages-title" className="v7-h2 v7-reveal mb-12 text-[var(--egeep-charcoal)]">
              {t('aboutStages')}
            </h2>
            <Workflow />
          </section>

          <section id="numbers" aria-labelledby="numbers-title" className="scroll-mt-8">
            <h2 id="numbers-title" className="v7-h2 v7-reveal text-[var(--egeep-charcoal)]">
              {t('aboutNumbers')}
            </h2>
            <ul className="mt-10 grid border-t border-[var(--egeep-gold)] sm:grid-cols-2">
              {data.stats.byNumbers.map((s, i) => (
                <li key={site.stats.byNumbers[i].label} className="v7-reveal border-b border-[var(--v7-hairline)] py-8 sm:pe-8">
                  <CountUp value={s.value} className="v7-figure-light text-primary-800" />
                  <span className="mt-2 block text-xl text-[var(--v7-muted)]">
                    {STAT_LABEL[site.stats.byNumbers[i].label]?.[lang] ?? s.label}
                  </span>
                </li>
              ))}
            </ul>
            <Link to={href('countries')} className="aegov-link v7-link mt-10">
              {pageLabel('countries', lang)}
              <ArrowRight aria-hidden="true" className={`link-icon ${FLIP}`} />
            </Link>
          </section>
        </article>
      </div>

      {data.quotes[1] && <QuoteSplit quote={data.quotes[1]} />}
      <ParticipateCta />
    </main>
  )
}
