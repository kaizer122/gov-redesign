import { useRef, type KeyboardEvent, type ReactNode } from 'react'

export interface TabOption {
  id: string
  label: ReactNode
}

interface TabsProps {
  tabs: TabOption[]
  selected: string
  onSelect: (id: string) => void
  idPrefix: string
  label: string
  /** Rendered once, inside the panel of the selected tab. */
  children: ReactNode
  variant?: 'underline' | 'pills'
}

/**
 * DS tabs (aegov-tab) following the WAI-ARIA tabs pattern: roving tabindex,
 * arrow keys / Home / End move and activate, the panel is labelled by its tab.
 */
export function Tabs({ tabs, selected, onSelect, idPrefix, label, children, variant = 'underline' }: TabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1
    const targets: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }
    const target = targets[event.key]
    if (target === undefined) return
    event.preventDefault()
    const next = tabs[target]
    onSelect(next.id)
    refs.current[next.id]?.focus()
  }

  return (
    <div>
      <div className={`aegov-tab ${variant === 'pills' ? 'tab-pills' : ''}`}>
        <ul className="tab-items gap-2 pb-1 md:gap-3 lg:flex-wrap" role="tablist" aria-label={label}>
          {tabs.map((tab, index) => {
            const active = tab.id === selected
            return (
              <li role="presentation" key={tab.id} className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  id={`${idPrefix}-tab-${tab.id}`}
                  aria-selected={active}
                  aria-controls={`${idPrefix}-panel`}
                  tabIndex={active ? 0 : -1}
                  ref={(el) => {
                    refs.current[tab.id] = el
                  }}
                  onClick={() => onSelect(tab.id)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={`tab-link whitespace-nowrap ${variant === 'pills' ? 'h-11 px-4 lg:px-5' : ''} ${active ? 'tab-active' : ''}`}
                >
                  {tab.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div
        className="tab-content px-0! pb-0! pt-6!"
        role="tabpanel"
        id={`${idPrefix}-panel`}
        aria-labelledby={`${idPrefix}-tab-${selected}`}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  )
}
