import { Link } from 'react-router-dom'
import { HandshakeIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { Accordion } from '../components/Accordion'
import { CtaBand } from '../components/CtaBand'
import { Page, PageHeader } from '../components/Page'
import { areaBlocks, countriesForArea, href } from '../lib/content'
import { useDeepLink } from '../lib/useDeepLink'

export function AreasPage() {
  const selected = useDeepLink('area', 'area-')

  return (
    <Page pageKey="areas">
      <PageHeader
        crumb="Areas of cooperation"
        eyebrow="Services we share"
        title="Areas of cooperation"
        intro={
          <p>
            The UAE shares its experience in {site.areas.length} areas of government work. Open an area to read what it
            covers and see which partner countries list it among their workstreams.
          </p>
        }
      />

      <nav aria-label="Jump to an area" className="container pt-10">
        <ul className="flex flex-wrap gap-2">
          {site.areas.map((area) => (
            <li key={area.slug}>
              <a
                href={`#area-${area.slug}`}
                className="inline-flex min-h-10 items-center rounded-full border border-aeblack-100 px-4 text-sm font-semibold text-aeblack-800 no-underline hover:border-primary-300 hover:text-primary-700"
              >
                {area.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-label="All areas of cooperation" className="container py-10 md:py-14">
        <ul className="grid gap-8 lg:grid-cols-2">
          {site.areas.map((area) => {
            const partners = countriesForArea(area)
            const isSelected = selected === area.slug
            return (
              <li key={area.slug}>
                <article
                  id={`area-${area.slug}`}
                  tabIndex={-1}
                  aria-labelledby={`area-title-${area.slug}`}
                  className={`aegov-card card-bordered card-service h-full scroll-mt-6 bg-whitely-50 ${isSelected ? 'border-primary-600! ring-4 ring-primary-100' : 'border-aeblack-100!'}`}
                >
                  {area.image && (
                    <img
                      src={area.image}
                      alt=""
                      width={930}
                      height={600}
                      className="card-image aspect-[16/7]! h-auto"
                      loading="lazy"
                    />
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {area.logo && <img src={area.logo} alt="" className="h-10 w-auto max-w-[60%] object-contain" loading="lazy" />}
                    <span className="aegov-badge v4-badge-blue">
                      <UsersThreeIcon aria-hidden="true" />
                      {partners.length} partner {partners.length === 1 ? 'country' : 'countries'}
                    </span>
                  </div>
                  <div>
                    <h2 id={`area-title-${area.slug}`} className="card-service-title text-aeblack-950">
                      {area.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-aeblack-600">{area.summary}</p>
                  </div>
                  <Accordion
                    key={isSelected ? 'selected' : 'default'}
                    idPrefix={`area-${area.slug}`}
                    defaultOpen={isSelected ? ['details'] : []}
                    items={[
                      {
                        id: 'details',
                        title: 'What this area covers',
                        content: areaBlocks(area).map((block, index) =>
                          block.kind === 'text' ? (
                            <p key={`text-${index}`}>{block.text}</p>
                          ) : (
                            <ul key={`list-${index}`} className="list-disc space-y-1 ps-6">
                              {block.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          ),
                        ),
                      },
                      {
                        id: 'partners',
                        title: `Partner countries (${partners.length})`,
                        content:
                          partners.length > 0 ? (
                            <ul className="flex flex-wrap gap-2">
                              {partners.map((country) => (
                                <li key={country.id}>
                                  <Link
                                    to={href('countries', { country: String(country.id) })}
                                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-aeblack-100 px-3 text-sm font-semibold text-aeblack-800 no-underline hover:border-primary-300 hover:text-primary-700"
                                  >
                                    <Flag iso={country.iso} alt="" className="h-4 w-6 rounded-sm object-cover" />
                                    {country.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No partner country lists this area as a separate workstream yet.</p>
                          ),
                      },
                    ]}
                  />
                  <Link
                    to={href('contact', { subject: 'Government Partnership', area: area.slug })}
                    className="aegov-btn btn-soft btn-sm"
                  >
                    <HandshakeIcon aria-hidden="true" />
                    Express interest in this area
                  </Link>
                </article>
              </li>
            )
          })}
        </ul>
      </section>

      <CtaBand
        title="Not sure which area fits?"
        text="Describe your government’s priorities and the programme team will help you choose the right areas of cooperation."
        secondary={
          <Link to={href('contact', { subject: 'Government Partnership' })} className="aegov-btn btn-outline">
            Contact the team
          </Link>
        }
      />
    </Page>
  )
}
