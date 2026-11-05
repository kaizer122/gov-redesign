import type { ReactNode } from 'react'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'

interface CtaBandProps {
  title: string
  text: string
  secondary?: ReactNode
}

/** Closing call to action that always offers the programme's registration platform. */
export function CtaBand({ title, text, secondary }: CtaBandProps) {
  return (
    <section aria-label={title} className="container pt-4">
      <div className="flex flex-col gap-6 rounded-3xl border border-primary-100 bg-linear-to-br from-primary-50 to-seablue-50 p-6 md:flex-row md:items-center md:justify-between md:p-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-aeblack-950">{title}</h2>
          <p className="mt-2 text-aeblack-700">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={site.hero.cta.url} target="_blank" rel="noopener noreferrer" className="aegov-btn">
            {site.hero.cta.label}
            <ArrowUpRightIcon aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          {secondary}
        </div>
      </div>
    </section>
  )
}
