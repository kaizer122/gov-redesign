import { site } from '../../../data/site'

/**
 * The five-stage partnership workflow drawn with DS step badges and connectors:
 * vertical on small screens, horizontal from lg up.
 */
export function Workflow() {
  const steps = site.about.workflow
  return (
    <div className="aegov-step v1-workflow">
      <ol className="lg:grid lg:grid-cols-5 lg:gap-6">
        {steps.map((step, i) => {
          const last = i === steps.length - 1
          return (
            <li key={step} className={`relative flex gap-4 lg:block ${last ? '' : 'pb-8 lg:pb-0'}`}>
              {!last && <div className="step-connector-state step-connector-vertical lg:hidden" aria-hidden="true" />}
              <div className="relative flex items-center">
                {!last && (
                  <div className="step-connector max-lg:hidden" aria-hidden="true">
                    <div className="step-connector-state" />
                  </div>
                )}
                <span className="step-badge">{i + 1}</span>
              </div>
              <div className="pt-2 lg:pt-4">
                <p className="text-xs font-semibold tracking-wider text-primary-700 uppercase">Stage {i + 1}</p>
                <p className="mt-1 font-semibold text-aeblack-900">{step}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
