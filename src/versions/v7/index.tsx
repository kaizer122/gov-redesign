import type { ComponentType } from 'react'
import { BilingualVersion } from '../../shared/BilingualVersion'
import type { PageKey } from '../../shared/pages'
import { Layout } from './components/Layout'
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

export default function V7App() {
  return <BilingualVersion version="v7" className="v7-root" pages={PAGE_COMPONENTS} Layout={Layout} />
}
