import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BuildingsIcon,
  ChalkboardTeacherIcon,
  NewspaperIcon,
  type Icon,
} from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { href } from '../lib/content'

interface RoleTask {
  label: string
  to: string
  external?: boolean
}

interface Role {
  id: string
  label: string
  hint: string
  icon: Icon
  tasks: RoleTask[]
}

const ROLES: Role[] = [
  {
    id: 'government',
    label: 'Government seeking partnership',
    hint: 'Explore what a partnership involves and express interest.',
    icon: BuildingsIcon,
    tasks: [
      { label: 'See how a partnership works', to: href('about') },
      { label: 'Explore the areas of cooperation', to: href('areas') },
      { label: 'Express interest in a partnership', to: href('contact', { subject: 'Government Partnership' }) },
      { label: 'Register on the participation platform', to: site.hero.cta.url, external: true },
    ],
  },
  {
    id: 'expert',
    label: 'Expert or trainer',
    hint: 'Share your expertise through the programme.',
    icon: ChalkboardTeacherIcon,
    tasks: [
      { label: 'Apply to become a trainer in GEEP', to: href('contact', { subject: 'Become a Trainer in GEEP' }) },
      { label: 'Review the practices we share', to: href('best-practices') },
      { label: 'Learn about our knowledge-sharing tools', to: href('about') },
    ],
  },
  {
    id: 'media',
    label: 'Media or researcher',
    hint: 'Find partnerships, figures and media resources.',
    icon: NewspaperIcon,
    tasks: [
      { label: 'Visit the media centre', to: href('media') },
      { label: 'Track partnerships by year', to: href('activities') },
      { label: 'Browse participating countries', to: href('countries') },
      { label: 'Send a media or research enquiry', to: href('contact', { subject: 'Inquiry' }) },
    ],
  },
]

/** "I am a…" chooser: a native radio group whose choice reveals the most relevant tasks. */
export function RoleChooser() {
  const [roleId, setRoleId] = useState(ROLES[0].id)
  const role = ROLES.find((r) => r.id === roleId) ?? ROLES[0]

  return (
    <div className="rounded-3xl border border-aeblack-100 bg-whitely-50 p-5 shadow-lg shadow-aeblack-100/60 md:p-7">
      <fieldset>
        <legend className="mb-4 text-lg font-bold text-aeblack-950">I am a…</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {ROLES.map((r) => {
            const RoleIcon = r.icon
            return (
              <label
                key={r.id}
                className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 border-aeblack-100 p-3 text-aeblack-800 transition-colors hover:border-primary-300 has-checked:border-primary-600 has-checked:bg-primary-50 has-checked:text-primary-800 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-seablue-600 sm:flex-col sm:items-start sm:p-4"
              >
                <input
                  type="radio"
                  name="v4-role"
                  value={r.id}
                  checked={roleId === r.id}
                  onChange={() => setRoleId(r.id)}
                  className="sr-only"
                />
                <RoleIcon aria-hidden="true" className="size-7 shrink-0 text-primary-600" />
                <span className="font-semibold leading-snug">{r.label}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
      <div className="mt-5">
        <p className="mb-3 text-sm text-aeblack-600">{role.hint}</p>
        <ul className="divide-y divide-aeblack-100 rounded-2xl border border-aeblack-100">
          {role.tasks.map((task) => (
            <li key={task.label}>
              {task.external ? (
                <a
                  href={task.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-between gap-3 px-4 py-3 font-semibold text-primary-600 no-underline hover:bg-primary-50 hover:underline"
                >
                  <span>
                    {task.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                  <ArrowUpRightIcon aria-hidden="true" className="size-5 shrink-0" />
                </a>
              ) : (
                <Link
                  to={task.to}
                  className="flex min-h-12 items-center justify-between gap-3 px-4 py-3 font-semibold text-primary-600 no-underline hover:bg-primary-50 hover:underline"
                >
                  <span>{task.label}</span>
                  <ArrowRightIcon aria-hidden="true" className="size-5 shrink-0" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
