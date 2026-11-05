import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, EnvelopeSimple, MagnifyingGlassPlus, Phone } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { pageLabel } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { ExternalLink } from '../components/ExternalLink'
import { FeaturedFilm } from '../components/Films'
import { Lightbox, type GalleryPhoto } from '../components/Lightbox'
import { ChapterHeading, ChapterLinks, PageOpening } from '../components/Story'
import { COPY } from '../lib/copy'
import { EMAIL_HREF, PHONE_HREF, socialHandle } from '../lib/content'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER, FLIP, SECTION } from '../lib/ui'

type Filter = 'all' | 'leadership' | 'areas' | 'events'
const FILTERS: Filter[] = ['all', 'leadership', 'areas', 'events']
const FILTER_LABEL: Record<Filter, keyof typeof COPY> = {
  all: 'filterAll',
  leadership: 'filterLeadership',
  areas: 'filterAreas',
  events: 'filterEvents',
}

export default function MediaPage() {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const id = useId()
  const data = getSite(lang)
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState<number>()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const photos: (GalleryPhoto & { group: Exclude<Filter, 'all'> })[] = [
    ...data.media.flatMap((m) =>
      m.image ? [{ group: 'events' as const, src: m.image, alt: m.title, caption: m.title, width: 512, height: 512 }] : [],
    ),
    ...[...data.quotes, ...(data.bestPracticesIntro.quote ? [data.bestPracticesIntro.quote] : [])].flatMap((q) =>
      q.image
        ? [{ group: 'leadership' as const, src: q.image, alt: `${t('portraitOf')} ${q.author}`, caption: q.author, detail: q.text, width: 1280, height: 880 }]
        : [],
    ),
    ...data.areas.flatMap((a) =>
      a.image ? [{ group: 'areas' as const, src: a.image, alt: `${t('photoFrom')} ${a.title}`, caption: a.title, width: 930, height: 600 }] : [],
    ),
  ]
  const shown = filter === 'all' ? photos : photos.filter((p) => p.group === filter)

  const onTabKey = (e: KeyboardEvent, index: number) => {
    const forward = lang === 'ar' ? 'ArrowLeft' : 'ArrowRight'
    const back = lang === 'ar' ? 'ArrowRight' : 'ArrowLeft'
    let next = index
    if (e.key === forward) next = (index + 1) % FILTERS.length
    else if (e.key === back) next = (index - 1 + FILTERS.length) % FILTERS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = FILTERS.length - 1
    else return
    e.preventDefault()
    setFilter(FILTERS[next])
    tabs.current[next]?.focus()
  }

  return (
    <main id="main" data-page="media" tabIndex={-1}>
      <PageOpening
        page="media"
        eyebrow={t('mediaEyebrow')}
        title={pageLabel('media', lang)}
        lead={t('mediaLead')}
        facts={[
          { label: t('galleryPhotos'), value: <bdi>{formatNumber(photos.length, lang)}</bdi> },
          { label: t('officialChannels'), value: <bdi>{formatNumber(data.contact.social.length, lang)}</bdi> },
        ]}
      >
        <ChapterLinks
          label={t('onThisPage')}
          items={[
            { id: 'film', label: t('onFilm') },
            { id: 'gallery', label: t('galleryTitle') },
            { id: 'channels', label: t('officialChannels') },
            { id: 'enquiries', label: t('mediaEnquiries') },
          ]}
        />
      </PageOpening>

      <section id="film" aria-labelledby="film-title" className={`v7-dark ${SECTION} scroll-mt-4`}>
        <div className={CONTAINER}>
          <ChapterHeading id="film-title" numeral="01" dark eyebrow={t('onFilm')} title={t('filmTitle')} intro={t('filmLead')} />
          <FeaturedFilm headingId="film-title" />
        </div>
      </section>

      <section id="gallery" aria-labelledby="gallery-title" className={`${SECTION} scroll-mt-4`}>
        <div className={CONTAINER}>
          <ChapterHeading id="gallery-title" numeral="02" eyebrow={t('photography')} title={t('galleryTitle')} intro={t('galleryLead')} />
          <div className="aegov-tab v7-tabs mb-10">
            <ul role="tablist" aria-label={t('galleryTitle')} className="flex flex-wrap gap-x-8 border-b border-[var(--v7-hairline-strong)]">
              {FILTERS.map((f, i) => (
                <li key={f} role="presentation">
                  <button
                    ref={(el) => {
                      tabs.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={`${id}-tab-${f}`}
                    aria-selected={filter === f}
                    aria-controls={`${id}-panel`}
                    tabIndex={filter === f ? 0 : -1}
                    onClick={() => setFilter(f)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className="v7-tab"
                  >
                    {t(FILTER_LABEL[f])}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${filter}`}>
            <p className="sr-only" aria-live="polite">
              {t('photosShown')}: {formatNumber(shown.length, lang)}
            </p>
            <ul className="v7-gallery columns-1 gap-6 sm:columns-2 lg:columns-3">
              {shown.map((p, i) => (
                <li key={p.src} className="v7-reveal mb-6 break-inside-avoid">
                  <button type="button" className="v7-thumb group" aria-haspopup="dialog" onClick={() => setOpen(i)}>
                    <span className="v7-clip relative block overflow-hidden bg-[var(--egeep-grey-light)]">
                      <img src={p.src} alt={p.alt} width={p.width} height={p.height} loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-[1.03]" />
                      <span aria-hidden="true" className="v7-thumb-zoom">
                        <MagnifyingGlassPlus className="size-5" />
                      </span>
                    </span>
                    <span aria-hidden="true" className="v7-caption mt-3 block text-start">
                      {p.caption}
                    </span>
                    <span className="sr-only">{t('enlarge')}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="channels" aria-labelledby="channels-title" className={`bg-[var(--v7-surface)] ${SECTION} scroll-mt-4`}>
        <div className={CONTAINER}>
          <ChapterHeading id="channels-title" numeral="03" eyebrow={UI.followUs[lang]} title={t('officialChannels')} intro={t('channelsLead')} />
          <ul className="grid border-t border-[var(--egeep-gold)] sm:grid-cols-2 lg:grid-cols-5">
            {data.contact.social.map((s) => {
              const Icon = SOCIAL_ICONS[s.platform]
              return (
                <li key={s.platform} className="border-b border-[var(--v7-hairline)] lg:border-e lg:last:border-e-0">
                  <ExternalLink href={s.url} className="v7-channel">
                    {Icon && <Icon aria-hidden="true" weight="thin" className="size-10 text-primary-700" />}
                    <span className="text-2xl text-[var(--egeep-charcoal)]">{s.platform}</span>
                    <bdi dir="ltr" className="text-base break-all text-[var(--v7-muted)]">
                      {socialHandle(s.url)}
                    </bdi>
                  </ExternalLink>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section id="enquiries" aria-labelledby="enquiries-title" className={`${SECTION} scroll-mt-4`}>
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-2 lg:items-end`}>
          <ChapterHeading id="enquiries-title" numeral="04" eyebrow={UI.contactUs[lang]} title={t('mediaEnquiries')} intro={t('enquiriesLead')} className="mb-0! md:mb-0!" />
          <ul className="space-y-4 text-xl">
            <li>
              <a href={PHONE_HREF} className="v7-link-plain inline-flex items-center gap-3">
                <Phone aria-hidden="true" className="size-6 text-primary-700" />
                <bdi dir="ltr">{data.contact.phone}</bdi>
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF} className="v7-link-plain inline-flex items-center gap-3">
                <EnvelopeSimple aria-hidden="true" className="size-6 text-primary-700" />
                <bdi dir="ltr">{data.contact.email}</bdi>
              </a>
            </li>
            <li>
              <Link to={href('contact')} className="aegov-link v7-link">
                {t('useContactForm')}
                <ArrowRight aria-hidden="true" className={`link-icon ${FLIP}`} />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {open !== undefined && shown[open] && <Lightbox photos={shown} index={open} onIndex={setOpen} onClose={() => setOpen(undefined)} />}
    </main>
  )
}
