import { useEffect, useId, useRef, useState, type ComponentType, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Clock, EnvelopeSimple, MapPin, Phone, WarningCircle, X, type IconProps } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Accordion } from '../components/Accordion'
import { ExternalLink } from '../components/ExternalLink'
import { PageHeader } from '../components/PageHeader'
import { EMAIL_HREF, PHONE_HREF, REGISTER_URL, href } from '../lib/content'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

const SUBJECTS = site.contactForm?.subjects ?? ['Inquiry']

interface Values {
  name: string
  email: string
  organisation: string
  subject: string
  message: string
  consent: boolean
}

type Field = keyof Values

const EMPTY: Values = { name: '', email: '', organisation: '', subject: '', message: '', consent: false }

const FIELD_LABEL: Record<Field, string> = {
  name: 'Full name',
  email: 'Email address',
  organisation: 'Government entity or organisation',
  subject: 'Subject',
  message: 'Message',
  consent: 'Consent',
}

const MIN_MESSAGE = 20

function validate(v: Values): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (!v.name.trim()) errors.name = 'Enter your full name.'
  if (!v.email.trim()) errors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    errors.email = 'Enter an email address in the format name@example.com.'
  if (!v.subject) errors.subject = 'Choose a subject.'
  if (v.message.trim().length < MIN_MESSAGE)
    errors.message = `Enter a message of at least ${MIN_MESSAGE} characters.`
  if (!v.consent) errors.consent = 'Confirm that the office may contact you about this request.'
  return errors
}

export default function ContactPage() {
  return (
    <main id="main" data-page="contact" tabIndex={-1}>
      <PageHeader
        page="contact"
        title="Contact us"
        lead={`Questions about partnerships, training or the programme's areas of cooperation? Contact the ${site.contact.office} by phone, email or the form below.`}
      />

      <div className={`${CONTAINER} ${SECTION} grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16`}>
        <ContactForm />
        <ContactDetails />
      </div>

      <section aria-labelledby="faq-title" className="border-t border-aeblack-100 bg-aeblack-50">
        <div className={`${CONTAINER} ${SECTION} grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]`}>
          <div>
            <h2 id="faq-title" className="text-h5 md:text-h4 text-aeblack-900">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-aeblack-700">Quick answers drawn from the programme's published information.</p>
          </div>
          <div className="rounded-xl border border-aeblack-100 bg-whitely-50 px-2 md:px-4">
            <Accordion
              defaultOpen={['what']}
              items={[
                {
                  key: 'what',
                  title: 'What is the Government Experience Exchange Programme?',
                  content: (
                    <div className="space-y-3">
                      <p>{site.about.intro[0]}</p>
                      <p>{site.about.launched}</p>
                    </div>
                  ),
                },
                {
                  key: 'join',
                  title: 'How can my government take part?',
                  content: (
                    <div className="space-y-3">
                      <p>
                        Register on the programme's participation platform, or contact the office using the details on
                        this page.
                      </p>
                      <ExternalLink href={REGISTER_URL} className="aegov-btn btn-sm">
                        {site.hero.cta.label}
                      </ExternalLink>
                    </div>
                  ),
                },
                {
                  key: 'stages',
                  title: 'What happens once a partnership is agreed?',
                  content: (
                    <ol className="list-decimal space-y-1 ps-6 marker:font-semibold marker:text-primary-700">
                      {site.about.workflow.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  ),
                },
                {
                  key: 'areas',
                  title: 'Which areas can we cooperate on?',
                  content: (
                    <div className="space-y-3">
                      <ul className="grid gap-1 sm:grid-cols-2">
                        {site.areas.map((a) => (
                          <li key={a.slug}>{a.title}</li>
                        ))}
                      </ul>
                      <Link to={href('areas')} className="aegov-link">
                        Explore the areas of cooperation
                      </Link>
                    </div>
                  ),
                },
                {
                  key: 'formats',
                  title: 'How is knowledge shared with partner governments?',
                  content: (
                    <div className="space-y-3">
                      <p>{site.about.methodology}</p>
                      <ul className="list-disc space-y-1 ps-6 marker:text-primary-600">
                        {site.about.tools.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function ContactForm() {
  const id = useId()
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [sent, setSent] = useState<string | null>(null)
  const [toast, setToast] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(false), 6000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const fieldId = (f: Field) => `${id}-${f}`
  const errorId = (f: Field) => `${id}-${f}-error`

  const set = <K extends Field>(field: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      setSent(null)
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    setSent(values.name.trim())
    setValues(EMPTY)
    setToast(true)
    requestAnimationFrame(() => successRef.current?.focus())
  }

  const errorList = (Object.keys(errors) as Field[]).filter((f) => errors[f])

  const control = (field: Field) => ({
    id: fieldId(field),
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? errorId(field) : undefined,
  })

  const error = (field: Field) =>
    errors[field] && (
      <p id={errorId(field)} className="error-message">
        <strong>Error:</strong> {errors[field]}
      </p>
    )

  return (
    <section aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="mb-2 text-h5 md:text-h4 text-aeblack-900">
        Send us a message
      </h2>
      <p className="mb-8 text-aeblack-700">Fields marked with * are required.</p>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="aegov-alert alert-error mb-8">
          <div className="alert-icon">
            <WarningCircle aria-hidden="true" weight="fill" />
          </div>
          <div className="alert-content">
            <h3 className="alert-title text-base">There is a problem with your message</h3>
            <ul className="mt-2 list-disc space-y-1 ps-5">
              {errorList.map((f) => (
                <li key={f}>
                  <a
                    href={`#${fieldId(f)}`}
                    className="text-aered-800 underline"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(fieldId(f))?.focus()
                    }}
                  >
                    {FIELD_LABEL[f]}: {errors[f]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {sent && (
        <div ref={successRef} tabIndex={-1} role="status" className="aegov-alert alert-success mb-8">
          <div className="alert-icon">
            <CheckCircle aria-hidden="true" weight="fill" />
          </div>
          <div className="alert-content">
            <h3 className="alert-title text-base">Thank you, {sent}. Your message has been submitted.</h3>
            <p>
              For urgent matters, call <a href={PHONE_HREF}>{site.contact.phone}</a> or email{' '}
              <a href={EMAIL_HREF}>{site.contact.email}</a>.
            </p>
          </div>
        </div>
      )}

      <form noValidate onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className={`aegov-form-control ${errors.name ? 'control-error' : ''}`}>
            <label htmlFor={fieldId('name')}>{FIELD_LABEL.name} *</label>
            <div className="form-control-input">
              <input
                type="text"
                autoComplete="name"
                required
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
                {...control('name')}
              />
            </div>
            {error('name')}
          </div>
          <div className={`aegov-form-control ${errors.email ? 'control-error' : ''}`}>
            <label htmlFor={fieldId('email')}>{FIELD_LABEL.email} *</label>
            <div className="form-control-input">
              <input
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                {...control('email')}
              />
            </div>
            {error('email')}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="aegov-form-control">
            <label htmlFor={fieldId('organisation')}>{FIELD_LABEL.organisation}</label>
            <div className="form-control-input">
              <input
                type="text"
                autoComplete="organization"
                value={values.organisation}
                onChange={(e) => set('organisation', e.target.value)}
                {...control('organisation')}
              />
            </div>
          </div>
          <div className={`aegov-form-control ${errors.subject ? 'control-error' : ''}`}>
            <label htmlFor={fieldId('subject')}>{FIELD_LABEL.subject} *</label>
            <div className="form-control-input">
              <select required value={values.subject} onChange={(e) => set('subject', e.target.value)} {...control('subject')}>
                <option value="">Choose a subject</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {error('subject')}
          </div>
        </div>

        <div className={`aegov-form-control ${errors.message ? 'control-error' : ''}`}>
          <label htmlFor={fieldId('message')}>{FIELD_LABEL.message} *</label>
          <div className="form-control-input">
            <textarea
              rows={6}
              required
              value={values.message}
              onChange={(e) => set('message', e.target.value)}
              {...control('message')}
            />
          </div>
          {error('message')}
        </div>

        <div className={`aegov-form-control ${errors.consent ? 'control-error' : ''}`}>
          <div className="aegov-check-item items-start! gap-3">
            <input
              type="checkbox"
              required
              checked={values.consent}
              onChange={(e) => set('consent', e.target.checked)}
              {...control('consent')}
            />
            <label htmlFor={fieldId('consent')} className="mb-0!">
              I agree that the {site.contact.office} may contact me about this request. *
            </label>
          </div>
          {error('consent')}
        </div>

        <button type="submit" className="aegov-btn">
          Send message
        </button>
      </form>

      {toast && (
        <div className="fixed end-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm">
          <div className="aegov-toast relative shadow-lg" role="status">
            <div className="flex items-start">
              <div className="toast-icon text-aegreen-600">
                <CheckCircle aria-hidden="true" weight="fill" />
              </div>
              <div className="toast-body">
                <span className="mb-1 block text-base font-semibold text-aeblack-900">Message submitted</span>
                <span className="block text-aeblack-700">Thank you for contacting the {site.contact.office}.</span>
              </div>
              <button type="button" className="toast-dismiss" onClick={() => setToast(false)}>
                <X aria-hidden="true" />
                <span className="sr-only">Dismiss notification</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

interface ContactItem {
  icon: ComponentType<IconProps>
  label: string
  value: string
  href?: string
}

function ContactDetails() {
  const items: ContactItem[] = [
    { icon: MapPin, label: 'Office', value: `${site.contact.office}, ${site.contact.address}` },
    { icon: Phone, label: 'Phone', value: site.contact.phone, href: PHONE_HREF },
    { icon: EnvelopeSimple, label: 'Email', value: site.contact.email, href: EMAIL_HREF },
    ...(site.contact.hours ? [{ icon: Clock, label: 'Opening hours', value: site.contact.hours }] : []),
  ]

  return (
    <div className="space-y-6">
      <div className="aegov-card card-bordered border-aeblack-100! p-6!">
        <h2 id="v1-contact-details" className="text-h6 text-aeblack-900">
          Contact details
        </h2>
        <dl className="space-y-5">
          {items.map(({ icon: Icon, label, value, href: link }) => (
            <div key={label} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <div className="min-w-0">
                <dt className="text-sm text-aeblack-700">{label}</dt>
                <dd className="font-semibold break-words text-aeblack-900">
                  {link ? (
                    <a href={link} className="text-aeblack-900 hover:text-primary-800">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="aegov-card card-bordered border-aeblack-100! p-6!">
        <h2 className="text-h6 text-aeblack-900">Follow the programme</h2>
        <ul className="flex flex-wrap gap-3">
          {site.contact.social.map((s) => {
            const Icon = SOCIAL_ICONS[s.platform]
            return (
              <li key={s.platform}>
                <ExternalLink href={s.url} label={s.platform} className="aegov-btn btn-soft btn-icon">
                  {Icon && <Icon aria-hidden="true" className="size-6" />}
                </ExternalLink>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-xl bg-aeblack-900 p-6 text-whitely-50">
        <h2 className="text-h6 text-whitely-50">Ready to partner with the UAE?</h2>
        <p className="mt-2 mb-5 text-aeblack-100">Register your government's interest on the participation platform.</p>
        <ExternalLink href={REGISTER_URL} className="aegov-btn">
          {site.hero.cta.label}
        </ExternalLink>
      </div>
    </div>
  )
}
