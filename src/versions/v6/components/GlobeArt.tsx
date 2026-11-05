import { useMemo } from 'react'
import { COUNTRY_COORDS, UAE_COORDS } from '../../../shared/geo'
import { arcPoints, graticule, pathFor, toVec, viewMatrix, type View } from '../lib/globe'

interface GlobeArtProps {
  view?: View
  /** Draw the partnership arcs from the UAE as well as the dotted graticule. */
  arcs?: boolean
  className?: string
}

const DEFAULT_VIEW: View = { lat: 18, lon: 40 }
const SIZE = 600
const R = 280

/** Static, decorative Flowing Globe: dotted gold graticule (and optional arcs) drawn with the same projection as the interactive globe. */
export function GlobeArt({ view = DEFAULT_VIEW, arcs = false, className = '' }: GlobeArtProps) {
  const paths = useMemo(() => {
    const project = viewMatrix(view)
    const c = SIZE / 2
    const grid = graticule(15, 3)
      .map((line) => pathFor(line, project, c, c, R))
      .join('')
    const origin = toVec(UAE_COORDS[0], UAE_COORDS[1])
    const flows = arcs
      ? Object.values(COUNTRY_COORDS)
          .map(([lat, lon]) => pathFor(arcPoints(origin, toVec(lat, lon), 40, 0.35), project, c, c, R))
          .join('')
      : ''
    return { grid, flows }
  }, [view, arcs])

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" focusable="false" className={className}>
      <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
      <path d={paths.grid} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0 7" />
      {arcs && <path d={paths.flows} fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1" />}
    </svg>
  )
}
