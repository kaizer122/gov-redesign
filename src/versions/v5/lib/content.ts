import { getSite, site } from '../../../data/site'
import type { Area, Country, Stat } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { compareText, type Bilingual, type Lang } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'

/** Page, area-anchor and country-detail URLs in the current version and language. */
export function useLinks() {
  const href = usePageHref()
  return {
    href,
    areaHref: (slug: string) => `${href('areas')}#${slug}`,
    countryHref: (id: number) => `${href('countries')}?country=${id}`,
  }
}

export const CURRENT_YEAR = new Date().getFullYear()

export const LAUNCH_YEAR = site.about.launched.match(/\b(?:19|20)\d{2}\b/)?.[0]

export const REGISTER_URL = site.hero.cta.url

export const PHONE_HREF = `tel:${site.contact.phone.replace(/\s+/g, '')}`

export const EMAIL_HREF = `mailto:${site.contact.email}`

/** Plain-language labels for the figures in `site.stats`, keyed by the English source label. */
const STAT_LABELS: Record<string, Bilingual> = {
  Country: { en: 'Partner countries', ar: 'الدول الشريكة' },
  'UAE Government Entity': { en: 'UAE government entities', ar: 'الجهات الحكومية الإماراتية' },
  Expert: { en: 'Experts', ar: 'الخبراء' },
  'Training Hour': { en: 'Training hours', ar: 'ساعات التدريب' },
  Workshop: { en: 'Workshops', ar: 'ورش العمل' },
  Trainee: { en: 'Trainees', ar: 'المتدربون' },
  Countries: { en: 'Countries', ar: 'الدول' },
  'Area of cooperation': { en: 'Areas of cooperation', ar: 'مجالات التعاون' },
  'Workshops delivered': { en: 'Workshops delivered', ar: 'ورش العمل المنفذة' },
  Trainees: { en: 'Trainees', ar: 'المتدربون' },
}

export interface LabelledStat {
  value: string
  label: string
}

/** Localized figures of `site.stats[list]`, with plain labels. Values come from the localized data. */
export function statsFor(list: 'headline' | 'byNumbers', lang: Lang): LabelledStat[] {
  const local = getSite(lang).stats[list]
  return site.stats[list].map((s: Stat, i) => ({
    value: local[i]?.value ?? s.value,
    label: STAT_LABELS[s.label]?.[lang] ?? local[i]?.label ?? s.label,
  }))
}

const COUNTRY_INDEX = new Map(site.countries.map((c, i) => [c.id, i]))

/** The same country in another language (ids are shared). */
export function inLang(country: Country, lang: Lang): Country {
  return getSite(lang).countries[COUNTRY_INDEX.get(country.id) ?? 0]
}

/** English record of a country, for matching and numeric stats. */
export const english = (country: Country): Country => inLang(country, 'en')

/** Country stat as a number for sorting (English label), or undefined when not reported. */
export function countryStat(country: Country, label: string): number | undefined {
  const stat = english(country).stats?.find((s) => s.label.toLowerCase() === label.toLowerCase())
  if (!stat) return undefined
  const value = Number(stat.value.replace(/[^\d.]/g, ''))
  return Number.isFinite(value) ? value : undefined
}

/** Localized value of a country stat by its English label. */
export function countryStatText(country: Country, label: string): string | undefined {
  const index = english(country).stats?.findIndex((s) => s.label === label) ?? -1
  return index >= 0 ? country.stats?.[index]?.value : undefined
}

export function partnershipPeriod(country: Country): string {
  if (country.startYear && country.endYear) return `${country.startYear}–${country.endYear}`
  return country.startYear ?? country.endYear ?? ''
}

export type PartnershipStatus = 'active' | 'completed'

/** A partnership is active until its completion year has passed. */
export function partnershipStatus(country: Country): PartnershipStatus {
  return country.endYear && Number(country.endYear) < CURRENT_YEAR ? 'completed' : 'active'
}

export const STATUS_LABEL: Record<PartnershipStatus, Bilingual> = {
  active: UI.active,
  completed: UI.completed,
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

/** Matches on the English data, so it works in both languages. */
export function countryHasArea(country: Country, slug: string): boolean {
  const area: Area | undefined = site.areas.find((a) => a.slug === slug)
  if (!area) return false
  const names = [area.title.toLowerCase(), ...(AREA_WORKSTREAM_ALIASES[slug] ?? [])]
  return english(country).workstreams?.some((w) => names.some((n) => w.toLowerCase().startsWith(n))) ?? false
}

/** Partner countries whose partnership includes the area, in the given language, sorted by name. */
export function countriesForArea(slug: string, lang: Lang): Country[] {
  return byName(
    getSite(lang).countries.filter((c) => countryHasArea(c, slug)),
    lang,
  )
}

export function byName(countries: Country[], lang: Lang): Country[] {
  const compare = compareText(lang)
  return [...countries].sort((a, b) => compare(a.name, b.name))
}

/** Newest signing year first; within a year, the most recently added partner (highest id) first, so both languages list the same partners. */
export function byNewest(countries: Country[]): Country[] {
  return [...countries].sort((a, b) => Number(b.startYear ?? 0) - Number(a.startYear ?? 0) || b.id - a.id)
}

export const FIRST_PARTNERSHIP_YEAR = Math.min(...site.countries.map((c) => Number(c.startYear ?? CURRENT_YEAR)))

export const ACTIVE_PARTNERSHIPS = site.countries.filter((c) => partnershipStatus(c) === 'active').length

export type BodyBlock = { kind: 'p'; text: string } | { kind: 'list'; intro: string; items: string[] }

/** Groups a paragraph ending in ":" with the short lines after it, so they render as a list. */
export function structureBody(body: string[]): BodyBlock[] {
  const blocks: BodyBlock[] = []
  for (let i = 0; i < body.length; i++) {
    const text = body[i]
    if (/[:：]$/.test(text.trim())) {
      const items: string[] = []
      while (i + 1 < body.length && body[i + 1].length < 80 && !/[.…]$/.test(body[i + 1].trim())) {
        items.push(body[++i])
      }
      if (items.length) {
        blocks.push({ kind: 'list', intro: text, items })
        continue
      }
    }
    blocks.push({ kind: 'p', text })
  }
  return blocks
}

export function socialHandle(url: string): string {
  const path = new URL(url).pathname.split('/').filter(Boolean)
  return path.length ? `/${path[path.length - 1]}` : url
}

/** Splits "34.2+ مليون" or "2,500+" into a number to count up to and the text around it. */
export function parseFigure(value: string): { number: number; decimals: number; prefix: string; suffix: string } | undefined {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/)
  if (!match) return undefined
  const [, prefix, digits, suffix] = match
  const number = Number(digits.replace(/,/g, ''))
  if (!Number.isFinite(number)) return undefined
  return { number, decimals: digits.split('.')[1]?.length ?? 0, prefix, suffix }
}
