import { getSite, site } from '../../../data/site'
import type { Area, Country } from '../../../data/site'
import { compareText, type Lang } from '../../../shared/i18n'

/**
 * Relationships (workstream ↔ area matching, stats, years) are computed on the English `site`
 * and the localized item with the same id or slug is displayed: both languages share ids, slugs
 * and order (src/data/site.ts).
 */

export const CURRENT_YEAR = new Date().getFullYear()

export const LAUNCH_YEAR = site.about.launched.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? ''

export const REGISTER_URL = site.hero.cta.url

export const PHONE_HREF = `tel:${site.contact.phone.replace(/\s+/g, '')}`

export const EMAIL_HREF = `mailto:${site.contact.email}`

/** Localized country by id. */
export function countryById(lang: Lang, id: number): Country | undefined {
  return getSite(lang).countries.find((c) => c.id === id)
}

/** Localized area by slug. */
export function areaBySlug(lang: Lang, slug: string): Area | undefined {
  return getSite(lang).areas.find((a) => a.slug === slug)
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

export const ACTIVE_PARTNERSHIPS = site.countries.filter((c) => partnershipStatus(c) === 'active').length

/** English stat labels the programme uses, in reading order. */
export const METRICS = ['Training hours', 'Workshops', 'Trainees'] as const
export type Metric = (typeof METRICS)[number]

/** Country stat as a number (from the English data), or undefined when the partnership did not report it. */
export function countryStat(id: number, label: string): number | undefined {
  const stat = site.countries.find((c) => c.id === id)?.stats?.find((s) => s.label.toLowerCase() === label.toLowerCase())
  if (!stat) return undefined
  const value = Number(stat.value.replace(/[^\d.]/g, ''))
  return Number.isFinite(value) ? value : undefined
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

const AREA_COUNTRY_IDS: Record<string, number[]> = Object.fromEntries(
  site.areas.map((a) => [a.slug, site.countries.filter((c) => c.workstreams?.some((w) => areaMatchesWorkstream(a, w))).map((c) => c.id)]),
)

/** Localized partner countries whose workstreams include this area, sorted by name. */
export function countriesForArea(lang: Lang, slug: string): Country[] {
  const ids = AREA_COUNTRY_IDS[slug] ?? []
  return byName(
    lang,
    getSite(lang).countries.filter((c) => ids.includes(c.id)),
  )
}

/** Localized areas of cooperation that this country's workstreams match. */
export function areasForCountry(lang: Lang, id: number): Area[] {
  const slugs = site.areas.filter((a) => AREA_COUNTRY_IDS[a.slug]?.includes(id)).map((a) => a.slug)
  return getSite(lang).areas.filter((a) => slugs.includes(a.slug))
}

/** Formal prefixes skipped when filing a country name in the alphabetical index. */
const EN_PREFIX =
  /^(the\s+)?((federal democratic|federative|co-operative|socialist|arab|hashemite)\s+)?(republic|kingdom|principality)(\s+of)?\s+(the\s+)?/i
const AR_PREFIX = /^(ال)?(جمهورية|مملكة|دولة|إمارة|سلطنة)\s+/
const AR_PREFIX_WORDS = ['المملكة', 'الجمهورية', 'جمهورية', 'مملكة', 'دولة', 'إمارة', 'إقليم', 'سلطنة']

/** The name a country is filed under: "Republic of Rwanda" → "Rwanda", "جمهورية مصر العربية" → "مصر العربية". */
export function filingName(name: string, lang: Lang): string {
  if (lang === 'en') return name.replace(EN_PREFIX, '') || name
  let rest = name.trim()
  for (const word of AR_PREFIX_WORDS) {
    if (rest.startsWith(`${word} `)) {
      rest = rest.slice(word.length + 1)
      break
    }
  }
  rest = rest.replace(AR_PREFIX, '')
  return rest.startsWith('ال') && rest.length > 3 ? rest.slice(2) : rest
}

/** Index letter for a country name: Latin capital in English, base Arabic letter in Arabic. */
export function indexLetter(name: string, lang: Lang): string {
  const first = filingName(name, lang).charAt(0)
  if (lang === 'en') return first.normalize('NFD').charAt(0).toUpperCase()
  return first.replace(/[أإآ]/, 'ا')
}

export const ALPHABET: Record<Lang, string[]> = {
  en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  ar: 'ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي'.split(' '),
}

export function byName(lang: Lang, countries: Country[]): Country[] {
  const compare = compareText(lang)
  return [...countries].sort((a, b) => compare(filingName(a.name, lang), filingName(b.name, lang)))
}

/** Localized countries grouped by index letter, in alphabet order. */
export function atlasGroups(lang: Lang): [string, Country[]][] {
  const groups = new Map<string, Country[]>()
  for (const c of byName(lang, getSite(lang).countries)) {
    const letter = indexLetter(c.name, lang)
    groups.set(letter, [...(groups.get(letter) ?? []), c])
  }
  const order = ALPHABET[lang]
  return [...groups.entries()].sort(([a], [b]) => {
    const ia = order.indexOf(a)
    const ib = order.indexOf(b)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b)
  })
}

/** Localized countries grouped by signing year, oldest first. */
export function signingYears(lang: Lang): { year: string; countries: Country[] }[] {
  const years = [...new Set(site.countries.map((c) => c.startYear).filter((y): y is string => Boolean(y)))].sort()
  return years.map((year) => ({
    year,
    countries: byName(
      lang,
      getSite(lang).countries.filter((c) => c.startYear === year),
    ),
  }))
}

export const FIRST_YEAR = Math.min(...site.countries.map((c) => Number(c.startYear ?? CURRENT_YEAR)))
export const LATEST_YEAR = Math.max(...site.countries.map((c) => Number(c.startYear ?? 0)))

export function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export type BodyBlock = { kind: 'p'; text: string } | { kind: 'list'; intro: string; items: string[] }

/**
 * Groups a paragraph ending in ":" with the short lines after it, so they render as a list. The
 * structure is decided on the English body and applied by index to the localized one.
 */
export function structureBody(slug: string, body: string[]): BodyBlock[] {
  const en = site.areas.find((a) => a.slug === slug)?.body ?? body
  const blocks: BodyBlock[] = []
  for (let i = 0; i < en.length; i++) {
    if (en[i].trim().endsWith(':')) {
      const start = i
      while (i + 1 < en.length && en[i + 1].length < 80 && !/[.…]$/.test(en[i + 1].trim())) i++
      if (i > start) {
        blocks.push({ kind: 'list', intro: body[start], items: body.slice(start + 1, i + 1) })
        continue
      }
    }
    blocks.push({ kind: 'p', text: body[i] })
  }
  return blocks
}

/** Leading number of a figure such as "34.2+M" or "2,500+", with its decimals and the text around it. */
export function parseFigure(value: string): { number: number; decimals: number; prefix: string; suffix: string } | undefined {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/)
  if (!match) return undefined
  const digits = match[2].replace(/,/g, '')
  return {
    prefix: match[1],
    number: Number(digits),
    decimals: digits.includes('.') ? digits.split('.')[1].length : 0,
    suffix: match[3],
  }
}

export function socialHandle(url: string): string {
  const path = new URL(url).pathname.split('/').filter(Boolean)
  return path.length ? `/${path[path.length - 1]}` : url
}
