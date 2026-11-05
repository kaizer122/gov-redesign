import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { formatNumber, useLang, useT, type Bilingual } from '../../../shared/i18n'
import { Accordion } from '../components/Accordion'
import { AreaBody } from '../components/AreaBody'
import { FactList, PageHeader } from '../components/PageHeader'
import { ParticipateCta } from '../components/ParticipateCta'
import { PartnerFlags } from '../components/PartnerFlags'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { ToolList } from '../components/ToolList'
import { useLinks } from '../lib/content'
import { F, T } from '../lib/dict'
import { CONTAINER, SECTION } from '../lib/ui'

/** The flagship practice each area's description introduces, named as the source text names it. */
const PRACTICE_NAMES: Record<string, Bilingual> = {
  'government-accelerators': {
    en: 'Government Accelerators: results in short periods of time',
    ar: 'مسرّعات حكومية: نتائج في فترات زمنية قصيرة',
  },
  'government-innovation': {
    en: 'Mohammed Bin Rashid Centre for Government Innovation',
    ar: 'مركز محمد بن راشد للابتكار الحكومي',
  },
  programming: { en: 'One Million Arab Coders', ar: 'مبادرة مليون مبرمج عربي' },
  'startup-and-entrepreneurship': { en: 'AREA 2071 innovation ecosystem', ar: 'منظومة الابتكار في منطقة 2071' },
  'government-services': {
    en: 'Proactive, seven-star government services',
    ar: 'خدمات حكومية استباقية بمعايير السبع نجوم',
  },
  'government-excellence': {
    en: 'A culture of quality and government excellence',
    ar: 'ثقافة الجودة والتميز الحكومي',
  },
  'government-performance': {
    en: 'Government performance framework and National Agenda',
    ar: 'منظومة الأداء الحكومي والأجندة الوطنية',
  },
  'competitiveness-and-statistics': {
    en: 'Managing and monitoring global competitiveness reports',
    ar: 'إدارة تقارير التنافسية العالمية ومتابعتها',
  },
  'leadership-and-capacity-building': {
    en: 'Creating change agents within government',
    ar: 'إعداد قادة التغيير في العمل الحكومي',
  },
  'government-human-resources': {
    en: 'International standards in government human resources',
    ar: 'المعايير الدولية في الموارد البشرية الحكومية',
  },
}

export default function BestPracticesPage() {
  const lang = useLang()
  const t = useT(T)
  const { href, areaHref } = useLinks()
  const site = getSite(lang)
  const intro = site.bestPracticesIntro
  const quote = intro.quote

  return (
    <main id="main" data-page="best-practices" tabIndex={-1}>
      <PageHeader
        page="best-practices"
        title={t('bestPracticesTitle')}
        lead={t('bestPracticesLead')}
        sections={[
          { id: 'approach', label: t('ourApproach') },
          { id: 'practices', label: t('featuredPractices') },
          { id: 'transfer', label: t('howTransferred') },
        ]}
        aside={
          <FactList
            facts={[
              { label: t('featuredPractices'), value: formatNumber(site.areas.length, lang) },
              { label: t('transferFormats'), value: formatNumber(site.about.tools.length, lang) },
            ]}
          />
        }
      />

      <section id="approach" aria-labelledby="approach-title" className={`${CONTAINER} ${SECTION} scroll-mt-4 pt-4!`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <h2 id="approach-title" className="text-4xl text-[var(--egeep-gold)] md:text-5xl">
              {intro.title}
            </h2>
            <div className="v5-hairline mt-8 mb-8" aria-hidden="true" />
            <div className="space-y-6 text-xl text-[var(--egeep-charcoal)]">
              {intro.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          {quote && (
            <Reveal>
              <figure className="bg-[var(--egeep-ivory)]">
                {quote.image && (
                  <img
                    src={quote.image}
                    alt={F.portraitOf[lang](quote.author)}
                    width={1920}
                    height={1334}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                )}
                <div className="p-8">
                  <blockquote className="aegov-quote border-s-2! ps-5!">
                    <p className="text-xl text-[var(--egeep-charcoal)]">{quote.text}</p>
                  </blockquote>
                  <figcaption className="mt-5 ps-5">
                    <span className="block text-xl text-[var(--egeep-charcoal)]">{quote.author}</span>
                    {quote.role && <span className="block text-base text-[var(--v5-muted)]">{quote.role}</span>}
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          )}
        </div>
      </section>

      <section id="practices" aria-labelledby="practices-title" className="scroll-mt-4 bg-[var(--egeep-ivory)]">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="practices-title"
            eyebrow={t('whatPartnersAdopt')}
            title={t('featuredPractices')}
            intro={t('featuredPracticesIntro')}
          />
          <div className="border-t border-[var(--egeep-gold)] bg-[#fff] px-4 md:px-8">
            <Accordion
              defaultOpen={[site.areas[0].slug]}
              items={site.areas.map((area) => ({
                key: area.slug,
                title: (
                  <span className="flex flex-col gap-1 text-start">
                    <span className="text-2xl text-[var(--egeep-charcoal)]">{PRACTICE_NAMES[area.slug]?.[lang] ?? area.title}</span>
                    <span className="text-base text-[var(--v5-muted)]">{F.areaLabel[lang](area.title)}</span>
                  </span>
                ),
                content: (
                  <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_14rem]">
                    <div className="space-y-6">
                      <AreaBody area={area} />
                      <PartnerFlags slug={area.slug} />
                      <Link to={areaHref(area.slug)} className="aegov-link">
                        {F.goTo[lang](area.title)}
                        <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
                      </Link>
                    </div>
                    {area.logo && (
                      <div className="flex h-28 items-center justify-center border border-[var(--egeep-grey-light)] bg-[#fff] p-4 max-md:order-first">
                        <img src={area.logo} alt="" loading="lazy" className="max-h-full w-auto max-w-full object-contain" />
                      </div>
                    )}
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      <section id="transfer" aria-labelledby="transfer-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading
          id="transfer-title"
          eyebrow={t('fromUaeToPartners')}
          title={t('howTransferred')}
          intro={site.about.methodology}
          action={
            <Link to={`${href('about')}#how-it-works`} className="aegov-link">
              {t('fiveStagesLink')}
              <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
            </Link>
          }
        />
        <ToolList tools={site.about.tools} />
      </section>

      <ParticipateCta />
    </main>
  )
}
