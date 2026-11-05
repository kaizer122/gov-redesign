import {
  BookOpenTextIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  LightbulbIcon,
  MapTrifoldIcon,
  VideoConferenceIcon,
} from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { chapterNo } from '../content'

const TOOL_ICONS = [LightbulbIcon, VideoConferenceIcon, MapTrifoldIcon, GraduationCapIcon, BriefcaseIcon, BookOpenTextIcon]

/** The programme's knowledge-sharing tools from `about.tools`. */
export function Toolkit({ dark = false }: { dark?: boolean }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-sm bg-aeblack-200/60 sm:grid-cols-2">
      {site.about.tools.map((tool, i) => {
        const ToolIcon = TOOL_ICONS[i % TOOL_ICONS.length]
        return (
          <li
            key={tool}
            className={`flex items-center gap-4 p-5 ${dark ? 'bg-aeblack-900 text-whitely-50' : 'bg-whitely-50 text-aeblack-900'}`}
          >
            <ToolIcon aria-hidden="true" className={`size-8 shrink-0 ${dark ? 'text-aegold-300' : 'text-aegold-700'}`} />
            <span className="font-[family-name:var(--font-alexandria)] text-lg font-semibold">{tool}</span>
          </li>
        )
      })}
    </ul>
  )
}

/** The partnership workflow from `about.workflow`, as a vertical timeline. */
export function Workflow({ dark = false }: { dark?: boolean }) {
  return (
    <ol className="relative space-y-8 border-s-2 border-aegold-500 ps-8">
      {site.about.workflow.map((step, i) => (
        <li key={step} className="relative">
          <span
            aria-hidden="true"
            className={`v3-numeral absolute -start-[3.19rem] top-0 flex size-9 items-center justify-center rounded-full text-sm ${dark ? 'bg-aegold-300 text-aeblack-950' : 'bg-aeblack-950 text-aegold-300'}`}
          >
            {chapterNo(i)}
          </span>
          <p className={`text-sm font-semibold uppercase tracking-wider ${dark ? 'text-aegold-300' : 'text-primary-700'}`}>
            Step {i + 1}
          </p>
          <p
            className={`mt-1 font-[family-name:var(--font-alexandria)] text-xl font-semibold ${dark ? 'text-whitely-50' : 'text-aeblack-950'}`}
          >
            {step}
          </p>
        </li>
      ))}
    </ol>
  )
}
