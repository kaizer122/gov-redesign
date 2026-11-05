import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { formatNumber, useLang, useT, type Bilingual } from '../../../shared/i18n'
import { Accordion } from '../components/Accordion'
import { PageHero } from '../components/PageHero'
import { ParticipateCta } from '../components/ParticipateCta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { byName, countryIdsForArea, structureBody, useLinks, useSite } from '../lib/content'
import { TOOL_ICONS } from '../lib/icons'
import { S } from '../lib/strings'
import { CONTAINER, SECTION } from '../lib/ui'

const T = {
  title: { en: 'Best practices', ar: 'أفضل الممارسات' },
  lead: {
    en: 'Proven UAE government practices that partner governments can learn from, adapt and build on, drawn from each area of cooperation.',
    ar: 'ممارسات حكومية إماراتية مجرّبة يمكن للحكومات الشريكة التعلم منها وتكييفها والبناء عليها، مستمدة من كل مجال من مجالات التعاون.',
  },
  approach: { en: 'Our approach', ar: 'نهجنا' },
  practices: { en: 'Featured practices', ar: 'ممارسات مختارة' },
  transfer: { en: 'How practices are transferred', ar: 'كيف تُنقل الممارسات' },
  featured: { en: 'Featured practices', ar: 'ممارسات مختارة' },
  formats: { en: 'Transfer formats', ar: 'صيغ النقل' },
  practicesEyebrow: { en: 'What partners can adopt', ar: 'ما يمكن للشركاء تبنّيه' },
  practicesIntro: {
    en: 'One flagship practice from each area of cooperation. Expand a practice to read how it works in the UAE and which partner countries have taken it up.',
    ar: 'ممارسة رئيسية من كل مجال تعاون. افتح أي ممارسة لتقرأ كيف تُطبَّق في دولة الإمارات وأي الدول الشريكة اعتمدتها.',
  },
  area: { en: 'Area', ar: 'المجال' },
  goTo: { en: 'Go to', ar: 'الانتقال إلى' },
  transferEyebrow: { en: 'From the UAE to partner governments', ar: 'من دولة الإمارات إلى الحكومات الشريكة' },
  stages: { en: 'The five partnership stages', ar: 'مراحل الشراكة الخمس' },
  takenUp: { en: 'Taken up by {n} partner countries', ar: 'اعتمدتها {n} دولة شريكة' },
}

/** The flagship practice each area's description introduces, named as the source text names it. */
const PRACTICE_NAMES: Record<string, Bilingual> = {
  'government-accelerators': { en: 'Government Accelerators: results in short periods of time', ar: 'المسرعات الحكومية: نتائج في فترات زمنية قصيرة' },
  'government-innovation': { en: 'Mohammed Bin Rashid Centre for Government Innovation', ar: 'مركز محمد بن راشد للابتكار الحكومي' },
  programming: { en: 'One Million Arab Coders', ar: 'مبادرة مليون مبرمج عربي' },
  'startup-and-entrepreneurship': { en: 'AREA 2071 innovation ecosystem', ar: 'منظومة الابتكار في AREA 2071' },
  'government-services': { en: 'Proactive, seven-star government services', ar: 'خدمات حكومية استباقية بمعايير السبع نجوم' },
  'government-excellence': { en: 'A culture of quality and government excellence', ar: 'ثقافة الجودة والتميز الحكومي' },
  'government-performance': { en: 'Government performance framework and National Agenda', ar: 'منظومة الأداء الحكومي والأجندة الوطنية' },
  'competitiveness-and-statistics': { en: 'Managing and monitoring global competitiveness reports', ar: 'إدارة تقارير التنافسية العالمية ومتابعتها' },
  'leadership-and-capacity-building': { en: 'Creating change agents within government', ar: 'إعداد قادة للتغيير داخل الحكومة' },
  'government-human-resources': { en: 'International standards in government human resources', ar: 'معايير عالمية في الموارد البشرية الحكومية' },
}

export default function BestPracticesPage() {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const links = useLinks()
  const data = useSite()
  const intro = data.bestPracticesIntro
  const quote = intro.quote
  const sections = [
    { id: 'approach', label: t('approach') },
    { id: 'practices', label: t('practices') },
    { id: 'transfer', label: t('transfer') },
  ]

  return (
    <main id="main" data-page="best-practices" tabIndex={-1}>
      <PageHero
        page="best-practices"
        title={t('title')}
        lead={t('lead')}
        sections={sections}
        sectionsLabel={st('onThisPage')}
        facts={[
          { label: t('featured'), value: formatNumber(data.areas.length, lang) },
          { label: t('formats'), value: formatNumber(data.about.tools.length, lang) },
        ]}
      />

      <section id="approach" aria-labelledby="approach-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <h2 id="approach-title" className="v6-gold-heading mb-8 text-4xl md:text-5xl">
              {intro.title}
            </h2>
            <div className="space-y-6 text-xl">
              {intro.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          {quote && (
            <Reveal as="figure" className="self-start overflow-hidden rounded-3xl bg-[color:var(--egeep-ivory)]">
              {quote.image && (
                <img
                  src={quote.image}
                  alt={`${st('portraitOf')} ${quote.author}`}
                  width={1920}
                  height={1334}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
              )}
              <div className="p-7">
                <blockquote className="aegov-quote px-0! py-0!">
                  <p className="text-2xl leading-snug">{quote.text}</p>
                </blockquote>
                <figcaption className="mt-5 border-s-2 border-primary-600 ps-4">
                  <span className="block text-xl">{quote.author}</span>
                  {quote.role && <span className="v6-muted block text-base">{quote.role}</span>}
                </figcaption>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section id="practices" aria-labelledby="practices-title" className="v6-ivory scroll-mt-4">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading id="practices-title" eyebrow={t('practicesEyebrow')} title={t('practices')} intro={t('practicesIntro')} />
          <div className="rounded-3xl bg-whitely-50 px-5 md:px-8">
            <Accordion
              defaultOpen={[data.areas[0].slug]}
              items={data.areas.map((area, i) => {
                const partners = byName(
                  countryIdsForArea(area.slug).map((cid) => data.countries.find((c) => c.id === cid)!),
                  lang,
                )
                return {
                  key: area.slug,
                  title: (
                    <span className="flex flex-col gap-1 text-start">
                      <span className="text-2xl">{PRACTICE_NAMES[area.slug]?.[lang] ?? area.title}</span>
                      <span className="v6-muted text-base">
                        {t('area')}: {area.title}
                      </span>
                    </span>
                  ),
                  content: (
                    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_14rem]">
                      <div className="space-y-6 text-lg">
                        {structureBody(site.areas[i].body, area.body).map((block) =>
                          block.kind === 'p' ? (
                            <p key={block.text}>{block.text}</p>
                          ) : (
                            <div key={block.intro}>
                              <p className="mb-2">{block.intro}</p>
                              <ul className="list-disc space-y-1 ps-6 marker:text-primary-600">
                                {block.items.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ),
                        )}
                        {partners.length > 0 && (
                          <div>
                            <p className="v6-muted mb-2 text-base">
                              {t('takenUp').replace('{n}', formatNumber(partners.length, lang))}
                            </p>
                            <ul className="flex flex-wrap gap-2">
                              {partners.map((c) => (
                                <li key={c.id}>
                                  <Link to={links.country(c.id)} title={c.name} className="block rounded-sm p-0.5">
                                    <Flag iso={c.iso} alt={c.name} className="h-5 w-7.5 rounded-[2px] object-cover ring-1 ring-aeblack-900/10" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <Link to={links.area(area.slug)} className="aegov-link">
                          {t('goTo')} {area.title}
                          <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
                        </Link>
                      </div>
                      {area.image && (
                        <img
                          src={area.image}
                          alt=""
                          width={930}
                          height={600}
                          loading="lazy"
                          className="aspect-square w-full rounded-2xl object-cover max-md:hidden"
                        />
                      )}
                    </div>
                  ),
                }
              })}
            />
          </div>
        </div>
      </section>

      <section id="transfer" aria-labelledby="transfer-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading
          id="transfer-title"
          eyebrow={t('transferEyebrow')}
          title={t('transfer')}
          intro={data.about.methodology}
          action={
            <Link to={`${links.href('about')}#how-it-works`} className="aegov-link">
              {t('stages')}
              <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
            </Link>
          }
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.about.tools.map((tool, i) => {
            const Icon = TOOL_ICONS[site.about.tools[i]]
            return (
              <li key={tool} className="aegov-card card-bordered flex items-center gap-5 p-6">
                {Icon && <Icon aria-hidden="true" weight="light" className="size-10 shrink-0 text-primary-700" />}
                <span className="text-xl">{tool}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <ParticipateCta />
    </main>
  )
}
