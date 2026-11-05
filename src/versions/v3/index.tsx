import { useEffect, type ComponentType } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PAGES, type PageKey } from '../../shared/pages'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { About } from './pages/About'
import { Activities } from './pages/Activities'
import { Areas } from './pages/Areas'
import { BestPractices } from './pages/BestPractices'
import { Contact } from './pages/Contact'
import { Countries } from './pages/Countries'
import { Home } from './pages/Home'
import { Media } from './pages/Media'
import './theme.css'

const PAGE_COMPONENTS: Record<PageKey, ComponentType> = {
  home: Home,
  about: About,
  areas: Areas,
  countries: Countries,
  'best-practices': BestPractices,
  activities: Activities,
  media: Media,
  contact: Contact,
}

/** Scrolls to the top on page change, or to the target section when the URL carries a hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) target.scrollIntoView()
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export default function V3App() {
  return (
    <div className="v3-root">
      <a
        href="#main"
        className="v3-skip aegov-btn btn-sm sr-only focus:not-sr-only"
      >
        Skip to main content
      </a>
      <ScrollManager />
      <Header />
      <Routes>
        {PAGES.map(({ key, path }) => {
          const Page = PAGE_COMPONENTS[key]
          return path ? <Route key={key} path={path} element={<Page />} /> : <Route key={key} index element={<Page />} />
        })}
      </Routes>
      <Footer />
    </div>
  )
}
