import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import {
  areaSlugsForCountry,
  countryParagraphs,
  partnershipPeriod,
  enCountry,
  partnershipStatus,
  regionLabel,
  regionOf,
  useLinks,
  useSite,
} from '../lib/content'
import { S } from '../lib/strings'
import { Modal } from './Modal'

const T = {
  region: { en: 'Region', ar: 'المنطقة' },
  workstreamsListed: { en: 'Workstreams listed in the partnership', ar: 'مسارات العمل المدرجة في الشراكة' },
  activity: { en: 'See partnership activity', ar: 'عرض أنشطة الشراكات' },
}

interface CountryPanelProps {
  country: Country | undefined
  onClose: () => void
}

/** Partnership details for one country in a side drawer (deep-linked with ?country=). */
export function CountryPanel({ country, onClose }: CountryPanelProps) {
  return (
    <Modal open={country !== undefined} onClose={onClose} labelledBy="v6-country-title" placement="side" width="max-w-2xl">
      {country && <CountryDetails country={country} />}
    </Modal>
  )
}

function CountryDetails({ country }: { country: Country }) {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const links = useLinks()
  const data = useSite()
  const status = partnershipStatus(country)
  const areas = areaSlugsForCountry(country.id).map((slug) => data.areas.find((a) => a.slug === slug)!)
  const enStats = enCountry(country.id).stats ?? []
  const figures = country.stats?.filter((_, i) => enStats[i]?.label !== 'Workstreams') ?? []

  return (
    <article className="space-y-8">
      <header className="space-y-5 pe-12">
        <Flag iso={country.iso} alt="" className="h-12 w-18 rounded-sm object-cover ring-1 ring-[color:var(--egeep-grey-light)]" />
        <div>
          <p className="v6-eyebrow mb-2">{st('partnerCountry')}</p>
          <h2 id="v6-country-title" className="v6-gold-heading text-4xl md:text-5xl">
            {country.name}
          </h2>
        </div>
      </header>

      <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-[color:var(--egeep-grey-light)]">
        {[
          { label: UI.partnershipPeriod[lang], value: <bdi>{partnershipPeriod(country)}</bdi> },
          { label: st('status'), value: status === 'active' ? UI.active[lang] : UI.completed[lang] },
          { label: t('region'), value: regionLabel(regionOf(country.id), lang) },
        ].map((f) => (
          <div key={f.label} className="flex flex-col-reverse gap-1 bg-[color:var(--egeep-ivory)] p-4">
            <dt className="v6-muted text-base">{f.label}</dt>
            <dd className="text-xl">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-4 text-lg">
        {countryParagraphs(country).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {figures.length > 0 && (
        <section aria-labelledby="v6-country-results">
          <h3 id="v6-country-results" className="mb-4 text-2xl">
            {st('recordedResults')}
          </h3>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {figures.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1 border-s-2 border-primary-600 ps-4">
                <dt className="v6-muted text-base">{s.label}</dt>
                <dd className="text-4xl leading-none text-primary-800">
                  <bdi>{s.value}</bdi>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {areas.length > 0 && (
        <section aria-labelledby="v6-country-areas">
          <h3 id="v6-country-areas" className="mb-4 text-2xl">
            {st('areasInPartnership')}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link to={links.area(a.slug)} className="aegov-badge badge-lg no-underline hover:underline">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {country.workstreams && country.workstreams.length > 0 && (
        <section aria-labelledby="v6-country-workstreams">
          <h3 id="v6-country-workstreams" className="mb-3 text-2xl">
            {t('workstreamsListed')}
          </h3>
          <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {country.workstreams.map((w) => (
              <li key={w} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-primary-600" />
                {w}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[color:var(--egeep-grey-light)] pt-6">
        <Link to={links.href('contact')} className="aegov-btn btn-sm">
          {st('askAboutPartnership')}
        </Link>
        <Link to={links.href('activities')} className="aegov-link">
          {t('activity')}
          <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
        </Link>
      </footer>
    </article>
  )
}
