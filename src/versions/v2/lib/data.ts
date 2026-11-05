import { site } from '../../../data/site'
import type { Area, Country, Stat } from '../../../data/site'

/** Partnership status is judged against this year: terms ending earlier are treated as completed. */
export const REFERENCE_YEAR = 2026

export type PartnershipStatus = 'active' | 'completed'

export interface Partner extends Country {
  /** Common name with the formal state prefix removed, e.g. "Brazil". */
  shortName: string
  start: number | null
  end: number | null
  status: PartnershipStatus | null
}

const FORMAL_PREFIX =
  /^(The )?((Federative|Arab|Hashemite|Co-operative|Federal Democratic|Socialist) )?(Republic|Kingdom|Principality)( of)?( the)? /i

function toYear(value: string | undefined): number | null {
  if (!value) return null
  const year = Number(value)
  return Number.isFinite(year) ? year : null
}

export const partners: Partner[] = site.countries
  .map((country) => {
    const start = toYear(country.startYear)
    const end = toYear(country.endYear)
    const status: PartnershipStatus | null = end === null ? null : end < REFERENCE_YEAR ? 'completed' : 'active'
    return { ...country, shortName: country.name.replace(FORMAL_PREFIX, ''), start, end, status }
  })
  .sort((a, b) => a.shortName.localeCompare(b.shortName))

export function findPartner(id: number): Partner | undefined {
  return partners.find((p) => p.id === id)
}

export function statValue(stats: Stat[] | undefined, label: string): string | undefined {
  return stats?.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value
}

/** Parses a published figure such as "1,200" into a number for sorting. */
export function statNumber(value: string | undefined): number {
  if (!value) return 0
  const n = Number(value.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function paragraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function statusLabel(status: PartnershipStatus | null): string {
  if (status === 'active') return 'Active'
  if (status === 'completed') return 'Completed'
  return 'Term not published'
}

const startYears = partners.map((p) => p.start).filter((y): y is number => y !== null)
const endYears = partners.map((p) => p.end).filter((y): y is number => y !== null)

export const firstSigningYear = Math.min(...startYears)
export const lastSigningYear = Math.max(...startYears)
export const lastEndYear = Math.max(...endYears)

export interface YearGroup {
  year: number
  signed: Partner[]
  ending: Partner[]
}

/** Every calendar year from the first signing to the last scheduled term end. */
export const timeline: YearGroup[] = Array.from(
  { length: lastEndYear - firstSigningYear + 1 },
  (_, i) => firstSigningYear + i,
).map((year) => ({
  year,
  signed: partners.filter((p) => p.start === year),
  ending: partners.filter((p) => p.end === year),
}))

export const signingYears = timeline.filter((g) => g.year <= lastSigningYear)

export const peakSigningCount = Math.max(...signingYears.map((g) => g.signed.length))

export const activeCount = partners.filter((p) => p.status === 'active').length
export const completedCount = partners.filter((p) => p.status === 'completed').length

export const partnersWithWorkstreams = partners.filter((p) => (p.workstreams?.length ?? 0) > 0)

export const workstreamTotal = partners.reduce((sum, p) => sum + (p.workstreams?.length ?? 0), 0)

/** Keywords matched (case-insensitively) against each partner's listed workstreams. */
export const AREA_KEYWORDS: Record<string, string[]> = {
  'government-services': ['government services', 'smart services'],
  'government-excellence': ['excellence'],
  'government-accelerators': ['accelerator'],
  'government-performance': ['performance', 'national plan', 'national agenda'],
  'government-innovation': ['innovation'],
  'competitiveness-and-statistics': ['competitiveness', 'statistic'],
  'leadership-and-capacity-building': ['capacity building', 'leadership', 'capabilities'],
  'government-human-resources': ['human resources', 'civil service'],
  programming: ['programming', 'coders'],
  'startup-and-entrepreneurship': ['startup', 'entrepreneurship', 'business incubator'],
}

export interface AreaReach {
  area: Area
  keywords: string[]
  partners: Partner[]
}

export const areaReach: AreaReach[] = site.areas.map((area) => {
  const keywords = AREA_KEYWORDS[area.slug] ?? [area.title.toLowerCase()]
  const matched = partners.filter((p) =>
    p.workstreams?.some((w) => keywords.some((k) => w.toLowerCase().includes(k))),
  )
  return { area, keywords, partners: matched }
})

export const areaReachRanked = [...areaReach].sort((a, b) => b.partners.length - a.partners.length)

/**
 * Splits an area body into paragraphs and bullet lists. A paragraph ending with ":" introduces
 * a list of short lines; when a long line follows instead, the scraped split is re-joined.
 */
export type BodyBlock = { kind: 'p'; text: string } | { kind: 'list'; items: string[] }

export function bodyBlocks(body: string[]): BodyBlock[] {
  const blocks: BodyBlock[] = []
  for (const line of body) {
    const last = blocks[blocks.length - 1]
    const isItem = line.length < 80 && !/[.:]$/.test(line)
    if (last?.kind === 'list' && isItem) {
      last.items.push(line)
    } else if (last?.kind === 'p' && last.text.endsWith(':')) {
      if (isItem) blocks.push({ kind: 'list', items: [line] })
      else last.text = `${last.text} ${line}`
    } else {
      blocks.push({ kind: 'p', text: line })
    }
  }
  return blocks
}

/** Fixes spelling errors carried over from the source site. */
export function tidy(text: string): string {
  return text.replace(/\bacheive\b/g, 'achieve').replace(/\bits eager\b/g, 'it is eager')
}

export const registration = site.hero.cta
