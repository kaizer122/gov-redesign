import { useState } from 'react'
import { Play } from '@phosphor-icons/react'
import { FEATURED_VIDEO } from '../../../shared/brand'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { ExternalLink } from './ExternalLink'

const T = {
  watchOnYoutube: { en: 'Watch on YouTube', ar: 'شاهد على يوتيوب' },
  loadNote: {
    en: 'The video loads from YouTube when you press play.',
    ar: 'يُحمَّل الفيديو من يوتيوب عند الضغط على زر التشغيل.',
  },
}

/** Click-to-load facade: local poster and play button; the youtube-nocookie iframe mounts only after the click. */
export function FeaturedFilm({ className = '' }: { className?: string }) {
  const lang = useLang()
  const t = useT(T)
  const [loaded, setLoaded] = useState(false)
  const title = FEATURED_VIDEO.title[lang]

  return (
    <figure className={className}>
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-[color:var(--egeep-charcoal)]">
        {loaded ? (
          <iframe
            src={`${FEATURED_VIDEO.embedUrl}&hl=${lang}`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button type="button" onClick={() => setLoaded(true)} className="group absolute inset-0 block size-full text-start">
            <img
              src={FEATURED_VIDEO.poster}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            />
            <span className="absolute inset-0 bg-linear-to-t from-[color:var(--egeep-charcoal)]/85 via-transparent" aria-hidden="true" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-20 place-items-center rounded-full border border-whitely-50/70 bg-[color:var(--egeep-charcoal)]/70 text-whitely-50 transition-colors group-hover:bg-primary-700 md:size-24">
                <Play aria-hidden="true" weight="fill" className="size-8" />
              </span>
            </span>
            <span className="sr-only">
              {UI.playVideo[lang]}: {title}
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span>
          <span className="block text-2xl">{title}</span>
          <span className="v6-muted block text-base">
            {FEATURED_VIDEO.source[lang]}. {t('loadNote')}
          </span>
        </span>
        <ExternalLink href={FEATURED_VIDEO.watchUrl} className="aegov-link">
          {t('watchOnYoutube')}
        </ExternalLink>
      </figcaption>
    </figure>
  )
}
