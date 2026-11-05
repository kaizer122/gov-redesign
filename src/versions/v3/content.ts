import { site, type Area, type Country, type Quote } from '../../data/site'
import { pageHref, type PageKey } from '../../shared/pages'

export const href = (key: PageKey) => pageHref('v3', key)

/** Fixes spacing and spelling slips carried over from the source pages. */
function tidy(text: string): string {
  return text
    .replace(/([a-z])\.([A-Z][a-z])/g, '$1. $2')
    .replace(/\bthe the\b/gi, 'the')
    .replace(/\bacheive\b/g, 'achieve')
    .replace(/\bits eager\b/g, 'it is eager')
    .trim()
}

export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map(tidy)
    .filter(Boolean)
}

export function sentences(text: string): string[] {
  return tidy(text)
    .split(/(?<!\bH\.H\.)(?<=[.!?])\s+(?=[A-Z“"])/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** A verbatim sentence from an area's own text, sized for a pull quote (excerpted with an ellipsis if needed). */
export function pullQuote(area: Area): string {
  const all = area.body.flatMap(sentences)
  const candidates = all.filter((s) => s.length >= 70 && s.length <= 230 && !s.endsWith(':'))
  const pool = candidates.length > 1 ? candidates.slice(1) : candidates
  if (pool.length > 0) {
    return pool.reduce((best, s) => (Math.abs(s.length - 140) < Math.abs(best.length - 140) ? s : best))
  }
  const thesis = all[0] ?? area.summary
  if (thesis.length <= 230) return thesis
  const head = thesis.slice(0, 221)
  const comma = head.lastIndexOf(',')
  const cut = comma >= 90 ? comma : head.lastIndexOf(' ', 200)
  return `${thesis.slice(0, cut)}…`
}

export type Block = { kind: 'p'; text: string } | { kind: 'list'; items: string[] }

/** Groups short label-like lines (e.g. programme names) into lists. */
export function toBlocks(body: string[]): Block[] {
  const blocks: Block[] = []
  for (const raw of body) {
    const text = tidy(raw)
    const isItem = text.length < 60 && !/[.:]$/.test(text)
    const last = blocks[blocks.length - 1]
    if (isItem && last?.kind === 'list') last.items.push(text)
    else if (isItem) blocks.push({ kind: 'list', items: [text] })
    else blocks.push({ kind: 'p', text })
  }
  return blocks
}

export const chapterNo = (index: number) => String(index + 1).padStart(2, '0')

const OFFICIAL_PREFIX =
  /^(?:the\s+)?(?:(?:federative|co-operative|socialist|federal democratic|arab|hashemite)\s+)?(?:republic|kingdom|principality)\s+(?:of\s+)?(?:the\s+)?(?=\S)/i

/** Short name used to file a country in the A–Z index, derived from its official name. */
export function indexName(country: Country): string {
  return country.name.replace(OFFICIAL_PREFIX, '').replace(/^the\s+/i, '')
}

export function indexLetter(country: Country): string {
  return indexName(country).normalize('NFD').charAt(0).toUpperCase()
}

export const countriesAZ: Country[] = [...site.countries].sort((a, b) =>
  indexName(a).localeCompare(indexName(b), 'en'),
)

export const countriesByStart: Country[] = [...site.countries].sort(
  (a, b) => Number(b.startYear ?? 0) - Number(a.startYear ?? 0) || indexName(a).localeCompare(indexName(b), 'en'),
)

export const countryAnchor = (country: Country) => `country-${country.id}`

export function partnersFor(area: Area): Country[] {
  return countriesAZ.filter((c) => c.workstreams?.includes(area.title))
}

export function years(country: Country): string | null {
  if (country.startYear && country.endYear) return `${country.startYear}–${country.endYear}`
  return country.startYear ?? null
}

/** Focal point for each portrait so the subject stays in frame when cropped. */
const FOCUS: Record<string, string> = {
  '/media/quotes/the-late-sheikh-zayed-bin-sultan-al-nahyan.jpg': '70% 30%',
  '/media/quotes/his-highness-sheikh-mohammed-bin-rashid-al-maktoum.jpg': '40% 30%',
  '/media/quotes/his-highness-sheikh-mohamed-bin-zayed-al-nahyan.jpg': '62% 25%',
  '/media/quotes/his-highness-sheikh-mohammed-bin-rashid-al-maktoum-best-practices.jpg': '35% 20%',
}

export const focusOf = (quote: Quote) => (quote.image && FOCUS[quote.image]) ?? '50% 30%'

export const [quoteZayed, quoteMbr, quoteMbz] = site.quotes

export const registration = site.hero.cta
