import type { ComponentType } from 'react'
import {
  BookOpen,
  Briefcase,
  FacebookLogo,
  InstagramLogo,
  Lightbulb,
  LinkedinLogo,
  MapTrifold,
  Student,
  VideoConference,
  XLogo,
  YoutubeLogo,
  type IconProps,
} from '@phosphor-icons/react'

type Icon = ComponentType<IconProps>

/** Icons for `site.contact.social[].platform`. */
export const SOCIAL_ICONS: Record<string, Icon> = {
  X: XLogo,
  Facebook: FacebookLogo,
  LinkedIn: LinkedinLogo,
  Instagram: InstagramLogo,
  YouTube: YoutubeLogo,
}

/** Icons for the knowledge-transfer tools, keyed by their English name in `site.about.tools`. */
export const TOOL_ICONS: Record<string, Icon> = {
  'Design-thinking workshops': Lightbulb,
  'Virtual & physical sessions': VideoConference,
  'Field visits': MapTrifold,
  'Capacity Building programmes': Student,
  'Business models': Briefcase,
  'White paper & other publications': BookOpen,
}
