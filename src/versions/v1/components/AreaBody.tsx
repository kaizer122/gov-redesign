import type { Area } from '../../../data/site'
import { structureBody } from '../lib/content'

/** An area's description, with "following programs:" style runs rendered as a list. */
export function AreaBody({ area, className = '' }: { area: Area; className?: string }) {
  return (
    <div className={`space-y-4 text-aeblack-800 ${className}`}>
      {structureBody(area.body).map((block) =>
        block.kind === 'p' ? (
          <p key={block.text}>
            {block.text}
          </p>
        ) : (
          <div key={block.intro}>
            <p className="mb-2">{block.intro}</p>
            <ul className="list-disc space-y-1 ps-6 marker:text-primary-600">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ),
      )}
    </div>
  )
}
