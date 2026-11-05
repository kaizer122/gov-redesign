import type { ReactNode } from 'react'

interface SectionHeadingProps {
  id: string
  title: string
  eyebrow?: string
  intro?: ReactNode
  /** Link or button aligned to the heading's end on wide screens. */
  action?: ReactNode
}

export function SectionHeading({ id, title, eyebrow, intro, action }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-2 text-sm font-semibold tracking-wider text-primary-700 uppercase">{eyebrow}</p>}
        <h2 id={id} className="text-h5 md:text-h4 text-aeblack-900">
          {title}
        </h2>
        {intro && <p className="mt-3 text-lg text-aeblack-700">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
