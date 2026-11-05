import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { COPY } from '../lib/copy'
import { useModalFocus } from '../lib/hooks'

export interface GalleryPhoto {
  src: string
  alt: string
  caption: string
  detail?: string
  width: number
  height: number
}

interface LightboxProps {
  photos: GalleryPhoto[]
  index: number
  onIndex: (index: number) => void
  onClose: () => void
}

/**
 * Accessible lightbox: a modal dialog with focus trap, Escape to close, focus returned to the
 * opening thumbnail, and previous/next by buttons or the arrow keys (following reading direction).
 */
export function Lightbox({ photos, index, onIndex, onClose }: LightboxProps) {
  const lang = useLang()
  const t = useT(COPY)
  const ref = useRef<HTMLDivElement>(null)
  useModalFocus(ref, true, onClose)
  const photo = photos[index]
  const count = photos.length
  const go = (delta: number) => onIndex((index + delta + count) % count)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      e.preventDefault()
      const visualForward = e.key === 'ArrowRight'
      onIndex((index + ((visualForward ? 1 : -1) * (lang === 'ar' ? -1 : 1)) + count) % count)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, count, lang, onIndex])

  const Back = lang === 'ar' ? ArrowRight : ArrowLeft
  const Forward = lang === 'ar' ? ArrowLeft : ArrowRight

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="v7-lightbox-caption"
      className="v7-lightbox fixed inset-0 z-50 flex flex-col"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
        <p className="text-lg text-[var(--v7-on-dark-muted)]" aria-live="polite">
          {t('photo')} <bdi>{formatNumber(index + 1, lang)}</bdi> {t('of')} <bdi>{formatNumber(count, lang)}</bdi>
        </p>
        <button type="button" onClick={onClose} className="v7-icon-btn v7-on-dark-link" data-autofocus>
          <X aria-hidden="true" className="size-7" />
          <span className="sr-only">{UI.close[lang]}</span>
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center gap-2 px-2 md:gap-6 md:px-8">
        <button type="button" onClick={() => go(-1)} className="v7-round-btn v7-round-btn-dark shrink-0">
          <Back aria-hidden="true" className="size-5" />
          <span className="sr-only">{UI.previous[lang]}</span>
        </button>
        <figure className="flex h-full min-w-0 flex-1 flex-col items-center justify-center">
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="v7-lightbox-img max-h-[70vh] w-auto max-w-full object-contain"
          />
          <figcaption className="mt-5 max-w-3xl text-center">
            <span id="v7-lightbox-caption" className="block text-xl text-[var(--egeep-ivory)]">
              {photo.caption}
            </span>
            {photo.detail && <span className="mt-2 block text-lg text-[var(--v7-on-dark-muted)]">{photo.detail}</span>}
          </figcaption>
        </figure>
        <button type="button" onClick={() => go(1)} className="v7-round-btn v7-round-btn-dark shrink-0">
          <Forward aria-hidden="true" className="size-5" />
          <span className="sr-only">{UI.next[lang]}</span>
        </button>
      </div>
      <div className="h-6" />
    </div>
  )
}
