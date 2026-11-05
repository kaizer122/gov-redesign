const flagUrls = import.meta.glob<string>('/node_modules/country-flag-icons/3x2/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
})

/** URL of the 3:2 SVG flag for an ISO 3166-1 alpha-2 code, or undefined if none exists. */
export function flagUrl(iso: string): string | undefined {
  return flagUrls[`/node_modules/country-flag-icons/3x2/${iso.toUpperCase()}.svg`]
}

interface FlagProps {
  iso: string
  /** Accessible name; pass "" when the country name is already adjacent (decorative flag). */
  alt: string
  className?: string
}

/** 3:2 country flag rendered as a self-hosted SVG image. */
export function Flag({ iso, alt, className }: FlagProps) {
  const src = flagUrl(iso)
  if (!src) return null
  return <img src={src} alt={alt} className={className} loading="lazy" width={36} height={24} />
}
