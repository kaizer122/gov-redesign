import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { site } from '../../../data/site'
import { href, registration } from '../content'

/** Closing call to action shared by every page: register on the participation platform. */
export function ParticipateBand() {
  return (
    <section aria-labelledby="v3-participate" className="v3-dark">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[15rem] md:min-h-[22rem]">
          <img
            src={site.hero.images[3]}
            alt="Night view of Earth from space with city lights across the Middle East"
            className="absolute inset-0 h-full w-full object-cover object-[30%_50%]"
            loading="lazy"
          />
        </div>
        <div className="px-5 py-14 md:px-12 lg:px-16 lg:py-20">
          <p className="v3-kicker">Join the exchange</p>
          <h2 id="v3-participate" className="mt-5 max-w-xl text-3xl font-bold leading-tight md:text-4xl">
            {site.hero.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-aeblack-100">
            Governments ready to exchange experience with the UAE can register through the official participation
            platform, or write to the Government Experience Exchange Office.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={registration.url}
              target="_blank"
              rel="noopener noreferrer"
              className="aegov-btn"
            >
              {registration.label}
              <ArrowUpRightIcon aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <Link to={href('contact')} className="aegov-btn btn-outline border-whitely-50! text-whitely-50! hover:bg-whitely-50/10!">
              Contact the office
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
