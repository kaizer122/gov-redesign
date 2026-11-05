import { Link } from 'react-router-dom'
import { EnvelopeSimpleIcon, MapPinIcon, PhoneIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { PAGES, pageHref } from '../../../shared/pages'
import { SocialLinks } from './SocialLinks'

export function Footer() {
  const { contact, about, meta } = site
  return (
    <footer className="aegov-footer v2-footer v2-dark">
      <div className="footer-top py-12 md:py-16">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img src={meta.logo} alt={`${contact.office}, UAE Ministry of Cabinet Affairs`} width={5466} height={668} className="h-9 w-auto" />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-techblue-100">{meta.description}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold uppercase tracking-[0.18em] text-aegold-200">
              {about.slogan.map((word, i) => (
                <span key={word} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true" className="size-1.5 rounded-full bg-aegold-300" />}
                  {word}
                </span>
              ))}
            </p>
          </div>

          <nav aria-labelledby="v2-footer-explore" className="lg:col-span-3">
            <h2 id="v2-footer-explore" className="text-base font-bold text-whitely-50">
              Explore the programme
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm lg:grid-cols-1">
              {PAGES.map((page) => (
                <li key={page.key}>
                  <Link to={pageHref('v2', page.key)} className="inline-block py-1 hover:underline">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="text-base font-bold text-whitely-50">{contact.office}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPinIcon size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-aegold-300" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-aegold-300" />
                <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>{contact.phone}</a>
              </li>
              <li className="flex items-start gap-3">
                <EnvelopeSimpleIcon size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-aegold-300" />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            </ul>
            <h2 className="mt-8 text-base font-bold text-whitely-50">Follow the programme</h2>
            <SocialLinks className="mt-3 -ms-3" linkClassName="hover:bg-techblue-900" />
          </div>
        </div>
      </div>
      <div className="footer-bottom py-6">
        <div className="container flex flex-col gap-2 text-xs text-techblue-200 md:flex-row md:justify-between">
          <p>© {contact.office}, Ministry of Cabinet Affairs, United Arab Emirates</p>
          <p>{about.launched.replace('The Programme was launched', 'Launched')}</p>
        </div>
      </div>
    </footer>
  )
}
