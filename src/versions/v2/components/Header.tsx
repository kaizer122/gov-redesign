import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRightIcon, ListIcon, XIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { PAGES, pageHref, type PageKey } from '../../../shared/pages'
import { registration } from '../lib/data'

const PRIMARY: { key: PageKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'areas', label: 'Areas' },
  { key: 'countries', label: 'Countries' },
  { key: 'best-practices', label: 'Best Practices' },
  { key: 'activities', label: 'Activities' },
  { key: 'media', label: 'Media' },
]

export function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)

  // Close the mobile menu whenever the route changes.
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const isActive = (key: PageKey) => {
    const href = pageHref('v2', key)
    return key === 'home' ? pathname === href || pathname === `${href}/` : pathname.startsWith(href)
  }

  return (
    <header className="aegov-header v2-header v2-dark">
      <div className="container">
        <div className="flex items-center justify-between gap-4 py-4 lg:py-5">
          <Link to={pageHref('v2', 'home')} className="block shrink-0 rounded">
            <img
              src={site.meta.logo}
              alt={`${site.contact.office}, UAE Ministry of Cabinet Affairs: home`}
              width={5466}
              height={668}
              className="h-7 w-auto sm:h-9 xl:h-11"
            />
          </Link>
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to={pageHref('v2', 'contact')}
              aria-current={isActive('contact') ? 'page' : undefined}
              className="aegov-btn btn-sm btn-outline v2-btn-ghost"
            >
              Contact
            </Link>
            <a
              href={registration.url}
              target="_blank"
              rel="noopener noreferrer"
              className="aegov-btn btn-sm v2-btn-gold"
            >
              Participate
              <ArrowUpRightIcon size={18} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
          <button
            type="button"
            className="hamburger-icon inline-flex size-11 items-center justify-center rounded-lg lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="v2-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <XIcon size={28} aria-hidden="true" /> : <ListIcon size={28} aria-hidden="true" />}
            <span className="sr-only">{menuOpen ? 'Close main menu' : 'Open main menu'}</span>
          </button>
        </div>
      </div>

      <div className="header-navs hidden border-t border-techblue-200/15 lg:block">
        <div className="container">
          <nav className="main-navigation" aria-label="Main navigation">
            <ul className="menu nav-menu flex items-center gap-1 xl:gap-2">
              {PRIMARY.map((item) => {
                const active = isActive(item.key)
                return (
                  <li
                    key={item.key}
                    className={`menu-item inline-flex items-center ${active ? 'active-page' : ''}`}
                  >
                    <Link to={pageHref('v2', item.key)} aria-current={active ? 'page' : undefined}>
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      <div
        id="v2-mobile-menu"
        hidden={!menuOpen}
        className="border-t border-techblue-200/15 bg-techblue-950 lg:hidden"
      >
        <nav aria-label="Mobile navigation" className="container py-4">
          <ul className="divide-y divide-techblue-200/15">
            {PAGES.map((page) => {
              const active = isActive(page.key)
              return (
                <li key={page.key}>
                  <Link
                    to={pageHref('v2', page.key)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center justify-between py-3 text-base font-semibold ${
                      active ? 'text-aegold-200' : 'text-whitely-50'
                    }`}
                  >
                    {page.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <a
            href={registration.url}
            target="_blank"
            rel="noopener noreferrer"
            className="aegov-btn btn-sm v2-btn-gold btn-block mt-4"
          >
            {registration.label}
            <ArrowUpRightIcon size={18} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
