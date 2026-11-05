import { useId, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, CheckCircle, EnvelopeSimple, MapPin, Phone, WarningCircle } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { Accordion } from '../components/Accordion'
import { ExternalLink } from '../components/ExternalLink'
import { ChapterHeading, PageOpening } from '../components/Story'
import { COPY } from '../lib/copy'
import { EMAIL_HREF, PHONE_HREF, REGISTER_URL } from '../lib/content'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER, FLIP, SECTION } from '../lib/ui'

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

const MIN_MESSAGE = 20

type ErrorKey = 'formErrorRequired' | 'formErrorEmail' | 'errorMessageLength' | 'errorConsent'

function validate(v: Values): Partial<Record<Field, ErrorKey>> {
  const errors: Partial<Record<Field, ErrorKey>> = {}
  if (!v.name.trim()) errors.name = 'formErrorRequired'
  if (!v.email.trim()) errors.email = 'formErrorRequired'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = 'formErrorEmail'
  if (!v.subject) errors.subject = 'formErrorRequired'
  if (!v.message.trim()) errors.message = 'formErrorRequired'
  else if (v.message.trim().length < MIN_MESSAGE) errors.message = 'errorMessageLength'
  if (!v.consent) errors.consent = 'errorConsent'
  return errors
}

export default function ContactPage() {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const data = getSite(lang)

  return (
    <main id="main" data-page="contact" tabIndex={-1}>
      <PageOpening page="contact" eyebrow={UI.officeName[lang]} title={UI.contactUs[lang]} lead={t('contactLead')} />

      <div className={`${CONTAINER} ${SECTION} grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-24`}>
        <ContactForm />
        <ContactDetails />
      </div>

      <section aria-labelledby="faq-title" className={`bg-[var(--v7-surface)] ${SECTION}`}>
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20`}>
          <ChapterHeading id="faq-title" eyebrow={t('faqEyebrow')} title={t('faqTitle')} className="mb-0!" />
          <Accordion
            defaultOpen={['what']}
            items={[
              {
                key: 'what',
                title: t('faqWhat'),
                content: (
                  <div className="v7-body space-y-3">
                    <p>{data.about.intro[0]}</p>
                    <p>{data.about.launched}</p>
                  </div>
                ),
              },
              {
                key: 'join',
                title: t('faqJoin'),
                content: (
                  <div className="v7-body space-y-4">
                    <p>{t('faqJoinAnswer')}</p>
                    <ExternalLink href={REGISTER_URL} className="aegov-btn btn-sm">
                      {data.hero.cta.label}
                    </ExternalLink>
                  </div>
                ),
              },
              {
                key: 'stages',
                title: t('faqStages'),
                content: (
                  <ol className="v7-body list-decimal space-y-1 ps-6 marker:text-primary-700">
                    {data.about.workflow.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                ),
              },
              {
                key: 'areas',
                title: t('faqAreas'),
                content: (
                  <div className="v7-body space-y-3">
                    <ul className="grid gap-1 sm:grid-cols-2">
                      {data.areas.map((a) => (
                        <li key={a.slug}>
                          <Link to={`${href('areas')}#${a.slug}`} className="v7-link-plain underline decoration-[var(--egeep-gold)] underline-offset-4">
                            {a.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>
    </main>
  )
}

function ContactForm() {
  const id = useId()
  const lang = useLang()
  const t = useT(COPY)
  const data = getSite(lang)
  const subjects = data.contactForm?.subjects ?? []
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, ErrorKey>>>({})
  const [sent, setSent] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const label: Record<Field, string> = {
    name: UI.formName[lang],
    email: UI.formEmail[lang],
    organisation: UI.formOrganisation[lang],
    subject: UI.formSubject[lang],
    message: UI.formMessage[lang],
    consent: t('consentShort'),
  }
  const message = (key: ErrorKey) => (key === 'formErrorRequired' || key === 'formErrorEmail' ? UI[key][lang] : t(key))

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
      setSent(false)
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    setSent(true)
    setValues(EMPTY)
    requestAnimationFrame(() => successRef.current?.focus())
  }

  const errorList = (Object.keys(errors) as Field[]).filter((f) => errors[f])

  const control = (field: Field) => ({
    id: fieldId(field),
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? errorId(field) : undefined,
  })

  const error = (field: Field) => {
    const key = errors[field]
    return (
      key && (
        <p id={errorId(field)} className="error-message">
          {message(key)}
        </p>
      )
    )
  }

  const required = (
    <span className="text-[var(--v7-muted)]">
      {' '}
      ({UI.formRequired[lang]})
    </span>
  )

  return (
    <section aria-labelledby={`${id}-title`}>
      <ChapterHeading id={`${id}-title`} eyebrow={t('writeToUs')} title={t('sendMessage')} intro={t('requiredNote')} className="mb-10!" />

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="aegov-alert alert-error mb-10">
          <div className="alert-icon">
            <WarningCircle aria-hidden="true" weight="fill" />
          </div>
          <div className="alert-content">
            <h3 className="alert-title text-lg">{UI.formErrorSummary[lang]}</h3>
            <ul className="mt-2 list-disc space-y-1 ps-5 text-lg">
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
                    {label[f]}: {message(errors[f]!)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div aria-live="polite">
        {sent && (
          <div ref={successRef} tabIndex={-1} className="aegov-alert alert-success mb-10">
            <div className="alert-icon">
              <CheckCircle aria-hidden="true" weight="fill" />
            </div>
            <div className="alert-content">
              <p className="alert-title text-lg">{UI.formSuccess[lang]}</p>
            </div>
          </div>
        )}
      </div>

      <form noValidate onSubmit={onSubmit} className="v7-form space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className={`aegov-form-control ${errors.name ? 'control-error' : ''}`}>
            <label htmlFor={fieldId('name')}>
              {label.name}
              {required}
            </label>
            <div className="form-control-input">
              <input type="text" autoComplete="name" required value={values.name} onChange={(e) => set('name', e.target.value)} {...control('name')} />
            </div>
            {error('name')}
          </div>
          <div className={`aegov-form-control ${errors.email ? 'control-error' : ''}`}>
            <label htmlFor={fieldId('email')}>
              {label.email}
              {required}
            </label>
            <div className="form-control-input">
              <input
                type="email"
                dir="ltr"
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

        <div className="grid gap-8 md:grid-cols-2">
          <div className="aegov-form-control">
            <label htmlFor={fieldId('organisation')}>
              {label.organisation}
              <span className="text-[var(--v7-muted)]"> ({UI.formOptional[lang]})</span>
            </label>
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
            <label htmlFor={fieldId('subject')}>
              {label.subject}
              {required}
            </label>
            <div className="form-control-input">
              <select required value={values.subject} onChange={(e) => set('subject', e.target.value)} {...control('subject')}>
                <option value="">{t('chooseSubject')}</option>
                {subjects.map((s) => (
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
          <label htmlFor={fieldId('message')}>
            {label.message}
            {required}
          </label>
          <div className="form-control-input">
            <textarea rows={6} required value={values.message} onChange={(e) => set('message', e.target.value)} {...control('message')} />
          </div>
          {error('message')}
        </div>

        <div className={`aegov-form-control ${errors.consent ? 'control-error' : ''}`}>
          <div className="aegov-check-item items-start! gap-3">
            <input type="checkbox" required checked={values.consent} onChange={(e) => set('consent', e.target.checked)} {...control('consent')} />
            <label htmlFor={fieldId('consent')} className="mb-0!">
              {t('consentLabel')}
              {required}
            </label>
          </div>
          {error('consent')}
        </div>

        <button type="submit" className="aegov-btn btn-lg">
          {UI.formSubmit[lang]}
        </button>
      </form>
    </section>
  )
}

function ContactDetails() {
  const lang = useLang()
  const t = useT(COPY)
  const { contact, hero } = getSite(lang)
  return (
    <aside aria-labelledby="v7-contact-details" className="space-y-12 lg:pt-4">
      <div>
        <h2 id="v7-contact-details" className="v7-eyebrow mb-6">
          {t('contactDetails')}
        </h2>
        <dl className="divide-y divide-[var(--v7-hairline)] border-y border-[var(--egeep-gold)]">
          <div className="flex gap-4 py-5">
            <MapPin aria-hidden="true" weight="thin" className="size-8 shrink-0 text-primary-700" />
            <div>
              <dt className="text-base text-[var(--v7-muted)]">{UI.address[lang]}</dt>
              <dd className="text-xl text-[var(--egeep-charcoal)]">
                {contact.office}
                {lang === 'ar' ? '، ' : ', '}
                {contact.address}
              </dd>
            </div>
          </div>
          <div className="flex gap-4 py-5">
            <Phone aria-hidden="true" weight="thin" className="size-8 shrink-0 text-primary-700" />
            <div>
              <dt className="text-base text-[var(--v7-muted)]">{UI.phone[lang]}</dt>
              <dd className="text-xl">
                <a href={PHONE_HREF} className="v7-link-plain">
                  <bdi dir="ltr">{contact.phone}</bdi>
                </a>
              </dd>
            </div>
          </div>
          <div className="flex gap-4 py-5">
            <EnvelopeSimple aria-hidden="true" weight="thin" className="size-8 shrink-0 text-primary-700" />
            <div className="min-w-0">
              <dt className="text-base text-[var(--v7-muted)]">{UI.email[lang]}</dt>
              <dd className="text-xl break-words">
                <a href={EMAIL_HREF} className="v7-link-plain">
                  <bdi dir="ltr">{contact.email}</bdi>
                </a>
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <div>
        <h2 className="v7-eyebrow mb-4">{UI.followUs[lang]}</h2>
        <ul className="flex flex-wrap gap-2">
          {contact.social.map((s) => {
            const Icon = SOCIAL_ICONS[s.platform]
            return (
              <li key={s.platform}>
                <ExternalLink href={s.url} label={s.platform} className="v7-round-btn">
                  {Icon && <Icon aria-hidden="true" className="size-5" />}
                </ExternalLink>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="v7-dark p-8">
        <h2 className="v7-h3 text-[var(--egeep-ivory)]">{t('readyToPartner')}</h2>
        <p className="mt-3 mb-6 text-lg text-[var(--v7-on-dark-muted)]">{t('readyToPartnerLead')}</p>
        <ExternalLink href={REGISTER_URL} className="aegov-btn v7-btn-ivory">
          {hero.cta.label}
          <ArrowUpRight aria-hidden="true" className={`size-5 ${FLIP}`} />
        </ExternalLink>
      </div>
    </aside>
  )
}
