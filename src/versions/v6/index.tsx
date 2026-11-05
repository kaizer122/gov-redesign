import type { ComponentType, ReactNode } from 'react'
import { BilingualVersion } from '../../shared/BilingualVersion'
import { useLang } from '../../shared/i18n'
import type { PageKey } from '../../shared/pages'
import { UI } from '../../shared/strings'
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

function Layout({ children }: { children: ReactNode }) {
  const lang = useLang()
  return (
    <>
      <a href="#main" className="v6-skip-link">
        {UI.skipToContent[lang]}
      </a>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default function V6App() {
  return <BilingualVersion version="v6" className="v6-root" pages={PAGE_COMPONENTS} Layout={Layout} />
}
