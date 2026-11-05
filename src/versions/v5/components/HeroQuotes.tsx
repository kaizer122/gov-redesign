import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CaretLeft, CaretRight, Pause, Play, Quotes } from '@phosphor-icons/react'
import { getSite, site } from '../../../data/site'
import { useLang, useT } from '../../../shared/i18n'
import { REGISTER_URL, useLinks } from '../lib/content'
import { F, T } from '../lib/dict'
import { useMediaQuery } from '../lib/hooks'
import { CONTAINER } from '../lib/ui'
import { EdgePattern } from './EdgePattern'
import { ExternalLink } from './ExternalLink'

const INTERVAL_MS = 8000

/** Leadership quotes (same order in both languages), then the participation slide. */
const IMAGES = [...site.quotes.map((q) => q.image ?? site.hero.images[0]), site.hero.images[site.hero.images.length - 1]]

/**
 * Leadership-words hero: a large quote on an ivory panel beside portrait photography that
 * crossfades with a slow zoom. Autoplays (pausable; off under reduced motion), pauses on hover
 * and focus, with arrows and dots that mirror in RTL.
 */
export function HeroQuotes() {
  const lang = useLang()
  const t = useT(T)
  const { href } = useLinks()
  const local = getSite(lang)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [index, setIndex] = useState(0)
  /** Bumped each time a slide becomes active, to restart that image's zoom without touching the outgoing one. */
  const [epochs, setEpochs] = useState(() => IMAGES.map(() => 0))
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const autoplay = playing && !reducedMotion && !hovered && !focused
  const count = IMAGES.length

  const names = [...local.quotes.map((q) => q.author), t('heroParticipateName')]

  const go = (next: number) => {
    const target = (next + count) % count
    setIndex(target)
    setEpochs((e) => e.map((v, j) => (j === target ? v + 1 : v)))
  }

  useEffect(() => {
    if (!autoplay) return
    const timer = window.setTimeout(() => {
      const target = (index + 1) % count
      setIndex(target)
      setEpochs((e) => e.map((v, j) => (j === target ? v + 1 : v)))
    }, INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [autoplay, index, count])

  return (
    <section
      aria-roledescription={t('carousel')}
      aria-label={t('heroLabel')}
      className={`${CONTAINER} pt-6 md:pt-10`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
      }}
    >
      <div className="relative grid overflow-hidden bg-[var(--egeep-ivory)] lg:min-h-[36rem] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <EdgePattern edge="start-bottom" />

        <div className="relative order-1 aspect-[4/3] overflow-hidden bg-[var(--egeep-grey-light)] sm:aspect-[16/9] lg:order-2 lg:aspect-auto">
          {IMAGES.map((src, i) => (
            <div
              key={src}
              aria-hidden="true"
              className={`v5-hero-image absolute inset-0 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                key={epochs[i]}
                src={src}
                alt=""
                width={1280}
                height={880}
                loading={i === 0 ? 'eager' : 'lazy'}
                className={`size-full object-cover object-[50%_30%] ${i === index || epochs[i] > 0 ? 'v5-zoom' : ''}`}
              />
            </div>
          ))}
        </div>

        <div className="relative order-2 flex flex-col justify-between gap-10 px-6 py-10 sm:px-10 lg:order-1 lg:px-14 lg:py-14 xl:px-16">
          <div className="grid" aria-live={autoplay ? 'off' : 'polite'}>
            {IMAGES.map((_, i) => {
              const quote = local.quotes[i]
              const active = i === index
              return (
                <div
                  key={i}
                  role="group"
                  aria-roledescription={t('slide')}
                  aria-label={F.slideOf[lang](i + 1, count, names[i])}
                  aria-hidden={!active}
                  inert={!active}
                  className={`[grid-area:1/1] transition-opacity duration-700 motion-reduce:transition-none ${active ? 'opacity-100' : 'invisible opacity-0'}`}
                >
                  {quote ? (
                    <figure>
                      <Quotes aria-hidden="true" weight="fill" className="mb-4 size-14 text-[var(--egeep-gold)] rtl:-scale-x-100" />
                      <blockquote className="text-3xl leading-[1.3] text-[var(--egeep-charcoal)] md:text-4xl xl:text-[2.875rem] rtl:leading-[1.55]">
                        <p>{quote.text}</p>
                      </blockquote>
                      <figcaption className="mt-8 flex gap-4">
                        <span aria-hidden="true" className="mt-4 h-px w-10 shrink-0 bg-[var(--egeep-gold)]" />
                        <span>
                          <span className="block text-xl text-[var(--egeep-charcoal)]">{quote.author}</span>
                          {quote.role && <span className="block text-base text-[var(--v5-muted)]">{quote.role}</span>}
                        </span>
                      </figcaption>
                    </figure>
                  ) : (
                    <div>
                      <p className="v5-eyebrow mb-4">{t('joinProgramme')}</p>
                      <p className="text-4xl leading-[1.2] text-[var(--egeep-gold)] md:text-5xl rtl:leading-[1.45]">
                        {local.hero.title}
                      </p>
                      <p className="mt-6 max-w-xl text-xl text-[var(--egeep-charcoal)]">{t('heroParticipateBody')}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <ExternalLink href={REGISTER_URL} className="aegov-btn">
                {local.hero.cta.label}
              </ExternalLink>
              <Link to={href('about')} className="aegov-link">
                {t('aboutProgramme')}
                <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
              </Link>
            </div>

            <div className="flex items-center gap-2 border-t border-[var(--egeep-gold)]/40 pt-5">
              <button type="button" className="v5-hero-control" onClick={() => go(index - 1)}>
                <CaretLeft aria-hidden="true" className="size-5 rtl:-scale-x-100" />
                <span className="sr-only">{t('previousSlide')}</span>
              </button>
              <ul className="flex items-center">
                {IMAGES.map((_, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      className="group flex h-11 w-9 items-center justify-center"
                      aria-current={i === index ? 'true' : undefined}
                      onClick={() => go(i)}
                    >
                      <span
                        aria-hidden="true"
                        className={`block h-0.5 transition-all motion-reduce:transition-none ${i === index ? 'w-7 bg-[var(--egeep-gold)]' : 'w-4 bg-[var(--egeep-charcoal)]/35 group-hover:bg-[var(--egeep-charcoal)]/70'}`}
                      />
                      <span className="sr-only">{F.slideOf[lang](i + 1, count, names[i])}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="v5-hero-control" onClick={() => go(index + 1)}>
                <CaretRight aria-hidden="true" className="size-5 rtl:-scale-x-100" />
                <span className="sr-only">{t('nextSlide')}</span>
              </button>
              <button
                type="button"
                className="v5-hero-control ms-auto"
                onClick={() => setPlaying((p) => !p)}
                disabled={reducedMotion}
              >
                {playing && !reducedMotion ? (
                  <Pause aria-hidden="true" weight="fill" className="size-5" />
                ) : (
                  <Play aria-hidden="true" weight="fill" className="size-5" />
                )}
                <span className="sr-only">{playing && !reducedMotion ? t('pauseSlideshow') : t('playSlideshow')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
