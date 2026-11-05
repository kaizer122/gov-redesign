import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useLang } from '../../../shared/i18n'

export interface Tab {
  key: string
  label: string
  content: ReactNode
}

/** DS tabs with the WAI-ARIA tabs pattern. Arrow keys follow the visual direction (mirrored in RTL). */
export function Tabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const id = useId()
  const rtl = useLang() === 'ar'
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number) => {
    const next = (index + tabs.length) % tabs.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const step = rtl ? -1 : 1
    const moves: Record<string, number> = {
      ArrowRight: active + step,
      ArrowLeft: active - step,
      Home: 0,
      End: tabs.length - 1,
    }
    if (e.key in moves) {
      e.preventDefault()
      select(moves[e.key])
    }
  }

  return (
    <div>
      <div className="aegov-tab">
        <div
          role="tablist"
          aria-label={label}
          className="tab-items gap-6 overflow-x-auto border-b border-[var(--egeep-grey-light)] md:gap-10"
          onKeyDown={onKeyDown}
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`tab-link whitespace-nowrap ${i === active ? 'tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.key}
          id={`${id}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${i}`}
          tabIndex={0}
          hidden={i !== active}
          className="tab-content px-0! py-8 md:py-10"
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
