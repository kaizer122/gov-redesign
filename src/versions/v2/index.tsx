import './theme.css'
import { useEffect, type ComponentType } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PAGES, type PageKey } from '../../shared/pages'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Areas from './pages/Areas'
import Countries from './pages/Countries'
import BestPractices from './pages/BestPractices'
import Activities from './pages/Activities'
import Media from './pages/Media'
import Contact from './pages/Contact'

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

export default function GlobalAtlas() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="v2-root flex min-h-screen flex-col">
      <a href="#main" className="v2-skip">
        Skip to main content
      </a>
      <Header />
      <Routes>
        {PAGES.map(({ key, path }) => {
          const Page = PAGE_COMPONENTS[key]
          return path ? (
            <Route key={key} path={path} element={<Page />} />
          ) : (
            <Route key={key} index element={<Page />} />
          )
        })}
      </Routes>
      <Footer />
    </div>
  )
}
