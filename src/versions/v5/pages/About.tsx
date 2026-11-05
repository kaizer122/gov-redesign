import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { PROGRAMMES, UI } from '../../../shared/strings'
import { FactList, PageHeader } from '../components/PageHeader'
import { ParticipateCta } from '../components/ParticipateCta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { StatsBand } from '../components/StatsBand'
import { Workflow } from '../components/Workflow'
import { LAUNCH_YEAR, statsFor, useLinks } from '../lib/content'
import { F, T } from '../lib/dict'
import { ToolList } from '../components/ToolList'
import { CONTAINER, SECTION } from '../lib/ui'

export default function AboutPage() {
  const lang = useLang()
  const t = useT(T)
  const { href } = useLinks()
  const site = getSite(lang)
  const { about } = site
  const leader = site.quotes[1]

  return (
    <main id="main" data-page="about" tabIndex={-1}>
      <PageHeader
        page="about"
        title={t('aboutTitle')}
        lead={about.intro[0]}
        sections={[
          { id: 'overview', label: t('overview') },
          { id: 'methodology', label: t('methodology') },
          { id: 'tools', label: t('toolsTitle') },
          { id: 'how-it-works', label: t('howPartnershipsWork') },
          { id: 'by-the-numbers', label: t('byTheNumbers') },
        ]}
        aside={
          <FactList
            facts={[
              { label: t('launched'), value: LAUNCH_YEAR ?? '' },
              { label: t('participatingCountries'), value: formatNumber(site.countries.length, lang) },
              { label: UI.areasOfCooperation[lang], value: formatNumber(site.areas.length, lang) },
              { label: t('partnershipStages'), value: formatNumber(about.workflow.length, lang) },
            ]}
          />
        }
      />

      <section id="overview" aria-labelledby="overview-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <h2 id="overview-title" className="text-4xl text-[var(--egeep-gold)] md:text-5xl">
              {t('overview')}
            </h2>
            <div className="v5-hairline mt-8 mb-8" aria-hidden="true" />
            <div className="space-y-6 text-xl text-[var(--egeep-charcoal)]">
              <p>{about.launched}</p>
              <p>{about.intro[1]}</p>
            </div>
          </div>
          <Reveal className="min-w-0 bg-[var(--egeep-ivory)] p-6 md:p-10">
            <h3 className="v5-eyebrow mb-6">{t('sloganHeading')}</h3>
            <ol className="space-y-5">
              {about.slogan.map((word, i) => (
                <li key={word} className="flex items-baseline gap-5 border-t border-[var(--egeep-gold)] pt-4">
                  <span className="text-lg text-[var(--v5-muted)] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 text-4xl text-[var(--egeep-gold)] sm:text-5xl">{word}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="programmes-title" className={`${CONTAINER} pb-16 md:pb-20 xl:pb-28`}>
        <SectionHeading id="programmes-title" eyebrow={UI.programmeShort[lang]} title={t('programmesTitle')} intro={t('programmesIntro')} />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMMES.map((p) => (
            <li key={p.key} className="border-t-4 bg-[#fff] pt-5" style={{ borderColor: p.color }}>
              <span className="block text-2xl text-[var(--egeep-charcoal)]">{p.name[lang]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="methodology" aria-labelledby="methodology-title" className="scroll-mt-4 bg-[var(--egeep-ivory)]">
        <div className={`${CONTAINER} ${SECTION} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
          <div>
            <h2 id="methodology-title" className="text-4xl text-[var(--egeep-gold)] md:text-5xl">
              {t('methodology')}
            </h2>
            <div className="v5-hairline mt-8 mb-8" aria-hidden="true" />
            <p className="text-xl text-[var(--egeep-charcoal)]">{about.methodology}</p>
          </div>
          {leader && (
            <Reveal className="self-center">
              <figure>
                <blockquote className="aegov-quote border-s-2! ps-6!">
                  <p className="text-2xl leading-[1.5] text-[var(--egeep-charcoal)] rtl:leading-[1.75]">{leader.text}</p>
                </blockquote>
                <figcaption className="mt-5 ps-6">
                  <span className="block text-xl text-[var(--egeep-charcoal)]">{leader.author}</span>
                  {leader.role && <span className="block text-base text-[var(--v5-muted)]">{leader.role}</span>}
                </figcaption>
              </figure>
            </Reveal>
          )}
        </div>
      </section>

      <section id="tools" aria-labelledby="tools-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading
          id="tools-title"
          eyebrow={t('howKnowledgeTransfers')}
          title={t('toolsTitle')}
          intro={F.toolsIntro[lang](about.tools.length)}
        />
        <ToolList tools={about.tools} />
      </section>

      <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-4 bg-[var(--egeep-ivory)]">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="how-title"
            eyebrow={t('partnershipLifecycle')}
            title={t('howPartnershipsWork')}
            intro={t('howPartnershipsIntro')}
            action={
              <Link to={href('activities')} className="aegov-link">
                {t('seePartnershipActivity')}
                <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
              </Link>
            }
          />
          <Reveal>
            <Workflow />
          </Reveal>
        </div>
      </section>

      <div id="by-the-numbers" className="scroll-mt-4 bg-[#fff] pt-16 md:pt-20">
        <StatsBand id="numbers-title" title={t('byTheNumbersTitle')} stats={statsFor('byNumbers', lang)} />
      </div>

      <ParticipateCta />
    </main>
  )
}
