import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRightIcon, EnvelopeSimpleIcon, MapPinIcon, PhoneIcon } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import { Accordion, type AccordionItem } from '../components/Accordion'
import { ContactForm } from '../components/ContactForm'
import { Page, PageHeader, SectionHeading } from '../components/Page'
import { href } from '../lib/content'

const SUBJECTS = site.contactForm?.subjects ?? []
const subjectLabel = (fallback: string, match: string) => SUBJECTS.find((s) => s.includes(match)) ?? fallback

const FAQ: AccordionItem[] = [
  {
    id: 'express-interest',
    title: 'How can my government express interest in a partnership?',
    content: (
      <>
        <p>
          Use the form on this page and choose the subject “{subjectLabel('Government Partnership', 'Partnership')}”.
          Tell us which ministry or entity you represent and the priorities you would like to work on.
        </p>
        <p>
          You can also register on the{' '}
          <a href={site.hero.cta.url} target="_blank" rel="noopener noreferrer">
            participation platform<span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'next-steps',
    title: 'What happens after we get in touch?',
    content: (
      <>
        <p>The programme team reviews your message and replies by email. If you go ahead, every partnership follows the same steps:</p>
        <ol className="list-decimal space-y-1 ps-6">
          {site.about.workflow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>
          <Link to={href('about')}>Read more about how a partnership works</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'which-areas',
    title: 'Which areas can we cooperate on?',
    content: (
      <p>
        There are {site.areas.length} areas of cooperation, from government services and excellence to programming and
        entrepreneurship. <Link to={href('areas')}>Compare the areas</Link> and mention the ones that interest you in your
        message. If you are not sure yet, describe your goals and we will suggest where to start.
      </p>
    ),
  },
  {
    id: 'trainer',
    title: 'How do I become a trainer or expert in the programme?',
    content: (
      <p>
        Choose the subject “{subjectLabel('Become a Trainer in GEEP', 'Trainer')}” and summarise your field of
        expertise, your experience and the languages you work in. The team will contact you if there is a match.
      </p>
    ),
  },
  {
    id: 'timeline',
    title: 'How long does a partnership last?',
    content: (
      <p>
        Partnership periods vary. You can see the signing and completion years of every partnership on the{' '}
        <Link to={href('countries')}>participating countries</Link> page and in the{' '}
        <Link to={href('activities')}>partnership tracker</Link>.
      </p>
    ),
  },
  {
    id: 'media',
    title: 'I am a journalist or researcher. Who should I contact?',
    content: (
      <p>
        Choose the subject “{subjectLabel('Inquiry', 'Inquiry')}”, or email{' '}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>. Key figures and photos are in the{' '}
        <Link to={href('media')}>media centre</Link>.
      </p>
    ),
  },
]

export function ContactPage() {
  const { search } = useLocation()
  return (
    <Page pageKey="contact">
      <PageHeader
        crumb="Contact us"
        eyebrow="We are here to help"
        title="Contact us"
        intro={
          <p>
            Send a message to the {site.contact.office}. Most questions are answered in the frequently asked questions
            below.
          </p>
        }
      />

      <section aria-label="Contact form and details" className="container py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="rounded-3xl border border-aeblack-100 bg-whitely-50 p-5 shadow-sm md:p-8">
            <ContactForm key={search} />
          </div>
          <aside aria-labelledby="v4-contact-details" className="space-y-6">
            <div className="aegov-card card-bordered border-primary-100! bg-primary-50">
              <h2 id="v4-contact-details" className="text-xl font-bold text-aeblack-950">
                {site.contact.office}
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPinIcon aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-primary-600" />
                  <span>
                    <span className="block text-sm text-aeblack-600">Address</span>
                    <span className="font-semibold text-aeblack-900">{site.contact.address}</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <PhoneIcon aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-primary-600" />
                  <span>
                    <span className="block text-sm text-aeblack-600">Phone</span>
                    <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="font-semibold text-primary-700">
                      {site.contact.phone}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <EnvelopeSimpleIcon aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-primary-600" />
                  <span>
                    <span className="block text-sm text-aeblack-600">Email</span>
                    <a href={`mailto:${site.contact.email}`} className="break-all font-semibold text-primary-700">
                      {site.contact.email}
                    </a>
                  </span>
                </li>
              </ul>
            </div>
            <div className="aegov-card card-bordered border-aeblack-100!">
              <h2 className="text-xl font-bold text-aeblack-950">Prefer to register directly?</h2>
              <p className="text-aeblack-600">
                You can also sign up on the programme’s participation platform.
              </p>
              <a href={site.hero.cta.url} target="_blank" rel="noopener noreferrer" className="aegov-btn btn-outline">
                {site.hero.cta.label}
                <ArrowUpRightIcon aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="v4-contact-faq" className="border-t border-aeblack-100 bg-aeblack-50/50">
        <div className="container py-14 md:py-20">
          <SectionHeading
            id="v4-contact-faq"
            title="Frequently asked questions"
            intro="Practical guidance on getting started with the programme."
          />
          <div className="rounded-3xl border border-aeblack-100 bg-whitely-50 px-2 md:px-4">
            <Accordion idPrefix="v4-faq" items={FAQ} defaultOpen={['express-interest']} />
          </div>
        </div>
      </section>
    </Page>
  )
}
