import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EnvelopeSimple, MapPin, Phone, Plus } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { Logo } from '../../../shared/brand'
import { useLang, useT } from '../../../shared/i18n'
import { pageLabel, type PageKey } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { CURRENT_YEAR, EMAIL_HREF, PHONE_HREF, PLATFORM_LABEL, REGISTER_URL, useSite } from '../lib/content'
import { useMediaQuery } from '../lib/hooks'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER } from '../lib/ui'
import { ExternalLink } from './ExternalLink'

const T = {
  programme: { en: 'The programme', ar: 'البرنامج' },
  partnerships: { en: 'Partnerships', ar: 'الشراكات' },
  mediaContact: { en: 'Media and contact', ar: 'الإعلام والتواصل' },
  footer: { en: 'Footer', ar: 'تذييل الصفحة' },
}

const GROUPS: { key: keyof typeof T; pages: PageKey[] }[] = [
  { key: 'programme', pages: ['about', 'areas', 'best-practices'] },
  { key: 'partnerships', pages: ['countries', 'activities'] },
  { key: 'mediaContact', pages: ['media', 'contact'] },
]

export function Footer() {
  const lang = useLang()
  const t = useT(T)
  const href = usePageHref()
  const data = useSite()
  const wide = useMediaQuery('(min-width: 40rem)')
  const [open, setOpen] = useState<string | null>(null)

  return (
    <footer className="aegov-footer v6-footer">
      <div className="footer-top py-12 md:py-16">
        <div className={CONTAINER}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="space-y-6">
              <Link to={href('home')} className="inline-block p-1 no-underline" aria-label={UI.logoAlt[lang]}>
                <Logo lockup="bilingual" colourway="white" className="h-auto w-56 md:w-64" />
              </Link>
              <p className="max-w-md text-[color:var(--v6-on-dark-muted)]">{UI.officeName[lang]}. {UI.parentEntity[lang]}.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary-300" />
                  <span>
                    {data.contact.office}, {data.contact.address}
                  </span>
                </li>
                <li>
                  <a href={PHONE_HREF} className="inline-flex items-center gap-3">
                    <Phone aria-hidden="true" className="size-5 shrink-0 text-primary-300" />
                    <span dir="ltr">{site.contact.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={EMAIL_HREF} className="inline-flex items-center gap-3">
                    <EnvelopeSimple aria-hidden="true" className="size-5 shrink-0 text-primary-300" />
                    <span dir="ltr">{site.contact.email}</span>
                  </a>
                </li>
              </ul>
            </div>
            <nav aria-label={t('footer')} className="aegov-accordion aegov-mobile-accordion">
              <ul className="grid w-full sm:grid-cols-3 sm:gap-8">
                {GROUPS.map((group, i) => {
                  const expanded = wide || open === group.key
                  const bodyId = `v6-footer-group-${i}`
                  return (
                    <li key={group.key} className="accordion-item border-b border-whitely-50/15 sm:border-b-0!">
                      <h2 className="accordion-title text-xl sm:mb-5">
                        {wide ? (
                          <span className="v6-footer-heading">{t(group.key)}</span>
                        ) : (
                          <button
                            type="button"
                            className="flex w-full items-center justify-between py-4 text-[color:var(--egeep-ivory)]"
                            aria-expanded={expanded}
                            aria-controls={bodyId}
                            onClick={() => setOpen(expanded ? null : group.key)}
                          >
                            <span>{t(group.key)}</span>
                            <Plus aria-hidden="true" className={`size-5 transition-transform ${expanded ? 'rotate-45' : ''}`} />
                          </button>
                        )}
                      </h2>
                      <div id={bodyId} className={`accordion-content max-sm:pb-5 ${expanded ? '' : 'hidden'}`}>
                        <ul className="space-y-3">
                          {group.pages.map((key) => (
                            <li key={key}>
                              <Link to={href(key)}>{pageLabel(key, lang)}</Link>
                            </li>
                          ))}
                          {group.key === 'partnerships' && (
                            <li>
                              <ExternalLink href={REGISTER_URL}>{UI.register[lang]}</ExternalLink>
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
      </div>
      <div className="footer-bottom border-t border-whitely-50/15 py-6">
        <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-6`}>
          <div className="space-y-1 text-base text-[color:var(--v6-on-dark-muted)]">
            <p>
              © {CURRENT_YEAR} {UI.copyright[lang]}
            </p>
            <p>{UI.contentSource[lang]}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-base text-[color:var(--v6-on-dark-muted)] max-sm:sr-only">{UI.followUs[lang]}</span>
            <ul className="flex items-center gap-2">
              {site.contact.social.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform]
                return (
                  <li key={s.platform}>
                    <ExternalLink href={s.url} label={PLATFORM_LABEL[s.platform]?.[lang] ?? s.platform} className="v6-social">
                      {Icon && <Icon aria-hidden="true" className="size-5" />}
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
