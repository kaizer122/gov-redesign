import { useEffect, type ComponentType } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PAGES, type PageKey } from '../../shared/pages'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import AboutPage from './pages/About'
import ActivitiesPage from './pages/Activities'
import AreasPage from './pages/Areas'
import BestPracticesPage from './pages/BestPractices'
import ContactPage from './pages/Contact'
import CountriesPage from './pages/Countries'
import HomePage from './pages/Home'
import MediaPage from './pages/Media'
import './theme.css'

const PAGE_COMPONENTS: Record<PageKey, ComponentType> = {
  home: HomePage,
  about: AboutPage,
  areas: AreasPage,
  countries: CountriesPage,
  'best-practices': BestPracticesPage,
  activities: ActivitiesPage,
  media: MediaPage,
  contact: ContactPage,
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

export default function V1App() {
  return (
    <div className="v1-root">
      <a href="#main" className="v1-skip-link">
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
