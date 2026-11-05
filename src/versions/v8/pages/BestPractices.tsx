import { site } from '../../../data/site'
import { useLang, useT, type Bilingual } from '../../../shared/i18n'
import { PROGRAMMES } from '../../../shared/strings'
import { Accordion } from '../components/Accordion'
import { AreaBody } from '../components/AreaBody'
import { ArrowLink, PageHeader, ParticipateCta, SectionHeading } from '../components/Blocks'
import { PartnerFlags } from '../components/Country'
import { fill, useSite } from '../lib/content'
import { useLinks } from '../lib/hooks'
import { TOOL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

/** The flagship practice each area's description introduces, named as the source text names it. */
const PRACTICE_NAMES: Record<string, Bilingual> = {
  'government-services': {
    en: 'Proactive, seven-star government services',
    ar: 'خدمات حكومية استباقية بمعايير السبع نجوم',
  },
  'government-excellence': {
    en: 'A culture of quality and government excellence',
    ar: 'ثقافة الجودة والتميز الحكومي',
  },
  'government-accelerators': {
    en: 'Government Accelerators: results in short periods of time',
    ar: 'المسرعات الحكومية: نتائج في فترات زمنية قصيرة',
  },
  'government-performance': {
    en: 'Government performance framework and National Agenda',
    ar: 'منظومة الأداء الحكومي والأجندة الوطنية',
  },
  'government-innovation': {
    en: 'Mohammed Bin Rashid Centre for Government Innovation',
    ar: 'مركز محمد بن راشد للابتكار الحكومي',
  },
  'competitiveness-and-statistics': {
    en: 'Managing and monitoring global competitiveness reports',
    ar: 'إدارة تقارير التنافسية العالمية ومتابعتها',
  },
  'leadership-and-capacity-building': {
    en: 'Creating change agents within government',
    ar: 'إعداد رواد للتغيير داخل الحكومة',
  },
  'government-human-resources': {
    en: 'International standards in government human resources',
    ar: 'معايير دولية في الموارد البشرية الحكومية',
  },
  programming: { en: 'One Million Arab Coders', ar: 'مبادرة مليون مبرمج عربي' },
  'startup-and-entrepreneurship': {
    en: 'AREA 2071 innovation ecosystem',
    ar: 'منظومة الابتكار في AREA 2071',
  },
}

const BP = {
  title: { en: 'Best practices', ar: 'أفضل الممارسات' },
  lead: {
    en: 'Proven UAE government practices that partner governments can learn from, adapt and build on, drawn from each area of cooperation.',
    ar: 'ممارسات حكومية إماراتية مجرّبة يمكن للحكومات الشريكة التعلم منها وتكييفها والبناء عليها، مستمدة من كل مجال من مجالات التعاون.',
  },
  factPractices: { en: 'Featured practices', ar: 'الممارسات المختارة' },
  factFormats: { en: 'Transfer formats', ar: 'أشكال النقل' },
  secApproach: { en: 'Our approach', ar: 'نهجنا' },
  secPractices: { en: 'Featured practices', ar: 'ممارسات مختارة' },
  secTransfer: { en: 'How practices are transferred', ar: 'كيف تُنقل الممارسات' },
  practicesEyebrow: { en: 'What partners can adopt', ar: 'ما يمكن للشركاء تبنّيه' },
  practicesIntro: {
    en: 'One flagship practice from each area of cooperation. Expand a practice to read how it works in the UAE and which partner countries have taken it up.',
    ar: 'ممارسة رئيسية من كل مجال من مجالات التعاون. افتح أي ممارسة للاطلاع على كيفية تطبيقها في دولة الإمارات والدول الشريكة التي تبنّتها.',
  },
  area: { en: 'Area: {name}', ar: 'المجال: {name}' },
  goTo: { en: 'Go to {name}', ar: 'انتقل إلى {name}' },
  transferEyebrow: { en: 'From the UAE to partner governments', ar: 'من دولة الإمارات إلى الحكومات الشريكة' },
  stagesLink: { en: 'The five partnership stages', ar: 'مراحل الشراكة الخمس' },
} satisfies Record<string, Bilingual>

const LEADERSHIP = PROGRAMMES.find((p) => p.key === 'leadership')!

export default function BestPracticesPage() {
  const lang = useLang()
  const bp = useT(BP)
  const local = useSite()
  const { href, areaHref } = useLinks()
  const intro = local.bestPracticesIntro
  const quote = intro.quote

  return (
    <main id="main" data-page="best-practices" tabIndex={-1}>
      <PageHeader
        page="best-practices"
        title={bp('title')}
        lead={bp('lead')}
        facts={[
          { label: bp('factPractices'), value: String(site.areas.length) },
          { label: bp('factFormats'), value: String(site.about.tools.length) },
        ]}
        sections={[
          { id: 'approach', label: bp('secApproach') },
          { id: 'practices', label: bp('secPractices') },
          { id: 'transfer', label: bp('secTransfer') },
        ]}
      />

      <section id="approach" aria-labelledby="approach-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="v8-tile p-6 md:p-10 lg:col-span-7">
            <p className="v8-eyebrow mb-3">{bp('secApproach')}</p>
            <h2 id="approach-title" className="mb-6 text-4xl md:text-5xl">
              {intro.title}
            </h2>
            <div className="space-y-5 text-lg">
              {intro.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          {quote && (
            <figure className="v8-tile flex flex-col overflow-hidden lg:col-span-5">
              {quote.image && (
                <img
                  src={quote.image}
                  alt={quote.author}
                  width={930}
                  height={580}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col gap-4 border-t-2 border-[var(--egeep-gold)] p-6">
                <blockquote className="aegov-quote">
                  <p className="text-xl leading-snug">{quote.text}</p>
                </blockquote>
                <figcaption className="mt-auto">
                  <span className="block">{quote.author}</span>
                  {quote.role && <span className="v8-muted block text-sm">{quote.role}</span>}
                </figcaption>
              </div>
            </figure>
          )}
        </div>
      </section>

      <section id="practices" aria-labelledby="practices-title" className="scroll-mt-4 border-y border-[var(--v8-line)] bg-[#fff]">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="practices-title"
            eyebrow={bp('practicesEyebrow')}
            title={bp('secPractices')}
            intro={bp('practicesIntro')}
          />
          <div className="v8-tile px-2 md:px-5">
            <Accordion
              defaultOpen={[site.areas[0].slug]}
              items={local.areas.map((area) => ({
                key: area.slug,
                title: (
                  <span className="flex flex-col gap-1 py-1 text-start">
                    <span className="text-2xl leading-snug">{PRACTICE_NAMES[area.slug]?.[lang] ?? area.title}</span>
                    <span className="flex flex-wrap items-center gap-3">
                      <span className="v8-muted text-sm">{fill(bp('area'), { name: area.title })}</span>
                      {area.slug === 'leadership-and-capacity-building' && (
                        <span className="v8-prog-tag" style={{ color: LEADERSHIP.color }}>
                          {LEADERSHIP.name[lang]}
                        </span>
                      )}
                    </span>
                  </span>
                ),
                content: (
                  <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_14rem]">
                    <div className="space-y-6">
                      <AreaBody area={area} />
                      <PartnerFlags area={area} />
                      <ArrowLink to={areaHref(area.slug)}>{fill(bp('goTo'), { name: area.title })}</ArrowLink>
                    </div>
                    {area.logo && (
                      <div className="flex h-28 items-center justify-center rounded-md border border-[var(--v8-line)] bg-[#fff] p-4 max-md:order-first">
                        <img src={area.logo} alt="" className="max-h-full w-auto max-w-full object-contain" loading="lazy" />
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
          eyebrow={bp('transferEyebrow')}
          title={bp('secTransfer')}
          intro={local.about.methodology}
          action={<ArrowLink to={`${href('about')}#how-it-works`}>{bp('stagesLink')}</ArrowLink>}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {local.about.tools.map((tool, i) => {
            const Icon = TOOL_ICONS[site.about.tools[i]]
            return (
              <li key={tool} className="v8-tile v8-lift flex items-center gap-4 p-5">
                {Icon && <Icon aria-hidden="true" className="size-8 shrink-0 text-primary-700" />}
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
