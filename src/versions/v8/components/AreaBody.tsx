import type { Area } from '../../../data/site'
import { structureBody } from '../lib/content'

/** An area's description, with "following programs:" style runs rendered as a list. */
export function AreaBody({ area, className = '' }: { area: Area; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {structureBody(area.slug).map((block) =>
        block.kind === 'p' ? (
          <p key={block.index}>{area.body[block.index]}</p>
        ) : (
          <div key={block.intro}>
            <p className="mb-2">{area.body[block.intro]}</p>
            <ul className="space-y-1">
              {block.items.map((i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-[var(--egeep-gold)]" />
                  {area.body[i]}
                </li>
              ))}
            </ul>
          </div>
        ),
      )}
    </div>
  )
}
