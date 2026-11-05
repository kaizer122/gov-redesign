import { site } from '../../../data/site'
import type { Area, Country } from '../../../data/site'
import { PAGES, pageHref, type PageKey } from '../../../shared/pages'

export const href = (key: PageKey) => pageHref('v1', key)

export const areaHref = (slug: string) => `${href('areas')}#${slug}`

export const countryHref = (id: number) => `${href('countries')}?country=${id}`

export const pageLabel = (key: PageKey) => PAGES.find((p) => p.key === key)!.label

/** Resolves the page key for a pathname inside this version, e.g. "/v1/about" → "about". */
export function pageKeyFromPath(pathname: string): PageKey | undefined {
  const rest = pathname.replace(/^\/v1\/?/, '').split('/')[0]
  return PAGES.find((p) => p.path === rest)?.key
}

export const CURRENT_YEAR = new Date().getFullYear()

export const LAUNCH_YEAR = site.about.launched.match(/\b(?:19|20)\d{2}\b/)?.[0]

export const REGISTER_URL = site.hero.cta.url

export const PHONE_HREF = `tel:${site.contact.phone.replace(/\s+/g, '')}`

export const EMAIL_HREF = `mailto:${site.contact.email}`

/** Plain-language labels for the figures in `site.stats`. */
export const STAT_LABELS: Record<string, string> = {
  Country: 'Partner countries',
  'UAE Government Entity': 'UAE government entities',
  Expert: 'Experts',
  'Training Hour': 'Training hours',
  Workshop: 'Workshops',
  Trainee: 'Trainees',
  Countries: 'Countries',
  'Area of cooperation': 'Areas of cooperation',
}

/** Country stat as a number for sorting, or undefined when the partnership did not report it. */
export function countryStat(country: Country, label: string): number | undefined {
  const stat = country.stats?.find((s) => s.label.toLowerCase() === label.toLowerCase())
  if (!stat) return undefined
  const value = Number(stat.value.replace(/[^\d.]/g, ''))
  return Number.isFinite(value) ? value : undefined
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

export const STATUS_LABEL: Record<PartnershipStatus, string> = {
  active: 'Active',
  completed: 'Completed',
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

export function areaMatchesWorkstream(area: Area, workstream: string): boolean {
  const w = workstream.toLowerCase()
  const names = [area.title.toLowerCase(), ...(AREA_WORKSTREAM_ALIASES[area.slug] ?? [])]
  return names.some((name) => w.startsWith(name))
}

export function countriesForArea(area: Area): Country[] {
  return byName(site.countries.filter((c) => c.workstreams?.some((w) => areaMatchesWorkstream(area, w))))
}

export function byName(countries: Country[]): Country[] {
  return [...countries].sort((a, b) => a.name.localeCompare(b.name))
}

export function byNewest(countries: Country[]): Country[] {
  return [...countries].sort(
    (a, b) => Number(b.startYear ?? 0) - Number(a.startYear ?? 0) || a.name.localeCompare(b.name),
  )
}

export const FIRST_PARTNERSHIP_YEAR = Math.min(...site.countries.map((c) => Number(c.startYear ?? CURRENT_YEAR)))

export const ACTIVE_PARTNERSHIPS = site.countries.filter((c) => partnershipStatus(c) === 'active').length

export type BodyBlock = { kind: 'p'; text: string } | { kind: 'list'; intro: string; items: string[] }

/** Groups a paragraph ending in ":" with the short lines after it, so they render as a list. */
export function structureBody(body: string[]): BodyBlock[] {
  const blocks: BodyBlock[] = []
  for (let i = 0; i < body.length; i++) {
    const text = body[i]
    if (text.trim().endsWith(':')) {
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
