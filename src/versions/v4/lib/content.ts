import { site, type Area, type Country } from '../../../data/site'
import { pageHref, type PageKey } from '../../../shared/pages'

/** Internal URL for a v4 page, optionally with query parameters. */
export function href(key: PageKey, params?: Record<string, string>): string {
  const base = pageHref('v4', key)
  if (!params) return base
  return `${base}?${new URLSearchParams(params).toString()}`
}

/** Partnership status is evaluated against the programme year shown on this portal. */
export const REFERENCE_YEAR = 2026

export type PartnershipStatus = 'active' | 'completed'

export function partnershipStatus(country: Country): PartnershipStatus {
  return country.endYear && Number(country.endYear) < REFERENCE_YEAR ? 'completed' : 'active'
}

export function partnershipPeriod(country: Country): string {
  if (country.startYear && country.endYear) return `${country.startYear}–${country.endYear}`
  return country.startYear ? `Since ${country.startYear}` : 'Period not published'
}

/** Share of the partnership period elapsed at REFERENCE_YEAR, 0–1. */
export function partnershipProgress(country: Country): number {
  const start = Number(country.startYear)
  const end = Number(country.endYear)
  if (!start || !end || end <= start) return partnershipStatus(country) === 'completed' ? 1 : 0
  return Math.min(1, Math.max(0, (REFERENCE_YEAR - start) / (end - start)))
}

/** Workstream count: the published stat when present, otherwise the listed workstreams. */
export function workstreamCount(country: Country): number {
  const stat = country.stats?.find((s) => s.label.toLowerCase() === 'workstreams')
  if (stat) return Number(stat.value.replace(/,/g, ''))
  return country.workstreams?.length ?? 0
}

export function countryStats(country: Country) {
  return (country.stats ?? []).filter((s) => s.label.toLowerCase() !== 'workstreams')
}

export function paragraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export const countriesByName: Country[] = [...site.countries].sort((a, b) =>
  displayName(a).localeCompare(displayName(b)),
)

/** Name without a leading article, for sorting and compact lists. */
export function displayName(country: Country): string {
  return country.name.replace(/^the\s+/i, '')
}

export const signingYears: string[] = [
  ...new Set(site.countries.map((c) => c.startYear).filter((y): y is string => Boolean(y))),
].sort((a, b) => Number(b) - Number(a))

export type AreaBlock = { kind: 'text'; text: string } | { kind: 'list'; items: string[] }

/**
 * Area bodies were scraped as flat paragraphs. A paragraph ending in ":" followed by
 * short label-like lines is a list; a paragraph that continues mid-sentence is joined.
 */
export function areaBlocks(area: Area): AreaBlock[] {
  const blocks: AreaBlock[] = []
  for (const raw of area.body) {
    const text = raw.trim()
    const last = blocks[blocks.length - 1]
    const isListItem = text.length < 60 && !text.includes('.')
    if (last?.kind === 'list' && isListItem) {
      last.items.push(text)
    } else if (last?.kind === 'text' && last.text.endsWith(':')) {
      if (isListItem) blocks.push({ kind: 'list', items: [text] })
      else last.text = `${last.text} ${text}`
    } else {
      blocks.push({ kind: 'text', text })
    }
  }
  return blocks
}

/** Country workstream labels that correspond to each area of cooperation. */
const AREA_WORKSTREAMS: Record<string, string[]> = {
  'leadership-and-capacity-building': ['Leadership and Capacity Building', 'Capacity Building'],
  programming: ['Programming', 'Programming (1M Coders)'],
}

export function countriesForArea(area: Area): Country[] {
  const labels = AREA_WORKSTREAMS[area.slug] ?? [area.title]
  return countriesByName.filter((c) => c.workstreams?.some((w) => labels.includes(w)))
}

export interface Practice {
  id: string
  area: string
  title: string
  summary: string
  highlights?: string[]
}

/** Practices and initiatives as described in the source text of each area of cooperation. */
export const PRACTICES: Practice[] = [
  {
    id: 'service-capacity-building',
    area: 'government-services',
    title: 'Capacity building for service teams',
    summary:
      'Builds world-class skills among the government employees in charge of service design and delivery, so services reach all customer segments, anytime and anywhere.',
  },
  {
    id: 'mobile-application-award',
    area: 'government-services',
    title: 'Government Mobile Application Award',
    summary:
      'Targets university students and invites creative solutions that improve government services through smartphone applications.',
  },
  {
    id: 'excellence-model',
    area: 'government-excellence',
    title: 'A national excellence model',
    summary:
      'Spreads a culture of quality and excellence among government entities’ representatives and develops an excellence model that suits the partner country.',
  },
  {
    id: 'excellence-award',
    area: 'government-excellence',
    title: 'Government Excellence Award',
    summary:
      'Launches an official Government Excellence Award and runs the first assessment cycle across the country’s government entities to enhance their performance.',
  },
  {
    id: 'accelerated-delivery',
    area: 'government-accelerators',
    title: 'Accelerated delivery of priorities',
    summary:
      'A platform for federal and local entities to address challenges and achieve ambitious goals over short periods of time.',
    highlights: ['Strategic programmes', 'Policies and regulations', 'Government services'],
  },
  {
    id: 'three-team-governance',
    area: 'government-accelerators',
    title: 'Three-team governance model',
    summary:
      'Forms leadership, sponsor and accelerator teams to empower the accelerator team and avoid bureaucracy in decision making.',
    highlights: ['Leadership team', 'Sponsors', 'Accelerator team'],
  },
  {
    id: 'cross-sector-integration',
    area: 'government-accelerators',
    title: 'Cross-sector collaboration',
    summary:
      'Re-thinks how government works through integration between federal and local entities, the private sector, academic institutions and NGOs.',
  },
  {
    id: 'performance-framework',
    area: 'government-performance',
    title: 'Government performance framework',
    summary:
      'Enriches the partner government’s performance management experience and ensures alignment among government entities and stakeholders.',
  },
  {
    id: 'national-agenda',
    area: 'government-performance',
    title: 'National agenda roadmap',
    summary:
      'Translates the country’s vision into reality with a developmental roadmap built on national priorities, strategic KPIs and a performance management system.',
    highlights: ['National priorities and goals', 'National and strategic KPIs', 'Performance management system'],
  },
  {
    id: 'innovation-framework',
    area: 'government-innovation',
    title: 'Integrated innovation framework',
    summary:
      'The Mohammed Bin Rashid Centre for Government Innovation makes innovation an everyday practice by experimenting with new approaches and enabling people with the right capabilities, networks and resources.',
  },
  {
    id: 'competitiveness-reports',
    area: 'competitiveness-and-statistics',
    title: 'Managing global competitiveness reports',
    summary:
      'Shares the UAE’s experience in managing and monitoring global competitiveness reports across competitiveness, entrepreneurship, prosperity, innovation and technology.',
  },
  {
    id: 'report-publishers',
    area: 'competitiveness-and-statistics',
    title: 'Working with report publishers',
    summary:
      'Establishes strong ties with subject matter experts at the international organisations that publish competitiveness reports, to streamline requirements and understand each report’s cycle.',
  },
  {
    id: 'change-agents',
    area: 'leadership-and-capacity-building',
    title: 'Developing change agents',
    summary:
      'Programmes that create change agents within government to engage with, lead, innovate and reinvigorate their nation’s success, tailored to each government’s needs.',
    highlights: ['Trainings', 'Workshops', 'Forums', 'Panel discussions', 'Online courses'],
  },
  {
    id: 'hr-systems',
    area: 'government-human-resources',
    title: 'HR systems, policies and legislation',
    summary:
      'Applies novel concepts and international human resources standards to set the systems, policies and legislation that best manage human capital in government.',
  },
  {
    id: 'one-million-arab-coders',
    area: 'programming',
    title: 'One Million Arab Coders',
    summary:
      'Launched in October 2017 with Dubai Future Foundation to empower Arab youth with the language of the future through free online courses and certifications from Udacity and Microsoft.',
  },
  {
    id: 'area-2071',
    area: 'startup-and-entrepreneurship',
    title: 'AREA 2071 innovation ecosystem',
    summary:
      'Brings together talents, government officials and private sector cadres to design and test innovative solutions, with strategic collaborations and growth opportunities for members.',
    highlights: [
      'Dubai Future Accelerators',
      'Country in Residence',
      'University Entrepreneurship Program',
      'Dubai Future Academy',
    ],
  },
]
