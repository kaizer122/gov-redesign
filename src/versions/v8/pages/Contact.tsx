import { useEffect, useId, useRef, useState, type ComponentType, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, EnvelopeSimple, MapPin, Phone, WarningCircle, X, type IconProps } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { useLang, useT, type Bilingual, type Lang } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { Accordion } from '../components/Accordion'
import { PageHeader } from '../components/Blocks'
import { ExternalLink } from '../components/ExternalLink'
import { EMAIL_HREF, PHONE_HREF, REGISTER_URL, fill, useSite } from '../lib/content'
import { useLinks } from '../lib/hooks'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

const CT = {
  title: { en: 'Contact us', ar: 'تواصل معنا' },
  lead: {
    en: 'Questions about partnerships, training or the areas of cooperation? Contact the {office} by phone, email or the form below.',
    ar: 'هل لديك أسئلة عن الشراكات أو التدريب أو مجالات التعاون؟ تواصل مع {office} عبر الهاتف أو البريد الإلكتروني أو النموذج أدناه.',
  },
  formTitle: { en: 'Send us a message', ar: 'أرسل إلينا رسالة' },
  requiredNote: { en: 'Fields marked with * are required.', ar: 'الحقول المميزة بعلامة * مطلوبة.' },
  chooseSubject: { en: 'Choose a reason', ar: 'اختر سبب التواصل' },
  errorMessageLength: { en: 'Enter a message of at least {n} characters.', ar: 'أدخل رسالة لا تقل عن {n} حرفًا.' },
  consent: {
    en: 'I agree that the {office} may contact me about this request.',
    ar: 'أوافق على أن يتواصل معي {office} بخصوص هذا الطلب.',
  },
  consentLabel: { en: 'Consent', ar: 'الموافقة' },
  errorConsent: {
    en: 'Confirm that the office may contact you about this request.',
    ar: 'أكّد موافقتك على أن يتواصل معك المكتب بخصوص هذا الطلب.',
  },
  errorTitle: { en: 'There is a problem with your message', ar: 'توجد مشكلة في رسالتك' },
  error: { en: 'Error:', ar: 'خطأ:' },
  sentTitle: { en: 'Thank you, {name}. Your message has been submitted.', ar: 'شكرًا لك يا {name}، تم إرسال رسالتك.' },
  urgent: { en: 'For urgent matters, call or email the office:', ar: 'للأمور العاجلة، اتصل بالمكتب أو راسله عبر البريد الإلكتروني:' },
  toastTitle: { en: 'Message submitted', ar: 'تم إرسال الرسالة' },
  dismiss: { en: 'Dismiss notification', ar: 'إغلاق الإشعار' },
  details: { en: 'Contact details', ar: 'بيانات التواصل' },
  office: { en: 'Office', ar: 'المكتب' },
  follow: { en: 'Follow the programme', ar: 'تابع البرنامج' },
  ready: { en: 'Ready to partner with the UAE?', ar: 'هل أنتم مستعدون للشراكة مع دولة الإمارات؟' },
  readyBody: {
    en: 'Register your government’s interest on the participation platform.',
    ar: 'سجّلوا اهتمام حكومتكم عبر منصة المشاركة.',
  },
  faqTitle: { en: 'Frequently asked questions', ar: 'الأسئلة الشائعة' },
  faqIntro: { en: 'Quick answers drawn from the programme’s published information.', ar: 'إجابات سريعة مستمدة من المعلومات المنشورة عن البرنامج.' },
  qWhat: { en: 'What is the programme?', ar: 'ما هو البرنامج؟' },
  qJoin: { en: 'How can my government take part?', ar: 'كيف يمكن لحكومتي المشاركة؟' },
  aJoin: {
    en: 'Register on the programme’s participation platform, or contact the office using the details on this page.',
    ar: 'سجّلوا عبر منصة المشاركة في البرنامج، أو تواصلوا مع المكتب باستخدام البيانات الواردة في هذه الصفحة.',
  },
  qStages: { en: 'What happens once a partnership is agreed?', ar: 'ماذا يحدث بعد الاتفاق على الشراكة؟' },
  qAreas: { en: 'Which areas can we cooperate on?', ar: 'ما المجالات التي يمكننا التعاون فيها؟' },
  aAreasLink: { en: 'Explore the areas of cooperation', ar: 'استكشف مجالات التعاون' },
  qFormats: { en: 'How is knowledge shared with partner governments?', ar: 'كيف تُنقل المعرفة إلى الحكومات الشريكة؟' },
} satisfies Record<string, Bilingual>

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

function validate(v: Values, lang: Lang): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (!v.name.trim()) errors.name = UI.formErrorRequired[lang]
  if (!v.email.trim()) errors.email = UI.formErrorRequired[lang]
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = UI.formErrorEmail[lang]
  if (!v.subject) errors.subject = UI.formErrorRequired[lang]
  if (v.message.trim().length < MIN_MESSAGE) errors.message = fill(CT.errorMessageLength[lang], { n: MIN_MESSAGE })
  if (!v.consent) errors.consent = CT.errorConsent[lang]
  return errors
}

export default function ContactPage() {
  const ct = useT(CT)
  const local = useSite()
  const { href } = useLinks()

  return (
    <main id="main" data-page="contact" tabIndex={-1}>
      <PageHeader page="contact" title={ct('title')} lead={fill(ct('lead'), { office: local.contact.office })} />

      <div className={`${CONTAINER} ${SECTION} grid gap-4 lg:grid-cols-12`}>
        <ContactForm />
        <ContactDetails />
      </div>

      <section aria-labelledby="faq-title" className="border-t border-[var(--v8-line)] bg-[#fff]">
        <div className={`${CONTAINER} ${SECTION} grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]`}>
          <div>
            <h2 id="faq-title" className="text-4xl md:text-5xl">
              {ct('faqTitle')}
            </h2>
            <p className="v8-muted mt-3 text-lg">{ct('faqIntro')}</p>
          </div>
          <div className="v8-tile px-2 md:px-5">
            <Accordion
              defaultOpen={['what']}
              items={[
                {
                  key: 'what',
                  title: <span className="text-xl">{ct('qWhat')}</span>,
                  content: (
                    <div className="space-y-3">
                      <p>{local.about.intro[0]}</p>
                      <p>{local.about.launched}</p>
                    </div>
                  ),
                },
                {
                  key: 'join',
                  title: <span className="text-xl">{ct('qJoin')}</span>,
                  content: (
                    <div className="space-y-4">
                      <p>{ct('aJoin')}</p>
                      <ExternalLink href={REGISTER_URL} className="aegov-btn btn-sm">
                        {local.hero.cta.label}
                      </ExternalLink>
                    </div>
                  ),
                },
                {
                  key: 'stages',
                  title: <span className="text-xl">{ct('qStages')}</span>,
                  content: (
                    <ol className="list-decimal space-y-1 ps-6 marker:text-primary-700">
                      {local.about.workflow.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  ),
                },
                {
                  key: 'areas',
                  title: <span className="text-xl">{ct('qAreas')}</span>,
                  content: (
                    <div className="space-y-3">
                      <ul className="grid gap-1 sm:grid-cols-2">
                        {local.areas.map((a) => (
                          <li key={a.slug}>{a.title}</li>
                        ))}
                      </ul>
                      <Link to={href('areas')} className="aegov-link">
                        {ct('aAreasLink')}
                      </Link>
                    </div>
                  ),
                },
                {
                  key: 'formats',
                  title: <span className="text-xl">{ct('qFormats')}</span>,
                  content: (
                    <div className="space-y-3">
                      <p>{local.about.methodology}</p>
                      <ul className="list-disc space-y-1 ps-6 marker:text-primary-600">
                        {local.about.tools.map((tool) => (
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
  const lang = useLang()
  const ct = useT(CT)
  const local = useSite()
  const id = useId()
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [sent, setSent] = useState<string | null>(null)
  const [toast, setToast] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const subjects = local.contactForm?.subjects ?? []

  const label: Record<Field, string> = {
    name: UI.formName[lang],
    email: UI.formEmail[lang],
    organisation: UI.formOrganisation[lang],
    subject: UI.formSubject[lang],
    message: UI.formMessage[lang],
    consent: ct('consentLabel'),
  }

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
    const found = validate(values, lang)
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
        <span className="sr-only">{ct('error')} </span>
        {errors[field]}
      </p>
    )

  const wrap = (field: Field) => `aegov-form-control ${errors[field] ? 'control-error' : ''}`

  return (
    <section aria-labelledby={`${id}-title`} className="v8-tile p-6 md:p-10 lg:col-span-7">
      <h2 id={`${id}-title`} className="mb-2 text-4xl">
        {ct('formTitle')}
      </h2>
      <p className="v8-muted mb-8">{ct('requiredNote')}</p>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="aegov-alert alert-error mb-8">
          <div className="alert-icon">
            <WarningCircle aria-hidden="true" weight="fill" />
          </div>
          <div className="alert-content">
            <h3 className="alert-title text-lg">{ct('errorTitle')}</h3>
            <p className="mt-1">{UI.formErrorSummary[lang]}</p>
            <ul className="mt-3 space-y-2">
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
        <div ref={successRef} tabIndex={-1} role="status" className="aegov-alert alert-success mb-8">
          <div className="alert-icon">
            <CheckCircle aria-hidden="true" weight="fill" />
          </div>
          <div className="alert-content">
            <h3 className="alert-title text-lg">{fill(ct('sentTitle'), { name: sent })}</h3>
            <p>{UI.formSuccess[lang]}</p>
            <p className="mt-1">
              {ct('urgent')}{' '}
              <a href={PHONE_HREF}>
                <bdi dir="ltr">{site.contact.phone}</bdi>
              </a>{' '}
              ·{' '}
              <a href={EMAIL_HREF}>
                <bdi dir="ltr">{site.contact.email}</bdi>
              </a>
            </p>
          </div>
        </div>
      )}

      <form noValidate onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className={wrap('name')}>
            <label htmlFor={fieldId('name')}>{label.name} *</label>
            <div className="form-control-input">
              <input type="text" autoComplete="name" required value={values.name} onChange={(e) => set('name', e.target.value)} {...control('name')} />
            </div>
            {error('name')}
          </div>
          <div className={wrap('email')}>
            <label htmlFor={fieldId('email')}>{label.email} *</label>
            <div className="form-control-input">
              <input
                type="email"
                autoComplete="email"
                dir="ltr"
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
            <label htmlFor={fieldId('organisation')}>
              {label.organisation} <span className="v8-muted">({UI.formOptional[lang]})</span>
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
          <div className={wrap('subject')}>
            <label htmlFor={fieldId('subject')}>{label.subject} *</label>
            <div className="form-control-input">
              <select required value={values.subject} onChange={(e) => set('subject', e.target.value)} {...control('subject')}>
                <option value="">{ct('chooseSubject')}</option>
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

        <div className={wrap('message')}>
          <label htmlFor={fieldId('message')}>{label.message} *</label>
          <div className="form-control-input">
            <textarea rows={6} required value={values.message} onChange={(e) => set('message', e.target.value)} {...control('message')} />
          </div>
          {error('message')}
        </div>

        <div className={wrap('consent')}>
          <div className="aegov-check-item items-start! gap-3">
            <input type="checkbox" required checked={values.consent} onChange={(e) => set('consent', e.target.checked)} {...control('consent')} />
            <label htmlFor={fieldId('consent')} className="mb-0! text-base!">
              {fill(ct('consent'), { office: local.contact.office })} *
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
              <div className="toast-icon text-[var(--egeep-green)]">
                <CheckCircle aria-hidden="true" weight="fill" />
              </div>
              <div className="toast-body">
                <span className="mb-1 block text-lg">{ct('toastTitle')}</span>
                <span className="v8-muted block">{UI.formSuccess[lang]}</span>
              </div>
              <button type="button" className="toast-dismiss" onClick={() => setToast(false)}>
                <X aria-hidden="true" />
                <span className="sr-only">{ct('dismiss')}</span>
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
  const ct = useT(CT)
  const local = useSite()
  const items: ContactItem[] = [
    { icon: MapPin, label: ct('office'), value: `${local.contact.office}, ${local.contact.address}` },
    { icon: Phone, label: UI.phone[lang], value: site.contact.phone, href: PHONE_HREF, ltr: true },
    { icon: EnvelopeSimple, label: UI.email[lang], value: site.contact.email, href: EMAIL_HREF, ltr: true },
  ]

  return (
    <div className="flex flex-col gap-4 lg:col-span-5">
      <section aria-labelledby="v8-contact-details" className="v8-tile p-6">
        <h2 id="v8-contact-details" className="mb-5 text-3xl">
          {ct('details')}
        </h2>
        <dl className="space-y-5">
          {items.map(({ icon: Icon, label, value, href: link, ltr }) => (
            <div key={label} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-primary-200 bg-primary-50 text-primary-700">
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <div className="min-w-0">
                <dt className="v8-muted text-sm">{label}</dt>
                <dd className="text-lg break-words">
                  {link ? (
                    <a href={link} className="hover:text-primary-800">
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
      </section>

      <section aria-labelledby="v8-contact-follow" className="v8-tile p-6">
        <h2 id="v8-contact-follow" className="mb-4 text-3xl">
          {ct('follow')}
        </h2>
        <ul className="flex flex-wrap gap-2">
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
      </section>

      <section aria-labelledby="v8-contact-ready" className="v8-dark rounded-[var(--v8-radius)] bg-[var(--egeep-charcoal)] p-6 text-[var(--egeep-ivory)]">
        <h2 id="v8-contact-ready" className="text-3xl text-[#fff]">
          {ct('ready')}
        </h2>
        <p className="mt-2 mb-5 text-[#d9d6cd]">{ct('readyBody')}</p>
        <ExternalLink href={REGISTER_URL} className="aegov-btn">
          {local.hero.cta.label}
        </ExternalLink>
      </section>
    </div>
  )
}
