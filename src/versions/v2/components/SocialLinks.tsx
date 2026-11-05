import {
  FacebookLogoIcon,
  GlobeHemisphereEastIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
  type Icon,
} from '@phosphor-icons/react'
import { site } from '../../../data/site'

export const SOCIAL_ICONS: Record<string, Icon> = {
  X: XLogoIcon,
  Facebook: FacebookLogoIcon,
  LinkedIn: LinkedinLogoIcon,
  Instagram: InstagramLogoIcon,
  YouTube: YoutubeLogoIcon,
}

interface SocialLinksProps {
  className?: string
  linkClassName?: string
}

/** Icon links to the programme's official social channels. */
export function SocialLinks({ className = '', linkClassName = '' }: SocialLinksProps) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {site.contact.social.map((s) => {
        const SocialIcon = SOCIAL_ICONS[s.platform] ?? GlobeHemisphereEastIcon
        return (
          <li key={s.platform}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex size-11 items-center justify-center rounded-lg transition-colors ${linkClassName}`}
            >
              <SocialIcon size={22} aria-hidden="true" />
              <span className="sr-only">{`${s.platform} (opens in a new tab)`}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
