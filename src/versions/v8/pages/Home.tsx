import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Quotes } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { PATTERNS } from '../../../shared/brand'
import { formatNumber, useLang, useT, type Bilingual } from '../../../shared/i18n'
import { PROGRAMMES, UI, type ProgrammeKey } from '../../../shared/strings'
import { AmbientVideo, DotMap, FilmCaption, FilmFacade } from '../components/Media'
import { ArrowLink, ParticipateCta, SectionHeading } from '../components/Blocks'
import { BarChart, ChartFrame, ColumnChart, Segmented, type Datum } from '../components/Charts'
import { CountryDrawer } from '../components/Country'
import { CountryTile } from '../components/CountryTile'
import { CountUp } from '../components/CountUp'
import { ExternalLink } from '../components/ExternalLink'
import {
  ACTIVE_PARTNERSHIPS,
  AREA_PARTNER_IDS,
  FIRST_PARTNERSHIP_YEAR,
  METRICS,
  REGISTER_URL,
  REPORTING_PARTNERS,
  SIGNINGS_BY_YEAR,
  byNewest,
  countryStat,
  fill,
  localCountry,
  useSite,
  type Metric,
} from '../lib/content'
import { useLinks } from '../lib/hooks'
import { METRIC_LABEL, STAT_LABEL } from '../lib/t'
import { CONTAINER, SECTION } from '../lib/ui'

const H = {
  aboutLink: { en: 'About the programme', ar: 'عن البرنامج' },
  partnersTile: { en: 'Partner governments', ar: 'الحكومات الشريكة' },
  partnersSub: { en: '{n} active partnerships · first signed in {year}', ar: 'الشراكات السارية: {n} · أول توقيع في {year}' },
  mapTitle: { en: 'Where our partners are', ar: 'أين يوجد شركاؤنا' },
  mapLabel: {
    en: 'Map of the capitals of {n} partner countries, each linked to the UAE by a line',
    ar: 'خريطة لعواصم {n} من الدول الشريكة، تربط كلًا منها بدولة الإمارات خطوط رفيعة',
  },
  mapLink: { en: 'Explore countries', ar: 'استكشف الدول' },
  ambientCaption: { en: 'Moments from the programme', ar: 'لقطات من البرنامج' },
  photoCaption: { en: 'From the Media Center', ar: 'من المركز الإعلامي' },
  dashEyebrow: { en: 'Impact dashboard', ar: 'لوحة الأثر' },
  dashTitle: { en: 'The programme in figures', ar: 'البرنامج بالأرقام' },
  dashIntro: {
    en: 'Headline figures published by the programme, and the record each partnership has reported.',
    ar: 'الأرقام الرئيسية التي نشرها البرنامج، والنتائج التي سجّلتها كل شراكة.',
  },
  signedTitle: { en: 'Partnerships signed per year', ar: 'الشراكات الموقعة سنويًا' },
  signedDesc: {
    en: 'Partnership MOUs signed each year since {year}, {n} in total.',
    ar: 'مذكرات تفاهم الشراكة الموقعة كل عام منذ {year}، وعددها الإجمالي {n}.',
  },
  colYear: { en: 'Year', ar: 'السنة' },
  colSigned: { en: 'Partnerships signed', ar: 'الشراكات الموقعة' },
  colCountry: { en: 'Country', ar: 'الدولة' },
  colArea: { en: 'Area of cooperation', ar: 'مجال التعاون' },
  colPartners: { en: 'Partner countries', ar: 'الدول الشريكة' },
  topTitle: { en: 'Top 10 partners', ar: 'أعلى 10 دول شريكة' },
  topDesc: {
    en: 'Partner countries ranked by {metric}, as reported by each partnership.',
    ar: 'ترتيب الدول الشريكة حسب {metric}، وفق ما أفادت به كل شراكة.',
  },
  measure: { en: 'Measure', ar: 'المؤشر' },
  areasTitle: { en: 'Partners in each area of cooperation', ar: 'عدد الشركاء في كل مجال تعاون' },
  areasDesc: {
    en: 'Number of partner countries whose workstreams include each area.',
    ar: 'عدد الدول الشريكة التي تشمل مسارات عملها كل مجال.',
  },
  notesTitle: { en: 'About these figures', ar: 'عن هذه الأرقام' },
  notes1: {
    en: 'The headline figures are the totals the programme publishes. They include partners not yet listed on this site.',
    ar: 'الأرقام الرئيسية هي الإجماليات التي ينشرها البرنامج، وتشمل شركاء لم تُدرج بياناتهم في هذا الموقع بعد.',
  },
  notes2: {
    en: '{n} of the {total} listed partnerships report training hours, workshops or trainees. The charts use those reports as published.',
    ar: 'أفادت {n} من أصل {total} شراكة مدرجة بساعات التدريب أو ورش العمل أو أعداد المتدربين، وتعتمد الرسوم البيانية على هذه البيانات كما نُشرت.',
  },
  notesLink: { en: 'Compare every partner in the table', ar: 'قارن جميع الشركاء في الجدول' },
  progEyebrow: { en: 'How EGEEP works', ar: 'كيف يعمل البرنامج' },
  progTitle: { en: 'Four programmes', ar: 'أربعة برامج' },
  progIntro: {
    en: 'EGEEP works through four programmes. Each has its own colour, used on this site only to mark that programme.',
    ar: 'يعمل البرنامج من خلال أربعة برامج، لكل منها لون خاص يُستخدم في هذا الموقع للدلالة عليه فقط.',
  },
  retreatsText: {
    en: 'International retreats held with partner governments.',
    ar: 'خلوات دولية تُعقد بالتعاون مع الحكومات الشريكة.',
  },
  vipText: { en: 'Meetings with senior officials, held inside the UAE.', ar: 'لقاءات مع كبار المسؤولين تُعقد داخل دولة الإمارات.' },
  mouText: {
    en: '{n} partnership MOUs signed with governments since {year}.',
    ar: 'مذكرات تفاهم شراكة موقعة مع الحكومات منذ {year}: {n}.',
  },
  leadershipText: {
    en: 'Leadership and capacity building, an area of cooperation taken up by {n} partner countries.',
    ar: 'القيادة وبناء القدرات، مجال تعاون اختارته {n} من الدول الشريكة.',
  },
  notPublished: {
    en: 'Programme details are not yet published on this site.',
    ar: 'لم تُنشر تفاصيل هذا البرنامج على هذا الموقع بعد.',
  },
  askOffice: { en: 'Ask the office', ar: 'اسأل المكتب' },
  seeSignings: { en: 'See the signings', ar: 'اطّلع على التوقيعات' },
  seeArea: { en: 'Explore the area', ar: 'استكشف المجال' },
  areasEyebrow: { en: 'What we share', ar: 'ما نشاركه' },
  areasIntro: {
    en: '{n} fields in which the UAE Government shares its experience, tools and practices with partner governments.',
    ar: 'مجالات تنقل فيها حكومة الإمارات خبراتها وأدواتها وممارساتها إلى الحكومات الشريكة، وعددها {n}.',
  },
  allAreas: { en: 'All areas of cooperation', ar: 'جميع مجالات التعاون' },
  latestEyebrow: { en: 'Partnerships', ar: 'الشراكات' },
  latestTitle: { en: 'Latest partnerships', ar: 'أحدث الشراكات' },
  latestIntro: {
    en: 'The most recent partnership agreements. Select a country for its period, workstreams and results.',
    ar: 'أحدث اتفاقيات الشراكة. اختر دولة للاطلاع على فترة الشراكة ومسارات العمل والنتائج.',
  },
  allCountries: { en: 'All {n} countries', ar: 'جميع الدول ({n})' },
} satisfies Record<string, Bilingual>

const PROGRAMME_LINK: Record<ProgrammeKey, { text: keyof typeof H; link: keyof typeof H }> = {
  retreats: { text: 'retreatsText', link: 'askOffice' },
  vip: { text: 'vipText', link: 'askOffice' },
  mou: { text: 'mouText', link: 'seeSignings' },
  leadership: { text: 'leadershipText', link: 'seeArea' },
}

const LEADERSHIP_SLUG = 'leadership-and-capacity-building'
const RECENT_COUNT = 8
const TOP_COUNT = 10

export default function HomePage() {
  const [drawer, setDrawer] = useState<number>()
  return (
    <main id="main" data-page="home" tabIndex={-1}>
      <HeroGrid />
      <Dashboard />
      <Programmes />
      <AreasStrip />
      <Latest onOpen={setDrawer} />
      <CountryDrawer countryId={drawer} onClose={() => setDrawer(undefined)} />
      <ParticipateCta />
    </main>
  )
}

function HeroGrid() {
  const lang = useLang()
  const h = useT(H)
  const local = useSite()
  const { href } = useLinks()
  const quote = local.quotes[1]
  const media = local.media[0]

  return (
    <section aria-labelledby="v8-home-title" className="v8-gridlines relative overflow-hidden border-b border-[var(--v8-line)]">
      <div className={`${CONTAINER} grid gap-3 py-6 md:py-10 lg:grid-cols-12 lg:gap-4`}>
        {/* Headline */}
        <div className="v8-tile relative flex flex-col justify-between gap-8 overflow-hidden p-6 md:p-10 lg:col-span-6 lg:row-span-2">
          <div
            aria-hidden="true"
            className="v8-pattern -end-28 -top-28 size-[26rem] opacity-[0.16]!"
            style={{ backgroundImage: `url(${PATTERNS.connectedCircles})` }}
          />
          <div className="relative space-y-6">
            <p className="v8-eyebrow">{UI.officeName[lang]}</p>
            <h1 id="v8-home-title" className="text-5xl leading-[1] md:text-[4.75rem] md:leading-[0.98] rtl:leading-[1.3]">
              {UI.programmeName[lang]}
            </h1>
            <p className="v8-muted max-w-xl text-xl">{local.meta.description}</p>
          </div>
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <ExternalLink href={REGISTER_URL} className="aegov-btn btn-lg">
                {local.hero.cta.label}
              </ExternalLink>
              <ArrowLink to={href('about')}>{h('aboutLink')}</ArrowLink>
            </div>
            <ul className="flex flex-wrap gap-2" aria-label={local.about.slogan.join(', ')}>
              {local.about.slogan.map((word) => (
                <li key={word} className="rounded-full border border-[var(--v8-line-strong)] px-3 text-sm">
                  {word}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Photography */}
        {media?.image && (
          <figure className="v8-tile v8-lift relative flex flex-col overflow-hidden lg:col-span-6">
            <img
              src={media.image}
              alt={media.title}
              width={1200}
              height={675}
              className="aspect-[16/9] w-full object-cover lg:aspect-auto lg:h-[20rem]"
            />
            <figcaption className="v8-muted border-t border-[var(--v8-line)] px-4 py-2.5 text-sm">{h('photoCaption')}</figcaption>
          </figure>
        )}

        {/* Partners counter + map */}
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:col-span-6 lg:gap-4">
          <div className="v8-tile v8-lift flex flex-col justify-between gap-4 p-5">
            <p className="v8-muted text-sm">{h('partnersTile')}</p>
            <p className="v8-gold-title text-8xl leading-none">
              <CountUp value={String(site.countries.length)} />
            </p>
            <p className="text-sm">{fill(h('partnersSub'), { n: ACTIVE_PARTNERSHIPS, year: FIRST_PARTNERSHIP_YEAR })}</p>
          </div>
          <div className="v8-tile v8-lift flex flex-col gap-2 p-5">
            <h2 className="text-xl">{h('mapTitle')}</h2>
            <DotMap label={fill(h('mapLabel'), { n: site.countries.length })} className="my-auto" />
            <Link to={href('countries')} className="self-end text-sm text-primary-800 underline-offset-4 hover:underline">
              {h('mapLink')}
            </Link>
          </div>
        </div>

        {/* Leadership quote */}
        {quote && (
          <figure className="v8-tile v8-lift flex gap-5 p-5 md:p-6 lg:col-span-5">
            {quote.image && (
              <img
                src={quote.image}
                alt={quote.author}
                width={240}
                height={300}
                loading="lazy"
                className="hidden w-28 shrink-0 rounded-md object-cover sm:block md:w-32"
              />
            )}
            <div className="flex flex-col gap-3">
              <Quotes aria-hidden="true" weight="fill" className="size-7 text-[var(--egeep-gold)] rtl:-scale-x-100" />
              <blockquote className="text-xl leading-snug">
                <p>{quote.text}</p>
              </blockquote>
              <figcaption className="mt-auto text-sm">
                <span className="block">{quote.author}</span>
                {quote.role && <span className="v8-muted block">{quote.role}</span>}
              </figcaption>
            </div>
          </figure>
        )}

        {/* Film */}
        <div className="v8-tile v8-lift flex flex-col overflow-hidden lg:col-span-4">
          <FilmFacade className="rounded-t-[calc(var(--v8-radius)-1px)]" />
          <div className="p-4">
            <FilmCaption />
          </div>
        </div>

        {/* Ambient video */}
        <figure className="v8-tile v8-lift flex flex-col overflow-hidden lg:col-span-3">
          <AmbientVideo className="aspect-video flex-1 lg:aspect-auto lg:min-h-48" />
          <figcaption className="px-4 py-3 text-sm">
            <span className="v8-muted">{h('ambientCaption')}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function Dashboard() {
  const lang = useLang()
  const h = useT(H)
  const local = useSite()
  const { href } = useLinks()
  const [metric, setMetric] = useState<Metric>('Training hours')
  const metricName = METRIC_LABEL[metric][lang]

  const signed: Datum[] = SIGNINGS_BY_YEAR.map(({ year, ids }) => ({
    key: year,
    label: year,
    value: ids.length,
    display: String(ids.length),
  }))

  const top: Datum[] = useMemo(
    () =>
      site.countries
        .flatMap((c) => {
          const value = countryStat(c, metric)
          return value === undefined ? [] : [{ id: c.id, value }]
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, TOP_COUNT)
        .map(({ id, value }) => ({
          key: String(id),
          label: localCountry(lang, id).name,
          value,
          display: formatNumber(value, lang),
        })),
    [metric, lang],
  )

  const areas: Datum[] = site.areas
    .map((a, i) => ({ key: a.slug, label: local.areas[i].title, value: AREA_PARTNER_IDS[a.slug].length, display: '' }))
    .sort((a, b) => b.value - a.value)
    .map((d) => ({ ...d, display: String(d.value) }))

  return (
    <section aria-labelledby="v8-dash-title" className={`${CONTAINER} ${SECTION}`}>
      <SectionHeading id="v8-dash-title" eyebrow={h('dashEyebrow')} title={h('dashTitle')} intro={h('dashIntro')} />

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--v8-radius)] border border-[var(--v8-line)] bg-[var(--v8-line)] md:grid-cols-3 xl:grid-cols-6">
        {local.stats.headline.map((s, i) => (
          <div key={i} className="flex flex-col-reverse justify-end gap-2 bg-[#fff] p-5 md:p-6">
            <dt className="v8-muted">{STAT_LABEL[site.stats.headline[i].label]?.[lang] ?? s.label}</dt>
            <dd className="v8-gold-title text-3xl leading-none sm:text-4xl md:whitespace-nowrap xl:text-[2.75rem]">
              <CountUp value={s.value} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <ChartFrame
          className="lg:col-span-5"
          title={h('signedTitle')}
          description={fill(h('signedDesc'), { year: FIRST_PARTNERSHIP_YEAR, n: site.countries.length })}
          headers={[h('colYear'), h('colSigned')]}
          data={signed}
        >
          {(state) => <ColumnChart data={signed} state={state} />}
        </ChartFrame>

        <ChartFrame
          className="lg:col-span-7 lg:row-span-2"
          title={h('topTitle')}
          description={fill(h('topDesc'), { metric: metricName })}
          headers={[h('colCountry'), metricName]}
          data={top}
          controls={
            <Segmented
              label={h('measure')}
              value={metric}
              onChange={setMetric}
              options={METRICS.map((m) => ({ key: m, label: METRIC_LABEL[m][lang] }))}
            />
          }
        >
          {(state) => <BarChart data={top} state={state} />}
        </ChartFrame>

        <div className="v8-tile flex flex-col gap-4 p-5 md:p-6 lg:col-span-5">
          <h3 className="text-2xl">{h('notesTitle')}</h3>
          <p>{h('notes1')}</p>
          <p>{fill(h('notes2'), { n: REPORTING_PARTNERS, total: site.countries.length })}</p>
          <ArrowLink to={`${href('countries')}?view=table`} className="mt-auto">
            {h('notesLink')}
          </ArrowLink>
        </div>

        <ChartFrame
          className="lg:col-span-12"
          title={h('areasTitle')}
          description={h('areasDesc')}
          headers={[h('colArea'), h('colPartners')]}
          data={areas}
        >
          {(state) => <BarChart data={areas} state={state} max={site.countries.length} />}
        </ChartFrame>
      </div>
    </section>
  )
}

function Programmes() {
  const lang = useLang()
  const h = useT(H)
  const { href, areaHref } = useLinks()
  const target: Record<ProgrammeKey, string> = {
    retreats: href('contact'),
    vip: href('contact'),
    mou: href('activities'),
    leadership: areaHref(LEADERSHIP_SLUG),
  }
  const text = (key: ProgrammeKey) =>
    fill(h(PROGRAMME_LINK[key].text), {
      n: key === 'mou' ? site.countries.length : AREA_PARTNER_IDS[LEADERSHIP_SLUG].length,
      year: FIRST_PARTNERSHIP_YEAR,
    })

  return (
    <section aria-labelledby="v8-prog-title" className="border-y border-[var(--v8-line)] bg-[#fff]">
      <div className={`${CONTAINER} ${SECTION}`}>
        <SectionHeading id="v8-prog-title" eyebrow={h('progEyebrow')} title={h('progTitle')} intro={h('progIntro')} />
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PROGRAMMES.map((p) => (
            <li key={p.key}>
              <article className="v8-tile v8-lift flex h-full flex-col gap-4 overflow-hidden p-6 pt-7">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: p.color }} />
                <h3 className="text-3xl" style={{ color: p.color }}>
                  {p.name[lang]}
                </h3>
                <p>{text(p.key)}</p>
                {(p.key === 'retreats' || p.key === 'vip') && <p className="v8-muted text-sm">{h('notPublished')}</p>}
                <Link
                  to={target[p.key]}
                  className="mt-auto inline-flex items-center gap-2 text-primary-800 after:absolute after:inset-0 hover:text-primary-950"
                >
                  {h(PROGRAMME_LINK[p.key].link)}
                  <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function AreasStrip() {
  const h = useT(H)
  const lang = useLang()
  const local = useSite()
  const { href, areaHref } = useLinks()
  return (
    <section aria-labelledby="v8-areas-title" className={`${CONTAINER} ${SECTION}`}>
      <SectionHeading
        id="v8-areas-title"
        eyebrow={h('areasEyebrow')}
        title={UI.areasOfCooperation[lang]}
        intro={fill(h('areasIntro'), { n: site.areas.length })}
        action={
          <Link to={href('areas')} className="aegov-btn btn-outline btn-sm">
            {h('allAreas')}
          </Link>
        }
      />
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {site.areas.map((a, i) => (
          <li key={a.slug}>
            <article className="v8-tile v8-lift flex h-full flex-col overflow-hidden">
              {a.image && (
                <img
                  src={a.image}
                  alt=""
                  width={930}
                  height={600}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="text-xl leading-snug">
                  <Link to={areaHref(a.slug)} className="after:absolute after:inset-0 hover:text-primary-800">
                    {local.areas[i].title}
                  </Link>
                </h3>
                <p className="v8-muted mt-auto text-sm">
                  {fill(UI.partnerCountries[lang] + ': {n}', { n: AREA_PARTNER_IDS[a.slug].length })}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Latest({ onOpen }: { onOpen: (id: number) => void }) {
  const h = useT(H)
  const local = useSite()
  const { href } = useLinks()
  const recent = byNewest(local.countries).slice(0, RECENT_COUNT)
  return (
    <section aria-labelledby="v8-latest-title" className="border-t border-[var(--v8-line)] bg-[#fff]">
      <div className={`${CONTAINER} ${SECTION}`}>
        <SectionHeading
          id="v8-latest-title"
          eyebrow={h('latestEyebrow')}
          title={h('latestTitle')}
          intro={h('latestIntro')}
          action={
            <Link to={href('countries')} className="aegov-btn btn-outline btn-sm">
              {fill(h('allCountries'), { n: site.countries.length })}
            </Link>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((c) => (
            <li key={c.id}>
              <CountryTile country={c} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
