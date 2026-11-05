import type { ReactNode } from 'react'

interface SectionHeadingProps {
  id: string
  kicker: string
  title: string
  intro?: ReactNode
  /** Optional element aligned to the end of the heading row (e.g. a "see all" link). */
  action?: ReactNode
}

export function SectionHeading({ id, kicker, title, intro, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="v3-measure">
        <p className="v3-kicker">{kicker}</p>
        <h2 id={id} className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
          {title}
        </h2>
        {intro && <p className="mt-4 text-lg leading-relaxed opacity-85">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
