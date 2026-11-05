import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  CameraIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  GlobeHemisphereEastIcon,
  NewspaperIcon,
  PhoneIcon,
  VideoCameraIcon,
  type Icon,
} from '@phosphor-icons/react'
import { site } from '../../../data/site'
import type { MediaItem } from '../../../data/site'
import { pageHref } from '../../../shared/pages'
import { Main, PageHeader, SectionHeading } from '../components/Page'
import { LeaderQuotes, StatBand } from '../components/Blocks'
import { SOCIAL_ICONS } from '../components/SocialLinks'

const MEDIA_TYPES: Record<MediaItem['type'], { label: string; icon: Icon }> = {
  photo: { label: 'Photo', icon: CameraIcon },
  video: { label: 'Video', icon: VideoCameraIcon },
  report: { label: 'Report', icon: FileTextIcon },
  news: { label: 'News', icon: NewspaperIcon },
}

export default function Media() {
  const [featured, ...rest] = site.media
  const { contact } = site

  return (
    <Main page="media">
      <PageHeader
        page="media"
        eyebrow="Media centre"
        title="News, images and official channels"
        lead="Coverage of the Government Experience Exchange Programme, key figures for reporting, and the official channels where the office publishes updates."
      />

      <section aria-labelledby="v2-media-latest" className="bg-whitely-50 py-16 md:py-20">
        <div className="container">
          <SectionHeading id="v2-media-latest" eyebrow="Gallery" title="From the programme" />
          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            {featured && (
              <div className="lg:col-span-8">
                <MediaCard item={featured} featured />
              </div>
            )}
            <div className="flex flex-col gap-6 lg:col-span-4">
              {rest.map((item) => (
                <MediaCard key={item.title} item={item} />
              ))}
              <div className="rounded-2xl border border-aeblack-100 bg-aeblack-50 p-6">
                <NewspaperIcon size={32} aria-hidden="true" className="text-techblue-700" />
                <h3 className="mt-3 text-lg font-bold text-techblue-950">Latest updates</h3>
                <p className="mt-2 text-sm text-aeblack-700">
                  For the latest programme news, follow the office’s official channels listed below.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatBand
        id="v2-media-figures"
        eyebrow="Key figures for media"
        title="Programme figures for reporting"
        intro="Use these figures as published by the Government Experience Exchange Office."
        stats={site.stats.headline}
      />

      <section aria-labelledby="v2-media-channels" className="bg-whitely-50 py-16 md:py-20">
        <div className="container">
          <SectionHeading
            id="v2-media-channels"
            eyebrow="Official channels"
            title="Follow the programme"
            intro="Official accounts of the Government Experience Exchange Office. Links open in a new tab."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {contact.social.map((s) => {
              const SocialIcon = SOCIAL_ICONS[s.platform] ?? GlobeHemisphereEastIcon
              return (
                <li key={s.platform}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aegov-card card-bordered flex h-full flex-col gap-4 bg-whitely-50 p-5 transition-shadow *:mb-0 hover:shadow-lg"
                  >
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-techblue-950 text-whitely-50">
                      <SocialIcon size={24} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-bold text-techblue-950">{s.platform}</span>
                      <span className="block break-all text-sm text-aeblack-600">
                        {s.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      </span>
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="mt-12 grid gap-6 rounded-2xl border border-aeblack-100 bg-aeblack-50 p-6 md:grid-cols-3 md:p-8">
            <div>
              <h3 className="text-lg font-bold text-techblue-950">Media enquiries</h3>
              <p className="mt-2 text-sm text-aeblack-700">Contact the {contact.office} for interviews and information.</p>
            </div>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-3 rounded-xl bg-whitely-50 p-4 font-semibold text-techblue-800 hover:bg-techblue-50">
              <EnvelopeSimpleIcon size={24} aria-hidden="true" />
              {contact.email}
            </a>
            <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="flex items-center gap-3 rounded-xl bg-whitely-50 p-4 font-semibold text-techblue-800 hover:bg-techblue-50">
              <PhoneIcon size={24} aria-hidden="true" />
              {contact.phone}
            </a>
          </div>
          <Link to={pageHref('v2', 'contact')} className="aegov-link mt-6">
            Go to the contact page
            <ArrowRightIcon size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <LeaderQuotes />
    </Main>
  )
}

interface MediaCardProps {
  item: MediaItem
  featured?: boolean
}

function MediaCard({ item, featured = false }: MediaCardProps) {
  const { label, icon: TypeIcon } = MEDIA_TYPES[item.type]
  return (
    <article
      className={`aegov-card overflow-hidden rounded-2xl *:mb-0 ${featured ? 'card-news bg-techblue-950' : 'card-bordered bg-whitely-50 p-0!'}`}
    >
      {item.image && (
        <img
          src={item.image}
          alt=""
          loading={featured ? undefined : 'lazy'}
          className="card-image aspect-[16/9] w-full rounded-none object-cover"
        />
      )}
      <div className={`card-content *:mb-0 ${featured ? 'p-6 md:p-8' : 'p-5'}`}>
        <span className="aegov-badge badge-base">
          <TypeIcon size={16} aria-hidden="true" />
          {label}
        </span>
        <h3 className={`card-title mt-4 ${featured ? 'text-2xl text-whitely-50' : 'text-lg text-techblue-950'}`}>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              {item.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            item.title
          )}
        </h3>
        {item.date && <p className={`mt-2 text-sm ${featured ? 'text-techblue-100' : 'text-aeblack-600'}`}>{item.date}</p>}
      </div>
    </article>
  )
}
