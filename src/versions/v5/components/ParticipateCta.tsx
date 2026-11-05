import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { PATTERNS } from '../../../shared/brand'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { REGISTER_URL, useLinks } from '../lib/content'
import { T } from '../lib/dict'
import { CONTAINER } from '../lib/ui'
import { ExternalLink } from './ExternalLink'

/** Closing call to action on Deep Charcoal, with the Flowing Globe edge pattern. */
export function ParticipateCta() {
  const lang = useLang()
  const t = useT(T)
  const { href } = useLinks()
  const site = getSite(lang)
  return (
    <section aria-labelledby="v5-participate-title" className="v5-dark relative overflow-hidden bg-[var(--egeep-charcoal)] text-[#fff]">
      <img
        src={PATTERNS.flowingGlobeEdge}
        alt=""
        aria-hidden="true"
        width={2278}
        height={1653}
        loading="lazy"
        className="pointer-events-none absolute inset-y-0 end-0 h-full w-auto max-w-none opacity-[0.22] max-md:-end-1/2 rtl:-scale-x-100"
      />
      <div className={`${CONTAINER} relative grid gap-10 py-20 md:py-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end`}>
        <div className="max-w-3xl">
          <p className="v5-eyebrow mb-4 text-[var(--color-primary-300)]!">
            {[UI.communication, UI.exchange, UI.development].map((w) => w[lang]).join(' · ')}
          </p>
          <h2 id="v5-participate-title" className="text-4xl text-[#fff] md:text-5xl">
            {site.hero.title}
          </h2>
          <div className="mt-6 h-px w-24 bg-[var(--color-primary-400)]" aria-hidden="true" />
          <p className="mt-6 text-lg text-[#e7e7e7]">{t('ctaBody')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <ExternalLink href={REGISTER_URL} className="aegov-btn btn-lg">
            {site.hero.cta.label}
          </ExternalLink>
          <Link
            to={href('contact')}
            className="inline-flex items-center gap-2 text-lg text-[#fff] no-underline underline-offset-4 hover:text-[var(--color-primary-300)] hover:underline"
          >
            {t('talkToOffice')}
            <ArrowRight aria-hidden="true" className="size-5 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  )
}
