import {
  ArrowUpRightIcon,
  CaretDownIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  PaperPlaneTiltIcon,
  PhoneIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { site } from '../../../data/site'
import { PageMasthead } from '../components/PageMasthead'
import { SectionHeading } from '../components/SectionHeading'
import { SOCIAL_ICONS } from '../components/social'
import { registration } from '../content'

const SUBJECTS = site.contactForm?.subjects ?? []
const [, TRAINER_SUBJECT, PARTNERSHIP_SUBJECT] = SUBJECTS

type Field = 'name' | 'email' | 'subject' | 'message' | 'consent'
type Errors = Partial<Record<Field, string>>

const FIELD_ORDER: Field[] = ['name', 'email', 'subject', 'message', 'consent']

function validate(form: FormData): Errors {
  const errors: Errors = {}
  const name = String(form.get('name') ?? '').trim()
  const email = String(form.get('email') ?? '').trim()
  const message = String(form.get('message') ?? '').trim()
  if (name.length < 2) errors.name = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Enter a valid email address, like name@example.gov.'
  if (!form.get('subject')) errors.subject = 'Choose what your message is about.'
  if (message.length < 20) errors.message = 'Write a message of at least 20 characters.'
  if (!form.get('consent')) errors.consent = 'Confirm that the office may use your details to reply.'
  return errors
}

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: 'Who can take part in the programme?',
    a: `${site.about.methodology} Governments can register their interest on the participation platform${PARTNERSHIP_SUBJECT ? `, or choose “${PARTNERSHIP_SUBJECT}” as the subject of a message` : ''}.`,
  },
  {
    q: 'How does a partnership begin?',
    a: (
      <>
        Every partnership follows the same five steps:
        <ol className="mt-3 list-decimal space-y-1 ps-6">
          {site.about.workflow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </>
    ),
  },
  {
    q: 'How is knowledge shared with partner governments?',
    a: (
      <>
        The programme works through:
        <ul className="mt-3 list-disc space-y-1 ps-6">
          {site.about.tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </>
    ),
  },
  ...(TRAINER_SUBJECT
    ? [
        {
          q: 'Can I become a trainer with the programme?',
          a: `Choose “${TRAINER_SUBJECT}” as the subject of your message and describe your area of expertise.`,
        },
      ]
    : []),
  {
    q: 'Where is the office?',
    a: `The ${site.contact.office} is at ${site.contact.address}. Call ${site.contact.phone} or email ${site.contact.email}.`,
  },
]

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="aegov-accordion">
      {FAQS.map((item, i) => {
        const expanded = open === i
        return (
          <div key={item.q} className="accordion-item">
            <h3 className="accordion-title" id={`faq-head-${i}`}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`faq-body-${i}`}
                className={expanded ? 'accordion-active' : undefined}
                onClick={() => setOpen(expanded ? null : i)}
              >
                <span>{item.q}</span>
                <CaretDownIcon aria-hidden="true" className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            </h3>
            <div
              id={`faq-body-${i}`}
              role="region"
              aria-labelledby={`faq-head-${i}`}
              className="accordion-content"
              hidden={!expanded}
            >
              <div className="accordion-content-body">
                <div className="v3-measure leading-relaxed text-aeblack-800">{item.a}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Contact() {
  const [errors, setErrors] = useState<Errors>({})
  const [sentTo, setSentTo] = useState<string | null>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const found = validate(data)
    setErrors(found)
    const first = FIELD_ORDER.find((f) => found[f])
    if (first) {
      setSentTo(null)
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setSentTo(String(data.get('email')).trim())
    form.reset()
    requestAnimationFrame(() => successRef.current?.focus())
  }

  const describedBy = (field: Field, hint?: string) =>
    [hint, errors[field] ? `${field}-error` : undefined].filter(Boolean).join(' ') || undefined

  const fieldError = (field: Field) =>
    errors[field] && (
      <p id={`${field}-error`} className="error-message mt-2 flex items-center gap-2 text-sm text-aered-700">
        <WarningCircleIcon aria-hidden="true" className="size-4 shrink-0" />
        {errors[field]}
      </p>
    )

  return (
    <main id="main" data-page="contact">
      <PageMasthead
        crumb="Contact"
        kicker="Write to us"
        title="Contact the Government Experience Exchange Office"
        standfirst={
          <p>
            Send the office a message about the programme, a government partnership or becoming a trainer, or reach
            the team by phone and email.
          </p>
        }
      />

      <div className="v3-wrap grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <section aria-labelledby="v3-form-title" className="lg:col-span-7">
          <h2 id="v3-form-title" className="text-3xl font-bold">
            Send a message
          </h2>
          <p className="mt-3 text-aeblack-700">
            Fields marked <span aria-hidden="true">*</span>
            <span className="sr-only">with an asterisk</span> are required.
          </p>

          {sentTo && (
            <div
              ref={successRef}
              tabIndex={-1}
              role="status"
              className="aegov-alert alert-success mt-8"
            >
              <div className="alert-icon">
                <CheckCircleIcon aria-hidden="true" />
              </div>
              <div className="alert-content">
                <p className="alert-title font-semibold">Thank you, we have received your message.</p>
                <p>
                  The Government Experience Exchange Office will reply to {sentTo}. For urgent matters call{' '}
                  {site.contact.phone}.
                </p>
              </div>
            </div>
          )}

          <form noValidate onSubmit={onSubmit} className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className={`aegov-form-control ${errors.name ? 'control-error' : ''}`}>
              <label htmlFor="v3-name">Full name *</label>
              <div className="form-control-input">
                <input
                  id="v3-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy('name')}
                />
              </div>
              {fieldError('name')}
            </div>

            <div className={`aegov-form-control ${errors.email ? 'control-error' : ''}`}>
              <label htmlFor="v3-email">Email address *</label>
              <div className="form-control-input">
                <input
                  id="v3-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy('email')}
                />
              </div>
              {fieldError('email')}
            </div>

            <div className="aegov-form-control">
              <label htmlFor="v3-org">Government entity or organisation</label>
              <div className="form-control-input">
                <input id="v3-org" name="organisation" type="text" autoComplete="organization" />
              </div>
            </div>

            <div className="aegov-form-control">
              <label htmlFor="v3-country">Country</label>
              <div className="form-control-input">
                <input id="v3-country" name="country" type="text" autoComplete="country-name" />
              </div>
            </div>

            <div className={`aegov-form-control sm:col-span-2 ${errors.subject ? 'control-error' : ''}`}>
              <label htmlFor="v3-subject">Subject *</label>
              <div className="form-control-input">
                <select
                  id="v3-subject"
                  name="subject"
                  required
                  defaultValue=""
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={describedBy('subject')}
                >
                  <option value="">
                    Choose a subject
                  </option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {fieldError('subject')}
            </div>

            <div className={`aegov-form-control sm:col-span-2 ${errors.message ? 'control-error' : ''}`}>
              <label htmlFor="v3-message">Message *</label>
              <div className="form-control-input">
                <textarea
                  id="v3-message"
                  name="message"
                  rows={6}
                  required
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={describedBy('message', 'v3-message-hint')}
                />
              </div>
              <p id="v3-message-hint" className="mt-2 text-sm text-aeblack-600">
                Tell us which area of cooperation or partnership your message concerns.
              </p>
              {fieldError('message')}
            </div>

            <div className="sm:col-span-2">
              <div className="aegov-check-item">
                <input
                  id="v3-consent"
                  name="consent"
                  type="checkbox"
                  required
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={describedBy('consent')}
                />
                <label htmlFor="v3-consent">
                  I agree that the office may use these details to respond to my message. *
                </label>
              </div>
              {fieldError('consent')}
            </div>

            <div className="sm:col-span-2">
              <button type="submit" className="aegov-btn">
                Send message
                <PaperPlaneTiltIcon aria-hidden="true" />
              </button>
            </div>
          </form>
        </section>

        <aside aria-labelledby="v3-office" className="lg:col-span-5">
          <div className="v3-dark rounded-sm p-8 lg:sticky lg:top-8">
            <p className="v3-kicker">The office</p>
            <h2 id="v3-office" className="mt-4 text-2xl font-bold">
              {site.contact.office}
            </h2>
            <address className="mt-6 space-y-5 not-italic">
              <p className="flex gap-3">
                <MapPinIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-aegold-300" />
                {site.contact.address}
              </p>
              <p className="flex gap-3">
                <PhoneIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-aegold-300" />
                <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="underline underline-offset-4 hover:text-aegold-300">
                  {site.contact.phone}
                </a>
              </p>
              <p className="flex gap-3">
                <EnvelopeSimpleIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-aegold-300" />
                <a href={`mailto:${site.contact.email}`} className="underline underline-offset-4 hover:text-aegold-300">
                  {site.contact.email}
                </a>
              </p>
            </address>
            {site.contact.hours && <p className="mt-5 text-aeblack-100">{site.contact.hours}</p>}

            <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-aegold-300">Follow</h3>
            <ul className="mt-4 flex flex-wrap gap-3">
              {site.contact.social.map(({ platform, url }) => {
                const SocialIcon = SOCIAL_ICONS[platform]
                return (
                  <li key={platform}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-11 items-center justify-center rounded-full border border-aeblack-600 hover:border-aegold-300 hover:text-aegold-300"
                    >
                      {SocialIcon && <SocialIcon aria-hidden="true" className="size-5" />}
                      <span className="sr-only">{platform} (opens in a new tab)</span>
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="mt-8 border-t border-aeblack-700 pt-6">
              <p className="text-aeblack-100">Representing a government? Register on the participation platform.</p>
              <a href={registration.url} target="_blank" rel="noopener noreferrer" className="aegov-btn btn-sm mt-4">
                {registration.label}
                <ArrowUpRightIcon aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </aside>
      </div>

      <section aria-labelledby="v3-faq" className="v3-paper-deep">
        <div className="v3-wrap grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-4">
            <SectionHeading id="v3-faq" kicker="Before you write" title="Frequently asked questions" />
          </div>
          <div className="lg:col-span-8">
            <Faq />
          </div>
        </div>
      </section>
    </main>
  )
}
