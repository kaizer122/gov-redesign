import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EnvelopeSimple, MagnifyingGlassPlus, Phone } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { ExternalLink } from '../components/ExternalLink'
import { FeaturedFilm } from '../components/FeaturedFilm'
import { Modal } from '../components/Modal'
import { PageHero } from '../components/PageHero'
import { SectionHeading } from '../components/SectionHeading'
import { Tabs } from '../components/Tabs'
import { EMAIL_HREF, PHONE_HREF, PLATFORM_LABEL, socialHandle, useLinks, useSite } from '../lib/content'
import { SOCIAL_ICONS } from '../lib/icons'
import { S } from '../lib/strings'
import { CONTAINER, SECTION } from '../lib/ui'

const T = {
  title: { en: 'Media Center', ar: 'المركز الإعلامي' },
  lead: {
    en: "Films, news and photography from the programme, leadership messages, and the programme's official channels.",
    ar: 'أفلام وأخبار وصور من البرنامج، ورسائل القيادة، والقنوات الرسمية للبرنامج.',
  },
  film: { en: 'Featured film', ar: 'فيلم مختار' },
  latest: { en: 'Latest', ar: 'الأحدث' },
  gallery: { en: 'Photo gallery', ar: 'معرض الصور' },
  channels: { en: 'Official channels', ar: 'القنوات الرسمية' },
  enquiries: { en: 'Media enquiries', ar: 'الاستفسارات الإعلامية' },
  photos: { en: 'Gallery photos', ar: 'صور المعرض' },
  latestTitle: { en: 'From the programme', ar: 'من البرنامج' },
  photo: { en: 'Photo', ar: 'صورة' },
  viewPhoto: { en: 'View photo', ar: 'عرض الصورة' },
  galleryTitle: { en: 'Programme imagery', ar: 'صور البرنامج' },
  galleryIntro: {
    en: 'Official portraits that accompany leadership messages, and photography from each area of cooperation. Select a photo to enlarge it.',
    ar: 'صور رسمية ترافق رسائل القيادة، وصور من كل مجال من مجالات التعاون. اختر صورة لتكبيرها.',
  },
  leadership: { en: 'Leadership messages', ar: 'رسائل القيادة' },
  areas: { en: 'Areas of cooperation', ar: 'مجالات التعاون' },
  follow: { en: 'Follow the programme', ar: 'تابع البرنامج' },
  channelsIntro: {
    en: "Follow the programme's official accounts for news, events and updates.",
    ar: 'تابع الحسابات الرسمية للبرنامج للاطلاع على الأخبار والفعاليات والمستجدات.',
  },
  enquiriesBody: {
    en: 'Journalists and partners can reach the office directly by phone or email, or send a message through the contact form.',
    ar: 'يمكن للصحفيين والشركاء التواصل مع المكتب مباشرة عبر الهاتف أو البريد الإلكتروني، أو إرسال رسالة عبر نموذج التواصل.',
  },
  openForm: { en: 'Open the contact form', ar: 'افتح نموذج التواصل' },
  about: { en: 'About', ar: 'عن' },
  filmEyebrow: { en: 'Watch', ar: 'شاهد' },
}

interface Photo {
  src: string
  width: number
  height: number
  caption: string
  detail?: string
  link?: { to: string; label: string }
}

export default function MediaPage() {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const links = useLinks()
  const data = useSite()
  const [photo, setPhoto] = useState<Photo>()

  const quotes = [...data.quotes, ...(data.bestPracticesIntro.quote ? [data.bestPracticesIntro.quote] : [])]
  const enQuotes = [...site.quotes, ...(site.bestPracticesIntro.quote ? [site.bestPracticesIntro.quote] : [])]
  const leadership: Photo[] = quotes.flatMap((q, i) => {
    const image = enQuotes[i].image
    return image ? [{ src: image, width: 1200, height: 825, caption: q.author, detail: q.text }] : []
  })
  const areas: Photo[] = data.areas.flatMap((a) =>
    a.image ? [{ src: a.image, width: 930, height: 600, caption: a.title, link: { to: links.area(a.slug), label: `${t('about')} ${a.title}` } }] : [],
  )
  const sections = [
    { id: 'film', label: t('film') },
    { id: 'latest', label: t('latest') },
    { id: 'gallery', label: t('gallery') },
    { id: 'channels', label: t('channels') },
    { id: 'enquiries', label: t('enquiries') },
  ]

  return (
    <main id="main" data-page="media" tabIndex={-1}>
      <PageHero
        page="media"
        title={t('title')}
        lead={t('lead')}
        sections={sections}
        sectionsLabel={st('onThisPage')}
        facts={[
          { label: t('photos'), value: formatNumber(leadership.length + areas.length, lang) },
          { label: t('channels'), value: formatNumber(site.contact.social.length, lang) },
        ]}
      />

      <section id="film" aria-labelledby="film-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading id="film-title" eyebrow={t('filmEyebrow')} title={t('film')} />
        <FeaturedFilm />
      </section>

      <section id="latest" aria-labelledby="latest-title" className="v6-ivory scroll-mt-4">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading id="latest-title" eyebrow={t('latest')} title={t('latestTitle')} />
          <ul className="grid gap-6">
            {data.media.map((item, i) => {
              const image = site.media[i].image
              return (
                <li key={item.title}>
                  <article className="aegov-card card-news overflow-hidden bg-whitely-50 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                    {image && <img src={image} alt="" width={512} height={512} loading="lazy" className="aspect-[16/10] h-full w-full object-cover lg:aspect-auto" />}
                    <div className="card-content flex flex-col justify-center gap-5 p-8">
                      <span className="aegov-badge self-start">{t('photo')}</span>
                      <h3 className="text-3xl leading-snug">{item.title}</h3>
                      {image && (
                        <button
                          type="button"
                          className="aegov-btn btn-outline btn-sm self-start"
                          aria-haspopup="dialog"
                          onClick={() => setPhoto({ src: image, width: 512, height: 512, caption: item.title })}
                        >
                          <MagnifyingGlassPlus aria-hidden="true" className="size-5" />
                          {t('viewPhoto')}
                        </button>
                      )}
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section id="gallery" aria-labelledby="gallery-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading id="gallery-title" eyebrow={t('gallery')} title={t('galleryTitle')} intro={t('galleryIntro')} />
        <Tabs
          label={t('gallery')}
          tabs={[
            { key: 'leadership', label: t('leadership'), content: <Gallery photos={leadership} onOpen={setPhoto} /> },
            { key: 'areas', label: t('areas'), content: <Gallery photos={areas} onOpen={setPhoto} /> },
          ]}
        />
      </section>

      <section id="channels" aria-labelledby="channels-title" className="v6-dark scroll-mt-4">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading id="channels-title" eyebrow={t('follow')} title={t('channels')} intro={t('channelsIntro')} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {site.contact.social.map((s) => {
              const Icon = SOCIAL_ICONS[s.platform]
              return (
                <li key={s.platform}>
                  <ExternalLink
                    href={s.url}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-primary-400/40 p-6 no-underline transition-colors hover:border-primary-300 hover:bg-whitely-50/5"
                  >
                    {Icon && <Icon aria-hidden="true" weight="light" className="size-9 text-primary-300" />}
                    <span className="text-2xl">{PLATFORM_LABEL[s.platform]?.[lang] ?? s.platform}</span>
                    <span dir="ltr" className="text-start text-base break-all text-[color:var(--v6-on-dark-muted)]">
                      {socialHandle(s.url)}
                    </span>
                  </ExternalLink>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section id="enquiries" aria-labelledby="enquiries-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="enquiries-title" className="v6-gold-heading mb-5 text-4xl md:text-5xl">
              {t('enquiries')}
            </h2>
            <p className="text-xl">{t('enquiriesBody')}</p>
          </div>
          <ul className="space-y-4">
            <li>
              <a href={PHONE_HREF} className="inline-flex items-center gap-4 text-2xl text-[color:var(--egeep-charcoal)] no-underline hover:underline">
                <Phone aria-hidden="true" className="size-7 text-primary-700" />
                <span className="sr-only">{UI.phone[lang]}:</span>
                <span dir="ltr">{site.contact.phone}</span>
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF} className="inline-flex items-center gap-4 text-2xl text-[color:var(--egeep-charcoal)] no-underline hover:underline">
                <EnvelopeSimple aria-hidden="true" className="size-7 text-primary-700" />
                <span className="sr-only">{UI.email[lang]}:</span>
                <span dir="ltr">{site.contact.email}</span>
              </a>
            </li>
            <li>
              <Link to={links.href('contact')} className="aegov-btn btn-sm mt-2">
                {t('openForm')}
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <Modal open={photo !== undefined} onClose={() => setPhoto(undefined)} labelledBy="v6-photo-title" width="max-w-5xl">
        {photo && (
          <figure className="space-y-4">
            <img src={photo.src} alt="" width={photo.width} height={photo.height} className="max-h-[70vh] w-full rounded-xl object-contain" />
            <figcaption className="pe-10">
              <h2 id="v6-photo-title" className="text-3xl">
                {photo.caption}
              </h2>
              {photo.detail && <p className="mt-2 text-lg">{photo.detail}</p>}
              {photo.link && (
                <Link to={photo.link.to} className="aegov-link mt-2">
                  {photo.link.label}
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
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {photos.map((p) => (
        <li key={p.src}>
          <button type="button" aria-haspopup="dialog" onClick={() => onOpen(p)} className="group block w-full text-start">
            <span className="block overflow-hidden rounded-2xl">
              <img
                src={p.src}
                alt=""
                width={p.width}
                height={p.height}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
            </span>
            <span className="mt-2 block text-lg leading-snug">{p.caption}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
