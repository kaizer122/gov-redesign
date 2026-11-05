import { useState, type ReactNode } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'

export interface AccordionItem {
  id: string
  title: ReactNode
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  /** Prefix for generated element ids; must be unique on the page. */
  idPrefix: string
  defaultOpen?: string[]
  headingLevel?: 'h2' | 'h3' | 'h4'
  className?: string
}

/** DS accordion (aegov-accordion) driven by React state; several panels may be open at once. */
export function Accordion({ items, idPrefix, defaultOpen = [], headingLevel = 'h3', className = '' }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen)
  const Heading = headingLevel

  return (
    <div className={`aegov-accordion [&_.accordion-active_svg]:rotate-180 ${className}`}>
      {items.map((item) => {
        const expanded = open.includes(item.id)
        const headId = `${idPrefix}-head-${item.id}`
        const bodyId = `${idPrefix}-body-${item.id}`
        return (
          <div className="accordion-item" key={item.id}>
            <Heading className="accordion-title text-base leading-normal" id={headId}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={bodyId}
                className={expanded ? 'accordion-active' : undefined}
                onClick={() =>
                  setOpen((current) =>
                    current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id],
                  )
                }
              >
                <span>{item.title}</span>
                <CaretDownIcon aria-hidden="true" className="transition-transform" />
              </button>
            </Heading>
            <div className="accordion-content" id={bodyId} role="region" aria-labelledby={headId} hidden={!expanded}>
              <div className="accordion-content-body space-y-3">{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
