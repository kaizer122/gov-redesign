import { useEffect, useState } from 'react'
import { site } from '../../../data/site'
import { LeaderPortrait } from '../components/LeaderPortrait'
import { PageMasthead } from '../components/PageMasthead'
import { ParticipateBand } from '../components/ParticipateBand'
import { Toolkit, Workflow } from '../components/Programme'
import { chapterNo, href, quoteMbz } from '../content'

const SECTIONS = [
  { id: 'mission', title: 'A platform for sharing what works' },
  { id: 'origins', title: 'Where the programme began' },
  { id: 'method', title: 'How knowledge travels' },
  { id: 'toolkit', title: 'The toolkit' },
  { id: 'workflow', title: 'From agreement to achievement' },
  { id: 'numbers', title: 'The programme in numbers' },
  { id: 'voices', title: 'In the leadership’s words' },
] as const

const NUMBER_LABELS: Record<string, string> = {
  'Area of cooperation': 'Areas of cooperation',
}

/** Tracks which long-read section is currently being read, for the table of contents. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])
  return active
}

const SECTION_IDS = SECTIONS.map((s) => s.id)

export function About() {
  const active = useActiveSection(SECTION_IDS)
  const [launchYear] = site.about.launched.match(/\d{4}/) ?? []

  return (
    <main id="main" data-page="about">
      <PageMasthead
        crumb="About"
        kicker="The long read"
        title="The story of the Government Experience Exchange Programme"
        standfirst={<p>How the UAE turned its own experience of modernising government into a partnership offered to governments around the world.</p>}
      >
        <dl className="grid grid-cols-2 gap-6 border-t-2 border-aeblack-900 pt-6 lg:grid-cols-1">
          {launchYear && (
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-aeblack-600">Launched</dt>
              <dd className="v3-numeral mt-2 text-4xl text-aeblack-950">{launchYear}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wider text-aeblack-600">Office</dt>
            <dd className="mt-2 leading-snug text-aeblack-900">
              {site.contact.office}, {site.contact.address}
            </dd>
          </div>
        </dl>
      </PageMasthead>

      <div className="v3-wrap grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <aside className="lg:col-span-3">
          <nav aria-labelledby="v3-toc" className="lg:sticky lg:top-8">
            <h2 id="v3-toc" className="text-sm font-bold uppercase tracking-[0.14em] text-aeblack-700">
              In this story
            </h2>
            <ol className="mt-4 border-s v3-rule">
              {SECTIONS.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={active === section.id ? 'location' : undefined}
                    className="-ms-px flex gap-3 border-s-2 border-transparent py-2 ps-4 text-aeblack-700 hover:text-aeblack-950 aria-[current=location]:border-aegold-600 aria-[current=location]:font-semibold aria-[current=location]:text-aeblack-950"
                  >
                    <span className="v3-numeral pt-0.5 text-sm text-primary-700">{chapterNo(i)}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="lg:col-span-8 lg:col-start-5">
          <section id="mission" aria-labelledby="mission-title" className="v3-prose v3-measure">
            <h2 id="mission-title" className="text-3xl font-bold leading-tight md:text-4xl">
              {SECTIONS[0].title}
            </h2>
            <p className="v3-dropcap mt-6">{site.about.intro[0]}</p>
            <p>{site.about.intro[1]}</p>
          </section>

          <section id="origins" aria-labelledby="origins-title" className="v3-prose v3-measure mt-16 border-t v3-rule pt-12">
            <h2 id="origins-title" className="text-3xl font-bold leading-tight md:text-4xl">
              {SECTIONS[1].title}
            </h2>
            <p className="mt-6">{site.about.launched}</p>
            <p>
              Since then, partnership agreements have been signed with governments across Africa, Asia, Europe and the
              Americas, each built around areas of cooperation agreed with the partner government.
            </p>
          </section>

          <section id="method" aria-labelledby="method-title" className="mt-16 border-t v3-rule pt-12">
            <div className="v3-prose v3-measure">
              <h2 id="method-title" className="text-3xl font-bold leading-tight md:text-4xl">
                {SECTIONS[2].title}
              </h2>
              <p className="mt-6">{site.about.methodology}</p>
            </div>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-sm bg-aeblack-900 sm:grid-cols-3">
              {site.about.slogan.map((word, i) => (
                <li key={word} className="bg-aeblack-950 p-6 text-whitely-50">
                  <span className="v3-numeral text-sm text-aegold-300">{chapterNo(i)}</span>
                  <span className="mt-6 block font-[family-name:var(--font-alexandria)] text-2xl font-bold">{word}</span>
                </li>
              ))}
            </ol>
          </section>

          <section id="toolkit" aria-labelledby="toolkit-title" className="mt-16 border-t v3-rule pt-12">
            <div className="v3-prose v3-measure">
              <h2 id="toolkit-title" className="text-3xl font-bold leading-tight md:text-4xl">
                {SECTIONS[3].title}
              </h2>
              <p className="mt-6">
                The programme shares knowledge through six formats, from hands-on workshops to published
                research.
              </p>
            </div>
            <div className="mt-8">
              <Toolkit />
            </div>
          </section>

          <section id="workflow" aria-labelledby="workflow-title" className="mt-16 border-t v3-rule pt-12">
            <div className="v3-prose v3-measure">
              <h2 id="workflow-title" className="text-3xl font-bold leading-tight md:text-4xl">
                {SECTIONS[4].title}
              </h2>
              <p className="mt-6">Every partnership follows the same five steps.</p>
            </div>
            <div className="mt-10 ps-5">
              <Workflow />
            </div>
          </section>

          <section id="numbers" aria-labelledby="numbers-title" className="mt-16 border-t v3-rule pt-12">
            <h2 id="numbers-title" className="text-3xl font-bold leading-tight md:text-4xl">
              {SECTIONS[5].title}
            </h2>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              {site.stats.byNumbers.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end border-t-2 border-aeblack-900 pt-5">
                  <dt className="mt-2 text-aeblack-700">{NUMBER_LABELS[stat.label] ?? stat.label}</dt>
                  <dd className="v3-numeral text-4xl text-aeblack-950 md:text-5xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </article>
      </div>

      <LeaderPortrait
        quote={quoteMbz}
        id="voices"
        pageUrl={href('about')}
        kicker={SECTIONS[6].title}
        tone="light"
        imageSide="right"
      />

      <ParticipateBand />
    </main>
  )
}
