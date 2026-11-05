import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretDown, EnvelopeSimple, House, List, Phone, Translate, X } from '@phosphor-icons/react'
import { getSite, site } from '../../../data/site'
import { useCurrentPage, useLangSwitchHref } from '../../../shared/BilingualVersion'
import { Logo } from '../../../shared/brand'
import { otherLang, useLang } from '../../../shared/i18n'
import { pageLabel, type PageKey } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { EMAIL_HREF, PHONE_HREF, REGISTER_URL, useLinks } from '../lib/content'
import { useDismiss, useModalFocus } from '../lib/hooks'
import { CONTAINER } from '../lib/ui'
import { ExternalLink } from './ExternalLink'
import { SiteSearch } from './SiteSearch'

/** Six primary links plus "More" keeps the bar within the DS limit of seven items. */
const PRIMARY: PageKey[] = ['home', 'about', 'areas', 'countries', 'best-practices', 'activities']
const MORE: PageKey[] = ['media', 'contact']

function HomeLogo({ className }: { className: string }) {
  const lang = useLang()
  const { href } = useLinks()
  return (
    <Link to={href('home')} className="logo block no-underline">
      <Logo className={className} />
      <span className="sr-only">{pageLabel('home', lang)}</span>
    </Link>
  )
}

/** Link to the same page in the other language. */
function LangSwitch({ className = '' }: { className?: string }) {
  const lang = useLang()
  const to = useLangSwitchHref()
  const target = otherLang(lang)
  return (
    <Link
      to={to}
      lang={target}
      hrefLang={target}
      className={`inline-flex min-h-11 items-center gap-2 px-2 text-lg text-[var(--egeep-charcoal)] no-underline hover:text-[var(--color-primary-800)] ${className}`}
    >
      <Translate aria-hidden="true" className="size-5 text-[var(--egeep-gold)]" />
      {UI.switchLanguage[lang]}
    </Link>
  )
}

export function Header() {
  const current = useCurrentPage()
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
  const lang = useLang()
  const { href } = useLinks()
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
                <HomeLogo className="v5-logo" />
              </div>
            </div>
            <div className="header-top-right">
              <div className="flex items-center gap-5">
                <SiteSearch className="w-72 xl:w-80" />
                <LangSwitch />
                <ExternalLink href={REGISTER_URL} className="aegov-btn btn-sm">
                  {getSite(lang).hero.cta.label}
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-navs">
        <div className={CONTAINER}>
          <nav className="main-navigation" aria-label={UI.mainNavigation[lang]}>
            <div className="menu-main-menu-container">
              <ul className="menu nav-menu lg:flex lg:items-center lg:gap-1 xl:gap-3">
                {PRIMARY.map((key) => (
                  <li
                    key={key}
                    className={`menu-item lg:inline-flex lg:items-center ${key === 'home' ? 'has-link-icon' : ''} ${current === key ? 'active-page' : ''}`}
                  >
                    <Link to={href(key)} aria-current={current === key ? 'page' : undefined}>
                      {key === 'home' && <House aria-hidden="true" />}
                      <span>{pageLabel(key, lang)}</span>
                    </Link>
                  </li>
                ))}
                <li
                  ref={moreRef}
                  className={`menu-item menu-item-has-children relative lg:inline-flex lg:items-center ${moreActive ? 'active-page' : ''}`}
                >
                  <button
                    type="button"
                    className="v5-nav-toggle"
                    aria-expanded={moreOpen}
                    aria-controls="v5-more-menu"
                    onClick={() => setMoreOpen((o) => !o)}
                  >
                    {UI.more[lang]}
                    <CaretDown aria-hidden="true" className={`size-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    id="v5-more-menu"
                    className={`submenu absolute end-0 top-full z-30 mt-px w-64 border border-[var(--egeep-grey-light)] border-t-[var(--egeep-gold)] bg-[#fff] py-3 shadow-lg ${moreOpen ? '' : 'hidden'}`}
                  >
                    <ul className="space-y-1">
                      {MORE.map((key) => (
                        <li key={key} className="menu-item">
                          <Link
                            to={href(key)}
                            aria-current={current === key ? 'page' : undefined}
                            onClick={() => setMoreOpen(false)}
                            className="w-full text-lg no-underline aria-[current=page]:text-[var(--color-primary-800)]!"
                          >
                            {pageLabel(key, lang)}
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
  )
}

function MobileHeader({ current, moreActive }: NavProps) {
  const lang = useLang()
  const { href } = useLinks()
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
      className="flex! w-full items-center gap-2 border-0! py-3 text-xl no-underline aria-[current=page]:text-[var(--color-primary-800)]!"
    >
      {key === 'home' && <House aria-hidden="true" className="size-5" />}
      {pageLabel(key, lang)}
    </Link>
  )

  return (
    <div className="header-mobile lg:hidden">
      <div className="header-top border-b border-[var(--egeep-gold)] py-3">
        <div className={CONTAINER}>
          <div className="flex items-center justify-between gap-3">
            <div className="header-logo logos min-w-0">
              <div className="logo-item">
                <HomeLogo className="v5-logo-mobile" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-1">
              <LangSwitch />
              <button
                type="button"
                className="hamburger-icon flex size-11 items-center justify-center text-[var(--egeep-charcoal)]"
                aria-expanded={open}
                aria-controls="v5-mobile-menu"
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
        id="v5-mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={UI.menu[lang]}
        hidden={!open}
        className="responsive-menu fixed inset-0 z-50 overflow-y-auto bg-[#fff] py-4 lg:hidden"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--egeep-gold)] px-5 pb-4">
          <Logo className="v5-logo-mobile" />
          <button
            type="button"
            onClick={close}
            className="flex size-11 items-center justify-center text-[var(--egeep-charcoal)]"
            data-autofocus
          >
            <X aria-hidden="true" className="size-7" />
            <span className="sr-only">{UI.closeMenu[lang]}</span>
          </button>
        </div>
        <div className="space-y-6 px-5 pt-6">
          <SiteSearch onNavigate={close} />
          <nav className="main-navigation" aria-label={UI.mainNavigation[lang]}>
            <ul className="menu nav-menu divide-y divide-[var(--egeep-grey-light)] border-y border-[var(--egeep-grey-light)]">
              {PRIMARY.map((key) => (
                <li key={key} className={`menu-item ${current === key ? 'active-page' : ''}`}>
                  {navLink(key)}
                </li>
              ))}
              <li className={`menu-item menu-item-has-children ${moreActive ? 'active-page' : ''}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between! py-3 text-xl text-[var(--egeep-charcoal)]"
                  aria-expanded={moreOpen}
                  aria-controls="v5-mobile-more"
                  onClick={() => setMoreOpen((o) => !o)}
                >
                  {UI.more[lang]}
                  <CaretDown aria-hidden="true" className={`size-5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <ul id="v5-mobile-more" className={`submenu bg-transparent! ps-4 pb-2 ${moreOpen ? '' : 'hidden'}`}>
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
            {getSite(lang).hero.cta.label}
          </ExternalLink>
          <ul className="space-y-3 pb-6 text-lg">
            <li>
              <a href={PHONE_HREF} className="inline-flex items-center gap-3 text-[var(--egeep-charcoal)]">
                <Phone aria-hidden="true" className="size-5 shrink-0 text-[var(--egeep-gold)]" />
                <bdi dir="ltr">{site.contact.phone}</bdi>
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF} className="inline-flex items-center gap-3 text-[var(--egeep-charcoal)]">
                <EnvelopeSimple aria-hidden="true" className="size-5 shrink-0 text-[var(--egeep-gold)]" />
                <bdi dir="ltr">{site.contact.email}</bdi>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
