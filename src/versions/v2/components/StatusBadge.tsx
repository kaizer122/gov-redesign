import { statusLabel, type PartnershipStatus } from '../lib/data'

interface StatusBadgeProps {
  status: PartnershipStatus | null
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const tone =
    status === 'active'
      ? 'badge-success'
      : status === 'completed'
        ? 'bg-aegold-100! text-aegold-900!'
        : 'bg-aeblack-100! text-aeblack-800!'
  return (
    <span className={`aegov-badge ${tone}`}>
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${status === 'active' ? 'bg-aegreen-600' : status === 'completed' ? 'bg-aegold-600' : 'bg-aeblack-400'}`}
      />
      {statusLabel(status)}
    </span>
  )
}
