import { createContext, useContext } from 'react'

/** Languages of the iteration 2 (bilingual) versions. The URL segment after the version id. */
export const LANGS = ['en', 'ar'] as const

export type Lang = (typeof LANGS)[number]

export type Dir = 'ltr' | 'rtl'

/** A value in both languages, e.g. a UI string. */
export type Bilingual<T = string> = Record<Lang, T>

export const isLang = (value: string | undefined): value is Lang => (LANGS as readonly string[]).includes(value ?? '')

export const dirOf = (lang: Lang): Dir => (lang === 'ar' ? 'rtl' : 'ltr')

export const otherLang = (lang: Lang): Lang => (lang === 'ar' ? 'en' : 'ar')

/**
 * Locale for Intl APIs. `nu-latn` keeps Western Arabic digits (0–9) in Arabic text: the brand
 * forbids Eastern Arabic digits (DESIGN.md#typography).
 */
export const LOCALE: Record<Lang, string> = { en: 'en-AE', ar: 'ar-AE-u-nu-latn' }

export function formatNumber(value: number, lang: Lang, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE[lang], options).format(value)
}

export function formatDate(date: Date, lang: Lang, options: Intl.DateTimeFormatOptions = { dateStyle: 'long' }): string {
  return new Intl.DateTimeFormat(LOCALE[lang], options).format(date)
}

/** Locale-aware string comparison for sorting names in the current language. */
export function compareText(lang: Lang): (a: string, b: string) => number {
  const collator = new Intl.Collator(LOCALE[lang])
  return collator.compare
}

export const LangContext = createContext<Lang>('en')

/** Current language of a bilingual version (provided by BilingualVersion). */
export const useLang = (): Lang => useContext(LangContext)

/** Returns a lookup into a bilingual dictionary for the current language: `t('readMore')`. */
export function useT<K extends string>(dict: Record<K, Bilingual>): (key: K) => string {
  const lang = useLang()
  return (key) => dict[key][lang]
}
