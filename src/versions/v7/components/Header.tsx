import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, CaretDown, EnvelopeSimple, List, Phone, X } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { useCurrentPage, useLangSwitchHref, usePageHref } from '../../../shared/BilingualVersion'
import { Logo } from '../../../shared/brand'
import { otherLang, useLang } from '../../../shared/i18n'
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

function LangSwitch({ className = '' }: { className?: string }) {
  const lang = useLang()
  const to = useLangSwitchHref()
  const target = otherLang(lang)
  return (
    <Link to={to} lang={target} hrefLang={target} className={`v7-lang ${className}`} aria-label={UI.switchLanguageLabel[lang]}>
      {UI.switchLanguage[lang]}
    </Link>
  )
}

function HomeLogo({ lockup, className }: { lockup: 'bilingual' | 'english' | 'arabic'; className: string }) {
  const href = usePageHref()
  return (
    <Link to={href('home')} className="logo block shrink-0 no-underline">
      <Logo lockup={lockup} colourway="white" className={className} />
    </Link>
  )
}

export function Header() {
  const current = useCurrentPage()
  const moreActive = current !== undefined && MORE.includes(current)
  return (
    <header className="aegov-header v7-header">
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
      <div className="header-top py-5">
        <div className={CONTAINER}>
          <div className="flex items-center justify-between gap-8">
            <div className="header-logo logos">
              <div className="logo-item">
                <HomeLogo lockup="bilingual" className="v7-logo" />
              </div>
            </div>
            <div className="header-top-right">
              <div className="flex items-center gap-5">
                <SiteSearch className="w-72 xl:w-80" />
                <LangSwitch />
                <ExternalLink href={REGISTER_URL} className="aegov-btn btn-sm v7-btn-ivory">
                  {getSite(lang).hero.cta.label}
                  <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-navs">
        <div className={CONTAINER}>
          <nav className="main-navigation" aria-label={UI.mainNavigation[lang]}>
            <ul className="menu nav-menu flex items-center gap-1 xl:gap-3">
              {PRIMARY.map((key) => (
                <li key={key} className={`menu-item inline-flex items-center ${current === key ? 'active-page' : ''}`}>
                  <Link to={href(key)} aria-current={current === key ? 'page' : undefined}>
                    {pageLabel(key, lang)}
                  </Link>
                </li>
              ))}
              <li
                ref={moreRef}
                className={`menu-item menu-item-has-children relative inline-flex items-center ${moreActive ? 'active-page' : ''}`}
              >
                <button
                  type="button"
                  className="v7-nav-toggle"
                  aria-expanded={moreOpen}
                  aria-controls="v7-more-menu"
                  onClick={() => setMoreOpen((o) => !o)}
                >
                  {UI.more[lang]}
                  <CaretDown aria-hidden="true" className={`size-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <div id="v7-more-menu" className={`submenu v7-submenu absolute start-0 top-full z-30 w-64 py-2 ${moreOpen ? '' : 'hidden'}`}>
                  <ul>
                    {MORE.map((key) => (
                      <li key={key} className="menu-item">
                        <Link to={href(key)} aria-current={current === key ? 'page' : undefined} onClick={() => setMoreOpen(false)}>
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
    <Link to={href(key)} onClick={close} aria-current={current === key ? 'page' : undefined} className="v7-mobile-link">
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
                <HomeLogo lockup={lockup} className="v7-logo-mobile" />
              </div>
            </div>
            <div className="header-top-right">
              <div className="flex items-center gap-1">
                <LangSwitch />
                <button
                  type="button"
                  className="hamburger-icon v7-icon-btn"
                  aria-expanded={open}
                  aria-controls="v7-mobile-menu"
                  onClick={() => setOpen(true)}
                >
                  <List aria-hidden="true" />
                  <span className="sr-only">{UI.openMenu[lang]}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="v7-mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={UI.menu[lang]}
        hidden={!open}
        className="responsive-menu v7-mobile-menu fixed inset-0 z-50 overflow-y-auto lg:hidden"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <HomeLogo lockup={lockup} className="v7-logo-mobile" />
          <button type="button" onClick={close} className="v7-icon-btn" data-autofocus>
            <X aria-hidden="true" className="size-7" />
            <span className="sr-only">{UI.closeMenu[lang]}</span>
          </button>
        </div>
        <div className="space-y-8 px-5 pt-4 pb-10">
          <SiteSearch onNavigate={close} />
          <nav aria-label={UI.mainNavigation[lang]}>
            <ul className="v7-mobile-nav">
              {PRIMARY.map((key) => (
                <li key={key}>{navLink(key)}</li>
              ))}
              <li>
                <button
                  type="button"
                  className="v7-mobile-link w-full justify-between"
                  aria-expanded={moreOpen}
                  aria-controls="v7-mobile-more"
                  onClick={() => setMoreOpen((o) => !o)}
                >
                  {UI.more[lang]}
                  <CaretDown aria-hidden="true" className={`size-5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <ul id="v7-mobile-more" className={`ps-5 ${moreOpen ? '' : 'hidden'}`}>
                  {MORE.map((key) => (
                    <li key={key}>{navLink(key)}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          <ExternalLink href={REGISTER_URL} className="aegov-btn btn-block v7-btn-ivory">
            {getSite(lang).hero.cta.label}
          </ExternalLink>
          <ul className="space-y-3 text-lg">
            <li>
              <a href={PHONE_HREF} className="v7-on-dark-link inline-flex items-center gap-3">
                <Phone aria-hidden="true" className="size-5 shrink-0" />
                <bdi dir="ltr">{getSite(lang).contact.phone}</bdi>
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF} className="v7-on-dark-link inline-flex items-center gap-3">
                <EnvelopeSimple aria-hidden="true" className="size-5 shrink-0" />
                <bdi dir="ltr">{getSite(lang).contact.email}</bdi>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
