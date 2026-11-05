import { useState } from 'react'
import { site } from '../../../data/site'

/** Plain-language explanation shown for each step of site.about.workflow, in order. */
const STEP_GUIDANCE = [
  'Both governments review the programme’s areas of cooperation and select the ones that match national priorities.',
  'Each side nominates the executive teams who will own delivery and coordinate the work day to day.',
  'The partnership is formalised through a Memorandum of Understanding between the two governments.',
  'The teams turn the agreed areas into an action plan of activities such as workshops, field visits and capacity building programmes.',
  'Progress is reviewed in periodic meetings, and achievements are documented as the partnership moves forward.',
]

/**
 * "How partnership works": the DS vertical stepper (aegov-step). Selecting a step marks the
 * earlier ones as completed and shows what happens at that stage.
 */
export function PartnershipSteps({ idPrefix }: { idPrefix: string }) {
  const steps = site.about.workflow
  const [current, setCurrent] = useState(0)

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
      <nav aria-label="Partnership steps" className="aegov-step">
        <ol role="list">
          {steps.map((step, index) => {
            const state = index < current ? 'step-completed' : index === current ? 'step-current' : 'step-upcoming'
            return (
              <li key={step} className={`relative ${state} ${index < steps.length - 1 ? 'pb-8' : ''}`}>
                {index < steps.length - 1 && (
                  <div className="step-connector-state step-connector-vertical" aria-hidden="true" />
                )}
                <button
                  type="button"
                  className="group flex min-h-11 w-full flex-nowrap items-center justify-start gap-4 rounded-xl text-start"
                  aria-current={index === current ? 'step' : undefined}
                  aria-controls={`${idPrefix}-detail`}
                  onClick={() => setCurrent(index)}
                >
                  <span className="step-badge" aria-hidden="true">
                    {index < current ? '' : index + 1}
                  </span>
                  <span
                    className={`font-semibold ${index === current ? 'text-primary-700' : 'text-aeblack-800 group-hover:text-primary-600'}`}
                  >
                    <span className="sr-only">Step {index + 1}: </span>
                    {step}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
      <div
        id={`${idPrefix}-detail`}
        aria-live="polite"
        className="aegov-card card-bordered self-start border-primary-100 bg-primary-50"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-seablue-800">
          Step {current + 1} of {steps.length}
        </p>
        <h3 className="text-xl font-bold text-aeblack-950">{steps[current]}</h3>
        {STEP_GUIDANCE[current] && <p className="text-aeblack-700">{STEP_GUIDANCE[current]}</p>}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="aegov-btn btn-outline btn-sm"
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            Previous step
          </button>
          <button
            type="button"
            className="aegov-btn btn-sm"
            disabled={current === steps.length - 1}
            onClick={() => setCurrent(current + 1)}
          >
            Next step
          </button>
        </div>
      </div>
    </div>
  )
}
