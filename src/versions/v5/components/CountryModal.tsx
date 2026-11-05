import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { countryParagraphs, partnershipPeriod, partnershipStatus, useLinks } from '../lib/content'
import { T } from '../lib/dict'
import { Modal } from './Modal'
import { StatusBadge } from './StatusBadge'

interface CountryModalProps {
  country: Country | undefined
  onClose: () => void
}

/** Partnership details for one country: period, status, description, results and workstreams. */
export function CountryModal({ country, onClose }: CountryModalProps) {
  return (
    <Modal open={country !== undefined} onClose={onClose} labelledBy="v5-country-title">
      {country && <CountryDetails country={country} />}
    </Modal>
  )
}

function CountryDetails({ country }: { country: Country }) {
  const lang = useLang()
  const t = useT(T)
  const { href } = useLinks()
  const paragraphs = countryParagraphs(country)

  return (
    <article className="space-y-8">
      <header className="flex items-center gap-5 pe-10">
        <Flag iso={country.iso} alt="" className="h-12 w-18 shrink-0 object-cover ring-1 ring-[var(--egeep-grey-light)]" />
        <div>
          <p className="v5-eyebrow mb-1">{t('partnerCountry')}</p>
          <h2 id="v5-country-title" className="text-4xl text-[var(--egeep-gold)]">
            {country.name}
          </h2>
        </div>
      </header>
      <div className="v5-hairline" aria-hidden="true" />

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        <div className="flex flex-col-reverse justify-end gap-1">
          <dt className="text-base text-[var(--v5-muted)]">{UI.partnershipPeriod[lang]}</dt>
          <dd className="text-2xl text-[var(--egeep-charcoal)]">{partnershipPeriod(country)}</dd>
        </div>
        <div className="flex flex-col-reverse justify-end gap-1">
          <dt className="text-base text-[var(--v5-muted)]">{t('status')}</dt>
          <dd>
            <StatusBadge status={partnershipStatus(country)} />
          </dd>
        </div>
        {country.workstreams && (
          <div className="flex flex-col-reverse justify-end gap-1">
            <dt className="text-base text-[var(--v5-muted)]">{UI.workstreams[lang]}</dt>
            <dd className="text-2xl text-[var(--egeep-charcoal)]">{formatNumber(country.workstreams.length, lang)}</dd>
          </div>
        )}
      </dl>

      {paragraphs.length > 0 && (
        <div className="space-y-4 text-[var(--egeep-charcoal)]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {country.stats && country.stats.length > 0 && (
        <section aria-labelledby="v5-country-results">
          <h3 id="v5-country-results" className="mb-4 text-2xl text-[var(--egeep-gold)]">
            {t('recordedResults')}
          </h3>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {country.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end gap-1 bg-[var(--egeep-ivory)] p-4">
                <dt className="text-base text-[var(--egeep-charcoal)]">{s.label}</dt>
                <dd className="text-3xl leading-none text-[var(--egeep-gold)]">
                  <bdi>{s.value}</bdi>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {country.workstreams && (
        <section aria-labelledby="v5-country-workstreams">
          <h3 id="v5-country-workstreams" className="mb-4 text-2xl text-[var(--egeep-gold)]">
            {t('areasInPartnership')}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {country.workstreams.map((w) => (
              <li key={w} className="aegov-badge whitespace-normal! border border-[var(--egeep-grey-light)]">
                {w}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[var(--egeep-grey-light)] pt-6">
        <Link to={href('contact')} className="aegov-btn btn-sm">
          {t('askAboutPartnership')}
        </Link>
        <Link to={href('activities')} className="aegov-link">
          {t('seePartnershipActivity')}
          <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
        </Link>
      </footer>
    </article>
  )
}
