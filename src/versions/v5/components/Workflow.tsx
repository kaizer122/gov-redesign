import { getSite } from '../../../data/site'
import { useLang } from '../../../shared/i18n'
import { F } from '../lib/dict'

/**
 * The five-stage partnership workflow as DS steps with gold connectors:
 * vertical on small screens, horizontal from lg up (mirrored in RTL by logical properties).
 */
export function Workflow() {
  const lang = useLang()
  const steps = getSite(lang).about.workflow
  return (
    <div className="aegov-step v5-workflow">
      <ol className="lg:grid lg:grid-cols-5 lg:gap-8">
        {steps.map((step, i) => {
          const last = i === steps.length - 1
          return (
            <li key={step} className={`relative flex gap-5 lg:block ${last ? '' : 'pb-10 lg:pb-0'}`}>
              {!last && <div className="step-connector-state step-connector-vertical lg:hidden" aria-hidden="true" />}
              <div className="relative flex items-center">
                {!last && (
                  <div className="step-connector max-lg:hidden" aria-hidden="true">
                    <div className="step-connector-state" />
                  </div>
                )}
                <span className="step-badge">{i + 1}</span>
              </div>
              <div className="pt-2 lg:pt-6">
                <p className="v5-eyebrow">{F.stage[lang](i + 1)}</p>
                <p className="mt-1 text-xl text-[var(--egeep-charcoal)]">{step}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
