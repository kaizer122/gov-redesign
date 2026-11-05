import { Link } from 'react-router-dom'
import { EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react'
import { Logo } from '../../../shared/brand'
import { useLang, useT } from '../../../shared/i18n'
import { pageLabel, type PageKey } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { CURRENT_YEAR, EMAIL_HREF, PHONE_HREF, REGISTER_URL, useSite } from '../lib/content'
import { useLinks } from '../lib/hooks'
import { SOCIAL_ICONS } from '../lib/icons'
import { T } from '../lib/t'
import { CONTAINER } from '../lib/ui'
import { ExternalLink } from './ExternalLink'

const GROUPS: { title: keyof typeof T; pages: PageKey[] }[] = [
  { title: 'footerProgramme', pages: ['about', 'areas', 'best-practices'] },
  { title: 'footerPartnerships', pages: ['countries', 'activities'] },
  { title: 'footerMedia', pages: ['media', 'contact'] },
]

export function Footer() {
  const lang = useLang()
  const t = useT(T)
  const site = useSite()
  const { href } = useLinks()

  return (
    <footer className="aegov-footer v8-dark">
      <div className={`${CONTAINER} grid gap-12 py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 md:py-16`}>
        <div className="space-y-6">
          <Link to={href('home')} className="inline-block p-3" aria-label={t('homeLink')}>
            <Logo lockup="bilingual" colourway="white" className="h-16 w-auto md:h-20" />
          </Link>
          <p className="max-w-md text-[#d9d6cd]">{site.meta.description}</p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary-300" />
              <span>
                {site.contact.office}, {site.contact.address}
              </span>
            </li>
            <li>
              <a href={PHONE_HREF} className="inline-flex items-center gap-3 no-underline">
                <Phone aria-hidden="true" className="size-5 shrink-0 text-primary-300" />
                <bdi dir="ltr">{site.contact.phone}</bdi>
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF} className="inline-flex items-center gap-3 no-underline">
                <EnvelopeSimple aria-hidden="true" className="size-5 shrink-0 text-primary-300" />
                <bdi dir="ltr">{site.contact.email}</bdi>
              </a>
            </li>
          </ul>
        </div>
        <nav aria-label={t('footerNav')}>
          <ul className="grid gap-10 sm:grid-cols-3">
            {GROUPS.map((group) => (
              <li key={group.title}>
                <h2 className="mb-4 border-b border-[#fff]/15 pb-3 text-xl text-primary-300">{t(group.title)}</h2>
                <ul className="space-y-3">
                  {group.pages.map((key) => (
                    <li key={key}>
                      <Link to={href(key)} className="no-underline hover:underline">
                        {pageLabel(key, lang)}
                      </Link>
                    </li>
                  ))}
                  {group.title === 'footerPartnerships' && (
                    <li>
                      <ExternalLink href={REGISTER_URL} className="no-underline hover:underline">
                        {UI.register[lang]}
                      </ExternalLink>
                    </li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-[#fff]/15">
        <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-6 py-6`}>
          <div className="space-y-1 text-sm text-[#d9d6cd]">
            <p>
              © {CURRENT_YEAR} {UI.copyright[lang]}
            </p>
            <p>{UI.contentSource[lang]}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#d9d6cd]">{UI.followUs[lang]}</span>
            <ul className="flex items-center gap-1">
              {site.contact.social.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform]
                return (
                  <li key={s.platform}>
                    <ExternalLink
                      href={s.url}
                      label={s.platform}
                      className="flex size-11 items-center justify-center rounded-md hover:bg-[#fff]/10"
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
    </footer>
  )
}
