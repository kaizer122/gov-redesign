import { site } from '../../../data/site'
import { PATTERNS } from '../../../shared/brand'
import { useLang, useT, type Bilingual } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { ArrowLink, PageHeader, ParticipateCta, SectionHeading, Workflow } from '../components/Blocks'
import { CountUp } from '../components/CountUp'
import { LAUNCH_YEAR, fill, useSite } from '../lib/content'
import { useLinks } from '../lib/hooks'
import { TOOL_ICONS } from '../lib/icons'
import { STAT_LABEL } from '../lib/t'
import { CONTAINER, SECTION } from '../lib/ui'

const AB = {
  title: { en: 'About the programme', ar: 'عن البرنامج' },
  launched: { en: 'Launched', ar: 'سنة الإطلاق' },
  countries: { en: 'Participating countries', ar: 'الدول المشاركة' },
  areas: { en: 'Areas of cooperation', ar: 'مجالات التعاون' },
  stages: { en: 'Partnership stages', ar: 'مراحل الشراكة' },
  secOverview: { en: 'Overview', ar: 'نظرة عامة' },
  secMethod: { en: 'Methodology', ar: 'المنهجية' },
  secTools: { en: 'Knowledge-transfer tools', ar: 'أدوات نقل المعرفة' },
  secHow: { en: 'How partnerships work', ar: 'آلية عمل الشراكات' },
  secNumbers: { en: 'By the numbers', ar: 'بالأرقام' },
  inThreeWords: { en: 'The programme in three words', ar: 'البرنامج في ثلاث كلمات' },
  toolsEyebrow: { en: 'How knowledge is transferred', ar: 'كيف تُنقل المعرفة' },
  toolsIntro: {
    en: 'The programme shares UAE experience through {n} formats, from hands-on workshops and field visits to published white papers.',
    ar: 'يشارك البرنامج تجربة دولة الإمارات عبر {n} أشكال، من ورش العمل التطبيقية والزيارات الميدانية إلى الأوراق البيضاء المنشورة.',
  },
  howEyebrow: { en: 'Partnership lifecycle', ar: 'دورة الشراكة' },
  howIntro: {
    en: 'Every partnership between the UAE Government and a participating country follows the same five stages.',
    ar: 'تمر كل شراكة بين حكومة دولة الإمارات ودولة مشاركة بالمراحل الخمس نفسها.',
  },
  howLink: { en: 'See partnership activity', ar: 'اطّلع على أنشطة الشراكات' },
  numbersEyebrow: { en: 'Programme totals', ar: 'إجماليات البرنامج' },
  numbersTitle: { en: 'The programme by the numbers', ar: 'البرنامج بالأرقام' },
} satisfies Record<string, Bilingual>

export default function AboutPage() {
  const lang = useLang()
  const ab = useT(AB)
  const local = useSite()
  const { href } = useLinks()
  const { about } = local
  const leader = local.quotes[1]

  return (
    <main id="main" data-page="about" tabIndex={-1}>
      <PageHeader
        page="about"
        title={ab('title')}
        lead={about.intro[0]}
        facts={[
          { label: ab('launched'), value: LAUNCH_YEAR },
          { label: ab('countries'), value: String(site.countries.length) },
          { label: ab('areas'), value: String(site.areas.length) },
          { label: ab('stages'), value: String(about.workflow.length) },
        ]}
        sections={[
          { id: 'overview', label: ab('secOverview') },
          { id: 'methodology', label: ab('secMethod') },
          { id: 'tools', label: ab('secTools') },
          { id: 'how-it-works', label: ab('secHow') },
          { id: 'by-the-numbers', label: ab('secNumbers') },
        ]}
      />

      <section id="overview" aria-labelledby="overview-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="v8-tile p-6 md:p-10 lg:col-span-7">
            <p className="v8-eyebrow mb-3">{UI.programmeName[lang]}</p>
            <h2 id="overview-title" className="mb-6 text-4xl md:text-5xl">
              {ab('secOverview')}
            </h2>
            <div className="space-y-5 text-lg">
              <p>{about.launched}</p>
              <p>{about.intro[1]}</p>
            </div>
          </div>
          <div className="v8-tile relative overflow-hidden p-6 md:p-10 lg:col-span-5">
            <div
              aria-hidden="true"
              className="v8-pattern -end-20 -bottom-20 size-80"
              style={{ backgroundImage: `url(${PATTERNS.unifiedImpact})` }}
            />
            <h3 className="v8-muted relative mb-6 text-lg">{ab('inThreeWords')}</h3>
            <ol className="relative divide-y divide-[var(--v8-line)]">
              {about.slogan.map((word, i) => (
                <li key={word} className="flex items-baseline gap-5 py-4">
                  <span className="v8-muted w-8 text-lg tabular-nums">0{i + 1}</span>
                  <span className="v8-gold-title text-5xl">{word}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="methodology" aria-labelledby="methodology-title" className="scroll-mt-4 border-y border-[var(--v8-line)] bg-[#fff]">
        <div className={`${CONTAINER} ${SECTION} grid gap-10 lg:grid-cols-2 lg:gap-16`}>
          <div>
            <h2 id="methodology-title" className="mb-6 text-4xl md:text-5xl">
              {ab('secMethod')}
            </h2>
            <p className="text-lg">{about.methodology}</p>
          </div>
          {leader && (
            <figure className="flex gap-5 self-center border-s-2 border-[var(--egeep-gold)] ps-6">
              {leader.image && (
                <img
                  src={leader.image}
                  alt={leader.author}
                  width={240}
                  height={300}
                  loading="lazy"
                  className="hidden h-36 w-28 shrink-0 self-start rounded-md object-cover object-top sm:block"
                />
              )}
              <div>
                <blockquote className="aegov-quote">
                  <p className="text-2xl leading-snug">{leader.text}</p>
                </blockquote>
                <figcaption className="mt-4">
                  <span className="block">{leader.author}</span>
                  {leader.role && <span className="v8-muted block text-sm">{leader.role}</span>}
                </figcaption>
              </div>
            </figure>
          )}
        </div>
      </section>

      <section id="tools" aria-labelledby="tools-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading
          id="tools-title"
          eyebrow={ab('toolsEyebrow')}
          title={ab('secTools')}
          intro={fill(ab('toolsIntro'), { n: about.tools.length })}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {about.tools.map((tool, i) => {
            const Icon = TOOL_ICONS[site.about.tools[i]]
            return (
              <li key={tool} className="v8-tile v8-lift flex items-center gap-4 p-5">
                {Icon && (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-primary-200 bg-primary-50 text-primary-700">
                    <Icon aria-hidden="true" className="size-7" />
                  </span>
                )}
                <span className="text-xl">{tool}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-4 border-t border-[var(--v8-line)] bg-[#fff]">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="how-title"
            eyebrow={ab('howEyebrow')}
            title={ab('secHow')}
            intro={ab('howIntro')}
            action={<ArrowLink to={href('activities')}>{ab('howLink')}</ArrowLink>}
          />
          <Workflow />
        </div>
      </section>

      <section id="by-the-numbers" aria-labelledby="numbers-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading id="numbers-title" eyebrow={ab('numbersEyebrow')} title={ab('numbersTitle')} />
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--v8-radius)] border border-[var(--v8-line)] bg-[var(--v8-line)] lg:grid-cols-4">
          {local.stats.byNumbers.map((s, i) => (
            <div key={i} className="flex flex-col-reverse justify-end gap-2 bg-[#fff] p-5 md:p-7">
              <dt className="v8-muted">{STAT_LABEL[site.stats.byNumbers[i].label]?.[lang] ?? s.label}</dt>
              <dd className="v8-gold-title text-4xl leading-none break-words md:text-6xl">
                <CountUp value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <ParticipateCta />
    </main>
  )
}
