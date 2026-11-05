import { useId, useState, type ReactNode } from 'react'
import { CaretDown } from '@phosphor-icons/react'

export interface AccordionItem {
  key: string
  title: ReactNode
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  /** Keys of the items expanded on first render. */
  defaultOpen?: string[]
}

/** DS accordion with h3 panel headings; any number of panels may be open at once. */
export function Accordion({ items, defaultOpen = [] }: AccordionProps) {
  const id = useId()
  const [open, setOpen] = useState(() => new Set(defaultOpen))

  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  return (
    <div className="aegov-accordion">
      {items.map((item, i) => {
        const expanded = open.has(item.key)
        const headId = `${id}-head-${i}`
        const bodyId = `${id}-body-${i}`
        return (
          <div key={item.key} className="accordion-item border-b border-[color:var(--egeep-grey-light)]">
            <h3 className="accordion-title">
              <button
                type="button"
                id={headId}
                aria-expanded={expanded}
                aria-controls={bodyId}
                onClick={() => toggle(item.key)}
                className={`flex w-full items-center justify-between gap-4 py-5 text-start ${expanded ? 'accordion-active' : ''}`}
              >
                <span>{item.title}</span>
                <CaretDown
                  aria-hidden="true"
                  className={`size-5 shrink-0 text-primary-700 transition-transform ${expanded ? 'rotate-180' : ''}`}
                />
              </button>
            </h3>
            <div id={bodyId} role="region" aria-labelledby={headId} className={`accordion-content ${expanded ? '' : 'hidden'}`}>
              <div className="accordion-content-body pb-6">{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
