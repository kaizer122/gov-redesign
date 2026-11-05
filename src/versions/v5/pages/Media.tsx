import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, EnvelopeSimple, MagnifyingGlassPlus, Phone } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { ExternalLink } from '../components/ExternalLink'
import { Modal } from '../components/Modal'
import { FactList, PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Tabs } from '../components/Tabs'
import { VideoFacade } from '../components/VideoFacade'
import { EMAIL_HREF, PHONE_HREF, socialHandle, useLinks } from '../lib/content'
import { F, T } from '../lib/dict'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

interface Photo {
  src: string
  caption: string
  detail?: string
  link?: { to: string; label: string }
}

export default function MediaPage() {
  const lang = useLang()
  const t = useT(T)
  const { href, areaHref } = useLinks()
  const site = getSite(lang)
  const [photo, setPhoto] = useState<Photo>()

  const quoteMark = lang === 'ar' ? ['«', '»'] : ['"', '"']
  const leadership: Photo[] = [...site.quotes, ...(site.bestPracticesIntro.quote ? [site.bestPracticesIntro.quote] : [])].flatMap((q) =>
    q.image ? [{ src: q.image, caption: q.author, detail: `${quoteMark[0]}${q.text}${quoteMark[1]}` }] : [],
  )
  const areas: Photo[] = site.areas.flatMap((a) =>
    a.image ? [{ src: a.image, caption: a.title, link: { to: areaHref(a.slug), label: F.goTo[lang](a.title) } }] : [],
  )

  return (
    <main id="main" data-page="media" tabIndex={-1}>
      <PageHeader
        page="media"
        title={t('mediaTitle')}
        lead={t('mediaLead')}
        sections={[
          { id: 'latest', label: t('latest') },
          { id: 'film', label: t('featuredFilm') },
          { id: 'gallery', label: t('photoGallery') },
          { id: 'channels', label: t('officialChannels') },
          { id: 'enquiries', label: t('mediaEnquiries') },
        ]}
        aside={
          <FactList
            facts={[
              { label: t('galleryPhotos'), value: formatNumber(leadership.length + areas.length, lang) },
              { label: t('officialChannels'), value: formatNumber(site.contact.social.length, lang) },
            ]}
          />
        }
      />

      <section id="latest" aria-labelledby="latest-title" className={`${CONTAINER} ${SECTION} scroll-mt-4 pt-4!`}>
        <SectionHeading id="latest-title" eyebrow={t('latest')} title={t('fromTheProgramme')} />
        <ul className="grid gap-8">
          {site.media.map((item) => (
            <li key={item.title}>
              <article className="aegov-card card-news grid border-0! bg-[var(--egeep-ivory)] p-0! lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] [&>*]:m-0!">
                {item.image && (
                  <img src={item.image} alt="" width={512} height={512} loading="lazy" className="aspect-square w-full object-cover lg:aspect-auto lg:h-full" />
                )}
                <div className="card-content flex flex-col justify-center gap-6 p-8 md:p-12">
                  <span className="v5-eyebrow">{t('typePhoto')}</span>
                  <h3 className="text-3xl text-[var(--egeep-charcoal)] md:text-4xl">{item.title}</h3>
                  <div className="flex flex-wrap gap-4">
                    {item.image && (
                      <button
                        type="button"
                        className="aegov-btn btn-outline btn-sm"
                        aria-haspopup="dialog"
                        onClick={() => setPhoto({ src: item.image!, caption: item.title })}
                      >
                        <MagnifyingGlassPlus aria-hidden="true" className="size-5" />
                        {t('viewPhoto')}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section id="film" aria-labelledby="film-title" className={`${CONTAINER} pb-16 md:pb-20 xl:pb-28 scroll-mt-4`}>
        <SectionHeading id="film-title" eyebrow={t('featuredFilm')} title={t('filmHeading')} intro={t('filmIntro')} />
        <Reveal className="mx-auto max-w-5xl">
          <VideoFacade />
        </Reveal>
      </section>

      <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-4 bg-[var(--egeep-ivory)]">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading id="gallery-title" eyebrow={t('photoGallery')} title={t('programmeImagery')} intro={t('galleryIntro')} />
          <Tabs
            label={t('photoGallery')}
            tabs={[
              { key: 'leadership', label: t('wordsOfLeadership'), content: <Gallery photos={leadership} onOpen={setPhoto} /> },
              { key: 'areas', label: UI.areasOfCooperation[lang], content: <Gallery photos={areas} onOpen={setPhoto} /> },
            ]}
          />
        </div>
      </section>

      <section id="channels" aria-labelledby="channels-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading id="channels-title" eyebrow={UI.followUs[lang]} title={t('officialChannels')} intro={t('channelsIntro')} />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {site.contact.social.map((s) => {
            const Icon = SOCIAL_ICONS[s.platform]
            return (
              <li key={s.platform}>
                <ExternalLink
                  href={s.url}
                  className="aegov-card card-bordered flex h-full flex-col gap-3 border-[var(--egeep-grey-light)]! p-6! text-[var(--egeep-charcoal)] no-underline hover:border-[var(--egeep-gold)]! [&>*]:m-0!"
                >
                  {Icon && <Icon aria-hidden="true" weight="light" className="size-9 text-[var(--egeep-gold)]" />}
                  <span className="text-2xl">{s.platform}</span>
                  <bdi dir="ltr" className="text-base break-all text-[var(--v5-muted)]">
                    {socialHandle(s.url)}
                  </bdi>
                </ExternalLink>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="enquiries" aria-labelledby="enquiries-title" className="scroll-mt-4 border-t border-[var(--egeep-gold)]">
        <div className={`${CONTAINER} ${SECTION} grid gap-10 lg:grid-cols-2 lg:items-center`}>
          <div>
            <h2 id="enquiries-title" className="text-4xl text-[var(--egeep-gold)] md:text-5xl">
              {t('mediaEnquiries')}
            </h2>
            <p className="mt-6 text-xl text-[var(--egeep-charcoal)]">{F.enquiriesBody[lang](site.contact.office)}</p>
          </div>
          <ul className="space-y-4 text-xl">
            <li>
              <a href={PHONE_HREF} className="inline-flex items-center gap-4 text-[var(--egeep-charcoal)] no-underline hover:text-[var(--color-primary-800)]">
                <Phone aria-hidden="true" className="size-6 text-[var(--egeep-gold)]" />
                <bdi dir="ltr">{site.contact.phone}</bdi>
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF} className="inline-flex items-center gap-4 text-[var(--egeep-charcoal)] no-underline hover:text-[var(--color-primary-800)]">
                <EnvelopeSimple aria-hidden="true" className="size-6 text-[var(--egeep-gold)]" />
                <bdi dir="ltr">{site.contact.email}</bdi>
              </a>
            </li>
            <li>
              <Link to={href('contact')} className="aegov-btn btn-sm mt-2">
                {t('openContactForm')}
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <Modal open={photo !== undefined} onClose={() => setPhoto(undefined)} labelledBy="v5-photo-title" width="max-w-5xl">
        {photo && (
          <figure className="space-y-5">
            <img src={photo.src} alt="" className="max-h-[70vh] w-full object-contain" />
            <figcaption className="pe-8">
              <h2 id="v5-photo-title" className="text-3xl text-[var(--egeep-gold)]">
                {photo.caption}
              </h2>
              {photo.detail && <p className="mt-3 text-lg text-[var(--egeep-charcoal)]">{photo.detail}</p>}
              {photo.link && (
                <Link to={photo.link.to} className="aegov-link mt-3">
                  {photo.link.label}
                  <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
                </Link>
              )}
            </figcaption>
          </figure>
        )}
      </Modal>
    </main>
  )
}

function Gallery({ photos, onOpen }: { photos: Photo[]; onOpen: (photo: Photo) => void }) {
  return (
    <ul className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
      {photos.map((p) => (
        <li key={p.src}>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => onOpen(p)}
            className="group block! w-full bg-[#fff] text-start"
          >
            <span className="block overflow-hidden">
              <img
                src={p.src}
                alt=""
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
            </span>
            <span className="block border-t border-[var(--egeep-gold)] p-4 text-lg text-[var(--egeep-charcoal)]">{p.caption}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
