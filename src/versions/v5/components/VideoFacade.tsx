import { useState } from 'react'
import { ArrowSquareOut, Play } from '@phosphor-icons/react'
import { FEATURED_VIDEO } from '../../../shared/brand'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { T } from '../lib/dict'
import { ExternalLink } from './ExternalLink'

/**
 * The featured programme film behind a click-to-load facade: local poster and a play button.
 * The youtube-nocookie iframe is mounted only after the click, so nothing loads from YouTube before.
 */
export function VideoFacade() {
  const lang = useLang()
  const t = useT(T)
  const [loaded, setLoaded] = useState(false)
  const title = FEATURED_VIDEO.title[lang]

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden bg-[var(--egeep-charcoal)]">
        {loaded ? (
          <iframe
            src={FEATURED_VIDEO.embedUrl}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <button type="button" onClick={() => setLoaded(true)} className="group absolute inset-0 block! size-full">
            <img
              src={FEATURED_VIDEO.poster}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            />
            <span className="absolute inset-0 bg-linear-to-t from-[#000]/45 to-transparent" aria-hidden="true" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-20 items-center justify-center rounded-full border border-[#fff]/80 bg-[var(--color-primary-700)] text-[#fff] transition-colors group-hover:bg-[var(--color-primary-800)] md:size-24">
                <Play aria-hidden="true" weight="fill" className="size-8 md:size-10" />
              </span>
            </span>
            <span className="sr-only">
              {UI.playVideo[lang]}: {title}
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span>
          <span className="block text-2xl text-[var(--egeep-charcoal)]">{title}</span>
          <span className="block text-base text-[var(--v5-muted)]">{FEATURED_VIDEO.source[lang]}</span>
        </span>
        <ExternalLink href={FEATURED_VIDEO.watchUrl} className="aegov-link">
          {t('watchOnYoutube')}
          <ArrowSquareOut aria-hidden="true" className="link-icon rtl:-scale-x-100" />
        </ExternalLink>
      </figcaption>
      {!loaded && <p className="mt-2 text-base text-[var(--v5-muted)]">{t('videoNotice')}</p>}
    </figure>
  )
}
