import { Link } from 'react-router-dom'
import { site, type Area } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { Blockquote } from '../components/Blockquote'
import { PageMasthead } from '../components/PageMasthead'
import { ParticipateBand } from '../components/ParticipateBand'
import { chapterNo, countryAnchor, href, indexName, partnersFor, pullQuote, toBlocks } from '../content'

function AreaEssay({ area, index }: { area: Area; index: number }) {
  const blocks = toBlocks(area.body)
  const partners = partnersFor(area)
  const quote = pullQuote(area)
  const source = quote.replace(/…$/, '')
  const quoteAfter = Math.max(
    0,
    blocks.findIndex((b) => b.kind === 'p' && b.text.includes(source)),
  )
  const imageFirst = index % 2 === 0

  return (
    <article
      id={area.slug}
      aria-labelledby={`${area.slug}-title`}
      className={index % 2 === 0 ? '' : 'v3-paper-deep'}
    >
      <div className="v3-wrap py-16 lg:py-24">
        <header className="flex flex-col gap-6 border-b-2 border-aeblack-900 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="v3-kicker">Chapter {chapterNo(index)}</p>
            <h2 id={`${area.slug}-title`} className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              {area.title}
            </h2>
          </div>
          {area.logo && (
            <div className="v3-plate inline-flex shrink-0 self-start rounded-sm px-4 py-3 md:self-auto">
              <img src={area.logo} alt={`${area.title} logo`} className="h-9 w-auto max-w-[16rem] object-contain" loading="lazy" />
            </div>
          )}
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {area.image && (
            <figure className={`lg:col-span-5 ${imageFirst ? '' : 'lg:order-2'}`}>
              <div className="v3-zoom aspect-[4/3] overflow-hidden rounded-sm bg-aeblack-100 lg:aspect-[4/5]">
                <img src={area.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <figcaption className="mt-3 border-l-2 border-aegold-600 pl-3 text-sm text-aeblack-600">
                Chapter {chapterNo(index)} · {area.title}
              </figcaption>
            </figure>
          )}
          <div className="v3-prose lg:col-span-7">
            {blocks.map((block, i) => (
              <div key={i}>
                {block.kind === 'p' ? (
                  <p className={`v3-measure ${i === 0 ? 'v3-dropcap' : 'mt-5'}`}>{block.text}</p>
                ) : (
                  <ul className="v3-measure mt-5 grid gap-3 sm:grid-cols-2">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="border-t-2 border-aegold-600 bg-whitely-50 px-4 py-3 font-[family-name:var(--font-alexandria)] font-semibold text-aeblack-900"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {i === quoteAfter && (
                  <Blockquote
                    variant="pull"
                    text={quote}
                    author={site.meta.siteName}
                    role={`Chapter ${chapterNo(index)}: ${area.title}`}
                    cite={`${href('areas')}#${area.slug}`}
                    className="v3-measure my-8"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {partners.length > 0 && (
          <div className="mt-12 border-t v3-rule pt-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-aeblack-700">
              Partner governments with a {area.title} workstream
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {partners.map((country) => (
                <li key={country.id}>
                  <Link
                    to={`${href('countries')}#${countryAnchor(country)}`}
                    className="inline-flex items-center gap-2 rounded-full border border-aeblack-200 bg-whitely-50 py-1 pe-3 ps-1.5 text-sm text-aeblack-800 hover:border-aegold-600"
                  >
                    <Flag iso={country.iso} alt="" className="h-4 w-6 rounded-xs object-cover" />
                    {indexName(country)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  )
}

export function Areas() {
  return (
    <main id="main" data-page="areas">
      <PageMasthead
        crumb="Areas of Cooperation"
        kicker={`${site.areas.length} chapters`}
        title="Areas of cooperation"
        standfirst={
          <p>
            The fields in which the UAE shares its government experience. Each chapter sets out the approach, the
            initiatives behind it and the partner governments working on it.
          </p>
        }
      />

      <nav aria-labelledby="v3-chapter-index" className="border-b v3-rule">
        <div className="v3-wrap py-10">
          <h2 id="v3-chapter-index" className="text-sm font-bold uppercase tracking-[0.14em] text-aeblack-700">
            Chapter index
          </h2>
          <ol className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
            {site.areas.map((area, i) => (
              <li key={area.slug} className="border-t v3-rule">
                <a href={`#${area.slug}`} className="flex gap-3 py-3 text-aeblack-800 hover:text-aeblack-950 hover:underline">
                  <span className="v3-numeral pt-0.5 text-sm text-primary-700">{chapterNo(i)}</span>
                  {area.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {site.areas.map((area, i) => (
        <AreaEssay key={area.slug} area={area} index={i} />
      ))}

      <ParticipateBand />
    </main>
  )
}
