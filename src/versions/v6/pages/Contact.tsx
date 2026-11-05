import { useId, useRef, useState, type ComponentType, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Clock, EnvelopeSimple, MapPin, Phone, WarningCircle, type IconProps } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { Accordion } from '../components/Accordion'
import { ExternalLink } from '../components/ExternalLink'
import { PageHero } from '../components/PageHero'
import { EMAIL_HREF, PHONE_HREF, PLATFORM_LABEL, REGISTER_URL, useLinks, useSite } from '../lib/content'
import { SOCIAL_ICONS } from '../lib/icons'
import { CONTAINER, SECTION } from '../lib/ui'

const T = {
  title: { en: 'Contact us', ar: 'تواصل معنا' },
  lead: {
    en: 'Questions about partnerships, training or the areas of cooperation? Contact the Government Experience Exchange Office by phone, email or the form below.',
    ar: 'هل لديك أسئلة عن الشراكات أو التدريب أو مجالات التعاون؟ تواصل مع مكتب التبادل المعرفي الحكومي عبر الهاتف أو البريد الإلكتروني أو النموذج أدناه.',
  },
  formTitle: { en: 'Send us a message', ar: 'أرسل لنا رسالة' },
  requiredNote: { en: 'Fields marked with * are required.', ar: 'الحقول المميزة بعلامة * مطلوبة.' },
  chooseSubject: { en: 'Choose a reason', ar: 'اختر سبب التواصل' },
  messageShort: { en: 'Enter a message of at least 20 characters.', ar: 'اكتب رسالة لا تقل عن 20 حرفًا.' },
  consent: {
    en: 'I agree that the office may contact me about this request.',
    ar: 'أوافق على أن يتواصل معي المكتب بشأن هذا الطلب.',
  },
  consentLabel: { en: 'Consent', ar: 'الموافقة' },
  consentError: { en: 'Confirm that the office may contact you.', ar: 'يرجى تأكيد موافقتك على تواصل المكتب معك.' },
  error: { en: 'Error', ar: 'خطأ' },
  details: { en: 'Contact details', ar: 'بيانات التواصل' },
  office: { en: 'Office', ar: 'المكتب' },
  hours: { en: 'Opening hours', ar: 'ساعات العمل' },
  follow: { en: 'Follow the programme', ar: 'تابع البرنامج' },
  ready: { en: 'Ready to partner with the UAE?', ar: 'هل أنتم مستعدون للشراكة مع دولة الإمارات؟' },
  readyBody: {
    en: "Register your government's interest on the participation platform.",
    ar: 'سجّلوا اهتمام حكومتكم عبر منصة المشاركة.',
  },
  faq: { en: 'Frequently asked questions', ar: 'الأسئلة الشائعة' },
  faqIntro: { en: "Quick answers drawn from the programme's published information.", ar: 'إجابات سريعة مستمدة من المعلومات المنشورة عن البرنامج.' },
  qWhat: { en: 'What is the programme?', ar: 'ما هو البرنامج؟' },
  qJoin: { en: 'How can my government take part?', ar: 'كيف يمكن لحكومتي المشاركة؟' },
  aJoin: {
    en: "Register on the programme's participation platform, or contact the office using the details on this page.",
    ar: 'سجّلوا عبر منصة المشاركة في البرنامج، أو تواصلوا مع المكتب عبر البيانات الواردة في هذه الصفحة.',
  },
  qStages: { en: 'What happens once a partnership is agreed?', ar: 'ماذا يحدث بعد الاتفاق على الشراكة؟' },
  qAreas: { en: 'Which areas can we cooperate on?', ar: 'ما مجالات التعاون المتاحة؟' },
  exploreAreas: { en: 'Explore the areas of cooperation', ar: 'استكشف مجالات التعاون' },
  qFormats: { en: 'How is knowledge shared with partner governments?', ar: 'كيف تُنقل المعرفة إلى الحكومات الشريكة؟' },
}

interface Values {
  name: string
  email: string
  organisation: string
  subject: string
  message: string
  consent: boolean
}

type Field = keyof Values

/** Why a field failed validation; mapped to a localized message at render time. */
type FieldErrors = Partial<Record<Field, 'required' | 'email' | 'short' | 'consent'>>

const EMPTY: Values = { name: '', email: '', organisation: '', subject: '', message: '', consent: false }
const MIN_MESSAGE = 20

export default function ContactPage() {
  const lang = useLang()
  const t = useT(T)
  const links = useLinks()
  const data = useSite()

  return (
    <main id="main" data-page="contact" tabIndex={-1}>
      <PageHero page="contact" title={t('title')} lead={t('lead')} />

      <div className={`${CONTAINER} ${SECTION} grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20`}>
        <ContactForm />
        <ContactDetails />
      </div>

      <section aria-labelledby="faq-title" className="v6-ivory">
        <div className={`${CONTAINER} ${SECTION} grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]`}>
          <div>
            <h2 id="faq-title" className="v6-gold-heading text-4xl md:text-5xl">
              {t('faq')}
            </h2>
            <p className="v6-muted mt-4 text-lg">{t('faqIntro')}</p>
          </div>
          <div className="rounded-3xl bg-whitely-50 px-5 md:px-8">
            <Accordion
              defaultOpen={['what']}
              items={[
                {
                  key: 'what',
                  title: t('qWhat'),
                  content: (
                    <div className="space-y-3 text-lg">
                      <p>{data.about.intro[0]}</p>
                      <p>{data.about.launched}</p>
                    </div>
                  ),
                },
                {
                  key: 'join',
                  title: t('qJoin'),
                  content: (
                    <div className="space-y-4 text-lg">
                      <p>{t('aJoin')}</p>
                      <ExternalLink href={REGISTER_URL} className="aegov-btn btn-sm">
                        {UI.participateNow[lang]}
                      </ExternalLink>
                    </div>
                  ),
                },
                {
                  key: 'stages',
                  title: t('qStages'),
                  content: (
                    <ol className="list-decimal space-y-1 ps-6 text-lg marker:text-primary-700">
                      {data.about.workflow.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  ),
                },
                {
                  key: 'areas',
                  title: t('qAreas'),
                  content: (
                    <div className="space-y-3 text-lg">
                      <ul className="grid gap-1 sm:grid-cols-2">
                        {data.areas.map((a) => (
                          <li key={a.slug}>
                            <Link to={links.area(a.slug)}>{a.title}</Link>
                          </li>
                        ))}
                      </ul>
                      <Link to={links.href('areas')} className="aegov-link">
                        {t('exploreAreas')}
                      </Link>
                    </div>
                  ),
                },
                {
                  key: 'formats',
                  title: t('qFormats'),
                  content: (
                    <div className="space-y-3 text-lg">
                      <p>{data.about.methodology}</p>
                      <ul className="list-disc space-y-1 ps-6 marker:text-primary-600">
                        {data.about.tools.map((tool) => (
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

function validate(v: Values): FieldErrors {
  const errors: FieldErrors = {}
  if (!v.name.trim()) errors.name = 'required'
  if (!v.email.trim()) errors.email = 'required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = 'email'
  if (!v.subject) errors.subject = 'required'
  if (!v.message.trim()) errors.message = 'required'
  else if (v.message.trim().length < MIN_MESSAGE) errors.message = 'short'
  if (!v.consent) errors.consent = 'consent'
  return errors
}

function ContactForm() {
  const id = useId()
  const lang = useLang()
  const t = useT(T)
  const subjects = useSite().contactForm?.subjects ?? []
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sent, setSent] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const label: Record<Field, string> = {
    name: UI.formName[lang],
    email: UI.formEmail[lang],
    organisation: UI.formOrganisation[lang],
    subject: UI.formSubject[lang],
    message: UI.formMessage[lang],
    consent: t('consentLabel'),
  }
  const message = (f: Field): string => {
    const e = errors[f]
    if (e === 'email') return UI.formErrorEmail[lang]
    if (e === 'short') return t('messageShort')
    if (e === 'consent') return t('consentError')
    return UI.formErrorRequired[lang]
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
      <p id={errorId(field)} className="error-message mt-2 text-base">
        <span className="sr-only">{t('error')}: </span>
        {message(field)}
      </p>
    )

  const required = (
    <span aria-hidden="true" className="text-primary-700">
      {' '}
      *
    </span>
  )

  return (
    <section aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="v6-gold-heading mb-3 text-4xl md:text-5xl">
        {t('formTitle')}
      </h2>
      <p className="v6-muted mb-10 text-lg">{t('requiredNote')}</p>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="aegov-alert alert-error mb-8">
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
                    {label[f]}: {message(f)}
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
            <p className="text-lg">{UI.formSuccess[lang]}</p>
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
                {...control('email')}
              />
            </div>
            {error('email')}
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <div className="aegov-form-control">
            <label htmlFor={fieldId('organisation')}>
              {label.organisation} <span className="v6-muted">({UI.formOptional[lang]})</span>
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
              {t('consent')}
              {required}
            </label>
          </div>
          {error('consent')}
        </div>

        <button type="submit" className="aegov-btn">
          {UI.formSubmit[lang]}
        </button>
      </form>
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
  const data = useSite()
  const items: ContactItem[] = [
    { icon: MapPin, label: t('office'), value: `${data.contact.office}, ${data.contact.address}` },
    { icon: Phone, label: UI.phone[lang], value: site.contact.phone, href: PHONE_HREF, ltr: true },
    { icon: EnvelopeSimple, label: UI.email[lang], value: site.contact.email, href: EMAIL_HREF, ltr: true },
    ...(data.contact.hours ? [{ icon: Clock, label: t('hours'), value: data.contact.hours }] : []),
  ]

  return (
    <div className="space-y-6">
      <div className="aegov-card card-bordered p-7">
        <h2 className="mb-6 text-3xl">{t('details')}</h2>
        <dl className="space-y-6">
          {items.map(({ icon: Icon, label, value, href, ltr }) => (
            <div key={label} className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-primary-600/50 text-primary-700">
                <Icon aria-hidden="true" weight="light" className="size-6" />
              </span>
              <div className="min-w-0">
                <dt className="v6-muted text-base">{label}</dt>
                <dd className="text-xl break-words">
                  {href ? (
                    <a href={href} dir={ltr ? 'ltr' : undefined} className="text-[color:var(--egeep-charcoal)] hover:text-primary-800">
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

      <div className="aegov-card card-bordered p-7">
        <h2 className="mb-4 text-3xl">{t('follow')}</h2>
        <ul className="flex flex-wrap gap-3">
          {site.contact.social.map((s) => {
            const Icon = SOCIAL_ICONS[s.platform]
            return (
              <li key={s.platform}>
                <ExternalLink
                  href={s.url}
                  label={PLATFORM_LABEL[s.platform]?.[lang] ?? s.platform}
                  className="grid size-12 place-items-center rounded-full border border-primary-600/50 text-primary-800 hover:bg-primary-50"
                >
                  {Icon && <Icon aria-hidden="true" className="size-6" />}
                </ExternalLink>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="v6-dark rounded-3xl p-7">
        <h2 className="text-3xl text-[color:var(--egeep-ivory)]">{t('ready')}</h2>
        <p className="mt-2 mb-6 text-lg text-[color:var(--v6-on-dark-muted)]">{t('readyBody')}</p>
        <ExternalLink href={REGISTER_URL} className="aegov-btn">
          {UI.participateNow[lang]}
        </ExternalLink>
      </div>
    </div>
  )
}
