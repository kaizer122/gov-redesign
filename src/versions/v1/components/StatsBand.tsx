import type { Stat } from '../../../data/site'
import { STAT_LABELS } from '../lib/content'
import { CONTAINER } from '../lib/ui'

interface StatsBandProps {
  id: string
  title: string
  stats: Stat[]
  note?: string
}

/** Key programme figures as a definition list on a gold-tinted band. */
export function StatsBand({ id, title, stats, note }: StatsBandProps) {
  return (
    <section aria-labelledby={id} className="border-y border-primary-200 bg-primary-50">
      <div className={`${CONTAINER} py-10 md:py-12`}>
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id={id} className="text-h6 text-aeblack-900">
            {title}
          </h2>
          {note && <p className="text-sm text-aeblack-700">{note}</p>}
        </div>
        <dl
          className={`grid grid-cols-2 gap-x-6 gap-y-8 ${stats.length > 4 ? 'md:grid-cols-3 xl:grid-cols-6' : 'md:grid-cols-4'}`}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1 border-s-4 border-primary-500 ps-4">
              <dt className="text-sm font-medium text-aeblack-700 md:text-base">{STAT_LABELS[s.label] ?? s.label}</dt>
              <dd className="font-[family-name:var(--font-heading)] text-2xl font-extrabold tracking-tight break-words text-primary-800 sm:text-3xl xl:text-4xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
