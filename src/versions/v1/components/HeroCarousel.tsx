import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft, CaretRight, Pause, Play, Quotes } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { REGISTER_URL, href } from '../lib/content'
import { useMediaQuery } from '../lib/hooks'
import { ExternalLink } from './ExternalLink'

const INTERVAL_MS = 8000

interface Slide {
  key: string
  image: string
  imageAlt: string
  name: string
}

const SLIDES: Slide[] = [
  ...site.quotes.map((q) => ({
    key: q.author,
    image: q.image ?? site.hero.images[0],
    imageAlt: `Portrait of ${q.author}`,
    name: q.author,
  })),
  {
    key: 'participate',
    image: site.hero.images[site.hero.images.length - 1],
    imageAlt: '',
    name: 'Participate in the programme',
  },
]

/** DS split hero as a React carousel: three leadership messages and the participation call to action. */
export function HeroCarousel() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const autoplay = playing && !reducedMotion && !hovered && !focused
  const count = SLIDES.length

  useEffect(() => {
    if (!autoplay) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [autoplay, index, count])

  const go = (next: number) => setIndex((next + count) % count)

  return (
    <section
      className="aegov-hero hero-slick-split relative"
      aria-roledescription="carousel"
      aria-label="Leadership messages and participation"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
      }}
    >
      <div className="hero-viewport rounded-xl">
        <div
          className="hero-container transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live={autoplay ? 'off' : 'polite'}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.key}
              className="hero-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${slide.name}`}
              aria-hidden={i !== index}
              inert={i !== index}
            >
              <div className="hero-row h-full">
                <div className="hero-col-left">
                  <div className="hero-col-content space-y-5 xl:space-y-6">
                    <SlideContent index={i} />
                  </div>
                </div>
                <div className="hero-col-right">
                  <picture>
                    <img
                      src={slide.image}
                      alt={slide.imageAlt}
                      className="object-cover object-[50%_30%] max-md:aspect-[16/9]"
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </picture>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-controls">
        <div className="hero-buttons">
          <button type="button" className="hero-button" onClick={() => go(index - 1)}>
            <CaretLeft aria-hidden="true" className="size-5" />
            <span className="sr-only">Previous slide</span>
          </button>
          <button
            type="button"
            className="hero-button"
            onClick={() => setPlaying((p) => !p)}
            disabled={reducedMotion}
          >
            {playing && !reducedMotion ? (
              <Pause aria-hidden="true" weight="fill" className="size-5" />
            ) : (
              <Play aria-hidden="true" weight="fill" className="size-5" />
            )}
            <span className="sr-only">{playing && !reducedMotion ? 'Pause slideshow' : 'Play slideshow'}</span>
          </button>
          <button type="button" className="hero-button" onClick={() => go(index + 1)}>
            <CaretRight aria-hidden="true" className="size-5" />
            <span className="sr-only">Next slide</span>
          </button>
        </div>
        <div className="hero-dots">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              className={i === index ? 'hero-dot-selected' : ''}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i)}
            >
              Slide {i + 1}: {slide.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function SlideContent({ index }: { index: number }) {
  const quote = site.quotes[index]
  if (!quote) {
    return (
      <>
        <p className="v1-hero-eyebrow">Join the programme</p>
        <p className="hero-title">{site.hero.title}</p>
        <p className="hero-description">
          Partner with the UAE Government to exchange experience in government development and modernisation.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <ExternalLink href={REGISTER_URL} className="aegov-btn max-lg:btn-sm">
            {site.hero.cta.label}
          </ExternalLink>
          <Link to={`${href('about')}#how-it-works`} className="aegov-btn btn-outline max-lg:btn-sm">
            How partnerships work
          </Link>
        </div>
      </>
    )
  }
  return (
    <figure className="space-y-5 xl:space-y-6">
      <p className="v1-hero-eyebrow">
        <Quotes aria-hidden="true" weight="fill" className="size-5" />
        Words of leadership
      </p>
      <blockquote className="hero-title">{quote.text}</blockquote>
      <figcaption className="hero-description">
        <span className="block font-semibold text-aeblack-900">{quote.author}</span>
        {quote.role && <span className="mt-1 block text-base text-aeblack-700">{quote.role}</span>}
      </figcaption>
      <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
        <ExternalLink href={REGISTER_URL} className="aegov-btn max-lg:btn-sm">
          {site.hero.cta.label}
        </ExternalLink>
        <Link to={href('about')} className="aegov-btn btn-outline max-lg:btn-sm">
          About the programme
        </Link>
      </div>
    </figure>
  )
}
