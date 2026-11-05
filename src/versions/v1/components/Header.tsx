import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CaretDown, EnvelopeSimple, House, List, Phone, X } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import type { PageKey } from '../../../shared/pages'
import { EMAIL_HREF, PHONE_HREF, REGISTER_URL, href, pageKeyFromPath, pageLabel } from '../lib/content'
import { useDismiss, useModalFocus } from '../lib/hooks'
import { CONTAINER } from '../lib/ui'
import { ExternalLink } from './ExternalLink'
import { SiteSearch } from './SiteSearch'

/** Six primary links plus "More" keeps the bar within the DS limit of seven items, with About last before More. */
const PRIMARY: PageKey[] = ['home', 'areas', 'countries', 'best-practices', 'activities', 'about']
const MORE: PageKey[] = ['media', 'contact']

const NAV_LABEL: Partial<Record<PageKey, string>> = { about: 'About', media: 'Media Center', contact: 'Contact Us' }
const label = (key: PageKey) => NAV_LABEL[key] ?? pageLabel(key)

const LOGO_ALT = `${site.meta.siteName}, UAE Ministry of Cabinet Affairs: home`

function Logo({ className }: { className: string }) {
  return (
    <Link to={href('home')} className="logo block no-underline">
      <img src={site.meta.logo} alt={LOGO_ALT} width={5466} height={668} className={`brightness-0 ${className}`} />
    </Link>
  )
}

export function Header() {
  const { pathname } = useLocation()
  const current = pageKeyFromPath(pathname)
  const moreActive = current !== undefined && MORE.includes(current)

  return (
    <header className="aegov-header">
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
                <Logo className="v1-logo" />
              </div>
            </div>
            <div className="header-top-right">
              <div className="flex items-center gap-4">
                <SiteSearch className="w-72 xl:w-80" />
                <ExternalLink href={REGISTER_URL} className="aegov-btn btn-sm">
                  {site.hero.cta.label}
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-navs">
        <div className={CONTAINER}>
          <div className="flex items-center">
            <nav className="main-navigation" aria-label="Main navigation">
              <div className="menu-main-menu-container">
                <ul className="menu nav-menu lg:flex lg:items-center lg:gap-1 xl:gap-2">
                  {PRIMARY.map((key) => (
                    <li
                      key={key}
                      className={`menu-item lg:inline-flex lg:items-center ${key === 'home' ? 'has-link-icon' : ''} ${current === key ? 'active-page' : ''}`}
                    >
                      <Link
                        to={href(key)}
                        aria-current={current === key ? 'page' : undefined}
                        className="hover:border-primary-800! hover:text-primary-800!"
                      >
                        {key === 'home' && <House aria-hidden="true" />}
                        <span>{label(key)}</span>
                      </Link>
                    </li>
                  ))}
                  <li
                    ref={moreRef}
                    className={`menu-item menu-item-has-children relative lg:inline-flex lg:items-center ${moreActive ? 'active-page' : ''}`}
                  >
                    <button
                      type="button"
                      className="v1-nav-toggle"
                      aria-expanded={moreOpen}
                      aria-controls="v1-more-menu"
                      onClick={() => setMoreOpen((o) => !o)}
                    >
                      More
                      <CaretDown aria-hidden="true" className={`size-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div
                      id="v1-more-menu"
                      className={`submenu rounded-bordered absolute end-0 top-full z-30 mt-1 w-64 py-3 shadow-lg ${moreOpen ? '' : 'hidden'}`}
                    >
                      <ul className="space-y-1">
                        {MORE.map((key) => (
                          <li key={key} className="menu-item">
                            <Link
                              to={href(key)}
                              aria-current={current === key ? 'page' : undefined}
                              onClick={() => setMoreOpen(false)}
                              className="w-full no-underline aria-[current=page]:font-bold aria-[current=page]:text-primary-800!"
                            >
                              {label(key)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileHeader({ current, moreActive }: NavProps) {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(moreActive)
  const menuRef = useRef<HTMLDivElement>(null)
  const close = () => setOpen(false)
  useModalFocus(menuRef, open, close)

  const navLink = (key: PageKey) => (
    <Link
      to={href(key)}
      onClick={close}
      aria-current={current === key ? 'page' : undefined}
      className="flex! w-full items-center gap-2 border-0! py-3 text-base no-underline aria-[current=page]:text-primary-800!"
    >
      {key === 'home' && <House aria-hidden="true" className="size-5" />}
      {label(key)}
    </Link>
  )

  return (
    <div className="header-mobile lg:hidden">
      <div className="header-top py-3">
        <div className={CONTAINER}>
          <div className="flex items-center justify-between gap-4">
            <div className="header-logo logos min-w-0">
              <div className="logo-item">
                <Logo className="v1-logo-mobile" />
              </div>
            </div>
            <div className="header-top-right flex items-center justify-end">
              <button
                type="button"
                className="hamburger-icon text-aeblack-700"
                aria-expanded={open}
                aria-controls="v1-mobile-menu"
                onClick={() => setOpen(true)}
              >
                <List aria-hidden="true" />
                <span className="sr-only">Open main menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        id="v1-mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        hidden={!open}
        className="responsive-menu fixed inset-0 z-50 overflow-y-auto bg-whitely-50 py-4 lg:hidden"
      >
        <div className="flex items-center justify-between gap-4 px-4 pb-4">
          <Logo className="v1-logo-mobile" />
          <button type="button" onClick={close} className="rounded-lg p-1 text-aeblack-700" data-autofocus>
            <X aria-hidden="true" className="size-7" />
            <span className="sr-only">Close main menu</span>
          </button>
        </div>
        <div className="space-y-6 px-4">
          <SiteSearch onNavigate={close} />
          <nav className="main-navigation" aria-label="Main navigation">
            <ul className="menu nav-menu divide-y divide-aeblack-100 border-y border-aeblack-100">
              {PRIMARY.map((key) => (
                <li key={key} className={`menu-item ${current === key ? 'active-page' : ''}`}>
                  {navLink(key)}
                </li>
              ))}
              <li className={`menu-item menu-item-has-children ${moreActive ? 'active-page' : ''}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between! py-3 text-base font-bold text-aeblack-800"
                  aria-expanded={moreOpen}
                  aria-controls="v1-mobile-more"
                  onClick={() => setMoreOpen((o) => !o)}
                >
                  More
                  <CaretDown aria-hidden="true" className={`size-5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <ul id="v1-mobile-more" className={`submenu bg-transparent! ps-4 pb-2 ${moreOpen ? '' : 'hidden'}`}>
                  {MORE.map((key) => (
                    <li key={key} className="menu-item">
                      {navLink(key)}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          <ExternalLink href={REGISTER_URL} className="aegov-btn btn-block">
            {site.hero.cta.label}
          </ExternalLink>
          <ul className="header-common-links space-y-3 pb-6">
            <li>
              <a href={PHONE_HREF}>
                <Phone aria-hidden="true" className="size-5 shrink-0" />
                <span>{site.contact.phone}</span>
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF}>
                <EnvelopeSimple aria-hidden="true" className="size-5 shrink-0" />
                <span>{site.contact.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
