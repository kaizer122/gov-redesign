import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  XLogoIcon,
  YoutubeLogoIcon,
  type Icon,
} from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { href } from '../lib/content'

const SOCIAL_ICONS: Record<string, Icon> = {
  X: XLogoIcon,
  Facebook: FacebookLogoIcon,
  LinkedIn: LinkedinLogoIcon,
  Instagram: InstagramLogoIcon,
  YouTube: YoutubeLogoIcon,
}

interface FooterColumn {
  id: string
  title: string
  links: ReactNode[]
}

const COLUMNS: FooterColumn[] = [
  {
    id: 'programme',
    title: 'The programme',
    links: [
      <Link to={href('about')}>About the programme</Link>,
      <Link to={href('areas')}>Areas of cooperation</Link>,
      <Link to={href('best-practices')}>Best practices</Link>,
    ],
  },
  {
    id: 'partnerships',
    title: 'Partnerships',
    links: [
      <Link to={href('countries')}>Participating countries</Link>,
      <Link to={href('activities')}>Partnership tracker</Link>,
      <a href={site.hero.cta.url} target="_blank" rel="noopener noreferrer">
        Register to participate<span className="sr-only"> (opens in a new tab)</span>
      </a>,
    ],
  },
  {
    id: 'help',
    title: 'Help and media',
    links: [
      <Link to={href('media')}>Media centre</Link>,
      <Link to={href('contact')}>Contact us</Link>,
      <Link to={href('contact', { subject: 'Become a Trainer in GEEP' })}>Become a trainer</Link>,
    ],
  },
]

export function Footer() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <footer className="aegov-footer">
      <div className="footer-top py-8 md:py-12">
        <div className="container">
          <div className="mb-8 border-b border-whitely-50/15 pb-8">
            <img src={site.meta.logo} alt="" width={5466} height={668} className="h-9 w-auto max-w-full md:h-12" />
            <p className="mt-4 max-w-2xl text-sm text-aegreen-100">{site.meta.description}</p>
          </div>
          <div className="footer-top-left gap-6 sm:flex xl:px-0">
            <nav aria-label="Footer navigation" className="aegov-accordion aegov-mobile-accordion [&_.accordion-active_svg]:rotate-45 flex-1">
              <ul className="grid w-full sm:grid-cols-3 sm:gap-x-4 sm:gap-y-8">
                {COLUMNS.map((column) => {
                  const expanded = open === column.id
                  return (
                    <li key={column.id} className="accordion-item border-b border-whitely-50/15 sm:border-none">
                      <h2 className="accordion-title text-base leading-normal sm:mb-4">
                        <button
                          type="button"
                          className={`flex min-h-12 w-full flex-nowrap items-center justify-between py-3 sm:hidden! ${expanded ? 'accordion-active' : ''}`}
                          aria-expanded={expanded}
                          aria-controls={`v4-footer-${column.id}`}
                          onClick={() => setOpen(expanded ? null : column.id)}
                        >
                          <span>{column.title}</span>
                          <PlusIcon aria-hidden="true" className="transition-transform" />
                        </button>
                        <span className="hidden text-lg font-bold text-whitely-50 sm:block">{column.title}</span>
                      </h2>
                      <div id={`v4-footer-${column.id}`} className={`accordion-content pb-4 sm:block sm:pb-0 ${expanded ? '' : 'max-sm:hidden'}`}>
                        <ul className="accordion-content-body">
                          {column.links.map((link, index) => (
                            <li key={`${column.id}-${index}`}>{link}</li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="footer-contact pt-8 sm:pt-0 lg:w-80">
              <ul className="space-y-1 text-start">
                <li className="inline-with-gap justify-start!">
                  <PhoneIcon aria-hidden="true" />
                  <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`}>{site.contact.phone}</a>
                </li>
                <li className="inline-with-gap justify-start!">
                  <EnvelopeSimpleIcon aria-hidden="true" />
                  <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                </li>
                <li className="inline-with-gap items-start! justify-start! text-sm text-aegreen-100">
                  <MapPinIcon aria-hidden="true" className="mt-0.5" />
                  <span>
                    {site.contact.office}
                    <br />
                    {site.contact.address}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom py-6">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-y-6">
            <p className="w-full text-xs text-aegreen-100 sm:text-sm lg:w-7/12">
              © {site.contact.office}, Ministry of Cabinet Affairs, United Arab Emirates. All rights reserved.
            </p>
            <div className="social-sharing w-full justify-center lg:w-5/12 lg:justify-end">
              <span className="text-sm text-aegreen-100 max-sm:hidden">Follow us on:</span>
              <ul className="flex items-center gap-5">
                {site.contact.social.map((social) => {
                  const SocialIcon = SOCIAL_ICONS[social.platform]
                  return (
                    <li key={social.platform}>
                      <a href={social.url} target="_blank" rel="noopener noreferrer" className="inline-flex size-11 items-center justify-center">
                        {SocialIcon && <SocialIcon aria-hidden="true" />}
                        <span className="sr-only">{social.platform} (opens in a new tab)</span>
                      </a>
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
