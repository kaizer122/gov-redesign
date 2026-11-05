import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { site } from './data/site'
import { isBilingual, VERSIONS, type VersionMeta } from './shared/pages'

const metaModules = import.meta.glob<{ meta: VersionMeta }>('./versions/*/meta.ts', { eager: true })
const appModules = import.meta.glob<{ default: ComponentType }>('./versions/*/index.tsx')

const versions = VERSIONS.map((id) => {
  const meta = metaModules[`./versions/${id}/meta.ts`]?.meta
  const load = appModules[`./versions/${id}/index.tsx`]
  const App: LazyExoticComponent<ComponentType> | null = load ? lazy(load) : null
  return { id, meta, App }
})

type VersionEntry = (typeof versions)[number]

function VersionCard({ id, meta }: VersionEntry) {
  return (
    <li className="aegov-card card-bordered">
      <div className="card-content">
        <p className="text-sm font-semibold uppercase text-primary-600">{id}</p>
        <h3 className="card-title">{meta?.name ?? id}</h3>
        <p className="text-aeblack-600">{meta?.concept}</p>
        {isBilingual(id) ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to={`/${id}/en`} className="aegov-btn btn-sm" aria-label={`Open ${id} in English`}>
              English
            </Link>
            <Link to={`/${id}/ar`} lang="ar" className="aegov-btn btn-sm btn-outline" aria-label={`Open ${id} in Arabic`}>
              العربية
            </Link>
          </div>
        ) : (
          <Link to={`/${id}`} className="aegov-btn btn-sm mt-4">
            Open {id}
          </Link>
        )}
      </div>
    </li>
  )
}

function Launcher() {
  const iterations = [
    {
      title: 'Iteration 2: EGEEP brand',
      note: 'Built on the EGEEP brand guideline (DESIGN.md) with Sakkal Majalla, in English and Arabic.',
      items: versions.filter((v) => isBilingual(v.id)),
    },
    {
      title: 'Iteration 1',
      note: 'Before the brand guideline. English only.',
      items: versions.filter((v) => !isBilingual(v.id)),
    },
  ]
  return (
    <main id="main" className="container py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Redesign concepts</p>
      <h1 className="mt-2 text-4xl font-bold text-aeblack-900">{site.meta.siteName}</h1>
      <p className="mt-4 max-w-2xl text-aeblack-600">
        Redesign directions built on the UAE Design System 3.0. Content sourced from {site.meta.source}.
      </p>
      {iterations.map((iteration) => (
        <section key={iteration.title} className="mt-12">
          <h2 className="text-2xl font-bold text-aeblack-900">{iteration.title}</h2>
          <p className="mt-2 text-aeblack-600">{iteration.note}</p>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {iteration.items.map((v) => (
              <VersionCard key={v.id} {...v} />
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route index element={<Launcher />} />
        {versions.map(({ id, App: VersionApp }) =>
          VersionApp ? <Route key={id} path={`${id}/*`} element={<VersionApp />} /> : null,
        )}
        <Route path="*" element={<Launcher />} />
      </Routes>
    </Suspense>
  )
}
