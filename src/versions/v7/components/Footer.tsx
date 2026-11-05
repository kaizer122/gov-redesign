import { Link } from 'react-router-dom'
import { EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { Logo } from '../../../shared/brand'
import { useLang, useT } from '../../../shared/i18n'
import { pageLabel, type PageKey } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { COPY } from '../lib/copy'
import { CURRENT_YEAR, EMAIL_HREF, PHONE_HREF, REGISTER_URL } from '../lib/content'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER } from '../lib/ui'
import { ExternalLink } from './ExternalLink'

const GROUPS: { title: 'footerProgramme' | 'footerPartnerships' | 'footerMedia'; pages: PageKey[] }[] = [
  { title: 'footerProgramme', pages: ['about', 'areas', 'best-practices'] },
  { title: 'footerPartnerships', pages: ['countries', 'activities'] },
  { title: 'footerMedia', pages: ['media', 'contact'] },
]

export function Footer() {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const { contact } = getSite(lang)

  return (
    <footer className="aegov-footer v7-footer">
      <div className="footer-top py-14 md:py-20">
        <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
          <div className="space-y-6">
            <Link to={href('home')} className="inline-block">
              <Logo colourway="white" className="h-20 w-auto md:h-24" />
            </Link>
            <p className="max-w-md text-lg text-[var(--v7-on-dark-muted)]">
              {UI.officeName[lang]}
              <br />
              {UI.parentEntity[lang]}
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {GROUPS.map((group) => (
              <nav key={group.title} aria-labelledby={`v7-footer-${group.title}`}>
                <h2 id={`v7-footer-${group.title}`} className="v7-eyebrow v7-eyebrow-dark mb-4">
                  {t(group.title)}
                </h2>
                <ul className="space-y-2 text-lg">
                  {group.pages.map((key) => (
                    <li key={key}>
                      <Link to={href(key)} className="v7-on-dark-link">
                        {pageLabel(key, lang)}
                      </Link>
                    </li>
                  ))}
                  {group.title === 'footerPartnerships' && (
                    <li>
                      <ExternalLink href={REGISTER_URL} className="v7-on-dark-link">
                        {UI.register[lang]}
                      </ExternalLink>
                    </li>
                  )}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className={`${CONTAINER} mt-14`}>
          <ul className="grid gap-4 border-t border-[var(--v7-hairline-dark)] pt-8 text-lg md:grid-cols-3">
            <li className="flex items-start gap-3 text-[var(--v7-on-dark-muted)]">
              <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary-300" />
              <span>
                {contact.office}
                {lang === 'ar' ? '، ' : ', '}
                {contact.address}
              </span>
            </li>
            <li>
              <a href={PHONE_HREF} className="v7-on-dark-link inline-flex items-center gap-3">
                <Phone aria-hidden="true" className="size-5 shrink-0 text-primary-300" />
                <bdi dir="ltr">{contact.phone}</bdi>
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF} className="v7-on-dark-link inline-flex items-center gap-3">
                <EnvelopeSimple aria-hidden="true" className="size-5 shrink-0 text-primary-300" />
                <bdi dir="ltr">{contact.email}</bdi>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom border-t border-[var(--v7-hairline-dark)] py-8">
        <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-6`}>
          <div className="space-y-1 text-base text-[var(--v7-on-dark-muted)]">
            <p>
              © <bdi>{CURRENT_YEAR}</bdi> {UI.copyright[lang]}
            </p>
            <p>{UI.contentSource[lang]}</p>
          </div>
          <div className="social-sharing flex items-center gap-4">
            <span className="text-base text-[var(--v7-on-dark-muted)]">{UI.followUs[lang]}</span>
            <ul className="flex items-center gap-2">
              {contact.social.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform]
                return (
                  <li key={s.platform}>
                    <ExternalLink href={s.url} label={s.platform} className="v7-icon-btn v7-on-dark-link">
                      {Icon ? <Icon aria-hidden="true" className="size-6" /> : s.platform}
                    </ExternalLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
