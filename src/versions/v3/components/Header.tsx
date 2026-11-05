import { ArrowUpRightIcon, ListIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../../../data/site'
import { PAGES } from '../../../shared/pages'
import { chapterNo, href, registration } from '../content'

/** DS guidance caps primary navigation at seven items; Contact sits in the masthead instead. */
const PRIMARY = PAGES.filter((p) => p.key !== 'contact')

const LABELS: Record<string, string> = {
  areas: 'Areas',
  countries: 'Countries',
  media: 'Media',
}

export function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="aegov-header">
      <div className="v3-dark">
        <div className="v3-wrap flex items-center justify-between gap-4 py-2 text-xs md:text-sm">
          <p>An official website of the United Arab Emirates Government</p>
          <p className="hidden text-aeblack-100 md:block">{site.about.slogan.join(' · ')}</p>
        </div>
      </div>

      <div className="v3-wrap flex items-center justify-between gap-4 py-5 lg:py-7">
        <Link to={href('home')} className="block shrink-0">
          <img
            src={site.meta.logo}
            alt="UAE Ministry of Cabinet Affairs, Government Experience Exchange Office — home"
            className="v3-logo h-7 w-auto sm:h-9 lg:h-11"
            width={5466}
            height={668}
          />
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          <NavLink to={href('contact')} className="v3-nav-link">
            Contact
          </NavLink>
          <a href={registration.url} target="_blank" rel="noopener noreferrer" className="aegov-btn btn-sm">
            Participate
            <ArrowUpRightIcon aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
        <button
          type="button"
          className="aegov-btn btn-icon btn-outline btn-sm lg:hidden"
          aria-expanded={open}
          aria-controls="v3-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <XIcon aria-hidden="true" /> : <ListIcon aria-hidden="true" />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <nav aria-label="Main navigation" className="main-navigation hidden border-t v3-rule lg:block">
        <ul className="menu nav-menu v3-wrap flex items-center justify-between">
          {PRIMARY.map((page) => (
            <li key={page.key} className="menu-item">
              <NavLink to={href(page.key)} end={page.key === 'home'} className="v3-nav-link">
                {LABELS[page.key] ?? page.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav
        id="v3-mobile-nav"
        aria-label="Main navigation (mobile)"
        hidden={!open}
        className="border-t v3-rule lg:hidden"
      >
        <ul className="v3-wrap divide-y divide-aeblack-100 py-2">
          {PAGES.map((page, i) => (
            <li key={page.key}>
              <NavLink
                to={href(page.key)}
                end={page.key === 'home'}
                className="flex items-baseline gap-4 py-3 font-[family-name:var(--font-alexandria)] text-lg font-semibold text-aeblack-900 aria-[current=page]:text-primary-700"
              >
                <span className="v3-numeral text-sm text-primary-700">{chapterNo(i)}</span>
                {page.label}
              </NavLink>
            </li>
          ))}
          <li className="py-4">
            <a
              href={registration.url}
              target="_blank"
              rel="noopener noreferrer"
              className="aegov-btn btn-block"
            >
              {registration.label}
              <ArrowUpRightIcon aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
