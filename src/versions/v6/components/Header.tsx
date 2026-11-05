import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretDown, EnvelopeSimple, Globe, List, Phone, X } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { useCurrentPage, useLangSwitchHref, usePageHref } from '../../../shared/BilingualVersion'
import { Logo } from '../../../shared/brand'
import { otherLang, useLang, useT } from '../../../shared/i18n'
import { pageLabel, type PageKey } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { EMAIL_HREF, PHONE_HREF, REGISTER_URL } from '../lib/content'
import { useDismiss, useModalFocus } from '../lib/hooks'
import { CONTAINER } from '../lib/ui'
import { ExternalLink } from './ExternalLink'
import { SiteSearch } from './SiteSearch'

/** Six primary links plus "More" keeps the bar within the DS limit of seven items. */
const PRIMARY: PageKey[] = ['home', 'areas', 'countries', 'best-practices', 'activities', 'about']
const MORE: PageKey[] = ['media', 'contact']

const T = {
  home: { en: 'home', ar: 'الصفحة الرئيسية' },
}

function HomeLogo({ lockup, className }: { lockup: 'bilingual' | 'english' | 'arabic'; className: string }) {
  const href = usePageHref()
  const lang = useLang()
  const t = useT(T)
  return (
    <Link to={href('home')} className="v6-logo-link block no-underline" aria-label={`${UI.logoAlt[lang]}: ${t('home')}`}>
      <Logo lockup={lockup} colourway="full-colour" className={className} />
    </Link>
  )
}

function LangSwitch({ className = '' }: { className?: string }) {
  const lang = useLang()
  const target = otherLang(lang)
  return (
    <Link
      to={useLangSwitchHref()}
      lang={target}
      hrefLang={target}
      aria-label={UI.switchLanguageLabel[lang]}
      className={`v6-lang-switch ${className}`}
    >
      <Globe aria-hidden="true" className="size-5" />
      <span lang={target}>{UI.switchLanguage[lang]}</span>
    </Link>
  )
}

export function Header() {
  const current = useCurrentPage()
  const moreActive = current !== undefined && MORE.includes(current)
  return (
    <header className="aegov-header v6-header">
      <DesktopHeader current={current} moreActive={moreActive} />
      <MobileHeader current={current} moreActive={moreActive} />
    </header>
  )
}

interface NavProps {
  current: PageKey | undefined
  moreActive: boolean
}

function DesktopHeader({ current, moreActive }: NavProps) {
  const lang = useLang()
  const href = usePageHref()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLLIElement>(null)
  useDismiss(moreRef, moreOpen, () => setMoreOpen(false))

  return (
    <div className="header-desktop hidden lg:block">
      <div className="header-top py-4">
        <div className={CONTAINER}>
          <div className="flex items-center justify-between gap-8">
            <div className="header-logo logos">
              <div className="logo-item">
                <HomeLogo lockup="bilingual" className="v6-logo" />
              </div>
            </div>
            <div className="flex items-center gap-5">
              <SiteSearch className="w-64 xl:w-80" />
              <LangSwitch />
              <ExternalLink href={REGISTER_URL} className="aegov-btn btn-sm">
                {UI.participateNow[lang]}
              </ExternalLink>
            </div>
          </div>
        </div>
      </div>
      <div className="header-navs v6-navs">
        <div className={CONTAINER}>
          <nav className="main-navigation" aria-label={UI.mainNavigation[lang]}>
            <ul className="menu nav-menu flex items-center gap-1 xl:gap-3">
              {PRIMARY.map((key) => (
                <li key={key} className={`menu-item ${current === key ? 'active-page' : ''}`}>
                  <Link to={href(key)} aria-current={current === key ? 'page' : undefined} className="v6-nav-link">
                    {pageLabel(key, lang)}
                  </Link>
                </li>
              ))}
              <li
                ref={moreRef}
                className={`menu-item menu-item-has-children relative ${moreActive ? 'active-page' : ''}`}
              >
                <button
                  type="button"
                  className="v6-nav-link"
                  aria-expanded={moreOpen}
                  aria-controls="v6-more-menu"
                  onClick={() => setMoreOpen((o) => !o)}
                >
                  {UI.more[lang]}
                  <CaretDown aria-hidden="true" className={`size-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  id="v6-more-menu"
                  className={`submenu absolute end-0 top-full z-30 mt-px w-64 border-t-2 border-primary-600 bg-whitely-50 py-2 shadow-lg ${moreOpen ? '' : 'hidden'}`}
                >
                  <ul>
                    {MORE.map((key) => (
                      <li key={key}>
                        <Link
                          to={href(key)}
                          aria-current={current === key ? 'page' : undefined}
                          onClick={() => setMoreOpen(false)}
                          className="block px-5 py-3 text-[color:var(--egeep-charcoal)] no-underline hover:bg-[color:var(--egeep-ivory)] aria-[current=page]:text-primary-800"
                        >
                          {pageLabel(key, lang)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

function MobileHeader({ current, moreActive }: NavProps) {
  const lang = useLang()
  const href = usePageHref()
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(moreActive)
  const menuRef = useRef<HTMLDivElement>(null)
  const close = () => setOpen(false)
  useModalFocus(menuRef, open, close)
  const lockup = lang === 'ar' ? 'arabic' : 'english'

  const navLink = (key: PageKey) => (
    <Link
      to={href(key)}
      onClick={close}
      aria-current={current === key ? 'page' : undefined}
      className="flex w-full items-center py-3 text-xl text-[color:var(--egeep-charcoal)] no-underline aria-[current=page]:text-primary-800"
    >
      {pageLabel(key, lang)}
    </Link>
  )

  return (
    <div className="header-mobile lg:hidden">
      <div className="header-top py-3">
        <div className={CONTAINER}>
          <div className="flex items-center justify-between gap-3">
            <div className="header-logo logos min-w-0">
              <div className="logo-item">
                <HomeLogo lockup={lockup} className="v6-logo-mobile" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <LangSwitch className="max-sm:[&>svg]:hidden" />
              <button
                type="button"
                className="v6-icon-btn"
                aria-expanded={open}
                aria-controls="v6-mobile-menu"
                onClick={() => setOpen(true)}
              >
                <List aria-hidden="true" className="size-7" />
                <span className="sr-only">{UI.openMenu[lang]}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        id="v6-mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={UI.menu[lang]}
        hidden={!open}
        className="fixed inset-0 z-50 overflow-y-auto bg-whitely-50 py-3 lg:hidden"
      >
        <div className="flex items-center justify-between gap-4 px-5 pb-4">
          <HomeLogo lockup={lockup} className="v6-logo-mobile" />
          <button type="button" onClick={close} className="v6-icon-btn" data-autofocus>
            <X aria-hidden="true" className="size-7" />
            <span className="sr-only">{UI.closeMenu[lang]}</span>
          </button>
        </div>
        <div className="space-y-6 px-5">
          <SiteSearch onNavigate={close} />
          <nav aria-label={UI.mainNavigation[lang]}>
            <ul className="divide-y divide-[color:var(--egeep-grey-light)] border-y border-[color:var(--egeep-grey-light)]">
              {PRIMARY.map((key) => (
                <li key={key}>{navLink(key)}</li>
              ))}
              <li>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-3 text-xl text-[color:var(--egeep-charcoal)]"
                  aria-expanded={moreOpen}
                  aria-controls="v6-mobile-more"
                  onClick={() => setMoreOpen((o) => !o)}
                >
                  {UI.more[lang]}
                  <CaretDown aria-hidden="true" className={`size-5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <ul id="v6-mobile-more" className={`ps-5 pb-2 ${moreOpen ? '' : 'hidden'}`}>
                  {MORE.map((key) => (
                    <li key={key}>{navLink(key)}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          <ExternalLink href={REGISTER_URL} className="aegov-btn btn-block">
            {UI.participateNow[lang]}
          </ExternalLink>
          <ul className="space-y-3 pb-6">
            <li>
              <a href={PHONE_HREF} className="inline-flex items-center gap-3 text-[color:var(--egeep-charcoal)] no-underline">
                <Phone aria-hidden="true" className="size-5 shrink-0 text-primary-700" />
                <span dir="ltr">{site.contact.phone}</span>
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF} className="inline-flex items-center gap-3 text-[color:var(--egeep-charcoal)] no-underline">
                <EnvelopeSimple aria-hidden="true" className="size-5 shrink-0 text-primary-700" />
                <span dir="ltr">{site.contact.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
