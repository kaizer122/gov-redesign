import { useId, useRef, useState, type FormEvent } from 'react'
import {
  ArrowUpRightIcon,
  CaretDownIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  PhoneIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Main, PageHeader, SectionHeading } from '../components/Page'
import { SocialLinks } from '../components/SocialLinks'
import { partners, registration } from '../lib/data'

interface FormValues {
  name: string
  organisation: string
  email: string
  country: string
  subject: string
  message: string
  consent: boolean
}

type FieldName = keyof FormValues
type Errors = Partial<Record<FieldName, string>>

const EMPTY: FormValues = {
  name: '',
  organisation: '',
  email: '',
  country: '',
  subject: '',
  message: '',
  consent: false,
}

const FIELD_ORDER: FieldName[] = ['name', 'email', 'subject', 'message', 'consent']

function validate(values: FormValues): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'Enter a valid email address, like name@example.gov.'
  if (!values.subject) errors.subject = 'Choose the subject of your message.'
  if (values.message.trim().length < 20) errors.message = 'Write a message of at least 20 characters.'
  if (!values.consent) errors.consent = 'Confirm that the office may contact you about this enquiry.'
  return errors
}

const FAQS = [
  {
    q: 'How does a partnership with the UAE start?',
    a: `Partnerships follow the programme workflow: ${site.about.workflow.map((s) => s.toLowerCase()).join(', then ')}.`,
  },
  {
    q: 'Which areas can a partnership cover?',
    a: `The programme shares UAE experience in ${site.areas.length} areas of cooperation: ${site.areas.map((a) => a.title).join(', ')}.`,
  },
  {
    q: 'What formats does knowledge exchange take?',
    a: `Knowledge is shared through ${site.about.tools.map((t) => t.toLowerCase()).join(', ')}.`,
  },
  {
    q: 'How do I register interest?',
    a: 'Use the registration platform linked on this page, or send a message with the subject “Government Partnership” using the form.',
  },
]

export default function Contact() {
  const { contact } = site
  const uid = useId()
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const successRef = useRef<HTMLDivElement>(null)

  const fieldId = (name: FieldName) => `${uid}-${name}`
  const errorId = (name: FieldName) => `${uid}-${name}-error`

  const update = <K extends FieldName>(name: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    const firstInvalid = FIELD_ORDER.find((f) => found[f])
    if (firstInvalid) {
      setSent(false)
      document.getElementById(fieldId(firstInvalid))?.focus()
      return
    }
    setSent(true)
    setValues(EMPTY)
    requestAnimationFrame(() => successRef.current?.focus())
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  const controlClass = (name: FieldName) => `aegov-form-control ${errors[name] ? 'control-error' : ''}`
  const describedBy = (name: FieldName, help?: string) =>
    [help, errors[name] ? errorId(name) : undefined].filter(Boolean).join(' ') || undefined

  return (
    <Main page="contact">
      <PageHeader
        page="contact"
        eyebrow="Contact us"
        title="Talk to the Government Experience Exchange Office"
        lead="Questions about the programme, interest in a government partnership, or an offer to become a GEEP trainer: write to the office using the form or the contact details below."
      />

      <section aria-labelledby="v2-contact-form" className="bg-aeblack-50 py-16 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-aeblack-100 bg-whitely-50 p-6 md:p-8">
              <h2 id="v2-contact-form" className="text-2xl font-extrabold text-techblue-950">
                Send a message
              </h2>
              <p className="mt-2 text-sm text-aeblack-600">Fields marked with * are required.</p>

              {sent && (
                <div ref={successRef} tabIndex={-1} role="status" className="aegov-alert alert-success mt-6 outline-none">
                  <div className="alert-icon">
                    <CheckCircleIcon size={28} weight="fill" aria-hidden="true" />
                  </div>
                  <div className="alert-content">
                    <p className="alert-title font-semibold">Thank you, your message is ready</p>
                    <p>
                      {`This preview does not send data. To reach the office now, email ${contact.email} or call ${contact.phone}.`}
                    </p>
                  </div>
                </div>
              )}

              {errorCount > 0 && (
                <div role="alert" className="aegov-alert alert-error mt-6">
                  <div className="alert-icon">
                    <WarningCircleIcon size={28} weight="fill" aria-hidden="true" />
                  </div>
                  <div className="alert-content">
                    <p className="alert-title font-semibold">
                      {`Please fix ${errorCount} ${errorCount === 1 ? 'field' : 'fields'} before sending`}
                    </p>
                    <ul className="mt-1 list-disc ps-5">
                      {FIELD_ORDER.filter((f) => errors[f]).map((f) => (
                        <li key={f}>
                          <a href={`#${fieldId(f)}`} className="underline underline-offset-2">
                            {errors[f]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <form noValidate onSubmit={onSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className={controlClass('name')}>
                    <label htmlFor={fieldId('name')}>Full name *</label>
                    <div className="form-control-input">
                      <input
                        id={fieldId('name')}
                        type="text"
                        autoComplete="name"
                        required
                        value={values.name}
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={describedBy('name')}
                        onChange={(e) => update('name', e.target.value)}
                      />
                    </div>
                    {errors.name && (
                      <p id={errorId('name')} className="error-message">
                        <strong>Error:</strong> {errors.name}
                      </p>
                    )}
                  </div>
                  <div className={controlClass('organisation')}>
                    <label htmlFor={fieldId('organisation')}>Organisation</label>
                    <div className="form-control-input">
                      <input
                        id={fieldId('organisation')}
                        type="text"
                        autoComplete="organization"
                        value={values.organisation}
                        onChange={(e) => update('organisation', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className={controlClass('email')}>
                    <label htmlFor={fieldId('email')}>Email address *</label>
                    <div className="form-control-input">
                      <input
                        id={fieldId('email')}
                        type="email"
                        autoComplete="email"
                        required
                        value={values.email}
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={describedBy('email')}
                        onChange={(e) => update('email', e.target.value)}
                      />
                    </div>
                    {errors.email && (
                      <p id={errorId('email')} className="error-message">
                        <strong>Error:</strong> {errors.email}
                      </p>
                    )}
                  </div>
                  <div className={controlClass('country')}>
                    <label htmlFor={fieldId('country')}>Country</label>
                    <div className="form-control-input">
                      <input
                        id={fieldId('country')}
                        type="text"
                        autoComplete="country-name"
                        list={`${uid}-countries`}
                        value={values.country}
                        aria-describedby={`${uid}-country-help`}
                        onChange={(e) => update('country', e.target.value)}
                      />
                      <datalist id={`${uid}-countries`}>
                        {partners.map((p) => (
                          <option key={p.id} value={p.shortName} />
                        ))}
                      </datalist>
                    </div>
                    <p id={`${uid}-country-help`} className="mt-2 text-xs leading-5 text-aeblack-600">
                      Suggestions list current partner countries; any country can be entered.
                    </p>
                  </div>
                </div>

                <div className={controlClass('subject')}>
                  <label htmlFor={fieldId('subject')}>Subject *</label>
                  <div className="form-control-input">
                    <select
                      id={fieldId('subject')}
                      required
                      value={values.subject}
                      aria-invalid={errors.subject ? true : undefined}
                      aria-describedby={describedBy('subject')}
                      onChange={(e) => update('subject', e.target.value)}
                    >
                      <option value="">Choose a subject</option>
                      {(site.contactForm?.subjects ?? []).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.subject && (
                    <p id={errorId('subject')} className="error-message">
                      <strong>Error:</strong> {errors.subject}
                    </p>
                  )}
                </div>

                <div className={controlClass('message')}>
                  <label htmlFor={fieldId('message')}>Message *</label>
                  <div className="form-control-input">
                    <textarea
                      id={fieldId('message')}
                      rows={6}
                      required
                      value={values.message}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={describedBy('message', `${uid}-message-help`)}
                      onChange={(e) => update('message', e.target.value)}
                    />
                  </div>
                  <p id={`${uid}-message-help`} className="mt-2 text-xs leading-5 text-aeblack-600">
                    Tell us about your government entity and the areas of cooperation you are interested in.
                  </p>
                  {errors.message && (
                    <p id={errorId('message')} className="error-message">
                      <strong>Error:</strong> {errors.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="aegov-check-item">
                    <input
                      id={fieldId('consent')}
                      type="checkbox"
                      checked={values.consent}
                      aria-invalid={errors.consent ? true : undefined}
                      aria-describedby={describedBy('consent')}
                      onChange={(e) => update('consent', e.target.checked)}
                    />
                    <label htmlFor={fieldId('consent')}>
                      I agree that the office may contact me about this enquiry. *
                    </label>
                  </div>
                  {errors.consent && (
                    <p id={errorId('consent')} className="mt-2 text-sm font-medium text-aered-700">
                      <strong>Error:</strong> {errors.consent}
                    </p>
                  )}
                </div>

                <button type="submit" className="aegov-btn w-full sm:w-auto">
                  Send message
                </button>
              </form>
            </div>
          </div>

          <aside aria-labelledby="v2-contact-details" className="space-y-6 lg:col-span-5">
            <div className="v2-dark v2-grid-bg rounded-2xl bg-techblue-950 p-6 text-whitely-50 md:p-8">
              <h2 id="v2-contact-details" className="text-xl font-extrabold text-whitely-50">
                {contact.office}
              </h2>
              <ul className="mt-6 space-y-5">
                <li className="flex gap-4">
                  <MapPinIcon size={24} aria-hidden="true" className="shrink-0 text-aegold-300" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-techblue-200">Address</p>
                    <p className="font-semibold">{contact.address}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <PhoneIcon size={24} aria-hidden="true" className="shrink-0 text-aegold-300" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-techblue-200">Phone</p>
                    <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="font-semibold text-whitely-50 underline-offset-4 hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <EnvelopeSimpleIcon size={24} aria-hidden="true" className="shrink-0 text-aegold-300" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-techblue-200">Email</p>
                    <a href={`mailto:${contact.email}`} className="font-semibold text-whitely-50 underline-offset-4 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </li>
              </ul>
              {contact.hours && <p className="mt-6 text-sm text-techblue-100">{contact.hours}</p>}
              <p className="mt-8 text-xs uppercase tracking-wider text-techblue-200">Official channels</p>
              <SocialLinks className="mt-2 -ms-3" linkClassName="text-techblue-100 hover:bg-techblue-900 hover:text-whitely-50" />
            </div>

            <div className="rounded-2xl border border-aegold-300 bg-aegold-50 p-6 md:p-8">
              <h3 className="text-xl font-extrabold text-techblue-950">Register your government’s interest</h3>
              <p className="mt-2 text-aeblack-700">
                Government entities can register to participate through the programme’s sign-up platform.
              </p>
              <a href={registration.url} target="_blank" rel="noopener noreferrer" className="aegov-btn mt-5">
                {registration.label}
                <ArrowUpRightIcon size={20} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="v2-contact-faq" className="bg-whitely-50 py-16 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="v2-contact-faq" eyebrow="Before you write" title="Frequently asked questions" />
          </div>
          <div className="aegov-accordion lg:col-span-8">
            {FAQS.map((faq, i) => {
              const open = openFaq === i
              return (
                <div key={faq.q} className="accordion-item">
                  <h3 className="accordion-title text-base font-semibold" id={`${uid}-faq-${i}-head`}>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`${uid}-faq-${i}`}
                      className={open ? 'accordion-active' : ''}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      <span>{faq.q}</span>
                      <CaretDownIcon size={20} aria-hidden="true" className={open ? 'rotate-180' : ''} />
                    </button>
                  </h3>
                  <div
                    id={`${uid}-faq-${i}`}
                    className="accordion-content"
                    hidden={!open}
                    role="region"
                    aria-labelledby={`${uid}-faq-${i}-head`}
                  >
                    <div className="accordion-content-body">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </Main>
  )
}
