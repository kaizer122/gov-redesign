import { useEffect } from 'react'
import { CheckCircleIcon, XIcon } from '@phosphor-icons/react'

interface ToastProps {
  title: string
  message: string
  onDismiss: () => void
}

const AUTO_DISMISS_MS = 8000

/** DS toast (aegov-toast), announced politely and dismissed automatically or by the user. */
export function Toast({ title, message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="v4-toast-region">
      <div className="aegov-toast relative w-full shadow-xl" role="status">
        <div className="flex items-start">
          <div className="toast-icon text-primary-600">
            <CheckCircleIcon aria-hidden="true" weight="fill" />
          </div>
          <div className="toast-body">
            <span className="mb-1 block text-base font-semibold text-aeblack-900">{title}</span>
            <div className="font-normal">{message}</div>
          </div>
          <button type="button" className="toast-dismiss" aria-label="Close notification" onClick={onDismiss}>
            <XIcon aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
