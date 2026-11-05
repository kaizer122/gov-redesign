import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CaretDown } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import type { Area } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { COUNTRY_REGION, REGION_LABEL, type Region } from '../../../shared/geo'
import { compareText, useLang, useT, type Bilingual } from '../../../shared/i18n'
import { PROGRAMMES, UI } from '../../../shared/strings'
import { AreaBody } from '../components/AreaBody'
import { ArrowLink, PageHeader, ParticipateCta } from '../components/Blocks'
import { AREA_PARTNER_IDS, fill, localCountry, useSite } from '../lib/content'
import { useLinks, useSmoothUpdate } from '../lib/hooks'
import { REGIONS, T } from '../lib/t'
import { CONTAINER } from '../lib/ui'

const A = {
  title: { en: 'Areas of cooperation', ar: 'مجالات التعاون' },
  lead: {
    en: 'The fields in which the UAE Government shares its experience, methods and practices with partner governments. Filter by region to see which partners have taken up each area.',
    ar: 'المجالات التي تشارك فيها حكومة دولة الإمارات خبراتها وأساليبها وممارساتها مع الحكومات الشريكة. صفِّ النتائج حسب المنطقة لمعرفة الشركاء في كل مجال.',
  },
  factAreas: { en: 'Areas of cooperation', ar: 'مجالات التعاون' },
  factLinked: { en: 'Areas taken up by partners', ar: 'مجالات اختارها الشركاء' },
  controls: { en: 'Filter and sort areas', ar: 'تصفية المجالات وترتيبها' },
  regionFilter: { en: 'Partners from', ar: 'الشركاء من' },
  sortMost: { en: 'Most partners first', ar: 'الأكثر شركاءً أولًا' },
  sortName: { en: 'Name', ar: 'الاسم' },
  summary: {
    en: '{n} of {total} areas have partners from this region',
    ar: 'المجالات التي تضم شركاء من هذه المنطقة: {n} من {total}',
  },
  summaryAll: { en: 'Showing all {total} areas', ar: 'عرض جميع المجالات ({total})' },
  partnersHere: { en: 'Partner countries: {n} of {total}', ar: 'الدول الشريكة: {n} من {total}' },
  noneInRegion: { en: 'No partner from this region lists this area.', ar: 'لا يوجد شريك من هذه المنطقة أدرج هذا المجال.' },
  readMore: { en: 'Read about this area', ar: 'اقرأ عن هذا المجال' },
  readLess: { en: 'Hide details', ar: 'أخفِ التفاصيل' },
  viewPartners: { en: 'View these partner countries', ar: 'اعرض هذه الدول الشريكة' },
  enquire: { en: 'Enquire about this area', ar: 'استفسر عن هذا المجال' },
  jump: { en: 'Jump to an area', ar: 'انتقل إلى مجال' },
} satisfies Record<string, Bilingual>

const LEADERSHIP = PROGRAMMES.find((p) => p.key === 'leadership')!
const LEADERSHIP_SLUG = 'leadership-and-capacity-building'

type Sort = 'most' | 'name'

export default function AreasPage() {
  const lang = useLang()
  const a = useT(A)
  const t = useT(T)
  const local = useSite()
  const smooth = useSmoothUpdate()
  const { hash } = useLocation()
  const [region, setRegion] = useState<Region | ''>('')
  const [sort, setSort] = useState<Sort>('most')

  const idsFor = (area: Area) => AREA_PARTNER_IDS[area.slug].filter((id) => !region || COUNTRY_REGION[id] === region)
  const compare = compareText(lang)
  const areas = [...local.areas].sort((x, y) =>
    sort === 'name' ? compare(x.title, y.title) : AREA_PARTNER_IDS[y.slug].length - AREA_PARTNER_IDS[x.slug].length,
  )
  const withPartners = local.areas.filter((x) => idsFor(x).length > 0).length
  const linked = site.areas.filter((x) => AREA_PARTNER_IDS[x.slug].length > 0).length

  return (
    <main id="main" data-page="areas" tabIndex={-1}>
      <PageHeader
        page="areas"
        title={a('title')}
        lead={a('lead')}
        facts={[
          { label: a('factAreas'), value: String(site.areas.length) },
          { label: a('factLinked'), value: String(linked) },
        ]}
      />

      <div className={`${CONTAINER} py-10 md:py-14`}>
        <div role="group" aria-label={a('controls')} className="v8-tile mb-4 flex flex-col gap-4 p-4 md:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="v8-muted me-2 text-sm">{a('regionFilter')}</span>
            {(['', ...REGIONS] as const).map((r) => (
              <button
                key={r || 'all'}
                type="button"
                aria-pressed={region === r}
                onClick={() => smooth(() => setRegion(r))}
                className={`min-h-10 rounded-full border px-4 text-sm ${region === r ? 'border-[var(--egeep-charcoal)] bg-[var(--egeep-charcoal)] text-[#fff]' : 'border-[var(--v8-line-strong)] bg-[#fff] hover:border-primary-600'}`}
              >
                {r ? REGION_LABEL[r][lang] : t('allRegions')}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="v8-muted text-sm" id="v8-area-sort">
              {UI.sortBy[lang]}
            </span>
            <div role="group" aria-labelledby="v8-area-sort" className="inline-flex gap-1 rounded-md border border-[var(--v8-line)] bg-[var(--egeep-ivory)] p-1">
              {(['most', 'name'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={sort === s}
                  onClick={() => smooth(() => setSort(s))}
                  className={`min-h-9 rounded px-3 text-sm ${sort === s ? 'bg-[#fff] text-primary-900 ring-1 ring-[var(--v8-line-strong)]' : 'text-[var(--v8-text-2)]'}`}
                >
                  {s === 'most' ? a('sortMost') : a('sortName')}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mb-6" aria-live="polite">
          {region
            ? fill(a('summary'), { n: withPartners, total: site.areas.length })
            : fill(a('summaryAll'), { total: site.areas.length })}
        </p>

        <nav aria-label={a('jump')} className="mb-8">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {local.areas.map((x) => (
              <li key={x.slug}>
                <a href={`#${x.slug}`} className="text-primary-800 underline-offset-4 hover:underline">
                  {x.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="grid gap-4 lg:grid-cols-2">
          {areas.map((area) => (
            <li key={area.slug} style={{ viewTransitionName: `v8-a-${area.slug}` }}>
              <AreaCard area={area} ids={idsFor(area)} region={region} initiallyOpen={hash === `#${area.slug}`} />
            </li>
          ))}
        </ul>
      </div>

      <ParticipateCta />
    </main>
  )
}

interface AreaCardProps {
  area: Area
  ids: number[]
  region: Region | ''
  initiallyOpen: boolean
}

function AreaCard({ area, ids, region, initiallyOpen }: AreaCardProps) {
  const lang = useLang()
  const a = useT(A)
  const { countryHref, href } = useLinks()
  const [open, setOpen] = useState(initiallyOpen)
  const total = AREA_PARTNER_IDS[area.slug].length
  const share = (ids.length / site.countries.length) * 100
  const bodyId = `${area.slug}-body`
  const dimmed = region !== '' && ids.length === 0
  const compare = compareText(lang)
  const countries = ids.map((id) => localCountry(lang, id)).sort((x, y) => compare(x.name, y.name))

  return (
    <article
      id={area.slug}
      aria-labelledby={`${area.slug}-title`}
      className={`v8-tile v8-lift flex h-full scroll-mt-6 flex-col overflow-hidden transition-opacity ${dimmed ? 'opacity-70' : ''}`}
    >
      <div className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {area.image && (
          <img
            src={area.image}
            alt=""
            width={930}
            height={600}
            loading="lazy"
            className="aspect-[16/10] h-full w-full object-cover sm:aspect-auto"
          />
        )}
        <div className="flex flex-col gap-3 p-5">
          {area.logo && <img src={area.logo} alt="" className="h-10 w-auto max-w-full self-start object-contain" loading="lazy" />}
          {area.slug === LEADERSHIP_SLUG && (
            <span className="v8-prog-tag self-start" style={{ color: LEADERSHIP.color }}>
              {LEADERSHIP.name[lang]}
            </span>
          )}
          <h2 id={`${area.slug}-title`} className="text-3xl">
            {area.title}
          </h2>
          <p className="v8-muted">{area.summary}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 border-t border-[var(--v8-line)] p-5">
        <div>
          <p className="mb-2 text-sm">{fill(a('partnersHere'), { n: ids.length, total: site.countries.length })}</p>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--egeep-ivory)] ring-1 ring-[var(--v8-line)]" aria-hidden="true">
            <div className="h-full rounded-full bg-[var(--egeep-gold)] transition-[width] duration-500" style={{ width: `${share}%` }} />
          </div>
        </div>
        {countries.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {countries.map((c) => (
              <li key={c.id}>
                <Link
                  to={countryHref(c.id)}
                  className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[var(--v8-line)] bg-[#fff] ps-1.5 pe-2.5 text-sm no-underline hover:border-primary-500 hover:text-primary-800"
                >
                  <Flag iso={c.iso} alt="" className="h-3.5 w-5 rounded-[2px] object-cover" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="v8-muted text-sm">{region ? a('noneInRegion') : T.noPartnersYet[lang]}</p>
        )}

        <div id={bodyId} hidden={!open} className="border-t border-[var(--v8-line)] pt-4">
          <AreaBody area={area} />
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--v8-line)] pt-4">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex min-h-11 items-center gap-2 text-primary-800 hover:text-primary-950"
          >
            {open ? a('readLess') : a('readMore')}
            <CaretDown aria-hidden="true" className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {total > 0 && <ArrowLink to={`${href('countries')}?area=${area.slug}`}>{a('viewPartners')}</ArrowLink>}
          <ArrowLink to={href('contact')}>{a('enquire')}</ArrowLink>
        </div>
      </div>
    </article>
  )
}
