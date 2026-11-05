import { ArrowUpRight } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { COPY } from '../lib/copy'
import { REGISTER_URL } from '../lib/content'
import { CONTAINER, FLIP } from '../lib/ui'
import { ExternalLink } from './ExternalLink'

/** Closing scene: the earth at night, full-bleed under a charcoal gradient, with the registration link. */
export function ParticipateCta() {
  const lang = useLang()
  const t = useT(COPY)
  const { hero } = getSite(lang)
  return (
    <section aria-labelledby="v7-participate-title" className="v7-dark relative isolate overflow-hidden">
      <img
        src="/media/hero/participate.jpg"
        alt=""
        width={1920}
        height={1200}
        loading="lazy"
        decoding="async"
        className="v7-parallax absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="v7-cta-shade absolute inset-0 -z-10" />
      <div className={`${CONTAINER} py-24 md:py-36`}>
        <div className="v7-reveal max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <span aria-hidden="true" className="v7-rule w-12" />
            <p className="v7-eyebrow v7-eyebrow-dark">{t('participateEyebrow')}</p>
          </div>
          <h2 id="v7-participate-title" className="v7-h2 text-[var(--egeep-ivory)]">
            {hero.title}
          </h2>
          <p className="v7-lead mt-6 text-[var(--v7-on-dark-muted)]">{t('participateLead')}</p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ExternalLink href={REGISTER_URL} className="aegov-btn btn-lg v7-btn-ivory">
              {UI.participateNow[lang]}
              <ArrowUpRight aria-hidden="true" className={`size-5 ${FLIP}`} />
            </ExternalLink>
          </div>
        </div>
      </div>
      <p className={`${CONTAINER} v7-caption v7-caption-dark pb-6`}>{t('participateCaption')}</p>
    </section>
  )
}
