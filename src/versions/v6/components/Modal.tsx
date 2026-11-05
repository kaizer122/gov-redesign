import { useRef, type ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
import { useLang } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { useModalFocus } from '../lib/hooks'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** id of the element that names the dialog. */
  labelledBy: string
  /** "center" for lightboxes, "side" for the detail drawer at the inline end. */
  placement?: 'center' | 'side'
  width?: string
  children: ReactNode
}

/** DS modal (aegov-modal + aegov-modal-backdrop) driven by React state. */
export function Modal({ open, onClose, labelledBy, placement = 'center', width = 'max-w-3xl', children }: ModalProps) {
  const lang = useLang()
  const panelRef = useRef<HTMLDivElement>(null)
  useModalFocus(panelRef, open, onClose)
  if (!open) return null
  const side = placement === 'side'

  return (
    <>
      <div className="aegov-modal-backdrop v6-backdrop" aria-hidden="true" />
      <div
        className={`aegov-modal v6-modal z-50 flex ${side ? 'v6-modal-side justify-end p-0!' : 'justify-center'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div ref={panelRef} className={`relative w-full ${width} ${side ? 'v6-drawer h-full' : 'my-auto'}`}>
          <div className={`aegov-modal-wrapper ${side ? 'h-full overflow-y-auto rounded-none! p-6 md:p-10' : 'p-5 md:p-8'}`}>
            <button type="button" className="aegov-modal-close v6-close end-4 top-4" onClick={onClose} data-autofocus>
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">{UI.close[lang]}</span>
            </button>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
