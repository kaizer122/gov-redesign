import { site as en } from '../../../data/site'
import { TOOL_ICONS } from '../lib/icons'

/** Knowledge-transfer formats with thin gold icons (icons keyed by the English tool name, same index). */
export function ToolList({ tools }: { tools: string[] }) {
  return (
    <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, i) => {
        const Icon = TOOL_ICONS[en.about.tools[i]]
        return (
          <li key={tool} className="flex items-center gap-5 border-b border-[var(--egeep-grey-light)] py-5">
            {Icon && <Icon aria-hidden="true" weight="thin" className="size-11 shrink-0 text-[var(--egeep-gold)]" />}
            <span className="text-xl text-[var(--egeep-charcoal)]">{tool}</span>
          </li>
        )
      })}
    </ul>
  )
}
