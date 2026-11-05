import { getSite, site } from '../../../data/site'
import type { Area, Country, SiteData } from '../../../data/site'
import { COUNTRY_REGION, type Region } from '../../../shared/geo'
import { useLang, type Lang } from '../../../shared/i18n'

/**
 * Relationships and figures are computed on the English `site` (stable labels, numeric values) and
 * displayed through the localized item with the same id, slug or index (getSite is index-aligned).
 */

/** Content in the current language. */
export function useSite(): SiteData {
  return getSite(useLang())
}

export const CURRENT_YEAR = new Date().getFullYear()

export const LAUNCH_YEAR = site.about.launched.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? ''

export const REGISTER_URL = site.hero.cta.url

export const PHONE_HREF = `tel:${site.contact.phone.replace(/\s+/g, '')}`

export const EMAIL_HREF = `mailto:${site.contact.email}`

export const COUNTRY_INDEX = new Map(site.countries.map((c, i) => [c.id, i]))

export const AREA_INDEX = new Map(site.areas.map((a, i) => [a.slug, i]))

/** Localized country by id. */
export function localCountry(lang: Lang, id: number): Country {
  return getSite(lang).countries[COUNTRY_INDEX.get(id) ?? 0]
}

/** Localized area by slug. */
export function localArea(lang: Lang, slug: string): Area {
  return getSite(lang).areas[AREA_INDEX.get(slug) ?? 0]
}

export const METRICS = ['Training hours', 'Workshops', 'Trainees'] as const
export type Metric = (typeof METRICS)[number]

/** A country's reported figure as a number (English stat labels), or undefined when not reported. */
export function countryStat(country: Country, label: string): number | undefined {
  const en = site.countries[COUNTRY_INDEX.get(country.id) ?? 0]
  const stat = en.stats?.find((s) => s.label.toLowerCase() === label.toLowerCase())
  if (!stat) return undefined
  const value = Number(stat.value.replace(/[^\d.]/g, ''))
  return Number.isFinite(value) ? value : undefined
}

export function workstreamCount(country: Country): number | undefined {
  return country.workstreams?.length ?? countryStat(country, 'Workstreams')
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

export function countryRegion(country: Country): Region {
  return COUNTRY_REGION[country.id] ?? 'asia'
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

/** Matches an English workstream name to an (English) area. */
export function areaMatchesWorkstream(area: Area, workstream: string): boolean {
  const w = workstream.toLowerCase()
  const enArea = site.areas[AREA_INDEX.get(area.slug) ?? 0]
  const names = [enArea.title.toLowerCase(), ...(AREA_WORKSTREAM_ALIASES[area.slug] ?? [])]
  return names.some((name) => w.startsWith(name))
}

/** Ids of the partner countries whose partnership includes each area, keyed by slug. */
export const AREA_PARTNER_IDS: Record<string, number[]> = Object.fromEntries(
  site.areas.map((area) => [
    area.slug,
    site.countries.filter((c) => c.workstreams?.some((w) => areaMatchesWorkstream(area, w))).map((c) => c.id),
  ]),
)

/** Slugs of the areas of cooperation a country's workstreams cover. */
export function areasForCountry(country: Country): string[] {
  return site.areas.filter((a) => AREA_PARTNER_IDS[a.slug].includes(country.id)).map((a) => a.slug)
}

export function countryInArea(country: Country, slug: string): boolean {
  return AREA_PARTNER_IDS[slug]?.includes(country.id) ?? false
}

/** Newest signing first; ties go to the higher id (added later), so both languages pick the same items. */
export function byNewest(countries: Country[]): Country[] {
  return [...countries].sort((a, b) => Number(b.startYear ?? 0) - Number(a.startYear ?? 0) || b.id - a.id)
}

export const ACTIVE_PARTNERSHIPS = site.countries.filter((c) => partnershipStatus(c) === 'active').length

export const FIRST_PARTNERSHIP_YEAR = Math.min(...site.countries.map((c) => Number(c.startYear ?? CURRENT_YEAR)))

/** Signing years in ascending order with the ids of the partnerships signed that year. */
export const SIGNINGS_BY_YEAR: { year: string; ids: number[] }[] = Object.entries(
  site.countries.reduce<Record<string, number[]>>((acc, c) => {
    if (c.startYear) acc[c.startYear] = [...(acc[c.startYear] ?? []), c.id]
    return acc
  }, {}),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([year, ids]) => ({ year, ids }))

/** Countries that reported at least one of training hours, workshops or trainees. */
export const REPORTING_PARTNERS = site.countries.filter((c) => METRICS.some((m) => countryStat(c, m) !== undefined)).length

export type BodyBlock = { kind: 'p'; index: number } | { kind: 'list'; intro: number; items: number[] }

/**
 * Groups a paragraph ending in ":" with the short lines after it, so they render as a list. Computed on
 * the English body; the indexes apply to the index-aligned Arabic body too.
 */
export function structureBody(slug: string): BodyBlock[] {
  const body = site.areas[AREA_INDEX.get(slug) ?? 0].body
  const blocks: BodyBlock[] = []
  for (let i = 0; i < body.length; i++) {
    if (body[i].trim().endsWith(':')) {
      const intro = i
      const items: number[] = []
      while (i + 1 < body.length && body[i + 1].length < 80 && !/[.…]$/.test(body[i + 1].trim())) items.push(++i)
      if (items.length) {
        blocks.push({ kind: 'list', intro, items })
        continue
      }
    }
    blocks.push({ kind: 'p', index: i })
  }
  return blocks
}

export function socialHandle(url: string): string {
  const path = new URL(url).pathname.split('/').filter(Boolean)
  return path.length ? `/${path[path.length - 1]}` : url
}

/** Replaces `{name}` placeholders in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}
