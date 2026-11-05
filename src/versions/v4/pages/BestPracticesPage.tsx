import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { CtaBand } from '../components/CtaBand'
import { Page, PageHeader, SectionHeading } from '../components/Page'
import { Tabs } from '../components/Tabs'
import { PRACTICES, countriesForArea, href } from '../lib/content'

const intro = site.bestPracticesIntro
/** Source copy with its typos corrected. */
const introBody = intro.body.map((p) => p.replace('acheive', 'achieve').replace('its eager', 'it is eager'))

const areaTabs = site.areas.filter((area) => PRACTICES.some((p) => p.area === area.slug))

export function BestPracticesPage() {
  const [tab, setTab] = useState('all')
  const practices = tab === 'all' ? PRACTICES : PRACTICES.filter((p) => p.area === tab)

  return (
    <Page pageKey="best-practices">
      <PageHeader
        crumb="Best practices"
        eyebrow="Practice library"
        title="Best practices"
        intro={
          <p>
            Proven UAE government practices and initiatives that partner governments can learn from and adapt. Filter by
            area of cooperation to find what is relevant to you.
          </p>
        }
      />

      <section aria-labelledby="v4-bp-intro" className="container py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="v4-bp-intro" className="text-2xl font-bold text-aeblack-950 md:text-3xl">
              {intro.title}
            </h2>
            <div className="mt-5 space-y-4 text-lg text-aeblack-700">
              {introBody.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          {intro.quote && (
            <figure className="overflow-hidden rounded-3xl border border-aeblack-100 bg-whitely-50">
              {intro.quote.image && (
                <img
                  src={intro.quote.image}
                  alt={intro.quote.author}
                  width={1920}
                  height={1334}
                  className="aspect-[16/9] h-auto w-full object-cover object-top"
                  loading="lazy"
                />
              )}
              <blockquote className="aegov-quote p-6 md:p-8">
                <p>{intro.quote.text}</p>
                <div className="quote-footer">
                  <div className="quote-author">{intro.quote.author}</div>
                  {intro.quote.role && <div className="quote-cite">{intro.quote.role}</div>}
                </div>
              </blockquote>
            </figure>
          )}
        </div>
      </section>

      <section aria-labelledby="v4-bp-library" className="border-t border-aeblack-100 bg-aeblack-50/50">
        <div className="container py-14 md:py-20">
          <SectionHeading
            id="v4-bp-library"
            title="Explore practices by area"
            intro="Each practice is drawn from the UAE initiatives described under the areas of cooperation."
          />
          <Tabs
            idPrefix="v4-bp"
            label="Filter practices by area of cooperation"
            variant="pills"
            selected={tab}
            onSelect={setTab}
            tabs={[
              { id: 'all', label: `All (${PRACTICES.length})` },
              ...areaTabs.map((area) => ({
                id: area.slug,
                label: `${area.title} (${PRACTICES.filter((p) => p.area === area.slug).length})`,
              })),
            ]}
          >
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {practices.map((practice) => {
                const area = site.areas.find((a) => a.slug === practice.area)
                const partners = area ? countriesForArea(area).length : 0
                return (
                  <li key={practice.id} className="aegov-card card-bordered card-glow flex h-full flex-col border-aeblack-100! bg-whitely-50">
                    <div className="flex items-center justify-between gap-3">
                      {area?.logo && <img src={area.logo} alt="" className="h-8 w-auto max-w-[70%] object-contain" loading="lazy" />}
                      <span className="aegov-badge v4-badge-blue">
                        Practice
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-700">{area?.title}</p>
                      <h3 className="mt-1 text-xl font-bold text-aeblack-950">{practice.title}</h3>
                      <p className="mt-3 text-aeblack-700">{practice.summary}</p>
                    </div>
                    {practice.highlights && (
                      <ul className="space-y-2">
                        {practice.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-aeblack-800">
                            <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-aeblack-100 pt-4">
                      {partners > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-aeblack-600">
                          <UsersThreeIcon aria-hidden="true" className="size-4" />
                          {partners} partner {partners === 1 ? 'country' : 'countries'}
                        </span>
                      )}
                      {area && (
                        <Link to={href('areas', { area: area.slug })} className="aegov-link text-sm">
                          About this area
                          <span className="sr-only">: {area.title}</span>
                          <ArrowRightIcon aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </Tabs>
        </div>
      </section>

      <CtaBand
        title="Want to apply a practice in your government?"
        text="Tell us which practices interest you. They are shared with partner governments through the programme’s knowledge-sharing tools."
        secondary={
          <Link to={href('contact', { subject: 'Government Partnership' })} className="aegov-btn btn-outline">
            Express interest
          </Link>
        }
      />
    </Page>
  )
}
