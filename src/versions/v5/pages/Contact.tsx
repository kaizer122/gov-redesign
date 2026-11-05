import { useEffect, useId, useRef, useState, type ComponentType, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Clock, EnvelopeSimple, MapPin, Phone, WarningCircle, X, type IconProps } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { Accordion } from '../components/Accordion'
import { ExternalLink } from '../components/ExternalLink'
import { PageHeader } from '../components/PageHeader'
import { EMAIL_HREF, PHONE_HREF, REGISTER_URL, useLinks } from '../lib/content'
import { F, T } from '../lib/dict'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

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

export default function ContactPage() {
  const lang = useLang()
  const t = useT(T)
  const { href } = useLinks()
  const site = getSite(lang)

  return (
    <main id="main" data-page="contact" tabIndex={-1}>
      <PageHeader page="contact" title={UI.contactUs[lang]} lead={F.contactLead[lang](site.contact.office)} />

      <div className={`${CONTAINER} ${SECTION} grid gap-14 pt-4! lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20`}>
        <ContactForm />
        <ContactDetails />
      </div>

      <section aria-labelledby="faq-title" className="bg-[var(--egeep-ivory)]">
        <div className={`${CONTAINER} ${SECTION} grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]`}>
          <div>
            <h2 id="faq-title" className="text-4xl text-[var(--egeep-gold)] md:text-5xl">
              {t('faqTitle')}
            </h2>
            <div className="v5-hairline mt-8 mb-6" aria-hidden="true" />
            <p className="text-lg text-[var(--egeep-charcoal)]">{t('faqIntro')}</p>
          </div>
          <div className="border-t border-[var(--egeep-gold)] bg-[#fff] px-4 md:px-8">
            <Accordion
              defaultOpen={['what']}
              items={[
                {
                  key: 'what',
                  title: t('faqWhat'),
                  content: (
                    <div className="space-y-3">
                      <p>{site.about.intro[0]}</p>
                      <p>{site.about.launched}</p>
                    </div>
                  ),
                },
                {
                  key: 'join',
                  title: t('faqJoin'),
                  content: (
                    <div className="space-y-4">
                      <p>{t('faqJoinAnswer')}</p>
                      <ExternalLink href={REGISTER_URL} className="aegov-btn btn-sm">
                        {site.hero.cta.label}
                      </ExternalLink>
                    </div>
                  ),
                },
                {
                  key: 'stages',
                  title: t('faqStages'),
                  content: (
                    <ol className="list-decimal space-y-1 ps-6 marker:text-[var(--color-primary-700)]">
                      {site.about.workflow.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  ),
                },
                {
                  key: 'areas',
                  title: t('faqAreas'),
                  content: (
                    <div className="space-y-4">
                      <ul className="grid gap-1 sm:grid-cols-2">
                        {site.areas.map((a) => (
                          <li key={a.slug}>{a.title}</li>
                        ))}
                      </ul>
                      <Link to={href('areas')} className="aegov-link">
                        {t('exploreAreas')}
                      </Link>
                    </div>
                  ),
                },
                {
                  key: 'formats',
                  title: t('faqFormats'),
                  content: (
                    <div className="space-y-3">
                      <p>{site.about.methodology}</p>
                      <ul className="list-disc space-y-1 ps-6 marker:text-[var(--egeep-gold)]">
                        {site.about.tools.map((tool) => (
                          <li key={tool}>{tool}</li>
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
  const lang = useLang()
  const t = useT(T)
  const site = getSite(lang)
  const subjects = site.contactForm?.subjects ?? []
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [sent, setSent] = useState(false)
  const [toast, setToast] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(false), 6000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const label: Record<Field, string> = {
    name: UI.formName[lang],
    email: UI.formEmail[lang],
    organisation: UI.formOrganisation[lang],
    subject: UI.formSubject[lang],
    message: UI.formMessage[lang],
    consent: t('consentShort'),
  }

  const validate = (v: Values) => {
    const found: Partial<Record<Field, string>> = {}
    if (!v.name.trim()) found.name = UI.formErrorRequired[lang]
    if (!v.email.trim()) found.email = UI.formErrorRequired[lang]
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) found.email = UI.formErrorEmail[lang]
    if (!v.subject) found.subject = UI.formErrorRequired[lang]
    if (v.message.trim().length < MIN_MESSAGE) found.message = F.minMessage[lang](MIN_MESSAGE)
    if (!v.consent) found.consent = t('consentError')
    return found
  }

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
        {errors[field]}
      </p>
    )

  const required = <span aria-hidden="true"> *</span>

  return (
    <section aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-4xl text-[var(--egeep-gold)] md:text-5xl">
        {t('sendMessage')}
      </h2>
      <div className="v5-hairline mt-8 mb-6" aria-hidden="true" />
      <p className="mb-10 text-lg text-[var(--v5-muted)]">{t('requiredNote')}</p>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="aegov-alert alert-error mb-10">
          <div className="alert-icon">
            <WarningCircle aria-hidden="true" weight="fill" />
          </div>
          <div className="alert-content">
            <h3 className="alert-title text-xl">{UI.formErrorSummary[lang]}</h3>
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
                    {label[f]}: {errors[f]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {sent && (
        <div ref={successRef} tabIndex={-1} role="status" className="aegov-alert alert-success mb-10">
          <div className="alert-icon">
            <CheckCircle aria-hidden="true" weight="fill" />
          </div>
          <div className="alert-content">
            <h3 className="alert-title text-xl">{UI.formSuccess[lang]}</h3>
            <p>
              {t('urgentCall')} <a href={PHONE_HREF}><bdi dir="ltr">{site.contact.phone}</bdi></a> {t('orEmail')}{' '}
              <a href={EMAIL_HREF}><bdi dir="ltr">{site.contact.email}</bdi></a>
            </p>
          </div>
        </div>
      )}

      <form noValidate onSubmit={onSubmit} className="space-y-7">
        <div className="grid gap-7 md:grid-cols-2">
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
                className="rtl:text-end"
                {...control('email')}
              />
            </div>
            {error('email')}
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <div className="aegov-form-control">
            <label htmlFor={fieldId('organisation')}>
              {label.organisation} <span className="text-[var(--v5-muted)]">({UI.formOptional[lang]})</span>
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
              {F.consent[lang](site.contact.office)}
              {required}
            </label>
          </div>
          {error('consent')}
        </div>

        <button type="submit" className="aegov-btn">
          {UI.formSubmit[lang]}
        </button>
      </form>

      {toast && (
        <div className="fixed end-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm">
          <div className="aegov-toast relative shadow-lg" role="status">
            <div className="flex items-start">
              <div className="toast-icon text-[var(--color-primary-700)]">
                <CheckCircle aria-hidden="true" weight="fill" />
              </div>
              <div className="toast-body">
                <span className="mb-1 block text-xl text-[var(--egeep-charcoal)]">{t('messageSubmitted')}</span>
                <span className="block text-base text-[var(--v5-muted)]">{F.thanks[lang](site.contact.office)}</span>
              </div>
              <button type="button" className="toast-dismiss" onClick={() => setToast(false)}>
                <X aria-hidden="true" />
                <span className="sr-only">{UI.close[lang]}</span>
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
  ltr?: boolean
}

function ContactDetails() {
  const lang = useLang()
  const t = useT(T)
  const site = getSite(lang)
  const items: ContactItem[] = [
    { icon: MapPin, label: UI.address[lang], value: [site.contact.office, site.contact.address].join(lang === 'ar' ? '، ' : ', ') },
    { icon: Phone, label: UI.phone[lang], value: site.contact.phone, href: PHONE_HREF, ltr: true },
    { icon: EnvelopeSimple, label: UI.email[lang], value: site.contact.email, href: EMAIL_HREF, ltr: true },
    ...(site.contact.hours ? [{ icon: Clock, label: t('openingHours'), value: site.contact.hours }] : []),
  ]

  return (
    <div className="space-y-8">
      <div className="bg-[var(--egeep-ivory)] p-8">
        <h2 className="text-3xl text-[var(--egeep-gold)]">{t('contactDetails')}</h2>
        <div className="v5-hairline mt-5 mb-6" aria-hidden="true" />
        <dl className="space-y-6">
          {items.map(({ icon: Icon, label, value, href: link, ltr }) => (
            <div key={label} className="flex gap-4">
              <Icon aria-hidden="true" weight="light" className="mt-1 size-7 shrink-0 text-[var(--egeep-gold)]" />
              <div className="min-w-0">
                <dt className="text-base text-[var(--v5-muted)]">{label}</dt>
                <dd className="text-xl break-words text-[var(--egeep-charcoal)]">
                  {link ? (
                    <a href={link} className="text-[var(--egeep-charcoal)] hover:text-[var(--color-primary-800)]">
                      {ltr ? <bdi dir="ltr">{value}</bdi> : value}
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

      <div className="border-t border-[var(--egeep-gold)] pt-6">
        <h2 className="text-3xl text-[var(--egeep-gold)]">{t('followProgramme')}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {site.contact.social.map((s) => {
            const Icon = SOCIAL_ICONS[s.platform]
            return (
              <li key={s.platform}>
                <ExternalLink
                  href={s.url}
                  label={s.platform}
                  className="flex size-12 items-center justify-center border border-[var(--egeep-grey-light)] text-[var(--egeep-charcoal)] hover:border-[var(--egeep-gold)] hover:text-[var(--color-primary-800)]"
                >
                  {Icon && <Icon aria-hidden="true" className="size-6" />}
                </ExternalLink>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="v5-dark bg-[var(--egeep-charcoal)] p-8 text-[#fff]">
        <h2 className="text-3xl text-[#fff]">{t('readyToPartner')}</h2>
        <p className="mt-3 mb-6 text-lg text-[#e7e7e7]">{t('readyToPartnerBody')}</p>
        <ExternalLink href={REGISTER_URL} className="aegov-btn">
          {site.hero.cta.label}
        </ExternalLink>
      </div>
    </div>
  )
}
