import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { getSite, site } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { formatNumber, useLang, useT, type Bilingual } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { AreaBody, PartnerFlags } from '../components/AreaBits'
import { ParticipateCta } from '../components/ParticipateCta'
import { QuoteSplit } from '../components/QuoteSplit'
import { ChapterHeading, ChapterLinks, PageOpening } from '../components/Story'
import { COPY } from '../lib/copy'
import { countriesForArea } from '../lib/content'
import { TOOL_ICONS } from '../lib/icons'
import { CONTAINER, FLIP, SECTION } from '../lib/ui'

/** The flagship practice each area's description introduces, named as the source text names it. */
const PRACTICE_NAMES: Record<string, Bilingual> = {
  'government-services': { en: 'Proactive, seven-star government services', ar: 'خدمات حكومية استباقية بمعايير السبع نجوم' },
  'government-excellence': { en: 'A culture of quality and government excellence', ar: 'ثقافة الجودة والتميز الحكومي' },
  'government-accelerators': { en: 'Government Accelerators: results in short periods of time', ar: 'المسرعات الحكومية: نتائج في فترات زمنية قصيرة' },
  'government-performance': { en: 'Government performance framework and National Agenda', ar: 'منظومة الأداء الحكومي والأجندة الوطنية' },
  'government-innovation': { en: 'Mohammed Bin Rashid Centre for Government Innovation', ar: 'مركز محمد بن راشد للابتكار الحكومي' },
  'competitiveness-and-statistics': { en: 'Managing and monitoring global competitiveness reports', ar: 'إدارة تقارير التنافسية العالمية ومتابعتها' },
  'leadership-and-capacity-building': { en: 'Creating change agents within government', ar: 'إعداد قادة للتغيير داخل الحكومة' },
  'government-human-resources': { en: 'International standards in government human resources', ar: 'المعايير الدولية في الموارد البشرية الحكومية' },
  programming: { en: 'One Million Arab Coders', ar: 'مبادرة مليون مبرمج عربي' },
  'startup-and-entrepreneurship': { en: 'AREA 2071 innovation ecosystem', ar: 'منظومة الابتكار AREA 2071' },
}

export default function BestPracticesPage() {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const data = getSite(lang)
  const intro = data.bestPracticesIntro

  return (
    <main id="main" data-page="best-practices" tabIndex={-1}>
      <PageOpening
        page="best-practices"
        eyebrow={t('caseNotesEyebrow')}
        title={t('bestPracticesTitle')}
        lead={t('bestPracticesLead')}
        facts={[
          { label: t('caseNotes'), value: <bdi>{formatNumber(data.areas.length, lang)}</bdi> },
          { label: t('transferFormats'), value: <bdi>{formatNumber(data.about.tools.length, lang)}</bdi> },
        ]}
      >
        <ChapterLinks
          label={t('onThisPage')}
          items={[
            { id: 'approach', label: intro.title },
            { id: 'cases', label: t('caseNotes') },
            { id: 'transfer', label: t('howTransferred') },
          ]}
        />
      </PageOpening>

      <section id="approach" aria-labelledby="approach-title" className={`${SECTION} scroll-mt-4`}>
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
          <ChapterHeading id="approach-title" numeral="01" eyebrow={t('ourApproach')} title={intro.title} className="mb-0!" />
          <div className="v7-body v7-reveal space-y-5 text-[var(--egeep-charcoal)]">
            {intro.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {intro.quote && <QuoteSplit quote={intro.quote} reverse />}

      <section id="cases" aria-labelledby="cases-title" className={`${SECTION} scroll-mt-4`}>
        <div className={CONTAINER}>
          <ChapterHeading id="cases-title" numeral="02" eyebrow={UI.areasOfCooperation[lang]} title={t('caseNotes')} intro={t('caseNotesLead')} />
          <ol className="border-t border-[var(--egeep-gold)]">
            {data.areas.map((area, i) => {
              const partners = countriesForArea(lang, area.slug).length
              return (
                <li key={area.slug} className="v7-reveal border-b border-[var(--v7-hairline-strong)] py-12 md:py-16">
                  <article aria-labelledby={`case-${area.slug}`} className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
                    <div className="space-y-6">
                      <p className="v7-eyebrow">
                        {t('caseNote')} <bdi>{formatNumber(i + 1, 'en', { minimumIntegerDigits: 2 })}</bdi>
                      </p>
                      <dl className="space-y-4 border-s border-[var(--egeep-gold)] ps-5 text-lg">
                        <div>
                          <dt className="text-base text-[var(--v7-muted)]">{t('area')}</dt>
                          <dd>
                            <Link to={`${href('areas')}#${area.slug}`} className="v7-link-plain underline decoration-[var(--egeep-gold)] underline-offset-4">
                              {area.title}
                            </Link>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-base text-[var(--v7-muted)]">{UI.partnerCountries[lang]}</dt>
                          <dd className="text-[var(--egeep-charcoal)]">
                            <bdi>{formatNumber(partners, lang)}</bdi>
                          </dd>
                        </div>
                      </dl>
                      {area.logo && <img src={area.logo} alt="" width={240} height={80} loading="lazy" className="h-14 w-auto max-w-[13rem] object-contain" />}
                    </div>
                    <div className="space-y-8">
                      <h3 id={`case-${area.slug}`} className="v7-h3 text-[var(--egeep-charcoal)]">
                        {PRACTICE_NAMES[area.slug]?.[lang] ?? area.title}
                      </h3>
                      <AreaBody area={area} className="max-w-3xl text-[var(--egeep-charcoal)]" />
                      <PartnerFlags area={area} />
                    </div>
                  </article>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section id="transfer" aria-labelledby="transfer-title" className={`v7-dark ${SECTION} scroll-mt-4`}>
        <div className={CONTAINER}>
          <ChapterHeading id="transfer-title" numeral="03" dark eyebrow={t('fromUaeToPartners')} title={t('howTransferred')} intro={data.about.methodology} />
          <ul className="grid border-t border-[var(--egeep-gold)] sm:grid-cols-2 lg:grid-cols-3">
            {data.about.tools.map((tool, i) => {
              const Icon = TOOL_ICONS[site.about.tools[i]]
              return (
                <li key={site.about.tools[i]} className="v7-reveal flex items-center gap-5 border-b border-[var(--v7-hairline-dark)] py-7 sm:pe-6">
                  {Icon && <Icon aria-hidden="true" weight="thin" className="size-10 shrink-0 text-primary-300" />}
                  <span className="text-xl text-[var(--egeep-ivory)]">{tool}</span>
                </li>
              )
            })}
          </ul>
          <Link to={`${href('about')}#stages`} className="aegov-link v7-link-dark mt-10">
            {t('aboutTheStages')}
            <ArrowRight aria-hidden="true" className={`link-icon ${FLIP}`} />
          </Link>
        </div>
      </section>

      <ParticipateCta />
    </main>
  )
}
