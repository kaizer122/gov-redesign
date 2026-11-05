import type { Lang } from './i18n'

/**
 * The core page set every version must implement. Each page renders exactly one
 * `<main id="main" data-page={key}>` containing exactly one `<h1>`.
 * The Playwright check (tests/versions.spec.ts) iterates this list.
 */
export const PAGES = [
  { key: 'home', path: '', label: 'Home', labelAr: 'الرئيسية' },
  { key: 'about', path: 'about', label: 'About', labelAr: 'من نحن' },
  { key: 'areas', path: 'areas', label: 'Areas of Cooperation', labelAr: 'مجالات التعاون' },
  { key: 'countries', path: 'countries', label: 'Participating Countries', labelAr: 'الدول المشاركة' },
  { key: 'best-practices', path: 'best-practices', label: 'Best Practices', labelAr: 'أفضل الممارسات' },
  { key: 'activities', path: 'activities', label: 'Activities', labelAr: 'الأنشطة' },
  { key: 'media', path: 'media', label: 'Media Center', labelAr: 'المركز الإعلامي' },
  { key: 'contact', path: 'contact', label: 'Contact', labelAr: 'تواصل معنا' },
] as const

export type PageKey = (typeof PAGES)[number]['key']

/** Page label in the given language. */
export function pageLabel(key: PageKey, lang: Lang = 'en'): string {
  const page = PAGES.find((p) => p.key === key)!
  return lang === 'ar' ? page.labelAr : page.label
}

/**
 * Iteration 1 (v1–v4) predates the EGEEP brand guideline and is English-only.
 * Iteration 2 (v5–v8) applies DESIGN.md and is bilingual: every page exists under /<id>/en and /<id>/ar.
 */
export const VERSIONS = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8'] as const

export type VersionId = (typeof VERSIONS)[number]

export const BILINGUAL_VERSIONS: readonly VersionId[] = ['v5', 'v6', 'v7', 'v8']

export const isBilingual = (version: VersionId) => BILINGUAL_VERSIONS.includes(version)

/** Each version exports this from src/versions/<id>/meta.ts. */
export interface VersionMeta {
  id: VersionId
  iteration: 1 | 2
  name: string
  concept: string
}

/**
 * Absolute URL for a page within a version. Bilingual versions need `lang`:
 * pageHref('v2', 'about') → "/v2/about"; pageHref('v5', 'about', 'ar') → "/v5/ar/about".
 */
export function pageHref(version: VersionId, key: PageKey, lang?: Lang): string {
  const page = PAGES.find((p) => p.key === key)!
  const base = lang ? `/${version}/${lang}` : `/${version}`
  return page.path ? `${base}/${page.path}` : base
}
