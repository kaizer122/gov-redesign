import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  CameraIcon,
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  PhoneIcon,
  XLogoIcon,
  YoutubeLogoIcon,
  type Icon,
} from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Page, PageHeader, SectionHeading } from '../components/Page'
import { ServiceCard } from '../components/ServiceCard'
import { href } from '../lib/content'

const SOCIAL_ICONS: Record<string, Icon> = {
  X: XLogoIcon,
  Facebook: FacebookLogoIcon,
  LinkedIn: LinkedinLogoIcon,
  Instagram: InstagramLogoIcon,
  YouTube: YoutubeLogoIcon,
}

const MEDIA_TYPE_LABELS: Record<string, string> = {
  photo: 'Photo',
  video: 'Video',
  report: 'Report',
  news: 'News',
}

export function MediaPage() {
  const [featured, ...rest] = site.media

  return (
    <Page pageKey="media">
      <PageHeader
        crumb="Media centre"
        eyebrow="Press and media"
        title="Media centre"
        intro={
          <p>
            Photos and updates from the programme, key figures for reporting, and the official channels to follow or
            contact for media enquiries.
          </p>
        }
      />

      <section aria-labelledby="v4-media-latest" className="container py-14 md:py-20">
        <SectionHeading id="v4-media-latest" title="Latest from the programme" />
        {featured && (
          <article className="aegov-card card-news card-bordered overflow-hidden border-aeblack-100! bg-whitely-50 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {featured.image && (
              <img
                src={featured.image}
                alt={featured.title}
                width={512}
                height={512}
                className="aspect-square h-full w-full object-cover md:aspect-auto"
              />
            )}
            <div className="card-content flex flex-col justify-center md:p-10!">
              <div className="flex flex-wrap items-center gap-3">
                <span className="aegov-badge">
                  <CameraIcon aria-hidden="true" />
                  {MEDIA_TYPE_LABELS[featured.type]}
                </span>
                {featured.date && <span className="text-sm text-aeblack-600">{featured.date}</span>}
              </div>
              <h3 className="text-2xl font-bold leading-snug text-aeblack-950 md:text-3xl">{featured.title}</h3>
              {featured.url ? (
                <a href={featured.url} target="_blank" rel="noopener noreferrer" className="aegov-link">
                  Open the story<span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <p className="text-aeblack-600">
                  For the full set of images or permission to reuse them, contact the media team below.
                </p>
              )}
            </div>
          </article>
        )}
        {rest.length > 0 && (
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {rest.map((item) => (
              <li key={item.title} className="aegov-card card-news card-bordered border-aeblack-100!">
                {item.image && <img src={item.image} alt="" className="aspect-video w-full object-cover" loading="lazy" />}
                <div className="card-content">
                  <span className="aegov-badge">{MEDIA_TYPE_LABELS[item.type]}</span>
                  <h3 className="text-lg font-bold text-aeblack-950">{item.title}</h3>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="v4-media-figures" className="bg-primary-900 text-whitely-50">
        <div className="container py-14 md:py-16">
          <h2 id="v4-media-figures" className="text-2xl font-bold md:text-3xl">
            Key figures for reporting
          </h2>
          <p className="mt-2 max-w-2xl text-aegreen-100">As published by the programme.</p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {site.stats.byNumbers.map((stat) => (
              <div key={stat.label} className="flex flex-col border-s-2 border-seablue-400 ps-4">
                <dt className="text-sm text-aegreen-100">{stat.label}</dt>
                <dd className="order-first break-words text-2xl font-extrabold md:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="v4-media-contact" className="container py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div>
            <SectionHeading
              id="v4-media-contact"
              title="Media enquiries"
              intro="Journalists and researchers can reach the Government Experience Exchange Office directly."
            />
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="flex min-h-14 items-center gap-3 rounded-2xl border border-aeblack-100 px-4 font-semibold text-primary-700 no-underline hover:bg-primary-50 hover:underline"
                >
                  <EnvelopeSimpleIcon aria-hidden="true" className="size-6" />
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, '')}`}
                  className="flex min-h-14 items-center gap-3 rounded-2xl border border-aeblack-100 px-4 font-semibold text-primary-700 no-underline hover:bg-primary-50 hover:underline"
                >
                  <PhoneIcon aria-hidden="true" className="size-6" />
                  {site.contact.phone}
                </a>
              </li>
            </ul>
            <Link to={href('contact', { subject: 'Inquiry' })} className="aegov-btn mt-6">
              Send an enquiry
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </div>
          <div>
            <h2 className="mb-8 text-2xl font-bold text-aeblack-950 md:text-3xl">Follow the programme</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {site.contact.social.map((social) => (
                <li key={social.platform}>
                  <ServiceCard
                    icon={SOCIAL_ICONS[social.platform]}
                    title={social.platform}
                    description={`Official ${site.meta.shortName} channel on ${social.platform}.`}
                    to={social.url}
                    action="Follow"
                    external
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Page>
  )
}
