import { createContext, useContext, useEffect, useLayoutEffect, type ComponentType, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { getSite } from '../data/site'
import { dirOf, isLang, LangContext, otherLang, useLang, type Lang } from './i18n'
import { PAGES, pageHref, pageLabel, type PageKey, type VersionId } from './pages'

const VersionContext = createContext<VersionId>('v5')

interface BilingualVersionProps {
  version: VersionId
  /** Class of the version root wrapper (e.g. "v5-root"); scope theme tokens under it. */
  className: string
  pages: Record<PageKey, ComponentType>
  /** Chrome around every page: skip link, header, footer. Receives the routed page as children. */
  Layout: ComponentType<{ children: ReactNode }>
}

/**
 * Routing shell for the iteration 2 versions: /<version> redirects to /<version>/en, and every page
 * exists under /<version>/en/... and /<version>/ar/.... It provides the language (useLang), sets
 * lang/dir on <html> and on the version root, sets the document title and manages scroll on navigation.
 */
export function BilingualVersion(props: BilingualVersionProps) {
  return (
    <VersionContext.Provider value={props.version}>
      <Routes>
        <Route index element={<Navigate to="en" replace />} />
        <Route path=":lang/*" element={<LangRoot {...props} />} />
      </Routes>
    </VersionContext.Provider>
  )
}

function LangRoot({ version, className, pages, Layout }: BilingualVersionProps) {
  const { lang } = useParams()
  if (!isLang(lang)) return <Navigate to={`/${version}/en`} replace />
  return (
    <LangContext.Provider value={lang}>
      <DocumentLang lang={lang} />
      <ScrollManager />
      <div className={className} lang={lang} dir={dirOf(lang)}>
        <Layout>
          <Routes>
            {PAGES.map(({ key, path }) => {
              const element = <PageFrame pageKey={key} Page={pages[key]} />
              return path ? <Route key={key} path={path} element={element} /> : <Route key={key} index element={element} />
            })}
            <Route path="*" element={<Navigate to={pageHref(version, 'home', lang)} replace />} />
          </Routes>
        </Layout>
      </div>
    </LangContext.Provider>
  )
}

/** Mirrors the language on <html>, so the DS's :root[dir] rules, portals and assistive tech see it. */
function DocumentLang({ lang }: { lang: Lang }) {
  useLayoutEffect(() => {
    const html = document.documentElement
    html.lang = lang
    html.dir = dirOf(lang)
    return () => {
      html.lang = 'en'
      html.dir = 'ltr'
    }
  }, [lang])
  return null
}

function PageFrame({ pageKey, Page }: { pageKey: PageKey; Page: ComponentType }) {
  const lang = useLang()
  const siteName = getSite(lang).meta.siteName
  useEffect(() => {
    document.title = pageKey === 'home' ? siteName : `${pageLabel(pageKey, lang)} | ${siteName}`
  }, [pageKey, lang, siteName])
  return <Page />
}

/** Scrolls to the top on page change, or to the target section when the URL has a hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

/** Version id of the enclosing BilingualVersion. */
export const useVersion = (): VersionId => useContext(VersionContext)

/** `href(key)` → URL of a page in the current version and language, e.g. "/v5/ar/about". */
export function usePageHref(): (key: PageKey) => string {
  const version = useVersion()
  const lang = useLang()
  return (key) => pageHref(version, key, lang)
}

/** The current URL (path, query and hash) in the other language. */
export function useLangSwitchHref(): string {
  const lang = useLang()
  const { pathname, search, hash } = useLocation()
  const segments = pathname.split('/') // ['', 'v5', 'en', ...rest]
  segments[2] = otherLang(lang)
  return segments.join('/') + search + hash
}

/** Page key for the current location, or undefined outside the page set. */
export function useCurrentPage(): PageKey | undefined {
  const { pathname } = useLocation()
  const rest = pathname.split('/').slice(3).join('/').replace(/\/$/, '')
  return PAGES.find((p) => p.path === rest)?.key
}
