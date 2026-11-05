import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { site, type Area } from '../../../data/site'
import { LeaderPortrait } from '../components/LeaderPortrait'
import { PageMasthead } from '../components/PageMasthead'
import { ParticipateBand } from '../components/ParticipateBand'
import { SectionHeading } from '../components/SectionHeading'
import { chapterNo, href, paragraphs, sentences, toBlocks } from '../content'

function PlaybookChapter({ area, index }: { area: Area; index: number }) {
  const blocks = toBlocks(area.body)
  const [lead, ...rest] = blocks.flatMap((b) => (b.kind === 'p' ? sentences(b.text) : []))
  const moves = rest.filter((s) => !s.endsWith(':'))
  const programmes = blocks.flatMap((b) => (b.kind === 'list' ? b.items : []))
  const titleId = `play-${area.slug}`

  return (
    <li>
      <article aria-labelledby={titleId} className="grid gap-8 border-t-2 border-aeblack-900 py-12 lg:grid-cols-12 lg:gap-12">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-8">
            <p className="v3-numeral text-7xl text-aegold-600 md:text-8xl" aria-hidden="true">
              {chapterNo(index)}
            </p>
            <p className="sr-only">Chapter {index + 1}</p>
            <h3 id={titleId} className="mt-4 text-2xl font-bold leading-tight md:text-3xl">
              {area.title}
            </h3>
            {area.logo && (
              <div className="v3-plate mt-6 inline-flex rounded-sm px-4 py-3">
                <img src={area.logo} alt={`${area.title} logo`} className="h-8 w-auto max-w-[14rem] object-contain" loading="lazy" />
              </div>
            )}
          </div>
        </header>
        <div className="lg:col-span-8">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary-700">The practice</p>
          <p
            className={`v3-measure mt-3 font-[family-name:var(--font-alexandria)] font-semibold leading-snug text-aeblack-950 ${lead.length > 220 ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}
          >
            {lead}
          </p>

          {moves.length > 0 && (
            <>
              <p className="mt-10 text-sm font-bold uppercase tracking-[0.14em] text-primary-700">How it works</p>
              <ol className="v3-measure mt-4 space-y-5">
                {moves.map((move, i) => (
                  <li key={move} className="grid grid-cols-[2.5rem_1fr] gap-3">
                    <span className="v3-numeral pt-1 text-lg text-aegold-700">{String.fromCharCode(97 + i)}.</span>
                    <span className="text-lg leading-relaxed text-aeblack-800">{move}</span>
                  </li>
                ))}
              </ol>
            </>
          )}

          {programmes.length > 0 && (
            <>
              <p className="mt-10 text-sm font-bold uppercase tracking-[0.14em] text-primary-700">Programmes offered</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {programmes.map((item) => (
                  <li key={item} className="aegov-badge badge-lg">
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-10">
            <Link to={`${href('areas')}#${area.slug}`} className="aegov-link">
              Read chapter {chapterNo(index)} in full
              <ArrowRightIcon aria-hidden="true" className="link-icon" />
            </Link>
          </p>
        </div>
      </article>
    </li>
  )
}

export function BestPractices() {
  const intro = site.bestPracticesIntro

  return (
    <main id="main" data-page="best-practices">
      <PageMasthead
        crumb="Best Practices"
        kicker="The playbook"
        title={intro.title}
        standfirst={
          <p>
            The practices the UAE has developed in its own government work, gathered into chapters that partner
            governments can study and adapt.
          </p>
        }
      />

      <section aria-labelledby="v3-why" className="v3-wrap grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-4">
          <p className="v3-kicker">Editor’s note</p>
          <h2 id="v3-why" className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
            From consuming knowledge to producing it
          </h2>
        </div>
        <div className="v3-prose v3-measure lg:col-span-7 lg:col-start-6">
          {intro.body.flatMap(paragraphs).map((text, i) => (
            <p key={text} className={i === 0 ? 'v3-dropcap' : undefined}>
              {text}
            </p>
          ))}
        </div>
      </section>

      {intro.quote && (
        <LeaderPortrait
          quote={intro.quote}
          id="v3-playbook-voice"
          pageUrl={href('best-practices')}
          kicker="The vision"
          tone="light"
          imageSide="left"
        />
      )}

      <section aria-labelledby="v3-playbook" className="v3-wrap py-16 lg:py-24">
        <SectionHeading
          id="v3-playbook"
          kicker={`${site.areas.length} chapters`}
          title="The playbook"
          intro="Each chapter distils one area of cooperation: the practice itself, how it works, and where to read more."
        />
        <ol className="mt-12">
          {site.areas.map((area, i) => (
            <PlaybookChapter key={area.slug} area={area} index={i} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="v3-adopt" className="v3-paper-deep">
        <div className="v3-wrap flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
          <div className="v3-measure">
            <h2 id="v3-adopt" className="text-2xl font-bold md:text-3xl">
              Interested in adapting a practice?
            </h2>
            <p className="mt-3 text-lg text-aeblack-700">
              Tell the Government Experience Exchange Office which chapter matters to your government.
            </p>
          </div>
          <Link to={href('contact')} className="aegov-btn shrink-0">
            Start a conversation
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </div>
      </section>

      <ParticipateBand />
    </main>
  )
}
