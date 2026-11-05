import { getSite } from '../../../data/site'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { COPY } from '../lib/copy'

/**
 * The five-stage partnership workflow as DS steps: numbered stages joined by a gold hairline,
 * vertical on small screens and horizontal from lg up.
 */
export function Workflow({ dark = false }: { dark?: boolean }) {
  const lang = useLang()
  const t = useT(COPY)
  const steps = getSite(lang).about.workflow
  return (
    <div className={`aegov-step v7-workflow ${dark ? 'v7-workflow-dark' : ''}`}>
      <ol className="lg:grid lg:grid-cols-5 lg:gap-8">
        {steps.map((step, i) => (
          <li key={step} className="v7-reveal relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0">
            <span aria-hidden="true" className="v7-step-line" />
            <span aria-hidden="true" className="step-badge v7-step-badge">
              {formatNumber(i + 1, 'en', { minimumIntegerDigits: 2 })}
            </span>
            <div className="lg:pt-6">
              <p className={`v7-eyebrow ${dark ? 'v7-eyebrow-dark' : ''}`}>
                {t('stage')} <bdi>{i + 1}</bdi>
              </p>
              <p className={`mt-2 text-xl leading-snug ${dark ? 'text-[var(--egeep-ivory)]' : 'text-[var(--egeep-charcoal)]'}`}>{step}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
