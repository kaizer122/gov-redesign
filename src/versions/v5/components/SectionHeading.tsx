import type { ReactNode } from 'react'

interface SectionHeadingProps {
  id: string
  title: string
  eyebrow?: string
  intro?: ReactNode
  /** Link or button aligned to the heading's end on wide screens. */
  action?: ReactNode
}

/** Heading block in the guide's grammar: eyebrow, large light gold title, intro, then a gold hairline. */
export function SectionHeading({ id, title, eyebrow, intro, action }: SectionHeadingProps) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          {eyebrow && <p className="v5-eyebrow mb-3">{eyebrow}</p>}
          <h2 id={id} className="text-4xl text-[var(--egeep-gold)] md:text-5xl">
            {title}
          </h2>
          {intro && <p className="mt-5 text-lg text-[var(--egeep-charcoal)]">{intro}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="v5-hairline mt-8" aria-hidden="true" />
    </div>
  )
}
