import { EnvelopeSimpleIcon, MapPinIcon, PhoneIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { site } from '../../../data/site'
import { PAGES } from '../../../shared/pages'
import { href } from '../content'
import { SOCIAL_ICONS } from './social'

export function Footer() {
  const { contact } = site
  return (
    <footer className="aegov-footer">
      <div className="v3-wrap grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <img src={site.meta.logo} alt={site.meta.siteName} className="h-auto w-full max-w-sm" width={5466} height={668} loading="lazy" />
          <p className="mt-8 max-w-md leading-relaxed text-aeblack-100">{site.meta.description}</p>
          <p className="mt-6 font-[family-name:var(--font-alexandria)] text-lg font-semibold text-aegold-300">
            {site.about.slogan.join(' · ')}
          </p>
        </div>

        <nav aria-labelledby="v3-footer-sections" className="lg:col-span-3">
          <h2 id="v3-footer-sections" className="text-sm font-bold uppercase tracking-[0.14em] text-aegold-300">
            Sections
          </h2>
          <ul className="mt-5 space-y-3">
            {PAGES.map((page) => (
              <li key={page.key}>
                <Link to={href(page.key)}>{page.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-aegold-300">Contact the office</h2>
          <address className="mt-5 space-y-4 not-italic">
            <p className="flex gap-3">
              <MapPinIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-aegold-300" />
              <span>
                {contact.office}
                <br />
                {contact.address}
              </span>
            </p>
            <p className="flex gap-3">
              <PhoneIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-aegold-300" />
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
            </p>
            <p className="flex gap-3">
              <EnvelopeSimpleIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-aegold-300" />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          </address>
          <h2 className="mt-10 text-sm font-bold uppercase tracking-[0.14em] text-aegold-300">Follow the programme</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {contact.social.map(({ platform, url }) => {
              const SocialIcon = SOCIAL_ICONS[platform]
              return (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-11 items-center justify-center rounded-full border border-aeblack-600"
                  >
                    {SocialIcon && <SocialIcon aria-hidden="true" className="size-5" />}
                    <span className="sr-only">{platform} (opens in a new tab)</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className="border-t border-aeblack-700">
        <div className="v3-wrap flex flex-col gap-2 py-6 text-sm text-aeblack-200 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {contact.office}, Ministry of Cabinet Affairs, United Arab Emirates
          </p>
          <p>{site.meta.shortName} · {site.meta.siteName}</p>
        </div>
      </div>
    </footer>
  )
}
