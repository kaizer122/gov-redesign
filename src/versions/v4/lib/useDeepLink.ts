import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Reads a query parameter (e.g. ?area=programming) and brings the element with id
 * `${idPrefix}${value}` into view and focus, so search results land on the right item.
 */
export function useDeepLink(param: string, idPrefix: string): string | null {
  const [params] = useSearchParams()
  const value = params.get(param)

  useEffect(() => {
    if (!value) return
    const target = document.getElementById(`${idPrefix}${value}`)
    if (!target) return
    target.scrollIntoView({ block: 'start' })
    target.focus({ preventScroll: true })
  }, [value, idPrefix])

  return value
}
