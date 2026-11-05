import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { AreaBody } from '../components/AreaBody'
import { FactList, PageHeader } from '../components/PageHeader'
import { ParticipateCta } from '../components/ParticipateCta'
import { PartnerFlags } from '../components/PartnerFlags'
import { countriesForArea, href } from '../lib/content'
import { CONTAINER, SECTION } from '../lib/ui'

export default function AreasPage() {
  const linked = site.areas.filter((a) => countriesForArea(a).length > 0).length

  return (
    <main id="main" data-page="areas" tabIndex={-1}>
      <PageHeader
        page="areas"
        title="Areas of cooperation"
        lead="The fields in which the UAE Government shares its experience, methods and best practices with partner governments. Each area lists the partner countries that have included it in their partnership."
        aside={
          <FactList
            facts={[
              { label: 'Areas of cooperation', value: site.areas.length },
              { label: 'Areas taken up by partners', value: linked },
            ]}
          />
        }
      />

      <div className={`${CONTAINER} ${SECTION} grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] xl:gap-14`}>
        <nav aria-label="Areas of cooperation" className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 text-sm font-semibold tracking-wider text-aeblack-700 uppercase">Jump to an area</p>
          <ul className="grid gap-1 max-lg:grid-cols-1 sm:max-lg:grid-cols-2">
            {site.areas.map((area) => (
              <li key={area.slug}>
                <a
                  href={`#${area.slug}`}
                  className="block rounded-lg border-s-2 border-aeblack-100 px-3 py-2 text-sm font-medium text-aeblack-800 no-underline hover:border-primary-600 hover:bg-primary-50 hover:text-primary-900"
                >
                  {area.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          {site.areas.map((area) => (
            <section
              key={area.slug}
              id={area.slug}
              aria-labelledby={`${area.slug}-title`}
              className="aegov-card card-bordered scroll-mt-6 overflow-hidden border-aeblack-100! p-0! [&>*]:m-0!"
            >
              <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                {area.image && (
                  <img
                    src={area.image}
                    alt=""
                    className="h-56 w-full object-cover md:h-full"
                    loading="lazy"
                    width={930}
                    height={600}
                  />
                )}
                <div className="space-y-5 p-6 md:p-8">
                  {area.logo && <img src={area.logo} alt="" className="h-12 w-auto max-w-full object-contain" loading="lazy" />}
                  <h2 id={`${area.slug}-title`} className="text-h6 md:text-h5 text-aeblack-900">
                    {area.title}
                  </h2>
                  <AreaBody area={area} />
                  <PartnerFlags area={area} />
                  <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-aeblack-100 pt-4">
                    {countriesForArea(area).length > 0 && (
                      <Link to={`${href('countries')}?area=${area.slug}`} className="aegov-link">
                        View partner countries
                        <ArrowRight aria-hidden="true" className="link-icon" />
                      </Link>
                    )}
                    <Link to={href('contact')} className="aegov-link">
                      Enquire about this area
                      <ArrowRight aria-hidden="true" className="link-icon" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <ParticipateCta />
    </main>
  )
}
