/** Contract for data/site.json — scraped from Wayback captures of governmentexchange.gov.ae/en. */

/** Image path relative to site root, served from public/ (e.g. "/media/areas/services.jpg"). */
export type ImagePath = string

export interface Stat {
  value: string
  label: string
}

export interface Quote {
  text: string
  author: string
  role?: string
  image?: ImagePath
}

export interface Area {
  slug: string
  title: string
  summary: string
  body: string[]
  image?: ImagePath
  logo?: ImagePath
}

export interface Country {
  id: number
  name: string
  iso: string
  description: string
  flag?: ImagePath
  /** Cooperation workstreams listed in the country's partnership details. */
  workstreams?: string[]
  /** Partnership signing year. */
  startYear?: string
  /** Partnership completion year. */
  endYear?: string
  stats?: Stat[]
}

export interface BestPractice {
  title: string
  summary: string
  area?: string
  image?: ImagePath
}

export interface Activity {
  title: string
  date?: string
  summary: string
  country?: string
  image?: ImagePath
}

export interface MediaItem {
  title: string
  date?: string
  type: 'photo' | 'video' | 'report' | 'news'
  image?: ImagePath
  url?: string
}

export interface SiteData {
  meta: {
    siteName: string
    shortName: string
    description: string
    source: string
    capturedAt: string
    logo?: ImagePath
  }
  nav: { label: string; key: string }[]
  hero: {
    title: string
    subtitle: string
    cta: { label: string; url: string }
    images: ImagePath[]
  }
  quotes: Quote[]
  about: {
    intro: string[]
    launched: string
    methodology: string
    tools: string[]
    workflow: string[]
    slogan: string[]
    vision?: string
    mission?: string
  }
  stats: {
    headline: Stat[]
    byNumbers: Stat[]
  }
  areas: Area[]
  countries: Country[]
  bestPractices: BestPractice[]
  bestPracticesIntro: {
    title: string
    body: string[]
    quote?: Quote
  }
  activities: Activity[]
  media: MediaItem[]
  contact: {
    office: string
    address: string
    phone: string
    email: string
    hours?: string
    social: { platform: string; url: string }[]
  }
  contactForm?: {
    subjects: string[]
  }
}

/**
 * Contract for data/site.ar.json: the Arabic text for SiteData. It holds strings only; src/data/site.ts
 * merges it onto site.json, so images, ids, ISO codes, years and stat values stay single-sourced.
 * Arrays are index-aligned with site.json; areas and countries are keyed by slug and id.
 * Numbers keep Western Arabic digits (DESIGN.md#typography).
 */
export interface SiteTranslation {
  meta: { siteName: string; shortName: string; description: string }
  /** Nav labels keyed by nav key. */
  nav: Record<string, string>
  hero: { title: string; subtitle: string; ctaLabel: string }
  quotes: { text: string; author: string; role?: string }[]
  about: {
    intro: string[]
    launched: string
    methodology: string
    tools: string[]
    workflow: string[]
    slogan: string[]
  }
  stats: { headline: Stat[]; byNumbers: Stat[] }
  areas: Record<string, { title: string; summary: string; body: string[] }>
  countries: Record<string, { name: string; description: string }>
  /** Workstream names keyed by their English name (shared by all countries). */
  workstreams: Record<string, string>
  /** Per-country stat labels keyed by their English label ("Training hours", ...). */
  countryStatLabels: Record<string, string>
  bestPracticesIntro: { title: string; body: string[]; quote: { text: string; author: string; role?: string } }
  media: { title: string }[]
  contact: { office: string; address: string }
  contactForm: { subjects: string[] }
}
