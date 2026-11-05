import { getSite, site } from '../../../data/site'
import type { Area, Country, SiteData, Stat } from '../../../data/site'
import { compareText, formatNumber, useLang, type Bilingual, type Lang } from '../../../shared/i18n'
import { COUNTRY_REGION, REGION_LABEL, type Region } from '../../../shared/geo'
import { usePageHref } from '../../../shared/BilingualVersion'

/** Content in the current language. Same shape, order, ids and slugs as the English `site`. */
export function useSite(): SiteData {
  return getSite(useLang())
}

export const CURRENT_YEAR = new Date().getFullYear()

export const LAUNCH_YEAR = Number(site.about.launched.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? 2018)

export const REGISTER_URL = site.hero.cta.url

export const PHONE_HREF = `tel:${site.contact.phone.replace(/\s+/g, '')}`

export const EMAIL_HREF = `mailto:${site.contact.email}`

/** English country by id: relationships and figures are computed on the English data. */
const EN_BY_ID = new Map(site.countries.map((c) => [c.id, c]))

export const enCountry = (id: number): Country => EN_BY_ID.get(id)!

/** Country stat as a number for sorting, or undefined when the partnership did not report it. */
export function countryStat(id: number, label: 'Training hours' | 'Workshops' | 'Trainees' | 'Workstreams'): number | undefined {
  const stat = enCountry(id).stats?.find((s) => s.label === label)
  if (!stat) return undefined
  const value = Number(stat.value.replace(/[^\d.]/g, ''))
  return Number.isFinite(value) ? value : undefined
}

export type PartnershipStatus = 'active' | 'completed'

/** A partnership is active until its completion year has passed. */
export function partnershipStatus(country: Country): PartnershipStatus {
  return country.endYear && Number(country.endYear) < CURRENT_YEAR ? 'completed' : 'active'
}

export function partnershipPeriod(country: Country): string {
  if (country.startYear && country.endYear) return `${country.startYear}–${country.endYear}`
  return country.startYear ?? country.endYear ?? ''
}

export const regionOf = (id: number): Region => COUNTRY_REGION[id]

export const REGIONS = Object.keys(REGION_LABEL) as Region[]

export function regionLabel(region: Region, lang: Lang): string {
  return REGION_LABEL[region][lang]
}

export function countryParagraphs(country: Country): string[] {
  return country.description
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Workstream names that partner countries use for an area besides its own title. */
const AREA_WORKSTREAM_ALIASES: Record<string, string[]> = {
  'leadership-and-capacity-building': ['capacity building'],
}

function areaMatchesWorkstream(area: Area, workstream: string): boolean {
  const w = workstream.toLowerCase()
  const names = [area.title.toLowerCase(), ...(AREA_WORKSTREAM_ALIASES[area.slug] ?? [])]
  return names.some((name) => w.startsWith(name))
}

const EN_AREA = new Map(site.areas.map((a) => [a.slug, a]))

/**
 * Ids of partner countries whose workstreams include the area (matched on the English data),
 * ordered by English name so any subset shown is the same in both languages.
 */
export function countryIdsForArea(slug: string): number[] {
  const area = EN_AREA.get(slug)
  if (!area) return []
  return site.countries
    .filter((c) => c.workstreams?.some((w) => areaMatchesWorkstream(area, w)))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    .map((c) => c.id)
}

/** Slugs of the areas a country's workstreams map onto. */
export function areaSlugsForCountry(id: number): string[] {
  const ws = enCountry(id).workstreams ?? []
  return site.areas.filter((a) => ws.some((w) => areaMatchesWorkstream(a, w))).map((a) => a.slug)
}

export function byName(countries: Country[], lang: Lang): Country[] {
  const compare = compareText(lang)
  return [...countries].sort((a, b) => compare(a.name, b.name))
}

export const FIRST_PARTNERSHIP_YEAR = Math.min(...site.countries.map((c) => Number(c.startYear ?? CURRENT_YEAR)))

export const ACTIVE_PARTNERSHIPS = site.countries.filter((c) => partnershipStatus(c) === 'active').length

/** Links within this version and language. */
export function useLinks() {
  const href = usePageHref()
  return {
    href,
    area: (slug: string) => `${href('areas')}#${slug}`,
    country: (id: number) => `${href('countries')}?country=${id}`,
  }
}

/** A stat value split around its first number, e.g. "34.2+ مليون" → 34.2 with suffix "+ مليون". */
export interface ParsedStat {
  prefix: string
  value: number
  decimals: number
  suffix: string
}

export function parseStat(raw: string): ParsedStat | undefined {
  const match = raw.match(/\d[\d,]*(?:\.\d+)?/)
  if (!match || match.index === undefined) return undefined
  const digits = match[0].replace(/,/g, '')
  return {
    prefix: raw.slice(0, match.index),
    value: Number(digits),
    decimals: digits.includes('.') ? digits.split('.')[1].length : 0,
    suffix: raw.slice(match.index + match[0].length),
  }
}

export function formatParsed(stat: ParsedStat, value: number, lang: Lang): string {
  const number = formatNumber(value, lang, {
    minimumFractionDigits: stat.decimals,
    maximumFractionDigits: stat.decimals,
  })
  return `${stat.prefix}${number}${stat.suffix}`
}

/** Plain-language labels for the programme figures, keyed by the English label in `site.stats`. */
export const STAT_LABEL: Record<string, Bilingual> = {
  Country: { en: 'Partner countries', ar: 'دولة شريكة' },
  'UAE Government Entity': { en: 'UAE government entities', ar: 'جهة حكومية إماراتية' },
  Expert: { en: 'Experts', ar: 'خبير' },
  'Training Hour': { en: 'Training hours', ar: 'ساعة تدريبية' },
  Workshop: { en: 'Workshops', ar: 'ورشة عمل' },
  Trainee: { en: 'Trainees', ar: 'متدرب' },
  Countries: { en: 'Countries', ar: 'دولة' },
  'Area of cooperation': { en: 'Areas of cooperation', ar: 'مجال تعاون' },
  'Workshops delivered': { en: 'Workshops delivered', ar: 'ورشة عمل منفذة' },
  Trainees: { en: 'Trainees', ar: 'متدرب' },
}

/** Localized stats with plain-language labels; `en` keeps the English stat at the same index. */
export function localizedStats(group: 'headline' | 'byNumbers', lang: Lang): { stat: Stat; en: Stat; label: string }[] {
  const local = getSite(lang).stats[group]
  return site.stats[group].map((en, i) => ({
    en,
    stat: local[i],
    label: STAT_LABEL[en.label]?.[lang] ?? local[i].label,
  }))
}

export type BodyBlock = { kind: 'p'; text: string } | { kind: 'list'; intro: string; items: string[] }

/**
 * Groups a paragraph ending in ":" with the short lines after it, so they render as a list.
 * The grouping is decided on the English body and applied to the same indexes of the localized body.
 */
export function structureBody(enBody: string[], body: string[]): BodyBlock[] {
  const blocks: BodyBlock[] = []
  for (let i = 0; i < enBody.length; i++) {
    const text = enBody[i]
    if (text.trim().endsWith(':')) {
      const start = i
      while (i + 1 < enBody.length && enBody[i + 1].length < 80 && !/[.…]$/.test(enBody[i + 1].trim())) i++
      if (i > start) {
        blocks.push({ kind: 'list', intro: body[start], items: body.slice(start + 1, i + 1) })
        continue
      }
    }
    blocks.push({ kind: 'p', text: body[i] })
  }
  return blocks
}

export function socialHandle(url: string): string {
  const path = new URL(url).pathname.split('/').filter(Boolean)
  return path.length ? `/${path[path.length - 1]}` : url
}

/** Social platform names in Arabic. */
export const PLATFORM_LABEL: Record<string, Bilingual> = {
  X: { en: 'X', ar: 'إكس' },
  Facebook: { en: 'Facebook', ar: 'فيسبوك' },
  LinkedIn: { en: 'LinkedIn', ar: 'لينكدإن' },
  Instagram: { en: 'Instagram', ar: 'إنستغرام' },
  YouTube: { en: 'YouTube', ar: 'يوتيوب' },
}
