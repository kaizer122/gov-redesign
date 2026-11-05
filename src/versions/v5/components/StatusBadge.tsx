import { useLang } from '../../../shared/i18n'
import { STATUS_LABEL, type PartnershipStatus } from '../lib/content'

/** Partnership status as text with a shape cue (filled vs hollow dot), never colour alone. */
export function StatusBadge({ status }: { status: PartnershipStatus }) {
  const lang = useLang()
  const active = status === 'active'
  return (
    <span
      className={`aegov-badge inline-flex items-center gap-2 border ${active ? 'border-[var(--egeep-gold)] bg-[#fff]!' : 'border-[var(--egeep-grey-light)] bg-[var(--egeep-ivory)]!'}`}
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full border border-[var(--color-primary-700)] ${active ? 'bg-[var(--color-primary-700)]' : 'bg-transparent'}`}
      />
      {STATUS_LABEL[status][lang]}
    </span>
  )
}
