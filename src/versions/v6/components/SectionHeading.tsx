import type { ReactNode } from 'react'

interface SectionHeadingProps {
  id: string
  eyebrow?: string
  title: string
  intro?: ReactNode
  action?: ReactNode
  className?: string
}

/** Section title block: Latin-tracked eyebrow with a gold rule, large light heading, optional lead and action. */
export function SectionHeading({ id, eyebrow, title, intro, action, className = 'mb-10 md:mb-14' }: SectionHeadingProps) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-10 gap-y-6 ${className}`}>
      <div className="max-w-3xl">
        {eyebrow && <p className="v6-eyebrow mb-4">{eyebrow}</p>}
        <h2 id={id} className="v6-gold-heading text-4xl md:text-5xl">
          {title}
        </h2>
        {intro && <div className="v6-muted mt-5 text-lg">{intro}</div>}
      </div>
      {action}
    </div>
  )
}
