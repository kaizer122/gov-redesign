import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { REGISTER_URL, href } from '../lib/content'
import { CONTAINER } from '../lib/ui'
import { ExternalLink } from './ExternalLink'

/** Closing call to action that sends governments to the registration platform. */
export function ParticipateCta() {
  return (
    <section aria-labelledby="v1-participate-title" className="bg-aeblack-900 text-whitely-50">
      <div className={`${CONTAINER} grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center`}>
        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-semibold tracking-wider text-primary-300 uppercase">
            {site.about.slogan.join(' · ')}
          </p>
          <h2 id="v1-participate-title" className="text-h5 md:text-h4 text-whitely-50">
            {site.hero.title}
          </h2>
          <p className="mt-4 text-lg text-aeblack-100">
            Registration opens on an external platform. Every partnership then follows the same five stages, starting
            with agreeing the areas of cooperation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <ExternalLink href={REGISTER_URL} className="aegov-btn btn-lg">
            {site.hero.cta.label}
          </ExternalLink>
          <Link
            to={href('contact')}
            className="inline-flex items-center gap-2 font-semibold text-whitely-50 underline-offset-4 hover:text-primary-200"
          >
            Talk to the office
            <ArrowRight aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
