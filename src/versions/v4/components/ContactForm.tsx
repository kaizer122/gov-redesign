import { useCallback, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PaperPlaneTiltIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { countriesByName } from '../lib/content'
import { Toast } from './Toast'

type FieldName = 'name' | 'email' | 'organisation' | 'country' | 'subject' | 'message'
type Values = Record<FieldName, string>
type Errors = Partial<Record<FieldName, string>>

const FIELD_ORDER: FieldName[] = ['name', 'email', 'organisation', 'country', 'subject', 'message']
const SUBJECTS = site.contactForm?.subjects ?? []
const OTHER_COUNTRY = 'Other'
const MESSAGE_MIN = 20
const MESSAGE_MAX = 1000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: Values): Errors {
  const errors: Errors = {}
  const name = values.name.trim()
  if (!name) errors.name = 'Enter your full name.'
  else if (name.length < 2) errors.name = 'Your name must be at least 2 characters.'
  const email = values.email.trim()
  if (!email) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter an email address in the correct format, like name@example.gov.'
  if (!values.organisation.trim()) errors.organisation = 'Enter your organisation or government entity.'
  if (!values.country) errors.country = 'Select your country.'
  if (!values.subject) errors.subject = 'Select what your message is about.'
  const message = values.message.trim()
  if (!message) errors.message = 'Enter your message.'
  else if (message.length < MESSAGE_MIN) errors.message = `Your message must be at least ${MESSAGE_MIN} characters.`
  else if (message.length > MESSAGE_MAX) errors.message = `Your message must be ${MESSAGE_MAX} characters or fewer.`
  return errors
}

function initialValues(params: URLSearchParams): Values {
  const subject = params.get('subject') ?? ''
  const area = site.areas.find((a) => a.slug === params.get('area'))
  return {
    name: '',
    email: '',
    organisation: '',
    country: '',
    subject: SUBJECTS.includes(subject) ? subject : '',
    message: area ? `We would like to explore cooperation in ${area.title}. ` : '',
  }
}

const EMPTY: Values = { name: '', email: '', organisation: '', country: '', subject: '', message: '' }

interface FieldProps {
  name: FieldName
  label: string
  error?: string
  hint?: ReactNode
  children: ReactNode
}

/** DS form control wrapper with label, optional hint and inline error message. */
function Field({ name, label, error, hint, children }: FieldProps) {
  return (
    <div className={`aegov-form-control ${error ? 'control-error' : ''}`}>
      <label htmlFor={`v4-contact-${name}`}>
        {label} <span className="text-aered-600" aria-hidden="true">*</span>
      </label>
      {hint && (
        <p id={`v4-contact-${name}-hint`} className="mb-2 text-sm text-aeblack-600">
          {hint}
        </p>
      )}
      <div className="form-control-input">{children}</div>
      {error && (
        <p id={`v4-contact-${name}-error`} className="error-message">
          <strong>Error:</strong> {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const [params] = useSearchParams()
  const [values, setValues] = useState<Values>(() => initialValues(params))
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [summary, setSummary] = useState<Errors | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const dismissToast = useCallback(() => setSentTo(null), [])

  const errors = validate(values)
  const visibleError = (name: FieldName) => (touched[name] ? errors[name] : undefined)

  function describedBy(name: FieldName, hasHint = false) {
    const ids = [hasHint ? `v4-contact-${name}-hint` : '', visibleError(name) ? `v4-contact-${name}-error` : '']
    return ids.filter(Boolean).join(' ') || undefined
  }

  function controlProps(name: FieldName, hasHint = false) {
    return {
      id: `v4-contact-${name}`,
      name,
      value: values[name],
      required: true,
      'aria-required': true,
      'aria-invalid': visibleError(name) ? true : undefined,
      'aria-describedby': describedBy(name, hasHint),
      onChange: (event: { target: { value: string } }) => {
        const next = { ...values, [name]: event.target.value }
        setValues(next)
        if (summary) setSummary(validate(next))
      },
      onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])))
    if (Object.keys(errors).length > 0) {
      setSummary(errors)
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    setSentTo(values.email.trim())
    setSummary(null)
    setTouched({})
    setValues(EMPTY)
  }

  const summaryEntries = summary ? FIELD_ORDER.filter((f) => summary[f]).map((f) => [f, summary[f] as string] as const) : []

  return (
    <>
      <form noValidate onSubmit={onSubmit} aria-labelledby="v4-contact-form-title" className="space-y-6">
        <div>
          <h2 id="v4-contact-form-title" className="text-2xl font-bold text-aeblack-950">
            Send us a message
          </h2>
          <p className="mt-1 text-sm text-aeblack-600">
            All fields marked <span aria-hidden="true">*</span>
            <span className="sr-only">with an asterisk</span> are required.
          </p>
        </div>

        {summaryEntries.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="aegov-alert alert-error outline-none">
            <div className="alert-icon">
              <WarningCircleIcon aria-hidden="true" />
            </div>
            <div className="alert-content">
              <div className="alert-title">
                There {summaryEntries.length === 1 ? 'is 1 problem' : `are ${summaryEntries.length} problems`} with your
                message
              </div>
              <ul className="mt-3 list-disc space-y-1 ps-4">
                {summaryEntries.map(([field, message]) => (
                  <li key={field}>
                    <a
                      href={`#v4-contact-${field}`}
                      className="inline"
                      onClick={(event) => {
                        event.preventDefault()
                        document.getElementById(`v4-contact-${field}`)?.focus()
                      }}
                    >
                      {message}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {sentTo && (
          <div role="status" className="aegov-alert alert-success">
            <div className="alert-content">
              <p>
                Thank you. We have received your message and will reply to <strong>{sentTo}</strong>.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Field name="name" label="Full name" error={visibleError('name')}>
            <input type="text" autoComplete="name" {...controlProps('name')} />
          </Field>
          <Field name="email" label="Email address" error={visibleError('email')}>
            <input type="email" autoComplete="email" inputMode="email" {...controlProps('email')} />
          </Field>
          <Field name="organisation" label="Organisation or government entity" error={visibleError('organisation')}>
            <input type="text" autoComplete="organization" {...controlProps('organisation')} />
          </Field>
          <Field name="country" label="Country" error={visibleError('country')}>
            <select autoComplete="country-name" {...controlProps('country')}>
              <option value="">Select a country</option>
              {countriesByName.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value={OTHER_COUNTRY}>Other country</option>
            </select>
          </Field>
        </div>
        <Field name="subject" label="Subject" error={visibleError('subject')}>
          <select {...controlProps('subject')}>
            <option value="">Select a subject</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field
          name="message"
          label="Message"
          error={visibleError('message')}
          hint={`Tell us what you would like to achieve. Between ${MESSAGE_MIN} and ${MESSAGE_MAX} characters.`}
        >
          <textarea rows={6} maxLength={MESSAGE_MAX} {...controlProps('message', true)} />
        </Field>
        <p className="-mt-4 text-end text-sm text-aeblack-600">
          {values.message.trim().length} / {MESSAGE_MAX} characters
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="aegov-btn btn-lg">
            <PaperPlaneTiltIcon aria-hidden="true" />
            Send message
          </button>
          <p className="text-sm text-aeblack-600">We use your details only to respond to this message.</p>
        </div>
      </form>
      {sentTo && (
        <Toast
          title="Message sent"
          message="Thank you for contacting the Government Experience Exchange Office."
          onDismiss={dismissToast}
        />
      )}
    </>
  )
}
