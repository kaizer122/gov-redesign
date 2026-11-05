import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, ArrowUpRightIcon, type Icon } from '@phosphor-icons/react'

interface ServiceCardProps {
  title: string
  description: ReactNode
  to: string
  icon?: Icon
  /** Visible call to action under the description. */
  action?: string
  external?: boolean
  headingLevel?: 'h2' | 'h3'
}

/**
 * DS service card (card-service). The title link is stretched over the whole card so the
 * card is one large touch target with a single accessible link.
 */
export function ServiceCard({
  title,
  description,
  to,
  icon: CardIcon,
  action = 'Start',
  external = false,
  headingLevel = 'h3',
}: ServiceCardProps) {
  const Heading = headingLevel
  const linkClass = 'static no-underline after:absolute after:inset-0 after:rounded-2xl after:content-[""] hover:underline'
  return (
    <div className="aegov-card card-bordered card-glow card-service relative flex h-full flex-col border-aeblack-100!">
      {CardIcon && (
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <CardIcon aria-hidden="true" className="size-7" />
        </span>
      )}
      <Heading className="card-service-title line-clamp-2">
        {external ? (
          <a href={to} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <Link to={to} className={linkClass}>
            {title}
          </Link>
        )}
      </Heading>
      <div className="flex-1 text-aeblack-600">{description}</div>
      <span className="aegov-link pointer-events-none" aria-hidden="true">
        {action}
        {external ? <ArrowUpRightIcon /> : <ArrowRightIcon />}
      </span>
    </div>
  )
}
