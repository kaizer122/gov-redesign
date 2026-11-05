import { useId, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { REGION_LABEL, type Region } from '../../../shared/geo'
import { compareText, useLang, useT, type Bilingual } from '../../../shared/i18n'
import { PROGRAMMES, UI } from '../../../shared/strings'
import { ArrowLink, PageHeader, ParticipateCta, SectionHeading, Workflow } from '../components/Blocks'
import { CountryDrawer, MouTag, StatusBadge } from '../components/Country'
import {
  ACTIVE_PARTNERSHIPS,
  REPORTING_PARTNERS,
  SIGNINGS_BY_YEAR,
  countryRegion,
  fill,
  localCountry,
  partnershipPeriod,
  partnershipStatus,
  useSite,
  workstreamCount,
  type PartnershipStatus,
} from '../lib/content'
import { useLinks, useSmoothUpdate } from '../lib/hooks'
import { TOOL_ICONS } from '../lib/icons'
import { REGIONS, STATUS_LABEL, T } from '../lib/t'
import { CONTAINER, SECTION } from '../lib/ui'

const ACT = {
  title: { en: 'Activities', ar: 'الأنشطة' },
  lead: {
    en: 'How the programme turns signed partnerships into workshops, training and field work: every partnership MOU signed since the programme began, the formats used and the stages each partnership follows.',
    ar: 'كيف يحوّل البرنامج الشراكات الموقعة إلى ورش عمل وتدريب وزيارات ميدانية: جميع مذكرات تفاهم الشراكة الموقعة منذ انطلاق البرنامج، وأشكال الأنشطة، والمراحل التي تمر بها كل شراكة.',
  },
  factSigned: { en: 'Partnership MOUs signed', ar: 'مذكرات تفاهم الشراكة الموقعة' },
  factActive: { en: 'Active partnerships', ar: 'الشراكات السارية' },
  factReporting: { en: 'Partnerships reporting results', ar: 'الشراكات التي أفادت بالنتائج' },
  factYears: { en: 'Years with signings', ar: 'سنوات شهدت توقيعات' },
  secSignings: { en: 'Signings', ar: 'التوقيعات' },
  secFormats: { en: 'Formats', ar: 'أشكال الأنشطة' },
  secLifecycle: { en: 'Lifecycle', ar: 'دورة الشراكة' },
  secResults: { en: 'Results', ar: 'النتائج' },
  secMedia: { en: 'In the media', ar: 'في وسائل الإعلام' },
  signEyebrow: { en: 'Partnership signings', ar: 'توقيع الشراكات' },
  signTitle: { en: 'Partnership MOUs by year', ar: 'مذكرات تفاهم الشراكة حسب السنة' },
  signIntro: {
    en: 'Every partnership starts with a memorandum of understanding, part of the MOU Signings programme. Filter the timeline by year, region or status.',
    ar: 'تبدأ كل شراكة بمذكرة تفاهم ضمن برنامج توقيع مذكرات التفاهم. صفِّ الخط الزمني حسب السنة أو المنطقة أو الحالة.',
  },
  filters: { en: 'Filter partnership signings', ar: 'تصفية توقيعات الشراكات' },
  year: { en: 'Signing year', ar: 'سنة التوقيع' },
  showing: { en: 'Showing {n} of {total} signings', ar: 'التوقيعات المعروضة: {n} من {total}' },
  none: { en: 'No signing matches these filters.', ar: 'لا يوجد توقيع يطابق عوامل التصفية هذه.' },
  yearCount: { en: '{n} signed', ar: 'عدد التوقيعات: {n}' },
  formatsEyebrow: { en: 'What happens in a partnership', ar: 'ما يجري خلال الشراكة' },
  formatsTitle: { en: 'Activity formats', ar: 'أشكال الأنشطة' },
  formatsIntro: {
    en: 'Knowledge is exchanged through virtual and physical formats, from design-thinking workshops and field visits to capacity-building programmes and publications.',
    ar: 'تُتبادل المعرفة عبر أشكال افتراضية وحضورية، من ورش التفكير التصميمي والزيارات الميدانية إلى برامج بناء القدرات والإصدارات.',
  },
  lifeEyebrow: { en: 'Partnership lifecycle', ar: 'دورة الشراكة' },
  lifeTitle: { en: 'Five stages, from agreement to documented achievements', ar: 'خمس مراحل من الاتفاق إلى توثيق الإنجازات' },
  resultsEyebrow: { en: 'Partnership record', ar: 'سجل الشراكات' },
  resultsTitle: { en: 'Results by partnership', ar: 'النتائج حسب الشراكة' },
  resultsBody: {
    en: '{n} partnerships have reported training hours, workshops or trainees. Sort and compare them in the country table.',
    ar: 'أفادت {n} شراكة بساعات التدريب أو ورش العمل أو أعداد المتدربين. يمكنك ترتيبها ومقارنتها في جدول الدول.',
  },
  resultsLink: { en: 'Open the results table', ar: 'افتح جدول النتائج' },
  dashLink: { en: 'See the impact dashboard', ar: 'اطّلع على لوحة الأثر' },
  mediaTitle: { en: 'Latest from the Media Center', ar: 'أحدث ما في المركز الإعلامي' },
  mediaLink: { en: 'Visit the Media Center', ar: 'زر المركز الإعلامي' },
  photo: { en: 'Photo', ar: 'صورة' },
} satisfies Record<string, Bilingual>

const MOU = PROGRAMMES.find((p) => p.key === 'mou')!

export default function ActivitiesPage() {
  const act = useT(ACT)
  const local = useSite()
  const { href } = useLinks()
  const [params, setParams] = useSearchParams()
  const selectedId = Number(params.get('country')) || undefined
  const selected = site.countries.some((c) => c.id === selectedId) ? selectedId : undefined
  const setCountry = (id: number | undefined) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (id) next.set('country', String(id))
        else next.delete('country')
        return next
      },
      { replace: !id, preventScrollReset: true },
    )
  const media = local.media[0]

  return (
    <main id="main" data-page="activities" tabIndex={-1}>
      <PageHeader
        page="activities"
        title={act('title')}
        lead={act('lead')}
        facts={[
          { label: act('factSigned'), value: String(site.countries.length) },
          { label: act('factActive'), value: String(ACTIVE_PARTNERSHIPS) },
          { label: act('factReporting'), value: String(REPORTING_PARTNERS) },
          { label: act('factYears'), value: String(SIGNINGS_BY_YEAR.length) },
        ]}
        sections={[
          { id: 'signings', label: act('secSignings') },
          { id: 'formats', label: act('secFormats') },
          { id: 'lifecycle', label: act('secLifecycle') },
          { id: 'results', label: act('secResults') },
          ...(media ? [{ id: 'media', label: act('secMedia') }] : []),
        ]}
      />

      <section id="signings" aria-labelledby="signings-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading id="signings-title" eyebrow={act('signEyebrow')} title={act('signTitle')} intro={act('signIntro')} />
        <Signings onOpen={setCountry} />
      </section>

      <section id="formats" aria-labelledby="formats-title" className="scroll-mt-4 border-y border-[var(--v8-line)] bg-[#fff]">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading id="formats-title" eyebrow={act('formatsEyebrow')} title={act('formatsTitle')} intro={act('formatsIntro')} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {local.about.tools.map((tool, i) => {
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
        </div>
      </section>

      <section id="lifecycle" aria-labelledby="lifecycle-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading id="lifecycle-title" eyebrow={act('lifeEyebrow')} title={act('lifeTitle')} intro={local.about.methodology} />
        <Workflow />
      </section>

      <section id="results" aria-labelledby="results-title" className="scroll-mt-4 border-t border-[var(--v8-line)] bg-[#fff]">
        <div className={`${CONTAINER} ${SECTION} grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end`}>
          <div className="max-w-3xl">
            <p className="v8-eyebrow mb-3">{act('resultsEyebrow')}</p>
            <h2 id="results-title" className="text-4xl md:text-5xl">
              {act('resultsTitle')}
            </h2>
            <p className="v8-muted mt-4 text-lg">{fill(act('resultsBody'), { n: REPORTING_PARTNERS })}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to={`${href('countries')}?view=table&sort=trainees`} className="aegov-btn">
              {act('resultsLink')}
            </Link>
            <ArrowLink to={href('home')}>{act('dashLink')}</ArrowLink>
          </div>
        </div>
      </section>

      {media && (
        <section id="media" aria-labelledby="media-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
          <SectionHeading id="media-title" eyebrow={act('secMedia')} title={act('mediaTitle')} />
          <article className="v8-tile v8-lift grid overflow-hidden md:grid-cols-2">
            {media.image && (
              <img src={media.image} alt="" width={1200} height={675} loading="lazy" className="h-full w-full object-cover" />
            )}
            <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
              <span className="aegov-badge self-start">{act('photo')}</span>
              <h3 className="text-3xl">{media.title}</h3>
              <ArrowLink to={href('media')}>{act('mediaLink')}</ArrowLink>
            </div>
          </article>
        </section>
      )}

      <CountryDrawer countryId={selected} onClose={() => setCountry(undefined)} />
      <ParticipateCta />
    </main>
  )
}

function Signings({ onOpen }: { onOpen: (id: number) => void }) {
  const lang = useLang()
  const act = useT(ACT)
  const t = useT(T)
  const id = useId()
  const smooth = useSmoothUpdate()
  const [year, setYear] = useState('')
  const [region, setRegion] = useState<Region | ''>('')
  const [status, setStatus] = useState<PartnershipStatus | ''>('')
  const compare = compareText(lang)

  const groups = useMemo(
    () =>
      [...SIGNINGS_BY_YEAR]
        .reverse()
        .filter((g) => !year || g.year === year)
        .map((g) => ({
          year: g.year,
          countries: g.ids
            .map((cid) => localCountry(lang, cid))
            .filter((c) => (!region || countryRegion(c) === region) && (!status || partnershipStatus(c) === status))
            .sort((x, y) => compare(x.name, y.name)),
        }))
        .filter((g) => g.countries.length > 0),
    [year, region, status, lang, compare],
  )
  const shown = groups.reduce((n, g) => n + g.countries.length, 0)
  const filtersActive = Boolean(year || region || status)

  return (
    <>
      <form
        role="search"
        aria-label={act('filters')}
        onSubmit={(e) => e.preventDefault()}
        className="v8-tile mb-6 flex flex-col gap-4 p-4 md:p-5"
      >
        <div role="group" aria-labelledby={`${id}-year`} className="flex flex-wrap items-center gap-2">
          <span id={`${id}-year`} className="v8-muted me-2 text-sm">
            {act('year')}
          </span>
          {['', ...SIGNINGS_BY_YEAR.map((g) => g.year).reverse()].map((y) => (
            <button
              key={y || 'all'}
              type="button"
              aria-pressed={year === y}
              onClick={() => smooth(() => setYear(y))}
              className={`min-h-10 rounded-full border px-4 text-sm ${year === y ? 'border-[var(--egeep-charcoal)] bg-[var(--egeep-charcoal)] text-[#fff]' : 'border-[var(--v8-line-strong)] bg-[#fff] hover:border-primary-600'}`}
            >
              {y || t('allYears')}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <div className="aegov-form-control">
            <label htmlFor={`${id}-region`}>{t('region')}</label>
            <div className="form-control-input">
              <select id={`${id}-region`} value={region} onChange={(e) => smooth(() => setRegion(e.target.value as Region | ''))}>
                <option value="">{t('allRegions')}</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {REGION_LABEL[r][lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="aegov-form-control">
            <label htmlFor={`${id}-status`}>{t('status')}</label>
            <div className="form-control-input">
              <select
                id={`${id}-status`}
                value={status}
                onChange={(e) => smooth(() => setStatus(e.target.value as PartnershipStatus | ''))}
              >
                <option value="">{t('allStatuses')}</option>
                {(['active', 'completed'] as const).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s][lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <p aria-live="polite">{fill(act('showing'), { n: shown, total: site.countries.length })}</p>
        {filtersActive && (
          <button
            type="button"
            className="aegov-btn btn-link btn-sm"
            onClick={() =>
              smooth(() => {
                setYear('')
                setRegion('')
                setStatus('')
              })
            }
          >
            {UI.clearFilters[lang]}
          </button>
        )}
      </div>

      {groups.length === 0 ? (
        <div role="status" className="aegov-alert alert-info">
          <div className="alert-content">
            <p>{act('none')}</p>
          </div>
        </div>
      ) : (
        <ol className="relative space-y-10 border-s border-[var(--v8-line-strong)] ps-6 md:ps-10">
          {groups.map((g) => (
            <li key={g.year} className="relative" style={{ viewTransitionName: `v8-y-${g.year}` }}>
              <span
                aria-hidden="true"
                className="absolute top-3 -start-[calc(1.5rem+6px)] size-3 rounded-full border-2 border-[#fff] ring-1 md:-start-[calc(2.5rem+6px)]"
                style={{ backgroundColor: MOU.color, boxShadow: `0 0 0 1px ${MOU.color}` }}
              />
              <h3 className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="v8-gold-title text-4xl">{g.year}</span>
                <span className="v8-muted text-base">{fill(act('yearCount'), { n: g.countries.length })}</span>
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {g.countries.map((c) => (
                  <li key={c.id}>
                    <article className="v8-tile v8-lift relative flex h-full flex-col gap-3 p-4">
                      <div className="flex items-start gap-3">
                        <Flag iso={c.iso} alt="" className="mt-1 h-6 w-9 shrink-0 rounded-sm object-cover ring-1 ring-[var(--v8-line)]" />
                        <h4 className="min-w-0 flex-1 text-xl leading-snug">
                          <button
                            type="button"
                            aria-haspopup="dialog"
                            onClick={() => onOpen(c.id)}
                            className="text-start after:absolute after:inset-0 hover:text-primary-800"
                          >
                            {c.name}
                          </button>
                        </h4>
                      </div>
                      <div className="mt-auto flex flex-wrap items-center gap-2">
                        <MouTag />
                        <StatusBadge country={c} />
                      </div>
                      <p className="v8-muted text-sm">
                        {UI.partnershipPeriod[lang]}: <bdi dir="ltr">{partnershipPeriod(c)}</bdi>
                        {workstreamCount(c) !== undefined && (
                          <>
                            {' · '}
                            {UI.workstreams[lang]}: {workstreamCount(c)}
                          </>
                        )}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}
