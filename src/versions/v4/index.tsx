import { useLayoutEffect, type ComponentType } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PAGES, type PageKey } from '../../shared/pages'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { AboutPage } from './pages/AboutPage'
import { ActivitiesPage } from './pages/ActivitiesPage'
import { AreasPage } from './pages/AreasPage'
import { BestPracticesPage } from './pages/BestPracticesPage'
import { ContactPage } from './pages/ContactPage'
import { CountriesPage } from './pages/CountriesPage'
import { HomePage } from './pages/HomePage'
import { MediaPage } from './pages/MediaPage'
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

function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function V4App() {
  return (
    <div className="v4-root">
      <ScrollToTop />
      <a href="#main" className="v4-skip-link">
        Skip to main content
      </a>
      <Header />
      <Routes>
        {PAGES.map(({ key, path }) => {
          const PageComponent = PAGE_COMPONENTS[key]
          return path ? (
            <Route key={key} path={path} element={<PageComponent />} />
          ) : (
            <Route key={key} index element={<PageComponent />} />
          )
        })}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </div>
  )
}
