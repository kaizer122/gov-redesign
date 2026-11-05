import { CheckCircleIcon, ClockIcon } from '@phosphor-icons/react'
import type { PartnershipStatus } from '../lib/content'

export function StatusBadge({ status }: { status: PartnershipStatus }) {
  return status === 'active' ? (
    <span className="aegov-badge badge-success shrink-0">
      <ClockIcon aria-hidden="true" />
      Active
    </span>
  ) : (
    <span className="aegov-badge v4-badge-neutral shrink-0">
      <CheckCircleIcon aria-hidden="true" />
      Completed
    </span>
  )
}
