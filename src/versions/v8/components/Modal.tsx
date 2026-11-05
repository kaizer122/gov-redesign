import { useRef, type ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
import { useT } from '../../../shared/i18n'
import { useModalFocus } from '../lib/hooks'
import { T } from '../lib/t'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** id of the element that names the dialog. */
  labelledBy: string
  /** Tailwind max-width class for the dialog panel. */
  width?: string
  children: ReactNode
}

/** DS modal (aegov-modal + aegov-modal-backdrop) driven by React state. */
export function Modal({ open, onClose, labelledBy, width = 'max-w-3xl', children }: ModalProps) {
  const t = useT(T)
  const panelRef = useRef<HTMLDivElement>(null)
  useModalFocus(panelRef, open, onClose)
  if (!open) return null

  return (
    <>
      <div className="aegov-modal-backdrop" aria-hidden="true" />
      <div
        className="aegov-modal z-50 flex justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div ref={panelRef} className={`v8-fade-in relative my-auto w-full ${width}`}>
          <div className="aegov-modal-wrapper p-5 md:p-8">
            <button type="button" className="aegov-modal-close end-3 top-3" onClick={onClose} data-autofocus>
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">{t('dialogClose')}</span>
            </button>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
