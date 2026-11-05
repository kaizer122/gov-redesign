import { useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pause, Play } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import type { Region } from '../../../shared/geo'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { CURRENT_YEAR, FIRST_PARTNERSHIP_YEAR, REGIONS, byName, regionLabel, regionOf, useLinks, useSite } from '../lib/content'
import { FlowMap } from './FlowMap'

const T = {
  year: { en: 'Signing year', ar: 'سنة التوقيع' },
  byYear: { en: 'partner countries by', ar: 'دولة شريكة حتى عام' },
  signedIn: { en: 'Partnerships signed in', ar: 'الشراكات الموقعة في عام' },
  noneSigned: { en: 'No new partnerships in this region that year.', ar: 'لا توجد شراكات جديدة في هذه المنطقة في ذلك العام.' },
  play: { en: 'Play the timeline', ar: 'تشغيل الخط الزمني' },
  pause: { en: 'Pause the timeline', ar: 'إيقاف الخط الزمني' },
  region: { en: 'Filter by region', ar: 'التصفية حسب المنطقة' },
  map: { en: 'Map of partnerships signed with the UAE', ar: 'خريطة الشراكات الموقعة مع دولة الإمارات' },
}

const YEARS = Array.from({ length: CURRENT_YEAR - FIRST_PARTNERSHIP_YEAR + 1 }, (_, i) => FIRST_PARTNERSHIP_YEAR + i)
const LAST_SIGNING = Math.max(...site.countries.map((c) => Number(c.startYear ?? 0)))

/** Scrubber from the first signing year to today: lights partners on the flow map by signing year, with a running count. */
export function PartnershipTimeline() {
  const lang = useLang()
  const t = useT(T)
  const uid = useId()
  const links = useLinks()
  const data = useSite()
  const [year, setYear] = useState(LAST_SIGNING)
  const [region, setRegion] = useState<Region | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      const next = year + 1
      setYear(next)
      if (next >= CURRENT_YEAR) setPlaying(false)
    }, 1100)
    return () => window.clearTimeout(timer)
  }, [playing, year])

  const inRegion = useMemo(
    () => data.countries.filter((c) => !region || regionOf(c.id) === region),
    [data.countries, region],
  )
  const ids = inRegion.map((c) => c.id)
  const signed = inRegion.filter((c) => Number(c.startYear) <= year)
  const thisYear = byName(
    inRegion.filter((c) => Number(c.startYear) === year),
    lang,
  )
  const lit = new Set(signed.map((c) => c.id))
  const current = new Set(thisYear.map((c) => c.id))

  const togglePlay = () => {
    if (!playing && year >= CURRENT_YEAR) setYear(FIRST_PARTNERSHIP_YEAR)
    setPlaying((p) => !p)
  }

  return (
    <div className="space-y-8">
      <div role="group" aria-label={t('region')} className="flex flex-wrap gap-2">
        <button type="button" className="v6-chip" aria-pressed={region === null} onClick={() => setRegion(null)}>
          {UI.all[lang]}
        </button>
        {REGIONS.map((r) => (
          <button key={r} type="button" className="v6-chip" aria-pressed={region === r} onClick={() => setRegion(r)}>
            {regionLabel(r, lang)}
          </button>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
        <FlowMap ids={ids} lit={lit} current={current} label={t('map')} />
        <div className="space-y-4">
          <output htmlFor={`${uid}-year`} aria-live="polite" className="block">
            <span className="block text-7xl leading-none text-primary-300 md:text-8xl">{formatNumber(signed.length, lang)}</span>
            <span className="mt-3 block text-xl">
              {t('byYear')} <bdi>{year}</bdi>
            </span>
          </output>
          <div>
            <p className="v6-muted text-base">
              {t('signedIn')} <bdi>{year}</bdi>
            </p>
            {thisYear.length ? (
              <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto pe-2">
                {thisYear.map((c) => (
                  <li key={c.id}>
                    <Link to={links.country(c.id)} className="inline-flex items-center gap-3 py-1 no-underline hover:underline">
                      <Flag iso={c.iso} alt="" className="h-4 w-6 shrink-0 rounded-[2px] object-cover" />
                      <span className="text-lg">{c.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-lg">{t('noneSigned')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button type="button" onClick={togglePlay} className="v6-icon-btn shrink-0 border border-primary-400 text-[color:var(--egeep-ivory)]">
          {playing ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
          <span className="sr-only">{playing ? t('pause') : t('play')}</span>
        </button>
        <div className="flex-1">
          <label htmlFor={`${uid}-year`} className="sr-only">
            {t('year')}
          </label>
          <input
            id={`${uid}-year`}
            type="range"
            min={FIRST_PARTNERSHIP_YEAR}
            max={CURRENT_YEAR}
            step={1}
            value={year}
            onChange={(e) => {
              setPlaying(false)
              setYear(Number(e.target.value))
            }}
            aria-valuetext={String(year)}
            className="v6-range"
          />
          <ol aria-hidden="true" className="mt-2 flex justify-between text-base text-[color:var(--v6-on-dark-muted)]">
            {YEARS.map((y) => (
              <li key={y} className={y === year ? 'text-primary-300' : ''}>
                <span className={y % 2 && y !== CURRENT_YEAR ? 'max-sm:hidden' : ''}>{y}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
