import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { ImpactBursts } from '../components/ImpactBursts'
import { PageHero } from '../components/PageHero'
import { ParticipateCta } from '../components/ParticipateCta'
import { Reveal } from '../components/Reveal'
import { Rings } from '../components/Rings'
import { SectionHeading } from '../components/SectionHeading'
import { LAUNCH_YEAR, useLinks, useSite } from '../lib/content'
import { TOOL_ICONS } from '../lib/icons'
import { S } from '../lib/strings'
import { CONTAINER, SECTION } from '../lib/ui'

const T = {
  title: { en: 'About the programme', ar: 'عن البرنامج' },
  overview: { en: 'Overview', ar: 'نظرة عامة' },
  methodology: { en: 'Methodology', ar: 'المنهجية' },
  tools: { en: 'Knowledge-transfer tools', ar: 'أدوات نقل المعرفة' },
  how: { en: 'How partnerships work', ar: 'كيف تعمل الشراكات' },
  numbers: { en: 'By the numbers', ar: 'بالأرقام' },
  launched: { en: 'Launched', ar: 'سنة الإطلاق' },
  stages: { en: 'Partnership stages', ar: 'مراحل الشراكة' },
  slogan: { en: 'The programme in three words', ar: 'البرنامج في ثلاث كلمات' },
  toolsEyebrow: { en: 'How knowledge is transferred', ar: 'كيف تنتقل المعرفة' },
  toolsIntro: {
    en: 'The programme shares UAE experience through {n} formats, from hands-on workshops and field visits to published white papers.',
    ar: 'يشارك البرنامج تجربة دولة الإمارات عبر {n} صيغ، من ورش العمل التطبيقية والزيارات الميدانية إلى الأوراق البيضاء المنشورة.',
  },
  howEyebrow: { en: 'Partnership lifecycle', ar: 'دورة حياة الشراكة' },
  howIntro: {
    en: 'Every partnership between the UAE Government and a participating country follows the same five stages. Each stage overlaps the next: the circles meet where teams hand over.',
    ar: 'تمر كل شراكة بين حكومة دولة الإمارات ودولة مشاركة بالمراحل الخمس نفسها. وتتداخل كل مرحلة مع التي تليها، فتلتقي الدوائر حيث تتسلم الفرق المهام.',
  },
  activity: { en: 'See partnership activity', ar: 'عرض أنشطة الشراكات' },
  numbersEyebrow: { en: 'Unified impact', ar: 'الأثر الموحّد' },
  numbersTitle: { en: 'The programme by the numbers', ar: 'البرنامج بالأرقام' },
}

export default function AboutPage() {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const links = useLinks()
  const data = useSite()
  const { about } = data
  const leader = data.quotes[1]
  const sections = [
    { id: 'overview', label: t('overview') },
    { id: 'methodology', label: t('methodology') },
    { id: 'tools', label: t('tools') },
    { id: 'how-it-works', label: t('how') },
    { id: 'by-the-numbers', label: t('numbers') },
  ]

  return (
    <main id="main" data-page="about" tabIndex={-1}>
      <PageHero
        page="about"
        eyebrow={UI.programmeName[lang]}
        title={t('title')}
        lead={about.intro[0]}
        sections={sections}
        sectionsLabel={st('onThisPage')}
        facts={[
          { label: t('launched'), value: LAUNCH_YEAR },
          { label: UI.partnerCountries[lang], value: formatNumber(data.countries.length, lang) },
          { label: UI.areasOfCooperation[lang], value: formatNumber(data.areas.length, lang) },
          { label: t('stages'), value: formatNumber(about.workflow.length, lang) },
        ]}
      />

      <section id="overview" aria-labelledby="overview-title" className={`${CONTAINER} ${SECTION} scroll-mt-32`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-center">
          <Reveal>
            <h2 id="overview-title" className="v6-gold-heading mb-8 text-4xl md:text-5xl">
              {t('overview')}
            </h2>
            <div className="space-y-6 text-xl">
              <p>{about.launched}</p>
              <p>{about.intro[1]}</p>
              <p className="v6-muted">
                {UI.officeName[lang]}. {UI.parentEntity[lang]}.
              </p>
            </div>
          </Reveal>
          <div>
            <h3 className="v6-eyebrow mb-8">{t('slogan')}</h3>
            <Rings items={about.slogan} row />
          </div>
        </div>
      </section>

      <section id="methodology" aria-labelledby="methodology-title" className="v6-dark scroll-mt-32">
        <div className={`${CONTAINER} ${SECTION} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
          <div>
            <h2 id="methodology-title" className="v6-gold-heading mb-8 text-4xl md:text-5xl">
              {t('methodology')}
            </h2>
            <p className="text-2xl leading-relaxed">{about.methodology}</p>
          </div>
          {leader && (
            <figure className="self-center border-s border-primary-400/50 ps-8">
              <blockquote className="aegov-quote px-0! py-0! text-[color:var(--egeep-ivory)]!">
                <p className="text-3xl leading-snug">{leader.text}</p>
              </blockquote>
              <figcaption className="mt-6">
                <span className="block text-xl">{leader.author}</span>
                {leader.role && <span className="v6-muted block text-base">{leader.role}</span>}
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <section id="tools" aria-labelledby="tools-title" className={`${CONTAINER} ${SECTION} scroll-mt-32`}>
        <SectionHeading
          id="tools-title"
          eyebrow={t('toolsEyebrow')}
          title={t('tools')}
          intro={t('toolsIntro').replace('{n}', formatNumber(about.tools.length, lang))}
        />
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-[color:var(--egeep-grey-light)] bg-[color:var(--egeep-grey-light)] sm:grid-cols-2 lg:grid-cols-3">
          {about.tools.map((tool, i) => {
            const Icon = TOOL_ICONS[site.about.tools[i]]
            return (
              <li key={tool} className="flex items-center gap-5 bg-whitely-50 p-7">
                {Icon && (
                  <span className="grid size-14 shrink-0 place-items-center rounded-full border border-primary-600/50 text-primary-700">
                    <Icon aria-hidden="true" weight="light" className="size-7" />
                  </span>
                )}
                <span className="text-xl">{tool}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="how-it-works" aria-labelledby="how-title" className="v6-ivory scroll-mt-32">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="how-title"
            eyebrow={t('howEyebrow')}
            title={t('how')}
            intro={t('howIntro')}
            action={
              <Link to={links.href('activities')} className="aegov-link">
                {t('activity')}
                <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
              </Link>
            }
          />
          <Rings items={about.workflow} caption={st('stage')} />
        </div>
      </section>

      <section id="by-the-numbers" aria-labelledby="numbers-title" className="v6-dark scroll-mt-32">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading id="numbers-title" eyebrow={t('numbersEyebrow')} title={t('numbersTitle')} />
          <ImpactBursts group="byNumbers" />
        </div>
      </section>

      <ParticipateCta />
    </main>
  )
}
