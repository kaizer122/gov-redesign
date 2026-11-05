import type { Bilingual } from './i18n'
import { useLang } from './i18n'
import { UI } from './strings'

/** Approved EGEEP lockups (DESIGN.md#logo) with their artboard size in pt, for intrinsic width/height. */
const LOCKUPS = {
  bilingual: { width: 454, height: 166 },
  arabic: { width: 436, height: 156 },
  english: { width: 436, height: 135 },
} as const

export type LogoLockup = keyof typeof LOCKUPS

/**
 * full-colour: white backgrounds · black: light tinted backgrounds · white: dark backgrounds ·
 * gold: only where full colour can't be reproduced. Never place the logo on photography.
 */
export type LogoColourway = 'full-colour' | 'black' | 'white' | 'gold'

interface LogoProps {
  lockup?: LogoLockup
  colourway?: LogoColourway
  className?: string
}

/**
 * The EGEEP logo as an approved, unmodified file. Size it with height (or width) only: no
 * filters, opacity, shadows, transforms or animation (DESIGN.md#misuse). Keep a clear space of
 * at least 18% of the rendered logo height on every side.
 */
export function Logo({ lockup = 'bilingual', colourway = 'full-colour', className }: LogoProps) {
  const lang = useLang()
  const { width, height } = LOCKUPS[lockup]
  return (
    <img
      src={`/brand/logo/egeep-logo-${lockup}-${colourway}.svg`}
      alt={UI.logoAlt[lang]}
      width={width}
      height={height}
      className={className}
      decoding="async"
    />
  )
}

/** Brand pattern artwork (DESIGN.md#pattern). Royal Gold lines on transparent backgrounds. */
export const PATTERNS = {
  /** Overlapping open rings: collaboration between governments. Tiles well. */
  connectedCircles: '/brand/pattern/connected-circles.svg',
  /** Dotted sphere: knowledge flowing between countries. */
  flowingGlobe: '/brand/pattern/flowing-globe.svg',
  /** Two dotted globes entering from the edges, with soft shadows: the edge pattern. */
  flowingGlobeEdge: '/brand/pattern/flowing-globe-edge.png',
  /** Radiating burst: collective impact. */
  unifiedImpact: '/brand/pattern/unified-impact.svg',
  /** Dotted burst. Large file (≈780 KB): avoid on performance-sensitive pages. */
  unifiedImpactDotted: '/brand/pattern/unified-impact-dotted.svg',
} as const

/**
 * Ambient loop cut from the programme's own event photography (33 s, 1280×720, muted, no logo).
 * It stands in for the live site's banner film, which could not be retrieved. Autoplaying it
 * needs a visible pause control (WCAG 2.2.2) and must stop under prefers-reduced-motion.
 */
export const AMBIENT_VIDEO = {
  src: '/media/video/ambient.mp4',
  poster: '/media/video/ambient-poster.jpg',
} as const

/**
 * A real programme film on YouTube. Embed it behind a click-to-load facade: render the local
 * poster and a play button, and only mount the youtube-nocookie iframe after the click.
 */
export const FEATURED_VIDEO = {
  youtubeId: '0itO4lSHcsw',
  embedUrl: 'https://www.youtube-nocookie.com/embed/0itO4lSHcsw?autoplay=1&rel=0',
  watchUrl: 'https://www.youtube.com/watch?v=0itO4lSHcsw',
  poster: '/media/video/geef-forum.jpg',
  title: { en: 'Government Experience Exchange Forum', ar: 'منتدى تبادل الخبرات الحكومية' } satisfies Bilingual,
  source: { en: 'World Governments Summit', ar: 'القمة العالمية للحكومات' } satisfies Bilingual,
} as const
