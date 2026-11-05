import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EnvelopeSimple, MagnifyingGlassPlus, Phone } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { useT, type Bilingual } from '../../../shared/i18n'
import { ArrowLink, PageHeader, SectionHeading } from '../components/Blocks'
import { ExternalLink } from '../components/ExternalLink'
import { FilmCaption, FilmFacade } from '../components/Media'
import { Modal } from '../components/Modal'
import { Tabs } from '../components/Tabs'
import { EMAIL_HREF, PHONE_HREF, fill, socialHandle, useSite } from '../lib/content'
import { useLinks } from '../lib/hooks'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

const M = {
  title: { en: 'Media Center', ar: 'المركز الإعلامي' },
  lead: {
    en: 'Film, news and photos from the programme, leadership messages and the programme’s official channels.',
    ar: 'أفلام وأخبار وصور من البرنامج، وكلمات القيادة، والقنوات الرسمية للبرنامج.',
  },
  factPhotos: { en: 'Gallery photos', ar: 'صور المعرض' },
  factChannels: { en: 'Official channels', ar: 'القنوات الرسمية' },
  secFilm: { en: 'Film', ar: 'فيلم' },
  secLatest: { en: 'Latest', ar: 'الأحدث' },
  secGallery: { en: 'Photo gallery', ar: 'معرض الصور' },
  secChannels: { en: 'Official channels', ar: 'القنوات الرسمية' },
  secEnquiries: { en: 'Media enquiries', ar: 'الاستفسارات الإعلامية' },
  filmEyebrow: { en: 'Featured film', ar: 'فيلم مختار' },
  latestTitle: { en: 'From the programme', ar: 'من البرنامج' },
  photo: { en: 'Photo', ar: 'صورة' },
  viewPhoto: { en: 'View photo', ar: 'اعرض الصورة' },
  galleryTitle: { en: 'Programme imagery', ar: 'صور البرنامج' },
  galleryIntro: {
    en: 'Official portraits that accompany leadership messages, and photography from each area of cooperation. Select a photo to enlarge it.',
    ar: 'صور رسمية مرافقة لكلمات القيادة، وصور من كل مجال من مجالات التعاون. اختر أي صورة لتكبيرها.',
  },
  tabLeaders: { en: 'Leadership messages', ar: 'كلمات القيادة' },
  tabAreas: { en: 'Areas of cooperation', ar: 'مجالات التعاون' },
  galleryLabel: { en: 'Photo gallery', ar: 'معرض الصور' },
  enlarge: { en: 'Enlarge photo: {name}', ar: 'كبّر الصورة: {name}' },
  aboutArea: { en: 'About {name}', ar: 'عن {name}' },
  channelsEyebrow: { en: 'Follow the programme', ar: 'تابع البرنامج' },
  channelsIntro: {
    en: 'Follow the programme’s official accounts for news, events and updates.',
    ar: 'تابع الحسابات الرسمية للبرنامج للاطلاع على الأخبار والفعاليات والمستجدات.',
  },
  enquiriesBody: {
    en: 'Journalists and partners can reach the {office} directly, or send a message through the contact form.',
    ar: 'يمكن للصحفيين والشركاء التواصل مباشرة مع {office}، أو إرسال رسالة عبر نموذج التواصل.',
  },
  openForm: { en: 'Open the contact form', ar: 'افتح نموذج التواصل' },
} satisfies Record<string, Bilingual>

interface Photo {
  src: string
  caption: string
  detail?: string
  link?: { to: string; label: string }
}

export default function MediaPage() {
  const m = useT(M)
  const local = useSite()
  const { href, areaHref } = useLinks()
  const [photo, setPhoto] = useState<Photo>()

  const leadership: Photo[] = [...local.quotes, ...(local.bestPracticesIntro.quote ? [local.bestPracticesIntro.quote] : [])].flatMap(
    (q) => (q.image ? [{ src: q.image, caption: q.author, detail: `“${q.text}”` }] : []),
  )
  const areas: Photo[] = local.areas.flatMap((a) =>
    a.image ? [{ src: a.image, caption: a.title, link: { to: areaHref(a.slug), label: fill(m('aboutArea'), { name: a.title }) } }] : [],
  )

  return (
    <main id="main" data-page="media" tabIndex={-1}>
      <PageHeader
        page="media"
        title={m('title')}
        lead={m('lead')}
        facts={[
          { label: m('factPhotos'), value: String(leadership.length + areas.length) },
          { label: m('factChannels'), value: String(site.contact.social.length) },
        ]}
        sections={[
          { id: 'film', label: m('secFilm') },
          { id: 'latest', label: m('secLatest') },
          { id: 'gallery', label: m('secGallery') },
          { id: 'channels', label: m('secChannels') },
          { id: 'enquiries', label: m('secEnquiries') },
        ]}
      />

      <section id="film" aria-labelledby="film-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="v8-tile overflow-hidden lg:col-span-8">
            <FilmFacade />
          </div>
          <div className="v8-tile flex flex-col justify-between gap-4 p-6 lg:col-span-4">
            <p className="v8-eyebrow">{m('filmEyebrow')}</p>
            <h2 id="film-title" className="sr-only">
              {m('secFilm')}
            </h2>
            <FilmCaption />
          </div>
        </div>
      </section>

      <section id="latest" aria-labelledby="latest-title" className={`${CONTAINER} pb-14 md:pb-20 scroll-mt-4`}>
        <SectionHeading id="latest-title" eyebrow={m('secLatest')} title={m('latestTitle')} />
        <ul className="grid gap-4">
          {local.media.map((item) => (
            <li key={item.title}>
              <article className="v8-tile v8-lift grid overflow-hidden lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                {item.image && (
                  <img src={item.image} alt="" width={1200} height={675} loading="lazy" className="aspect-[16/9] h-full w-full object-cover" />
                )}
                <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="aegov-badge">{m('photo')}</span>
                    {item.date && <span className="v8-muted text-sm">{item.date}</span>}
                  </div>
                  <h3 className="text-3xl">{item.title}</h3>
                  {item.image && (
                    <button
                      type="button"
                      className="aegov-btn btn-outline btn-sm self-start"
                      aria-haspopup="dialog"
                      onClick={() => setPhoto({ src: item.image!, caption: item.title })}
                    >
                      <MagnifyingGlassPlus aria-hidden="true" className="size-5" />
                      {m('viewPhoto')}
                    </button>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-4 border-y border-[var(--v8-line)] bg-[#fff]">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading id="gallery-title" eyebrow={m('secGallery')} title={m('galleryTitle')} intro={m('galleryIntro')} />
          <Tabs
            label={m('galleryLabel')}
            tabs={[
              { key: 'leadership', label: m('tabLeaders'), content: <Gallery photos={leadership} onOpen={setPhoto} /> },
              { key: 'areas', label: m('tabAreas'), content: <Gallery photos={areas} onOpen={setPhoto} /> },
            ]}
          />
        </div>
      </section>

      <section id="channels" aria-labelledby="channels-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading id="channels-title" eyebrow={m('channelsEyebrow')} title={m('secChannels')} intro={m('channelsIntro')} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {site.contact.social.map((s) => {
            const Icon = SOCIAL_ICONS[s.platform]
            return (
              <li key={s.platform}>
                <ExternalLink href={s.url} className="v8-tile v8-lift flex h-full flex-col gap-3 p-5 no-underline">
                  {Icon && <Icon aria-hidden="true" className="size-8 text-primary-700" />}
                  <span className="text-xl">{s.platform}</span>
                  <bdi dir="ltr" className="v8-muted text-sm break-all">
                    {socialHandle(s.url)}
                  </bdi>
                </ExternalLink>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="enquiries" aria-labelledby="enquiries-title" className="scroll-mt-4 border-t border-[var(--v8-line)] bg-[#fff]">
        <div className={`${CONTAINER} ${SECTION} grid gap-8 lg:grid-cols-2 lg:items-center`}>
          <div>
            <h2 id="enquiries-title" className="mb-4 text-4xl md:text-5xl">
              {m('secEnquiries')}
            </h2>
            <p className="v8-muted text-lg">{fill(m('enquiriesBody'), { office: local.contact.office })}</p>
          </div>
          <ul className="space-y-3">
            <li>
              <a href={PHONE_HREF} className="inline-flex items-center gap-3 text-xl no-underline hover:text-primary-800">
                <Phone aria-hidden="true" className="size-6 text-primary-700" />
                <bdi dir="ltr">{site.contact.phone}</bdi>
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF} className="inline-flex items-center gap-3 text-xl no-underline hover:text-primary-800">
                <EnvelopeSimple aria-hidden="true" className="size-6 text-primary-700" />
                <bdi dir="ltr">{site.contact.email}</bdi>
              </a>
            </li>
            <li className="pt-2">
              <Link to={href('contact')} className="aegov-btn btn-sm">
                {m('openForm')}
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <Modal open={photo !== undefined} onClose={() => setPhoto(undefined)} labelledBy="v8-photo-title" width="max-w-5xl">
        {photo && (
          <figure className="space-y-4">
            <img src={photo.src} alt="" className="max-h-[70vh] w-full rounded-md object-contain" />
            <figcaption className="pe-8">
              <h2 id="v8-photo-title" className="text-2xl">
                {photo.caption}
              </h2>
              {photo.detail && <p className="v8-muted mt-2">{photo.detail}</p>}
              {photo.link && (
                <ArrowLink to={photo.link.to} className="mt-2">
                  {photo.link.label}
                </ArrowLink>
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
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {photos.map((p) => (
        <li key={p.src}>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => onOpen(p)}
            className="v8-tile v8-lift group block w-full overflow-hidden text-start"
          >
            <img
              src={p.src}
              alt=""
              width={930}
              height={600}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span className="block p-3 text-base leading-snug">{p.caption}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
