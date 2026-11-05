import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from '@phosphor-icons/react'
import { AMBIENT_VIDEO } from '../../../shared/brand'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { localizedStats } from '../lib/content'
import { useOnScreen, useReducedMotion } from '../lib/hooks'
import { CONTAINER } from '../lib/ui'

const T = {
  title: { en: 'Experience that travels', ar: 'خبرة تعبر الحدود' },
  body: {
    en: 'Workshops, field visits and capacity-building programmes carry UAE government practice to partner teams, in person and online.',
    ar: 'تنقل ورش العمل والزيارات الميدانية وبرامج بناء القدرات ممارسات حكومة الإمارات إلى فرق الدول الشريكة، حضوريًا وعن بُعد.',
  },
}

/** Full-bleed ambient film band with one key figure over a charcoal gradient. */
export function AmbientFilm() {
  const lang = useLang()
  const t = useT(T)
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const onScreen = useOnScreen(ref)
  /** The visitor's choice; until they make one, the film plays unless reduced motion is requested. */
  const [choice, setChoice] = useState<'play' | 'pause' | null>(null)
  const [playing, setPlaying] = useState(false)
  const figure = localizedStats('headline', lang)[3]
  const wanted = choice ? choice === 'play' : !reduced
  /** The file is only requested once the film should play on screen; until then the poster shows. */
  const [loaded, setLoaded] = useState(false)
  if (!loaded && wanted && onScreen) setLoaded(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !loaded) return
    if (wanted && onScreen) video.play().catch(() => setPlaying(false))
    else video.pause()
  }, [wanted, onScreen, loaded])

  const toggle = () => setChoice(playing ? 'pause' : 'play')

  return (
    <section ref={ref} aria-labelledby="v6-film-title" className="v6-dark relative isolate overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 size-full object-cover"
        src={loaded ? AMBIENT_VIDEO.src : undefined}
        poster={AMBIENT_VIDEO.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-[color:var(--egeep-charcoal)] via-[color:var(--egeep-charcoal)]/70 to-[color:var(--egeep-charcoal)]/10 md:bg-linear-to-r md:via-[color:var(--egeep-charcoal)]/55 md:to-transparent md:rtl:bg-linear-to-l" />
      <div className={`${CONTAINER} flex min-h-[34rem] flex-col justify-end py-16 md:min-h-[40rem] md:py-20`}>
        <div className="max-w-xl">
          <p className="text-7xl leading-none text-primary-300 md:text-[7.5rem]">
            <bdi>{figure.stat.value}</bdi>
          </p>
          <p className="mt-3 text-2xl text-[color:var(--egeep-ivory)]">{figure.label}</p>
          <div className="v6-rule my-8 w-40" />
          <h2 id="v6-film-title" className="text-4xl text-[color:var(--egeep-ivory)] md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-xl text-[color:var(--v6-on-dark-muted)]">{t('body')}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="v6-chip absolute end-5 bottom-5 bg-[color:var(--egeep-charcoal)]/80 text-[color:var(--egeep-ivory)] md:end-10 md:bottom-8"
      >
        {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
        {playing ? UI.pauseBackgroundVideo[lang] : UI.playBackgroundVideo[lang]}
      </button>
    </section>
  )
}
