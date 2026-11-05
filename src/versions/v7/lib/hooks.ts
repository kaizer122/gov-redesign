import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Ref that always holds the latest callback, so effects need not re-run when callers pass inline functions. */
function useLatest<T>(value: T) {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}

/** Closes a popup on Escape and on pointer-down outside `ref`. */
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, onDismiss: () => void) {
  const dismiss = useLatest(onDismiss)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss.current()
    }
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) dismiss.current()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [ref, open, dismiss])
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'

/**
 * Modal behaviour for dialogs and the mobile menu: moves focus inside, keeps Tab within
 * `ref`, closes on Escape, locks page scroll and restores focus to the opener on close.
 */
export function useModalFocus(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  const close = useLatest(onClose)
  useLayoutEffect(() => {
    const node = ref.current
    if (!open || !node) return
    const opener = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const initial = node.querySelector<HTMLElement>('[data-autofocus]') ?? node.querySelector<HTMLElement>(FOCUSABLE)
    initial?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      if (opener?.isConnected) opener.focus()
    }
  }, [ref, open, close])
}

/**
 * Animates from 0 to `target` once the element scrolls into view. Elements already in view on
 * load, and full-page captures that never scroll, keep the final value: the count only runs
 * after the reader has scrolled to it. Reduced motion always shows the final value.
 */
export function useCountUp(ref: RefObject<HTMLElement | null>, target: number, reduced: boolean, duration = 1600): number {
  const [value, setValue] = useState(target)
  useEffect(() => {
    const node = ref.current
    if (reduced || !node || !('IntersectionObserver' in window)) return
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight) return
    let frame = 0
    let armed = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !armed) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          setValue(target * (1 - Math.pow(1 - p, 3)))
          if (p < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    // Arm on the reader's first scroll while the figure is still below the fold.
    const onScroll = () => {
      window.removeEventListener('scroll', onScroll)
      if (node.getBoundingClientRect().top < window.innerHeight) return
      armed = true
      setValue(0)
      observer.observe(node)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
      cancelAnimationFrame(frame)
      setValue(target)
    }
  }, [ref, target, reduced, duration])
  return value
}
