import { Flag } from '../../../shared/Flag'
import {
  REFERENCE_YEAR,
  activeCount,
  areaReachRanked,
  completedCount,
  partners,
  partnersWithWorkstreams,
  signingYears,
} from '../lib/data'

/** Unit chart: one flag tile per partnership, stacked in a column for its signing year. */
export function SigningYearChart() {
  return (
    <ol className="grid grid-cols-8 items-end gap-1.5 sm:gap-3" aria-label="Partnerships signed per year">
      {signingYears.map((group) => (
        <li key={group.year} className="flex flex-col items-center justify-end gap-2">
          <span className="sr-only">
            {`${group.year}: ${group.signed.length} ${group.signed.length === 1 ? 'partnership' : 'partnerships'} signed`}
          </span>
          <span aria-hidden="true" className="v2-display text-lg font-bold text-techblue-800 sm:text-2xl">
            {group.signed.length}
          </span>
          <ul className="flex w-full flex-col-reverse items-center gap-1" aria-label={`Partners signed in ${group.year}`}>
            {group.signed.map((partner) => (
              <li key={partner.id} className="leading-none">
                <Flag
                  iso={partner.iso}
                  alt={partner.shortName}
                  className="h-4 w-6 rounded-[2px] object-cover shadow-sm ring-1 ring-aeblack-900/10 sm:h-5 sm:w-[30px]"
                />
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="w-full border-t-2 border-techblue-900 pt-2 text-center text-xs font-bold text-aeblack-800 sm:text-sm"
          >
            {group.year}
          </span>
        </li>
      ))}
    </ol>
  )
}

/** Split bar of partnerships still running in the reference year versus those that have ended. */
export function StatusSplit() {
  const total = activeCount + completedCount
  const activeShare = (activeCount / total) * 100
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
        <span className="v2-bar bg-techblue-600" style={{ width: `${activeShare}%` }} />
        <span className="flex-1 bg-aegold-400" />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col-reverse gap-0.5">
          <dt className="flex items-center gap-2 text-aeblack-600">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-techblue-600" />
            {`Active in ${REFERENCE_YEAR} or later`}
          </dt>
          <dd className="v2-display text-2xl font-bold text-techblue-950">{activeCount}</dd>
        </div>
        <div className="flex flex-col-reverse gap-0.5">
          <dt className="flex items-center gap-2 text-aeblack-600">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-aegold-400" />
            {`Term ended before ${REFERENCE_YEAR}`}
          </dt>
          <dd className="v2-display text-2xl font-bold text-techblue-950">{completedCount}</dd>
        </div>
      </dl>
    </div>
  )
}

interface AreaReachChartProps {
  limit?: number
}

/** Horizontal bars: partner countries whose listed workstreams match each area (derived). */
export function AreaReachChart({ limit }: AreaReachChartProps) {
  const rows = limit ? areaReachRanked.slice(0, limit) : areaReachRanked
  const base = partnersWithWorkstreams.length
  return (
    <figure>
      <ol className="space-y-4">
        {rows.map(({ area, partners: matched }) => (
          <li key={area.slug}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="font-semibold text-aeblack-800">{area.title}</span>
              <span className="v2-display shrink-0 text-base font-bold text-techblue-800">
                {matched.length}
                <span className="sr-only"> partner countries</span>
              </span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-full bg-techblue-50" aria-hidden="true">
              <div
                className="v2-bar h-full rounded-full bg-gradient-to-r from-techblue-700 to-techblue-500"
                style={{ width: `${(matched.length / base) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="mt-5 text-xs leading-relaxed text-aeblack-600">
        {`Derived figure: partner countries whose listed workstreams mention each area, out of the ${base} of ${partners.length} country profiles that list workstreams.`}
      </figcaption>
    </figure>
  )
}
