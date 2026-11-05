import { useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { pageHref } from '../../../shared/pages'
import { Main, PageHeader, SectionHeading } from '../components/Page'
import { ParticipateBand, QuoteIcon } from '../components/Blocks'
import { areaReach, bodyBlocks, tidy } from '../lib/data'

const FLAG_PREVIEW = 12

export default function BestPractices() {
  const intro = site.bestPracticesIntro
  const quote = intro.quote
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = areaReach.length
    const steps: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
      Home: -index,
      End: count - 1 - index,
    }
    if (!(e.key in steps)) return
    e.preventDefault()
    const next = (index + steps[e.key] + count) % count
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <Main page="best-practices">
      <PageHeader
        page="best-practices"
        eyebrow="Best practices"
        title={intro.title}
        lead="The UAE set out to produce and manage knowledge, not only consume it. These are the government practices it now shares with partner countries."
      />

      <section aria-labelledby="v2-bp-story" className="bg-whitely-50 py-16 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading id="v2-bp-story" eyebrow="Our approach" title="From consuming knowledge to producing it" />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-aeblack-700">
              {intro.body.map((p) => (
                <p key={p}>{tidy(p)}</p>
              ))}
            </div>
          </div>
          {quote && (
            <figure className="v2-dark overflow-hidden rounded-2xl bg-techblue-950 lg:col-span-6">
              {quote.image && (
                <img src={quote.image} alt={quote.author} loading="lazy" className="aspect-[16/9] w-full object-cover object-top" />
              )}
              <blockquote className="aegov-quote v2-quote-dark mx-6 my-8 md:mx-8">
                <QuoteIcon />
                <p>{quote.text}</p>
              </blockquote>
              <figcaption className="border-t border-techblue-200/20 px-6 py-5 md:px-8">
                <span className="block font-bold text-aegold-200">{quote.author}</span>
                {quote.role && <span className="block text-sm text-techblue-100">{quote.role}</span>}
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <section aria-labelledby="v2-bp-practices" className="border-t border-aeblack-100 bg-aeblack-50 py-16 md:py-20">
        <div className="container">
          <SectionHeading
            id="v2-bp-practices"
            eyebrow="Practices shared"
            title="UAE initiatives behind each area of cooperation"
            intro="Choose a practice to read how it works in the UAE and see which partner countries have related workstreams."
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <div className="aegov-tab v2-tab-vertical min-w-0 lg:col-span-4">
              <div className="tab-items gap-4 overflow-x-auto pb-px lg:gap-0 lg:overflow-visible" role="tablist" aria-label="Best practices" aria-orientation="vertical">
                {areaReach.map(({ area }, i) => (
                  <button
                    key={area.slug}
                    ref={(el) => {
                      tabRefs.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={`v2-bp-tab-${area.slug}`}
                    aria-controls={`v2-bp-panel-${area.slug}`}
                    aria-selected={active === i}
                    tabIndex={active === i ? 0 : -1}
                    className={`tab-link shrink-0 whitespace-nowrap ${active === i ? 'tab-active' : ''}`}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => onTabKey(e, i)}
                  >
                    {area.title}
                  </button>
                ))}
              </div>
            </div>

            {areaReach.map(({ area, partners }, i) => (
              <div
                key={area.slug}
                role="tabpanel"
                id={`v2-bp-panel-${area.slug}`}
                aria-labelledby={`v2-bp-tab-${area.slug}`}
                hidden={active !== i}
                tabIndex={0}
                className="tab-content min-w-0 lg:col-span-8"
              >
                <article className="overflow-hidden rounded-2xl border border-aeblack-100 bg-whitely-50">
                  <div className="relative h-56 bg-techblue-950 md:h-72">
                    {area.image && <img src={area.image} alt="" className="size-full object-cover" />}
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-techblue-950/70 to-transparent" />
                    {area.logo && (
                      <span className="absolute bottom-5 start-6 inline-flex max-w-[70%] rounded-lg bg-whitely-50 px-3 py-2 shadow">
                        <img
                          src={area.logo}
                          alt={`${area.title} logo`}
                          className="h-8 w-auto max-w-full object-contain object-left"
                        />
                      </span>
                    )}
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-extrabold text-techblue-950">{area.title}</h3>
                    <div className="mt-4 space-y-4 leading-relaxed text-aeblack-700">
                      {bodyBlocks(area.body).map((block) =>
                        block.kind === 'p' ? (
                          <p key={block.text}>{block.text}</p>
                        ) : (
                          <ul key={block.items.join('|')} className="grid gap-2 sm:grid-cols-2">
                            {block.items.map((item) => (
                              <li key={item} className="flex items-center gap-2 rounded-lg bg-techblue-50 px-3 py-2 font-semibold text-techblue-900">
                                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-aegold-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        ),
                      )}
                    </div>

                    <div className="mt-8 border-t border-aeblack-100 pt-6">
                      <p className="text-sm font-bold text-aeblack-900">
                        {`${partners.length} partner ${partners.length === 1 ? 'country lists' : 'countries list'} related workstreams`}
                        <span className="font-normal text-aeblack-600"> (derived from country profiles)</span>
                      </p>
                      {partners.length > 0 && (
                        <ul className="mt-3 flex flex-wrap items-center gap-2" aria-label={`Partners with ${area.title} workstreams`}>
                          {partners.slice(0, FLAG_PREVIEW).map((p) => (
                            <li key={p.id} className="flex items-center gap-1.5 rounded-full bg-aeblack-50 py-1 pe-3 ps-1 text-xs font-medium text-aeblack-800">
                              <Flag iso={p.iso} alt="" className="size-5 rounded-full object-cover" />
                              {p.shortName}
                            </li>
                          ))}
                          {partners.length > FLAG_PREVIEW && (
                            <li className="text-xs font-semibold text-aeblack-600">{`+${partners.length - FLAG_PREVIEW} more`}</li>
                          )}
                        </ul>
                      )}
                      <Link to={pageHref('v2', 'countries')} className="aegov-link mt-4">
                        Explore partner countries
                        <ArrowRightIcon size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ParticipateBand />
    </Main>
  )
}
