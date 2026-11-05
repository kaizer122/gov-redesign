import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { AmbientFilm } from '../components/AmbientFilm'
import { AreaCarousel } from '../components/AreaCarousel'
import { ExternalLink } from '../components/ExternalLink'
import { FeaturedFilm } from '../components/FeaturedFilm'
import { Globe } from '../components/Globe'
import { ImpactBursts } from '../components/ImpactBursts'
import { LeadershipQuotes } from '../components/LeadershipQuotes'
import { ParticipateCta } from '../components/ParticipateCta'
import { PartnershipTimeline } from '../components/PartnershipTimeline'
import { Reveal } from '../components/Reveal'
import { Rings } from '../components/Rings'
import { SectionHeading } from '../components/SectionHeading'
import { ACTIVE_PARTNERSHIPS, LAUNCH_YEAR, REGISTER_URL, useLinks, useSite } from '../lib/content'
import { S } from '../lib/strings'
import { CONTAINER, SECTION } from '../lib/ui'

const T = {
  title: {
    en: 'UAE government experience, shared with {n} partner governments',
    ar: 'تجربة حكومة الإمارات، نتشاركها مع {n} حكومة شريكة',
  },
  exploreCountries: { en: 'Explore the partner countries', ar: 'استكشف الدول الشريكة' },
  globeLabel: { en: 'Partner countries on the globe', ar: 'الدول الشريكة على الكرة الأرضية' },
  since: { en: 'Programme launched', ar: 'إطلاق البرنامج' },
  active: { en: 'Active partnerships', ar: 'شراكة سارية' },
  partners: { en: 'Partner countries', ar: 'دولة شريكة' },
  impactEyebrow: { en: 'Unified impact', ar: 'الأثر الموحّد' },
  impactTitle: { en: 'The programme at a glance', ar: 'البرنامج في أرقام' },
  impactIntro: { en: 'Figures published by the programme since its launch in {y}.', ar: 'أرقام نشرها البرنامج منذ إطلاقه في عام {y}.' },
  timelineEyebrow: { en: 'Partnerships over time', ar: 'الشراكات عبر السنوات' },
  timelineTitle: { en: 'How the network grew', ar: 'كيف نمت شبكة الشراكات' },
  timelineIntro: {
    en: 'Move through the years to see each partnership light up in the year it was signed. Filter by region to focus the map.',
    ar: 'تنقّل بين السنوات لترى كل شراكة تضيء في عام توقيعها، واختر منطقة لتركيز الخريطة عليها.',
  },
  areasEyebrow: { en: 'What we share', ar: 'ما نتشاركه' },
  areasIntro: {
    en: '{n} fields in which the UAE Government transfers its experience, tools and practices to partner governments.',
    ar: '{n} مجالات تنقل فيها حكومة الإمارات خبراتها وأدواتها وممارساتها إلى الحكومات الشريكة.',
  },
  allAreas: { en: 'All areas of cooperation', ar: 'جميع مجالات التعاون' },
  quotesEyebrow: { en: 'Leadership', ar: 'القيادة' },
  quotesTitle: { en: 'In the words of the UAE leadership', ar: 'بكلمات قيادة دولة الإمارات' },
  howEyebrow: { en: 'How it works', ar: 'آلية العمل' },
  howTitle: { en: 'From agreement to results in five stages', ar: 'من الاتفاق إلى النتائج في خمس مراحل' },
  methodology: { en: 'Programme methodology', ar: 'منهجية البرنامج' },
  filmEyebrow: { en: 'Featured film', ar: 'فيلم مختار' },
  filmTitle: { en: 'Government experience on the world stage', ar: 'التجربة الحكومية على المنصة العالمية' },
}

export default function HomePage() {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const links = useLinks()
  const data = useSite()
  const ids = data.countries.map((c) => c.id)
  const n = formatNumber(data.countries.length, lang)

  return (
    <main id="main" data-page="home" tabIndex={-1}>
      <section aria-labelledby="v6-home-title" className="v6-dark relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,#2b2822_0%,var(--egeep-charcoal)_60%)] rtl:bg-[radial-gradient(ellipse_at_30%_40%,#2b2822_0%,var(--egeep-charcoal)_60%)]"
        />
        <div className={`${CONTAINER} grid items-center gap-8 pt-12 pb-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6 lg:pt-16 lg:pb-20`}>
          <div className="relative z-10">
            <p className="v6-eyebrow mb-6">{UI.programmeName[lang]}</p>
            <h1 id="v6-home-title" className="text-5xl text-[color:var(--egeep-ivory)] md:text-6xl xl:text-7xl">
              {t('title').replace('{n}', n)}
            </h1>
            <p className="mt-6 max-w-xl text-xl text-[color:var(--v6-on-dark-muted)]">{data.about.intro[0]}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ExternalLink href={REGISTER_URL} className="aegov-btn btn-lg">
                {UI.participateNow[lang]}
              </ExternalLink>
              <Link to={links.href('countries')} className="aegov-link">
                {t('exploreCountries')}
                <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-primary-400/30 pt-6">
              {[
                { label: t('partners'), value: n },
                { label: t('active'), value: formatNumber(ACTIVE_PARTNERSHIPS, lang) },
                { label: t('since'), value: String(LAUNCH_YEAR) },
              ].map((f) => (
                <div key={f.label} className="flex flex-col-reverse gap-1">
                  <dt className="text-base leading-snug text-[color:var(--v6-on-dark-muted)]">{f.label}</dt>
                  <dd className="text-4xl leading-none text-primary-300">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Globe ids={ids} label={t('globeLabel')} className="mx-auto w-full max-w-[42rem] lg:-me-6" />
        </div>
      </section>

      <section aria-labelledby="v6-home-impact" className={`${CONTAINER} ${SECTION}`}>
        <SectionHeading
          id="v6-home-impact"
          eyebrow={t('impactEyebrow')}
          title={t('impactTitle')}
          intro={t('impactIntro').replace('{y}', String(LAUNCH_YEAR))}
        />
        <ImpactBursts group="headline" />
      </section>

      <AmbientFilm />

      <section aria-labelledby="v6-home-timeline" className="v6-dark">
        <div className={`${CONTAINER} ${SECTION} pt-8!`}>
          <SectionHeading id="v6-home-timeline" eyebrow={t('timelineEyebrow')} title={t('timelineTitle')} intro={t('timelineIntro')} />
          <PartnershipTimeline />
        </div>
      </section>

      <section aria-labelledby="v6-home-areas" className="v6-ivory overflow-hidden">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="v6-home-areas"
            eyebrow={t('areasEyebrow')}
            title={UI.areasOfCooperation[lang]}
            intro={t('areasIntro').replace('{n}', formatNumber(data.areas.length, lang))}
            action={
              <Link to={links.href('areas')} className="aegov-btn btn-outline btn-sm">
                {t('allAreas')}
              </Link>
            }
          />
          <AreaCarousel />
        </div>
      </section>

      <section aria-labelledby="v6-home-quotes" className={`${CONTAINER} ${SECTION}`}>
        <SectionHeading id="v6-home-quotes" eyebrow={t('quotesEyebrow')} title={t('quotesTitle')} />
        <Reveal>
          <LeadershipQuotes />
        </Reveal>
      </section>

      <section aria-labelledby="v6-home-how" className="v6-ivory">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="v6-home-how"
            eyebrow={t('howEyebrow')}
            title={t('howTitle')}
            intro={data.about.methodology}
            action={
              <Link to={`${links.href('about')}#how-it-works`} className="aegov-link">
                {t('methodology')}
                <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
              </Link>
            }
          />
          <Rings items={data.about.workflow} caption={st('stage')} />
        </div>
      </section>

      <section aria-labelledby="v6-home-film" className={`${CONTAINER} ${SECTION}`}>
        <SectionHeading id="v6-home-film" eyebrow={t('filmEyebrow')} title={t('filmTitle')} />
        <Reveal>
          <FeaturedFilm className="mx-auto max-w-5xl" />
        </Reveal>
      </section>

      <ParticipateCta />
    </main>
  )
}
