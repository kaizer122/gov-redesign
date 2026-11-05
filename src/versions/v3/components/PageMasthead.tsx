import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { href } from '../content'

interface PageMastheadProps {
  /** Breadcrumb label for the current page. */
  crumb: string
  kicker: string
  title: string
  standfirst: ReactNode
  children?: ReactNode
}

/** Section-front header for inner pages: breadcrumb, kicker, headline and standfirst. */
export function PageMasthead({ crumb, kicker, title, standfirst, children }: PageMastheadProps) {
  return (
    <header className="border-b v3-rule">
      <div className="v3-wrap pb-12 pt-8 md:pb-16 lg:pt-10">
        <nav aria-label="Breadcrumb" className="aegov-breadcrumb with-seperator">
          <ol>
            <li>
              <Link to={href('home')}>Home</Link>
            </li>
            <li>
              <span aria-current="page">{crumb}</span>
            </li>
          </ol>
        </nav>
        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="v3-kicker v3-rise">{kicker}</p>
            <h1 className="v3-rise v3-rise-2 mt-5 text-4xl font-bold leading-[1.1] text-aeblack-950 md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <div className="v3-rise v3-rise-3 v3-measure mt-6 text-lg leading-relaxed text-aeblack-700 md:text-xl">
              {standfirst}
            </div>
          </div>
          {children && <div className="lg:col-span-4">{children}</div>}
        </div>
      </div>
    </header>
  )
}
