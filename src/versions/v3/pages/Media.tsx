import { ArrowUpRightIcon, EnvelopeSimpleIcon, PhoneIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Blockquote } from '../components/Blockquote'
import { PageMasthead } from '../components/PageMasthead'
import { ParticipateBand } from '../components/ParticipateBand'
import { SectionHeading } from '../components/SectionHeading'
import { SOCIAL_ICONS } from '../components/social'
import { focusOf, href } from '../content'

const TYPE_LABELS: Record<string, string> = {
  photo: 'Photo',
  video: 'Video',
  report: 'Report',
  news: 'News',
}

const STATEMENTS = [...site.quotes, ...(site.bestPracticesIntro.quote ? [site.bestPracticesIntro.quote] : [])]

export function Media() {
  const { contact } = site

  return (
    <main id="main" data-page="media">
      <PageMasthead
        crumb="Media Center"
        kicker="Media centre"
        title="Pictures, statements and channels"
        standfirst={
          <p>
            Photographs from the programme, the statements of the UAE leadership that frame it, and the official
            channels where the Government Experience Exchange Office publishes its news.
          </p>
        }
      />

      <section aria-labelledby="v3-gallery" className="v3-wrap py-14 lg:py-20">
        <SectionHeading id="v3-gallery" kicker="Photo story" title="From the gallery" />
        <ul className="mt-10 space-y-10">
          {site.media.map((item, i) => (
            <li key={item.title}>
              <article className="grid gap-8 md:grid-cols-12 md:items-end" aria-labelledby={`media-${i}`}>
                {item.image && (
                  <figure className="md:col-span-6 lg:col-span-5">
                    <div className="aspect-square overflow-hidden rounded-sm bg-aeblack-100">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                  </figure>
                )}
                <div className="md:col-span-6 lg:col-span-7">
                  <span className="aegov-badge badge-solid">{TYPE_LABELS[item.type]}</span>
                  {item.date && <p className="mt-3 text-sm text-aeblack-600">{item.date}</p>}
                  <h3
                    id={`media-${i}`}
                    className="mt-4 text-2xl font-bold leading-snug text-aeblack-950 md:text-4xl"
                  >
                    {item.title}
                  </h3>
                  {item.url && (
                    <p className="mt-6">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="aegov-link">
                        View the original
                        <ArrowUpRightIcon aria-hidden="true" className="link-icon" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </p>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="v3-statements" className="v3-paper-deep">
        <div className="v3-wrap py-14 lg:py-20">
          <SectionHeading
            id="v3-statements"
            kicker="Statements"
            title="In the leadership’s words"
            intro="The statements that frame the UAE’s approach to sharing government experience."
          />
          <ul className="mt-10 grid gap-8 md:grid-cols-2">
            {STATEMENTS.map((quote, i) => (
              <li key={quote.text} id={`statement-${i + 1}`} className="overflow-hidden rounded-sm bg-whitely-50 shadow-sm">
                {quote.image && (
                  <img
                    src={quote.image}
                    alt={`Portrait of ${quote.author}`}
                    className="aspect-[16/9] w-full object-cover"
                    style={{ objectPosition: focusOf(quote) }}
                    loading="lazy"
                  />
                )}
                <Blockquote
                  variant="pull"
                  text={quote.text}
                  author={quote.author}
                  role={quote.role}
                  cite={`${href('media')}#statement-${i + 1}`}
                  className="m-4 px-5! sm:m-6 sm:px-6!"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="v3-channels" className="v3-wrap grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-7">
          <SectionHeading
            id="v3-channels"
            kicker="Official channels"
            title="Follow the programme"
            intro="News, photographs and video from the Government Experience Exchange Office."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {contact.social.map(({ platform, url }) => {
              const SocialIcon = SOCIAL_ICONS[platform]
              return (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-sm border v3-rule bg-whitely-50 p-4 text-aeblack-900 hover:border-aegold-600"
                  >
                    {SocialIcon && <SocialIcon aria-hidden="true" className="size-7 text-aegold-700" />}
                    <span className="font-[family-name:var(--font-alexandria)] text-lg font-semibold">{platform}</span>
                    <ArrowUpRightIcon aria-hidden="true" className="ms-auto size-5 text-aeblack-600" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
        <aside aria-labelledby="v3-press" className="v3-dark self-start rounded-sm p-8 lg:col-span-5">
          <h2 id="v3-press" className="text-2xl font-bold">
            Media enquiries
          </h2>
          <p className="mt-3 text-aeblack-100">
            Journalists and partners can reach the {contact.office} directly.
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-center gap-3">
              <EnvelopeSimpleIcon aria-hidden="true" className="size-5 text-aegold-300" />
              <a href={`mailto:${contact.email}`} className="underline underline-offset-4 hover:text-aegold-300">
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <PhoneIcon aria-hidden="true" className="size-5 text-aegold-300" />
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="underline underline-offset-4 hover:text-aegold-300">
                {contact.phone}
              </a>
            </li>
          </ul>
        </aside>
      </section>

      <ParticipateBand />
    </main>
  )
}
