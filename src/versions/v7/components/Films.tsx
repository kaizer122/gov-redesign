import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from '@phosphor-icons/react'
import { AMBIENT_VIDEO, FEATURED_VIDEO } from '../../../shared/brand'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { COPY } from '../lib/copy'
import { useReducedMotion } from '../lib/hooks'
import { ExternalLink } from './ExternalLink'

/**
 * Full-bleed muted loop behind the home opening. Autoplays only without reduced motion (the
 * poster shows otherwise) and always has a visible pause/play control (WCAG 2.2.2).
 */
export function AmbientFilm({ className = '' }: { className?: string }) {
  const lang = useLang()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (reduced) {
      video.pause()
      return
    }
    video.play().catch(() => setPlaying(false))
  }, [reduced])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }

  return (
    <>
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        src={AMBIENT_VIDEO.src}
        poster={AMBIENT_VIDEO.poster}
        muted
        loop
        playsInline
        preload={reduced ? 'none' : 'auto'}
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button type="button" onClick={toggle} className="v7-film-toggle">
        {playing ? <Pause aria-hidden="true" weight="fill" className="size-5" /> : <Play aria-hidden="true" weight="fill" className="size-5" />}
        <span>{playing ? UI.pauseBackgroundVideo[lang] : UI.playBackgroundVideo[lang]}</span>
      </button>
    </>
  )
}

/**
 * The programme film behind a click-to-load facade: the local poster and a play button. The
 * youtube-nocookie iframe mounts only after the click, so nothing loads from YouTube before.
 */
export function FeaturedFilm({ headingId }: { headingId: string }) {
  const lang = useLang()
  const t = useT(COPY)
  const [loaded, setLoaded] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (loaded) frameRef.current?.focus()
  }, [loaded])

  return (
    <figure>
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--egeep-charcoal)]">
        {loaded ? (
          <iframe
            ref={frameRef}
            src={FEATURED_VIDEO.embedUrl}
            title={FEATURED_VIDEO.title[lang]}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setLoaded(true)} className="v7-film-facade group" aria-describedby={headingId}>
            <img
              src={FEATURED_VIDEO.poster}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[var(--egeep-charcoal)]/70 via-transparent" />
            <span className="v7-play">
              <Play aria-hidden="true" weight="fill" className="size-7 md:size-9" />
            </span>
            <span className="v7-play-label">
              {UI.playVideo[lang]}
              <span className="sr-only">: {FEATURED_VIDEO.title[lang]}</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="v7-caption v7-caption-dark mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span>
          {FEATURED_VIDEO.title[lang]} · {FEATURED_VIDEO.source[lang]}
        </span>
        <span>
          {t('filmPrivacy')}{' '}
          <ExternalLink href={FEATURED_VIDEO.watchUrl} className="v7-on-dark-link underline">
            {t('watchOnYoutube')}
          </ExternalLink>
        </span>
      </figcaption>
    </figure>
  )
}
