import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowSquareOut, EnvelopeSimple, MagnifyingGlassPlus, Phone } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { ExternalLink } from '../components/ExternalLink'
import { Modal } from '../components/Modal'
import { FactList, PageHeader } from '../components/PageHeader'
import { SectionHeading } from '../components/SectionHeading'
import { Tabs } from '../components/Tabs'
import { EMAIL_HREF, PHONE_HREF, areaHref, href, socialHandle } from '../lib/content'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

interface Photo {
  src: string
  caption: string
  detail?: string
  link?: { to: string; label: string }
}

const LEADERSHIP: Photo[] = [
  ...site.quotes,
  ...(site.bestPracticesIntro.quote ? [site.bestPracticesIntro.quote] : []),
].flatMap((q) => (q.image ? [{ src: q.image, caption: q.author, detail: `“${q.text}”` }] : []))

const AREAS: Photo[] = site.areas.flatMap((a) =>
  a.image ? [{ src: a.image, caption: a.title, link: { to: areaHref(a.slug), label: `About ${a.title}` } }] : [],
)

const TYPE_LABEL: Record<string, string> = { photo: 'Photo', video: 'Video', report: 'Report', news: 'News' }

const SECTIONS = [
  { id: 'latest', label: 'Latest' },
  { id: 'gallery', label: 'Photo gallery' },
  { id: 'channels', label: 'Official channels' },
  { id: 'enquiries', label: 'Media enquiries' },
]

export default function MediaPage() {
  const [photo, setPhoto] = useState<Photo>()

  return (
    <main id="main" data-page="media" tabIndex={-1}>
      <PageHeader
        page="media"
        title="Media Center"
        lead="News and photos from the programme, leadership messages, and the programme's official channels."
        sections={SECTIONS}
        aside={
          <FactList
            facts={[
              { label: 'Gallery photos', value: LEADERSHIP.length + AREAS.length },
              { label: 'Official channels', value: site.contact.social.length },
            ]}
          />
        }
      />

      <section id="latest" aria-labelledby="latest-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading id="latest-title" eyebrow="Latest" title="From the programme" />
        <ul className="grid gap-6">
          {site.media.map((item) => (
            <li key={item.title}>
              <article className="aegov-card card-news card-bordered overflow-hidden border-aeblack-100! lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                {item.image && (
                  <img src={item.image} alt="" className="aspect-[16/9] h-full w-full object-cover" loading="lazy" />
                )}
                <div className="card-content flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="aegov-badge">{TYPE_LABEL[item.type] ?? item.type}</span>
                    {item.date && <span className="text-sm text-aeblack-700">{item.date}</span>}
                  </div>
                  <h3 className="text-h6 md:text-h5 text-aeblack-900">{item.title}</h3>
                  <div className="flex flex-wrap gap-4">
                    {item.image && (
                      <button
                        type="button"
                        className="aegov-btn btn-outline btn-sm"
                        aria-haspopup="dialog"
                        onClick={() => setPhoto({ src: item.image!, caption: item.title })}
                      >
                        <MagnifyingGlassPlus aria-hidden="true" className="size-5" />
                        View photo
                      </button>
                    )}
                    {item.url && (
                      <ExternalLink href={item.url} className="aegov-link">
                        Read more
                        <ArrowSquareOut aria-hidden="true" className="link-icon" />
                      </ExternalLink>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-4 border-y border-aeblack-100 bg-aeblack-50">
        <div className={`${CONTAINER} ${SECTION}`}>
          <SectionHeading
            id="gallery-title"
            eyebrow="Photo gallery"
            title="Programme imagery"
            intro="Official portraits that accompany leadership messages, and photography from each area of cooperation. Select a photo to enlarge it."
          />
          <Tabs
            label="Photo gallery"
            tabs={[
              { key: 'leadership', label: 'Leadership messages', content: <Gallery photos={LEADERSHIP} onOpen={setPhoto} /> },
              { key: 'areas', label: 'Areas of cooperation', content: <Gallery photos={AREAS} onOpen={setPhoto} /> },
            ]}
          />
        </div>
      </section>

      <section id="channels" aria-labelledby="channels-title" className={`${CONTAINER} ${SECTION} scroll-mt-4`}>
        <SectionHeading
          id="channels-title"
          eyebrow="Follow the programme"
          title="Official channels"
          intro="Follow the programme's official accounts for news, events and updates."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {site.contact.social.map((s) => {
            const Icon = SOCIAL_ICONS[s.platform]
            return (
              <li key={s.platform}>
                <ExternalLink
                  href={s.url}
                  className="aegov-card card-bordered card-glow flex h-full flex-col gap-3 border-aeblack-100! p-5! text-aeblack-900 no-underline [&>*]:m-0!"
                >
                  {Icon && <Icon aria-hidden="true" className="size-8 text-primary-700" />}
                  <span className="font-bold">{s.platform}</span>
                  <span className="text-sm break-all text-aeblack-700">{socialHandle(s.url)}</span>
                </ExternalLink>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="enquiries" aria-labelledby="enquiries-title" className="scroll-mt-4 border-t border-aeblack-100">
        <div className={`${CONTAINER} ${SECTION} grid gap-8 lg:grid-cols-2 lg:items-center`}>
          <div>
            <h2 id="enquiries-title" className="mb-4 text-h5 md:text-h4 text-aeblack-900">
              Media enquiries
            </h2>
            <p className="text-lg text-aeblack-800">
              Journalists and partners can reach the {site.contact.office} directly, or send a message through the
              contact form.
            </p>
          </div>
          <ul className="space-y-3">
            <li>
              <a href={PHONE_HREF} className="inline-flex items-center gap-3 font-semibold text-aeblack-900 no-underline hover:text-primary-800">
                <Phone aria-hidden="true" className="size-6 text-primary-700" />
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF} className="inline-flex items-center gap-3 font-semibold text-aeblack-900 no-underline hover:text-primary-800">
                <EnvelopeSimple aria-hidden="true" className="size-6 text-primary-700" />
                {site.contact.email}
              </a>
            </li>
            <li>
              <Link to={href('contact')} className="aegov-btn btn-sm mt-2">
                Open the contact form
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <Modal open={photo !== undefined} onClose={() => setPhoto(undefined)} labelledBy="v1-photo-title" width="max-w-5xl">
        {photo && (
          <figure className="space-y-4">
            <img src={photo.src} alt="" className="max-h-[70vh] w-full rounded-lg object-contain" />
            <figcaption className="pe-8">
              <h2 id="v1-photo-title" className="text-h6 text-aeblack-900">
                {photo.caption}
              </h2>
              {photo.detail && <p className="mt-2 text-aeblack-800">{photo.detail}</p>}
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
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => onOpen(p)}
            className="group block! w-full overflow-hidden rounded-xl border border-aeblack-100 bg-whitely-50 text-start"
          >
            <img
              src={p.src}
              alt=""
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
              loading="lazy"
            />
            <span className="block p-3 text-sm font-semibold text-aeblack-900">{p.caption}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
