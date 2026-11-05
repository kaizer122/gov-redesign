import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EnvelopeSimple, MapPin, Phone, Plus } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import type { PageKey } from '../../../shared/pages'
import { EMAIL_HREF, PHONE_HREF, REGISTER_URL, href, pageLabel } from '../lib/content'
import { useMediaQuery } from '../lib/hooks'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER } from '../lib/ui'
import { ExternalLink } from './ExternalLink'

interface FooterGroup {
  title: string
  pages: PageKey[]
}

const GROUPS: FooterGroup[] = [
  { title: 'The programme', pages: ['about', 'areas', 'best-practices'] },
  { title: 'Partnerships', pages: ['countries', 'activities'] },
  { title: 'Media and contact', pages: ['media', 'contact'] },
]

export function Footer() {
  const wide = useMediaQuery('(min-width: 40rem)')
  const [open, setOpen] = useState<string | null>(null)

  return (
    <footer className="aegov-footer">
      <div className="footer-top py-8 md:py-12">
        <div className={CONTAINER}>
          <div className="footer-top-left gap-10 lg:flex xl:px-6">
            <nav aria-label="Footer" className="aegov-accordion aegov-mobile-accordion flex-1">
              <ul className="grid w-full sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8">
                {GROUPS.map((group, i) => {
                  const expanded = wide || open === group.title
                  const bodyId = `v1-footer-group-${i}`
                  return (
                    <li key={group.title} className="accordion-item border-b border-aeblack-100 sm:border-b-0!">
                      <h2 className="accordion-title text-base sm:mb-4">
                        {wide ? (
                          <span className="text-lg font-bold text-primary-700 lg:text-xl">{group.title}</span>
                        ) : (
                          <button
                            type="button"
                            className={`w-full justify-between! py-4 ${expanded ? 'accordion-active' : ''}`}
                            aria-expanded={expanded}
                            aria-controls={bodyId}
                            onClick={() => setOpen(expanded ? null : group.title)}
                          >
                            <span>{group.title}</span>
                            <Plus aria-hidden="true" className={`transition-transform ${expanded ? 'rotate-45' : ''}`} />
                          </button>
                        )}
                      </h2>
                      <div id={bodyId} className={`accordion-content max-sm:pb-4 ${expanded ? '' : 'hidden'}`}>
                        <ul className="accordion-content-body space-y-3">
                          {group.pages.map((key) => (
                            <li key={key}>
                              <Link to={href(key)}>{pageLabel(key)}</Link>
                            </li>
                          ))}
                          {group.title === 'Partnerships' && (
                            <li>
                              <ExternalLink href={REGISTER_URL}>Register to participate</ExternalLink>
                            </li>
                          )}
                        </ul>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="footer-contact lg:w-80">
              <ul className="divide-y divide-aeblack-100">
                <li className="flex! justify-center lg:justify-start!">
                  <Link to={href('home')} className="block">
                    <img
                      src={site.meta.logo}
                      alt={`${site.meta.siteName}: home`}
                      width={5466}
                      height={668}
                      className="h-auto w-64 brightness-0"
                    />
                  </Link>
                </li>
                <li className="inline-with-gap w-full lg:justify-start!">
                  <MapPin aria-hidden="true" />
                  <span className="text-sm text-aeblack-800">
                    {site.contact.office}, {site.contact.address}
                  </span>
                </li>
                <li className="custom-divide flex flex-wrap lg:justify-start!">
                  <a href={PHONE_HREF} className="inline-with-gap">
                    <Phone aria-hidden="true" />
                    <span>{site.contact.phone}</span>
                  </a>
                  <a href={EMAIL_HREF} className="inline-with-gap">
                    <EnvelopeSimple aria-hidden="true" />
                    <span>{site.contact.email}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom py-6 md:py-8">
        <div className={CONTAINER}>
          <div className="flex flex-wrap items-center justify-between gap-y-6">
            <p className="w-full text-xs text-aeblack-700 sm:text-sm lg:w-7/12">
              © {new Date().getFullYear()} {site.contact.office}, Prime Minister’s Office at the Ministry of Cabinet
              Affairs, United Arab Emirates. All rights reserved.
            </p>
            <div className="social-sharing w-full justify-center lg:w-5/12 lg:justify-end">
              <span className="text-sm text-aeblack-700 max-sm:hidden">Follow us on:</span>
              <ul className="flex items-center gap-6">
                {site.contact.social.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform]
                  return (
                    <li key={s.platform}>
                      <ExternalLink href={s.url} label={s.platform}>
                        {Icon ? <Icon aria-hidden="true" /> : s.platform}
                      </ExternalLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
