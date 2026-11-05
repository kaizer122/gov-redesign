import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EnvelopeSimple, MapPin, Phone, Plus } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { Logo } from '../../../shared/brand'
import { useLang, useT } from '../../../shared/i18n'
import { pageLabel, type PageKey } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { CURRENT_YEAR, EMAIL_HREF, PHONE_HREF, REGISTER_URL, useLinks } from '../lib/content'
import { T, type DictKey } from '../lib/dict'
import { useMediaQuery } from '../lib/hooks'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER } from '../lib/ui'
import { ExternalLink } from './ExternalLink'

const GROUPS: { title: DictKey; pages: PageKey[]; register?: boolean }[] = [
  { title: 'footerProgramme', pages: ['about', 'areas', 'best-practices'] },
  { title: 'footerPartnerships', pages: ['countries', 'activities'], register: true },
  { title: 'footerMedia', pages: ['media', 'contact'] },
]

/** Deep Charcoal footer with the white logo, closed by a solid Royal Gold band along the bottom edge. */
export function Footer() {
  const lang = useLang()
  const t = useT(T)
  const { href } = useLinks()
  const site = getSite(lang)
  const wide = useMediaQuery('(min-width: 40rem)')
  const [open, setOpen] = useState<DictKey | null>(null)

  return (
    <footer className="aegov-footer v5-dark">
      <div className="footer-top py-14 md:py-20">
        <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
          <div className="space-y-8">
            <Link to={href('home')} className="inline-block p-1">
              <Logo colourway="white" className="h-20 w-auto md:h-24" />
              <span className="sr-only">{pageLabel('home', lang)}</span>
            </Link>
            <ul className="space-y-4 text-lg text-[#e7e7e7]">
              <li className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-[var(--color-primary-300)]" />
                <span>
                  {site.contact.office}
                  <br />
                  {site.contact.address}
                </span>
              </li>
              <li>
                <a href={PHONE_HREF} className="inline-flex items-center gap-3 text-[#fff] hover:text-[var(--color-primary-300)]">
                  <Phone aria-hidden="true" className="size-5 shrink-0 text-[var(--color-primary-300)]" />
                  <bdi dir="ltr">{site.contact.phone}</bdi>
                </a>
              </li>
              <li>
                <a href={EMAIL_HREF} className="inline-flex items-center gap-3 text-[#fff] hover:text-[var(--color-primary-300)]">
                  <EnvelopeSimple aria-hidden="true" className="size-5 shrink-0 text-[var(--color-primary-300)]" />
                  <bdi dir="ltr">{site.contact.email}</bdi>
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label={t('footerNav')} className="aegov-accordion aegov-mobile-accordion">
            <ul className="grid w-full sm:grid-cols-3 sm:gap-x-8 sm:gap-y-8">
              {GROUPS.map((group, i) => {
                const expanded = wide || open === group.title
                const bodyId = `v5-footer-group-${i}`
                return (
                  <li key={group.title} className="accordion-item border-b border-[#fff]/15 sm:border-b-0!">
                    <h2 className="accordion-title sm:mb-5">
                      {wide ? (
                        <span className="block border-b border-[var(--color-primary-400)]/60 pb-3 text-2xl text-[var(--color-primary-300)]">
                          {t(group.title)}
                        </span>
                      ) : (
                        <button
                          type="button"
                          className={`w-full items-center! justify-between! py-4 text-xl text-[#fff]! ${expanded ? 'accordion-active' : ''}`}
                          aria-expanded={expanded}
                          aria-controls={bodyId}
                          onClick={() => setOpen(expanded ? null : group.title)}
                        >
                          <span>{t(group.title)}</span>
                          <Plus aria-hidden="true" className={`text-[var(--color-primary-300)] transition-transform ${expanded ? 'rotate-45' : ''}`} />
                        </button>
                      )}
                    </h2>
                    <div id={bodyId} className={`accordion-content max-sm:pb-5 ${expanded ? '' : 'hidden'}`}>
                      <ul className="accordion-content-body space-y-3 text-lg">
                        {group.pages.map((key) => (
                          <li key={key}>
                            <Link to={href(key)} className="text-[#e7e7e7] hover:text-[var(--color-primary-300)]">
                              {pageLabel(key, lang)}
                            </Link>
                          </li>
                        ))}
                        {group.register && (
                          <li>
                            <ExternalLink href={REGISTER_URL} className="text-[#e7e7e7] hover:text-[var(--color-primary-300)]">
                              {UI.register[lang]}
                            </ExternalLink>
                          </li>
                        )}
                      </ul>
                    </div>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      <div className="footer-bottom border-t border-[#fff]/15 py-8">
        <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-x-10 gap-y-6`}>
          <div className="space-y-1 text-base text-[#c9c9c9] lg:max-w-[60%]">
            <p>{[UI.parentEntity[lang], UI.country[lang]].join(lang === 'ar' ? '، ' : ', ')}</p>
            <p>
              © {CURRENT_YEAR} {UI.copyright[lang]}
            </p>
            <p>{UI.contentSource[lang]}</p>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-base text-[#c9c9c9]">{UI.followUs[lang]}</span>
            <ul className="flex items-center gap-1">
              {site.contact.social.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform]
                return (
                  <li key={s.platform}>
                    <ExternalLink
                      href={s.url}
                      label={s.platform}
                      className="flex size-11 items-center justify-center text-[#e7e7e7] hover:text-[var(--color-primary-300)]"
                    >
                      {Icon ? <Icon aria-hidden="true" className="size-6" /> : s.platform}
                    </ExternalLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="h-3 bg-[var(--egeep-gold)] md:h-4" />
    </footer>
  )
}
