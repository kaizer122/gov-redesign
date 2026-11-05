import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUp, ArrowsDownUp } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { compareText, formatNumber, useLang, useT } from '../../../shared/i18n'
import { PROGRAMMES, UI } from '../../../shared/strings'
import { PageHero } from '../components/PageHero'
import { ParticipateCta } from '../components/ParticipateCta'
import { Rings } from '../components/Rings'
import { SectionHeading } from '../components/SectionHeading'
import { Tabs } from '../components/Tabs'
import {
  ACTIVE_PARTNERSHIPS,
  byName,
  countryStat,
  partnershipPeriod,
  partnershipStatus,
  useLinks,
  useSite,
} from '../lib/content'
import { TOOL_ICONS } from '../lib/icons'
import { S } from '../lib/strings'
import { CONTAINER, SECTION } from '../lib/ui'

const T = {
  title: { en: 'Activities', ar: 'الأنشطة' },
  lead: {
    en: 'How the programme turns signed partnerships into workshops, training and field work, and what each partnership has recorded so far.',
    ar: 'كيف يحوّل البرنامج الشراكات الموقعة إلى ورش عمل وبرامج تدريب وعمل ميداني، وما سجلته كل شراكة حتى الآن.',
  },
  formats: { en: 'Activity formats', ar: 'صيغ الأنشطة' },
  lifecycle: { en: 'Partnership lifecycle', ar: 'دورة حياة الشراكة' },
  record: { en: 'Partnership record', ar: 'سجل الشراكات' },
  media: { en: 'In the media', ar: 'في الإعلام' },
  reporting: { en: 'Partnerships reporting results', ar: 'شراكات سجّلت نتائج' },
  activePartnerships: { en: 'Active partnerships', ar: 'شراكة سارية' },
  formatsEyebrow: { en: 'What happens in a partnership', ar: 'ماذا يحدث في الشراكة' },
  formatsIntro: {
    en: 'Knowledge is exchanged through virtual and physical formats, from design-thinking workshops and field visits to capacity-building programmes and publications.',
    ar: 'تُتبادل المعرفة عبر صيغ افتراضية وحضورية، من ورش التفكير التصميمي والزيارات الميدانية إلى برامج بناء القدرات والإصدارات.',
  },
  lifecycleTitle: { en: 'Five stages, from agreement to documented achievements', ar: 'خمس مراحل، من الاتفاق إلى توثيق الإنجازات' },
  recordTitle: { en: 'Partnerships by year and results', ar: 'الشراكات حسب السنة والنتائج' },
  recordIntro: {
    en: 'Each partnership starts with a memorandum of understanding. Browse the signings by year, or compare the training hours, workshops and trainees each partnership has reported.',
    ar: 'تبدأ كل شراكة بمذكرة تفاهم. تصفّح التوقيعات حسب السنة، أو قارن ساعات التدريب وورش العمل وأعداد المتدربين التي سجلتها كل شراكة.',
  },
  views: { en: 'Partnership record views', ar: 'طرق عرض سجل الشراكات' },
  timeline: { en: 'Signings by year', ar: 'التوقيعات حسب السنة' },
  results: { en: 'Results by partnership', ar: 'النتائج حسب الشراكة' },
  signed: { en: 'memoranda signed', ar: 'مذكرات تفاهم موقعة' },
  country: { en: 'Country', ar: 'الدولة' },
  period: { en: 'Period', ar: 'الفترة' },
  caption: {
    en: 'Recorded results by partnership. Select a column heading to sort.',
    ar: 'النتائج المسجلة حسب الشراكة. اختر عنوان عمود للترتيب.',
  },
  note: {
    en: 'Figures are as reported for each partnership. A dash means the partnership has not reported that figure.',
    ar: 'الأرقام كما سجلتها كل شراكة. وتعني الشرطة أن الشراكة لم تسجل ذلك الرقم.',
  },
  latest: { en: 'Latest from the Media Center', ar: 'أحدث ما في المركز الإعلامي' },
  visitMedia: { en: 'Visit the Media Center', ar: 'زيارة المركز الإعلامي' },
  photo: { en: 'Photo', ar: 'صورة' },
}

const METRICS = ['Training hours', 'Workshops', 'Trainees'] as const
const METRIC_LABEL = { 'Training hours': UI.trainingHours, Workshops: UI.workshops, Trainees: UI.trainees }
type SortColumn = 'name' | 'start' | (typeof METRICS)[number]

const MOU = PROGRAMMES.find((p) => p.key === 'mou')!

export default function ActivitiesPage() {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const links = useLinks()
  const data = useSite()
  const media = data.media[0]
  const reporting = site.countries.filter((c) => METRICS.some((m) => countryStat(c.id, m) !== undefined)).length
  const sections = [
    { id: 'formats', label: t('formats') },
    { id: 'lifecycle', label: t('lifecycle') },
    { id: 'record', label: t('record') },
    { id: 'media', label: t('media') },
  ]

  return (
    <main id="main" data-page="activities" tabIndex={-1}>
      <PageHero
        page="activities"
        title={t('title')}
        lead={t('lead')}
        sections={sections}
        sectionsLabel={st('onThisPage')}
        facts={[
          { label: t('activePartnerships'), value: formatNumber(ACTIVE_PARTNERSHIPS, lang) },
          { label: t('reporting'), value: formatNumber(reporting, lang) },
        ]}
      />

      <section id="formats" aria-labelledby="formats-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading id="formats-title" eyebrow={t('formatsEyebrow')} title={t('formats')} intro={t('formatsIntro')} />
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-[color:var(--egeep-grey-light)] bg-[color:var(--egeep-grey-light)] sm:grid-cols-2 lg:grid-cols-3">
          {data.about.tools.map((tool, i) => {
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

      <section id="lifecycle" aria-labelledby="lifecycle-title" className="v6-ivory scroll-mt-4">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading id="lifecycle-title" eyebrow={t('lifecycle')} title={t('lifecycleTitle')} intro={data.about.methodology} />
          <Rings items={data.about.workflow} caption={st('stage')} />
        </div>
      </section>

      <section id="record" aria-labelledby="record-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading id="record-title" eyebrow={t('record')} title={t('recordTitle')} intro={t('recordIntro')} />
        <Tabs
          label={t('views')}
          tabs={[
            { key: 'timeline', label: t('timeline'), content: <Timeline /> },
            { key: 'results', label: t('results'), content: <ResultsTable /> },
          ]}
        />
      </section>

      {media && (
        <section id="media" aria-labelledby="media-title" className="v6-ivory scroll-mt-4">
          <div className={`${CONTAINER} ${SECTION}`}>
            <SectionHeading id="media-title" eyebrow={t('media')} title={t('latest')} />
            <article className="aegov-card card-news overflow-hidden bg-whitely-50 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              {media.image && <img src={media.image} alt="" width={512} height={512} loading="lazy" className="h-full w-full object-cover" />}
              <div className="card-content flex flex-col justify-center gap-5 p-8">
                <span className="aegov-badge self-start">{t('photo')}</span>
                <h3 className="text-3xl leading-snug">{media.title}</h3>
                <Link to={links.href('media')} className="aegov-link">
                  {t('visitMedia')}
                  <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      <ParticipateCta />
    </main>
  )
}

function Timeline() {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const links = useLinks()
  const data = useSite()
  const years = useMemo(() => {
    const groups = new Map<string, Country[]>()
    for (const c of data.countries) {
      const year = c.startYear ?? ''
      groups.set(year, [...(groups.get(year) ?? []), c])
    }
    return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a)).map(([y, cs]) => [y, byName(cs, lang)] as const)
  }, [data.countries, lang])

  return (
    <ol className="relative space-y-12 border-s border-primary-600/40 ps-8 md:ps-12">
      {years.map(([year, countries]) => (
        <li key={year} className="relative">
          <span
            aria-hidden="true"
            className="absolute top-3 -start-[calc(2rem+6px)] size-3 rounded-full ring-4 ring-whitely-50 md:-start-[calc(3rem+6px)]"
            style={{ backgroundColor: MOU.color }}
          />
          <h3 className="mb-5 flex flex-wrap items-baseline gap-x-4 text-4xl">
            <bdi>{year}</bdi>
            <span className="v6-muted text-lg">
              {formatNumber(countries.length, lang)} {t('signed')}
            </span>
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {countries.map((c) => (
              <li key={c.id}>
                <Link
                  to={links.country(c.id)}
                  className="flex items-center gap-4 rounded-2xl border border-[color:var(--egeep-grey-light)] p-4 text-[color:var(--egeep-charcoal)] no-underline hover:border-primary-600"
                >
                  <Flag iso={c.iso} alt="" className="h-7 w-10 shrink-0 rounded-sm object-cover ring-1 ring-aeblack-900/10" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg leading-snug">{c.name}</span>
                    <span className="v6-muted flex flex-wrap items-center gap-x-2 text-base">
                      <span className="inline-flex items-center gap-1.5">
                        <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: MOU.color }} />
                        {st('mouSigning')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <bdi>{partnershipPeriod(c)}</bdi>
                      <span aria-hidden="true">·</span>
                      {partnershipStatus(c) === 'active' ? UI.active[lang] : UI.completed[lang]}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

function ResultsTable() {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const links = useLinks()
  const data = useSite()
  const [sort, setSort] = useState<{ column: SortColumn; descending: boolean }>({ column: 'Trainees', descending: true })

  const rows = useMemo(() => {
    const compare = compareText(lang)
    const value = (c: Country): number | string =>
      sort.column === 'name' ? c.name : sort.column === 'start' ? Number(c.startYear ?? 0) : (countryStat(c.id, sort.column) ?? -1)
    return [...data.countries].sort((a, b) => {
      const va = value(a)
      const vb = value(b)
      const order = typeof va === 'string' ? compare(va, vb as string) : va - (vb as number)
      return sort.descending ? -order : order
    })
  }, [sort, data.countries, lang])

  const header = (column: SortColumn, label: string, numeric = false) => {
    const active = sort.column === column
    const Icon = !active ? ArrowsDownUp : sort.descending ? ArrowDown : ArrowUp
    return (
      <th
        key={column}
        scope="col"
        aria-sort={active ? (sort.descending ? 'descending' : 'ascending') : undefined}
        className={`px-4 py-3 font-normal ${numeric ? 'text-end' : 'text-start'}`}
      >
        <button
          type="button"
          onClick={() => setSort({ column, descending: active ? !sort.descending : column !== 'name' })}
          className="inline-flex min-h-11 items-center gap-1.5 text-lg hover:text-primary-800"
        >
          {label}
          <Icon aria-hidden="true" className={`size-4 ${active ? 'text-primary-700' : 'text-[color:var(--v6-muted)]'}`} />
        </button>
      </th>
    )
  }

  return (
    <div>
      <div role="region" aria-labelledby="v6-results-caption" tabIndex={0} className="overflow-x-auto rounded-2xl border border-[color:var(--egeep-grey-light)]">
        <table className="w-full min-w-[44rem]">
          <caption id="v6-results-caption" className="sr-only">
            {t('caption')}
          </caption>
          <thead className="bg-[color:var(--egeep-ivory)]">
            <tr>
              {header('name', t('country'))}
              {header('start', t('period'))}
              {METRICS.map((m) => header(m, METRIC_LABEL[m][lang], true))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--egeep-grey-light)]">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-primary-50">
                <th scope="row" className="px-4 py-3 text-start font-normal">
                  <Link to={links.country(c.id)} className="inline-flex items-center gap-3 text-[color:var(--egeep-charcoal)] no-underline hover:underline">
                    <Flag iso={c.iso} alt="" className="h-4 w-6 shrink-0 rounded-[2px] object-cover ring-1 ring-aeblack-900/10" />
                    {c.name}
                  </Link>
                </th>
                <td className="px-4 py-3 whitespace-nowrap">
                  <bdi>{partnershipPeriod(c)}</bdi>
                </td>
                {METRICS.map((m) => {
                  const v = countryStat(c.id, m)
                  return (
                    <td key={m} className="px-4 py-3 text-end tabular-nums">
                      {v !== undefined ? (
                        formatNumber(v, lang)
                      ) : (
                        <>
                          <span aria-hidden="true">–</span>
                          <span className="sr-only">{st('notReported')}</span>
                        </>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="v6-muted mt-3 text-base">{t('note')}</p>
    </div>
  )
}
