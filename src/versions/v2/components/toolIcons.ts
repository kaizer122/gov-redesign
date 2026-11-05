import {
  BooksIcon,
  BriefcaseIcon,
  ChalkboardTeacherIcon,
  LightbulbIcon,
  MapTrifoldIcon,
  StudentIcon,
  VideoConferenceIcon,
  type Icon,
} from '@phosphor-icons/react'

const TOOL_ICONS: Record<string, Icon> = {
  'Design-thinking workshops': LightbulbIcon,
  'Virtual & physical sessions': VideoConferenceIcon,
  'Field visits': MapTrifoldIcon,
  'Capacity Building programmes': StudentIcon,
  'Business models': BriefcaseIcon,
  'White paper & other publications': BooksIcon,
}

/** Icon for one of the programme's knowledge-sharing tools (see `site.about.tools`). */
export function toolIcon(tool: string): Icon {
  return TOOL_ICONS[tool] ?? ChalkboardTeacherIcon
}
