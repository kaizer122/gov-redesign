import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretDown, Globe, House, List, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useCurrentPage, useLangSwitchHref } from '../../../shared/BilingualVersion'
import { Logo } from '../../../shared/brand'
import { otherLang, useLang, useT, type Lang } from '../../../shared/i18n'
import { pageLabel, type PageKey } from '../../../shared/pages'
import { UI } from '../../../shared/strings'
import { REGISTER_URL, useSite } from '../lib/content'
import { useDismiss, useLinks, useModalFocus } from '../lib/hooks'
import { T } from '../lib/t'
import { CONTAINER } from '../lib/ui'
import { CommandPalette } from './CommandPalette'
import { ExternalLink } from './ExternalLink'

/** Six primary links plus "More" keeps the bar within the DS limit of seven items. */
const PRIMARY: PageKey[] = ['home', 'about', 'areas', 'countries', 'activities', 'best-practices']
const MORE: PageKey[] = ['media', 'contact']

const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

export function Header() {
  const current = useCurrentPage()
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="aegov-header">
      <DesktopHeader current={current} onSearch={() => setPaletteOpen(true)} />
      <MobileHeader current={current} onSearch={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  )
}

interface NavProps {
  current: PageKey | undefined
  onSearch: () => void
}

function HomeLogo({ className, lockup }: { className: string; lockup: 'bilingual' | 'english' | 'arabic' }) {
  const { href } = useLinks()
  const t = useT(T)
  return (
    <Link to={href('home')} className="block shrink-0 py-[0.7rem] no-underline" aria-label={t('homeLink')}>
      <Logo lockup={lockup} colourway="full-colour" className={className} />
    </Link>
  )
}

function LanguageLink({ className = '' }: { className?: string }) {
  const lang = useLang()
  const target: Lang = otherLang(lang)
  return (
    <Link
      to={useLangSwitchHref()}
      lang={target}
      hrefLang={target}
      title={UI.switchLanguageLabel[lang]}
      className={`inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-[var(--v8-text)] no-underline hover:bg-[var(--egeep-ivory)] ${className}`}
    >
      <Globe aria-hidden="true" className="size-5 text-primary-700" />
      {UI.switchLanguage[lang]}
    </Link>
  )
}

function DesktopHeader({ current, onSearch }: NavProps) {
  const lang = useLang()
  const t = useT(T)
  const site = useSite()
  const { href } = useLinks()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLLIElement>(null)
  useDismiss(moreRef, moreOpen, () => setMoreOpen(false))
  const moreActive = current !== undefined && MORE.includes(current)

  return (
    <div className="header-desktop hidden lg:block">
      <div className={`${CONTAINER} flex items-center gap-6 py-3`}>
        <HomeLogo className="v8-logo" lockup="bilingual" />
        <div className="ms-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onSearch}
            aria-haspopup="dialog"
            aria-keyshortcuts={isMac() ? 'Meta+K' : 'Control+K'}
            className="flex min-h-11 w-72 items-center gap-3 rounded-md border border-[var(--v8-line-strong)] bg-[var(--egeep-ivory)] px-3 text-start text-[var(--v8-text-2)] hover:border-primary-600 xl:w-80"
          >
            <MagnifyingGlass aria-hidden="true" className="size-5 shrink-0 text-primary-700" />
            <span className="min-w-0 flex-1 truncate">{UI.searchPlaceholder[lang]}</span>
            <kbd className="v8-kbd" aria-hidden="true">
              {isMac() ? '⌘ K' : 'Ctrl K'}
            </kbd>
            <span className="sr-only">{t('searchSite')}</span>
          </button>
          <LanguageLink />
          <ExternalLink href={REGISTER_URL} className="aegov-btn btn-sm">
            {site.hero.cta.label}
          </ExternalLink>
        </div>
      </div>
      <div className="border-t border-[var(--v8-line)]">
        <div className={CONTAINER}>
          <nav aria-label={UI.mainNavigation[lang]} className="main-navigation">
            <ul className="-mx-3.5 flex items-center">
              {PRIMARY.map((key) => (
                <li key={key}>
                  <Link to={href(key)} aria-current={current === key ? 'page' : undefined} className="v8-nav-link">
                    {key === 'home' && <House aria-hidden="true" className="size-5" />}
                    {pageLabel(key, lang)}
                  </Link>
                </li>
              ))}
              <li ref={moreRef} className="relative">
                <button
                  type="button"
                  className="v8-nav-link"
                  data-active={moreActive}
                  aria-expanded={moreOpen}
                  aria-controls="v8-more-menu"
                  onClick={() => setMoreOpen((o) => !o)}
                >
                  {UI.more[lang]}
                  <CaretDown aria-hidden="true" className={`size-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <ul
                  id="v8-more-menu"
                  hidden={!moreOpen}
                  className="v8-tile absolute start-0 top-full z-30 mt-px w-60 p-2 shadow-lg"
                >
                  {MORE.map((key) => (
                    <li key={key}>
                      <Link
                        to={href(key)}
                        aria-current={current === key ? 'page' : undefined}
                        onClick={() => setMoreOpen(false)}
                        className="block rounded-md px-3 py-2 text-[var(--v8-text)] no-underline hover:bg-[var(--egeep-ivory)] aria-[current=page]:text-primary-800"
                      >
                        {pageLabel(key, lang)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

function MobileHeader({ current, onSearch }: NavProps) {
  const lang = useLang()
  const t = useT(T)
  const site = useSite()
  const { href } = useLinks()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const close = () => setOpen(false)
  useModalFocus(menuRef, open, close)
  const lockup = lang === 'ar' ? 'arabic' : 'english'

  return (
    <div className="header-mobile lg:hidden">
      <div className={`${CONTAINER} flex items-center justify-between gap-2`}>
        <HomeLogo className="v8-logo-mobile" lockup={lockup} />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSearch}
            aria-haspopup="dialog"
            className="flex size-11 items-center justify-center rounded-md text-[var(--v8-text)]"
          >
            <MagnifyingGlass aria-hidden="true" className="size-6" />
            <span className="sr-only">{t('searchSite')}</span>
          </button>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-md text-[var(--v8-text)]"
            aria-expanded={open}
            aria-controls="v8-mobile-menu"
            onClick={() => setOpen(true)}
          >
            <List aria-hidden="true" className="size-7" />
            <span className="sr-only">{UI.openMenu[lang]}</span>
          </button>
        </div>
      </div>
      <div
        id="v8-mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={UI.menu[lang]}
        hidden={!open}
        className="v8-menu fixed inset-0 z-50 overflow-y-auto bg-[#fff]"
      >
        <div className={`${CONTAINER} flex items-center justify-between gap-4 border-b border-[var(--v8-line)]`}>
          <HomeLogo className="v8-logo-mobile" lockup={lockup} />
          <button
            type="button"
            onClick={close}
            className="flex size-11 items-center justify-center rounded-md text-[var(--v8-text)]"
            data-autofocus
          >
            <X aria-hidden="true" className="size-7" />
            <span className="sr-only">{UI.closeMenu[lang]}</span>
          </button>
        </div>
        <div className={`${CONTAINER} space-y-6 py-6`}>
          <nav aria-label={UI.mainNavigation[lang]}>
            <ul className="divide-y divide-[var(--v8-line)] border-y border-[var(--v8-line)]">
              {[...PRIMARY, ...MORE].map((key) => (
                <li key={key}>
                  <Link
                    to={href(key)}
                    onClick={close}
                    aria-current={current === key ? 'page' : undefined}
                    className="flex items-center gap-3 py-3 text-xl text-[var(--v8-text)] no-underline aria-[current=page]:text-primary-800"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-5 w-0.5 ${current === key ? 'bg-[var(--egeep-gold)]' : 'bg-transparent'}`}
                    />
                    {pageLabel(key, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <ExternalLink href={REGISTER_URL} className="aegov-btn">
              {site.hero.cta.label}
            </ExternalLink>
            <LanguageLink className="border border-[var(--v8-line)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
