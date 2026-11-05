import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { AMBIENT_VIDEO, FEATURED_VIDEO } from '../../../shared/brand'
import { COUNTRY_COORDS, UAE_COORDS } from '../../../shared/geo'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { useInView, useReducedMotion } from '../lib/hooks'
import { T } from '../lib/t'
import { ExternalLink } from './ExternalLink'

/**
 * Click-to-load film: the local poster and a play button. The youtube-nocookie iframe mounts only
 * after the click, so nothing is requested from YouTube before the user asks for it.
 */
export function FilmFacade({ className = '' }: { className?: string }) {
  const lang = useLang()
  const t = useT(T)
  const [playing, setPlaying] = useState(false)
  const title = FEATURED_VIDEO.title[lang]

  return (
    <div className={`relative aspect-video overflow-hidden bg-[var(--egeep-charcoal)] ${className}`}>
      {playing ? (
        <iframe
          src={FEATURED_VIDEO.embedUrl}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 block size-full">
          <img
            src={FEATURED_VIDEO.poster}
            alt=""
            width={1280}
            height={720}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#000]/55 via-[#000]/0 to-[#000]/0" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#fff]/95 text-[var(--egeep-charcoal)] shadow-lg ring-1 ring-[#000]/10 transition-transform group-hover:scale-105">
              <Play aria-hidden="true" weight="fill" className="size-7 translate-x-0.5" />
            </span>
          </span>
          <span className="sr-only">
            {UI.playVideo[lang]}: {title}. {t('filmNotice')}
          </span>
        </button>
      )}
    </div>
  )
}

/** Caption under the film: title, source and the third-party notice. */
export function FilmCaption() {
  const lang = useLang()
  const t = useT(T)
  return (
    <div className="space-y-1">
      <p className="text-xl">{FEATURED_VIDEO.title[lang]}</p>
      <p className="v8-muted text-sm">
        {FEATURED_VIDEO.source[lang]} · {t('filmNotice')}{' '}
        <ExternalLink href={FEATURED_VIDEO.watchUrl} className="text-primary-800 underline">
          {t('watchOnYoutube')}
        </ExternalLink>
      </p>
    </div>
  )
}

/**
 * Muted ambient loop with a visible pause/play control (WCAG 2.2.2). It does not autoplay under
 * prefers-reduced-motion: the poster shows until the user presses play.
 */
export function AmbientVideo({ className = '' }: { className?: string }) {
  const lang = useLang()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(!reduced)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (playing && !reduced) video.play().catch(() => setPlaying(false))
    else video.pause()
  }, [playing, reduced])

  const isPlaying = playing && !reduced
  return (
    <div className={`relative overflow-hidden bg-[var(--egeep-charcoal)] ${className}`}>
      <video
        ref={ref}
        src={AMBIENT_VIDEO.src}
        poster={AMBIENT_VIDEO.poster}
        muted
        loop
        playsInline
        preload={reduced ? 'none' : 'metadata'}
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <button
        type="button"
        onClick={() => setPlaying(!isPlaying)}
        className="absolute end-3 bottom-3 z-10 flex size-11 items-center justify-center rounded-full bg-[#fff]/95 text-[var(--egeep-charcoal)] shadow ring-1 ring-[#000]/10 hover:bg-[#fff]"
      >
        {isPlaying ? <Pause aria-hidden="true" weight="fill" className="size-5" /> : <Play aria-hidden="true" weight="fill" className="size-5" />}
        <span className="sr-only">{isPlaying ? UI.pauseBackgroundVideo[lang] : UI.playBackgroundVideo[lang]}</span>
      </button>
    </div>
  )
}

const LAT_TOP = 72
const LAT_BOTTOM = -48
const MAP_W = 360
const MAP_H = LAT_TOP - LAT_BOTTOM

const project = ([lat, lon]: readonly [number, number]) => [lon + 180, LAT_TOP - lat] as const

/**
 * Mini map of partner locations: an equirectangular graticule, a dot per partner capital and a thin
 * arc from the UAE to each partner, drawn in the brand's line grammar. Geography is never mirrored.
 */
export function DotMap({ label, className = '' }: { label: string; className?: string }) {
  const [ref, inView] = useInView<SVGSVGElement>()
  const [ux, uy] = project(UAE_COORDS)
  const points = site.countries.flatMap((c) => (COUNTRY_COORDS[c.id] ? [{ id: c.id, at: project(COUNTRY_COORDS[c.id]) }] : []))

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      role="img"
      aria-label={label}
      className={`v8-map block h-auto w-full ${className}`}
      data-in={inView}
    >
      {[-30, 0, 30, 60].map((lat) => (
        <line key={`lat${lat}`} x1={0} x2={MAP_W} y1={LAT_TOP - lat} y2={LAT_TOP - lat} stroke="var(--v8-line)" strokeWidth={0.4} />
      ))}
      {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => (
        <line key={`lon${lon}`} x1={lon + 180} x2={lon + 180} y1={0} y2={MAP_H} stroke="var(--v8-line)" strokeWidth={0.4} />
      ))}
      <g fill="none" stroke="var(--egeep-gold)" strokeWidth={0.45} strokeOpacity={0.55}>
        {points.map(({ id, at: [x, y] }) => {
          const mx = (ux + x) / 2
          const my = (uy + y) / 2
          const dist = Math.hypot(x - ux, y - uy)
          const lift = Math.min(28, dist * 0.32)
          return <path key={id} className="v8-arc" pathLength={1} d={`M${ux},${uy} Q${mx},${my - lift} ${x},${y}`} />
        })}
      </g>
      {points.map(({ id, at: [x, y] }) => (
        <circle key={id} cx={x} cy={y} r={1.6} fill="var(--egeep-gold)" />
      ))}
      <circle cx={ux} cy={uy} r={4.5} fill="none" stroke="var(--egeep-charcoal)" strokeWidth={0.6} />
      <circle cx={ux} cy={uy} r={2.2} fill="var(--egeep-charcoal)" />
    </svg>
  )
}
