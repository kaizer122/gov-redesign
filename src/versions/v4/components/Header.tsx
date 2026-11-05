import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRightIcon, EnvelopeSimpleIcon, HouseIcon, ListIcon, PhoneIcon, XIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { PAGES, type PageKey } from '../../../shared/pages'
import { href } from '../lib/content'

const LOGO_ALT = 'United Arab Emirates Ministry of Cabinet Affairs, Government Experience Exchange Office'

/** Short labels for the navigation; the DS allows at most seven primary items, Home first. */
const NAV_LABELS: Partial<Record<PageKey, string>> = {
  home: 'Home',
  about: 'About',
  areas: 'Areas of cooperation',
  countries: 'Countries',
  'best-practices': 'Best practices',
  activities: 'Activities',
  media: 'Media',
}

const PRIMARY_NAV = PAGES.filter((p) => NAV_LABELS[p.key])

function useActiveKey(): PageKey {
  const { pathname } = useLocation()
  const path = pathname.replace(/\/+$/, '')
  return PAGES.find((p) => href(p.key) === path)?.key ?? 'home'
}

export function Header() {
  const active = useActiveKey()
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    closeRef.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  function closeMenu() {
    setMenuOpen(false)
    toggleRef.current?.focus()
  }

  function onDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu()
      return
    }
    if (event.key !== 'Tab' || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const participate = (
    <a
      href={site.hero.cta.url}
      target="_blank"
      rel="noopener noreferrer"
      className="aegov-btn btn-sm"
    >
      Participate now
      <ArrowUpRightIcon aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )

  return (
    <header className="aegov-header">
      <div className="header-desktop hidden lg:block">
        <div className="header-top py-3">
          <div className="container">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="header-logo logos">
                <div className="logo-item">
                  <Link to={href('home')} className="logo block">
                    <img src={site.meta.logo} alt={LOGO_ALT} width={5466} height={668} />
                  </Link>
                </div>
              </div>
              <div className="header-top-right flex items-center">
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <a
                      href={`tel:${site.contact.phone.replace(/\s/g, '')}`}
                      className="inline-flex min-h-11 items-center gap-2 text-whitely-50 no-underline hover:underline"
                    >
                      <PhoneIcon aria-hidden="true" className="size-4" />
                      {site.contact.phone}
                    </a>
                  </li>
                  <li>
                    <Link
                      to={href('contact')}
                      className="inline-flex min-h-11 items-center gap-2 font-semibold text-whitely-50 no-underline hover:underline"
                    >
                      <EnvelopeSimpleIcon aria-hidden="true" className="size-4" />
                      Contact us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="header-navs">
          <div className="container">
            <div className="flex items-center justify-between gap-4">
              <nav className="main-navigation" aria-label="Main navigation">
                <div className="menu-main-menu-container">
                  <ul className="menu nav-menu lg:flex lg:items-center lg:gap-1 xl:gap-2">
                    {PRIMARY_NAV.map((page) => (
                      <li
                        key={page.key}
                        className={`menu-item lg:inline-flex lg:items-center ${page.key === 'home' ? 'has-link-icon' : ''} ${active === page.key ? 'active-page' : ''}`}
                      >
                        <Link
                          to={href(page.key)}
                          aria-current={active === page.key ? 'page' : undefined}
                          className="hover:border-primary-600! hover:text-primary-700!"
                        >
                          {page.key === 'home' && <HouseIcon aria-hidden="true" />}
                          <span>{NAV_LABELS[page.key]}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
              <div className="hidden shrink-0 xl:block">{participate}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="header-mobile lg:hidden">
        <div className="header-top py-3">
          <div className="container">
            <div className="flex items-center justify-between gap-3">
              <div className="header-logo logos min-w-0">
                <div className="logo-item min-w-0">
                  <Link to={href('home')} className="logo block">
                    <img src={site.meta.logo} alt={LOGO_ALT} width={5466} height={668} />
                  </Link>
                </div>
              </div>
              <button
                ref={toggleRef}
                type="button"
                className="hamburger-icon inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-whitely-50"
                aria-expanded={menuOpen}
                aria-controls="v4-mobile-menu"
                onClick={() => setMenuOpen(true)}
              >
                <ListIcon aria-hidden="true" />
                <span className="sr-only">Open main menu</span>
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div
            id="v4-mobile-menu"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            onKeyDown={onDialogKeyDown}
            className="responsive-menu fixed inset-0 z-50 flex flex-col overflow-y-auto bg-whitely-50"
          >
            <div className="flex items-center justify-between gap-3 bg-primary-900 px-4 py-3">
              <Link to={href('home')} className="logo block min-w-0" onClick={() => setMenuOpen(false)}>
                <img src={site.meta.logo} alt={LOGO_ALT} width={5466} height={668} className="h-8 w-auto max-w-full" />
              </Link>
              <button
                ref={closeRef}
                type="button"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-whitely-50"
                onClick={closeMenu}
              >
                <XIcon aria-hidden="true" className="size-7" />
                <span className="sr-only">Close main menu</span>
              </button>
            </div>
            <nav className="main-navigation px-4 py-4" aria-label="Main navigation">
              <ul className="menu nav-menu divide-y divide-aeblack-100">
                {PAGES.map((page) => (
                  <li key={page.key} className={`menu-item ${active === page.key ? 'active-page' : ''}`}>
                    <Link
                      to={href(page.key)}
                      aria-current={active === page.key ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                      className="flex! min-h-12 w-full items-center border-0! py-3 text-lg"
                    >
                      {NAV_LABELS[page.key] ?? 'Contact us'}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto space-y-3 border-t border-aeblack-100 px-4 py-6">
              {participate}
              <p className="text-sm text-aeblack-600">
                {site.contact.office} · {site.contact.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
