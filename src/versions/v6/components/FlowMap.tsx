import { useId } from 'react'
import { COUNTRY_COORDS, REGION_LABEL, UAE_COORDS, type Region } from '../../../shared/geo'
import { useLang } from '../../../shared/i18n'

const LON0 = -100
const LON1 = 140
const LAT0 = 62
const LAT1 = -42
const W = 1000
const H = Math.round((W * (LAT0 - LAT1)) / (LON1 - LON0))

const x = (lon: number) => ((lon - LON0) / (LON1 - LON0)) * W
const y = (lat: number) => ((LAT0 - lat) / (LAT0 - LAT1)) * H

const UAE = { x: x(UAE_COORDS[1]), y: y(UAE_COORDS[0]) }

/** Where each region's name sits on the map (decorative). */
const REGION_SPOT: Record<Region, [lat: number, lon: number]> = {
  americas: [44, -78],
  europe: [56, 8],
  africa: [-36, 22],
  'middle-east': [8, 62],
  asia: [57, 92],
}

/** Curved flow line from the UAE, bowed upwards in proportion to its length. */
function flowPath(lat: number, lon: number): string {
  const tx = x(lon)
  const ty = y(lat)
  const mx = (UAE.x + tx) / 2
  const my = (UAE.y + ty) / 2
  const len = Math.hypot(tx - UAE.x, ty - UAE.y)
  return `M${UAE.x.toFixed(1)} ${UAE.y.toFixed(1)}Q${mx.toFixed(1)} ${(my - len * 0.32).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`
}

const GRID_LATS = [-40, -20, 0, 20, 40, 60]
const GRID_LONS = [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100, 120, 140]

interface FlowMapProps {
  ids: number[]
  /** Countries drawn as signed (lit); the rest are faint. */
  lit: Set<number>
  /** Countries signed in the selected year: emphasised. */
  current?: Set<number>
  label: string
}

/**
 * Equirectangular dot map in the brand's line grammar: a dotted gold graticule, a dot per
 * partner and a flow line drawn from the UAE as each partnership is signed. Geography is
 * never mirrored in Arabic.
 */
export function FlowMap({ ids, lit, current, label }: FlowMapProps) {
  const lang = useLang()
  const uid = useId()
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={`${uid}-t`} className="v6-flowmap block h-auto w-full">
      <title id={`${uid}-t`}>{label}</title>
      <g stroke="var(--color-primary-400)" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" strokeDasharray="0 9" fill="none">
        {GRID_LATS.map((lat) => (
          <path key={`lat${lat}`} d={`M0 ${y(lat)}H${W}`} />
        ))}
        {GRID_LONS.map((lon) => (
          <path key={`lon${lon}`} d={`M${x(lon)} 0V${H}`} />
        ))}
      </g>
      <g fill="var(--egeep-ivory)" fillOpacity="0.55" fontSize="22" textAnchor="middle" aria-hidden="true">
        {(Object.keys(REGION_SPOT) as Region[]).map((r) => (
          <text key={r} x={x(REGION_SPOT[r][1])} y={y(REGION_SPOT[r][0])} direction={lang === 'ar' ? 'rtl' : 'ltr'} style={{ fontFamily: 'Sakkal Majalla, sans-serif' }}>
            {REGION_LABEL[r][lang]}
          </text>
        ))}
      </g>
      <g>
        {ids.map((id) => {
          const [lat, lon] = COUNTRY_COORDS[id]
          return (
            <path
              key={id}
              d={flowPath(lat, lon)}
              pathLength={1}
              className={`v6-flow-arc ${lit.has(id) ? 'is-lit' : ''}`}
              style={current?.has(id) ? { stroke: '#fff', opacity: 1 } : undefined}
            />
          )
        })}
      </g>
      <g>
        {ids.map((id) => {
          const [lat, lon] = COUNTRY_COORDS[id]
          const on = lit.has(id)
          const now = current?.has(id)
          return (
            <circle
              key={id}
              cx={x(lon)}
              cy={y(lat)}
              r={now ? 7 : on ? 5 : 3.5}
              fill={now ? '#fff' : on ? 'var(--color-primary-300)' : 'var(--egeep-ivory)'}
              fillOpacity={on ? 1 : 0.3}
              stroke={now ? 'var(--color-primary-300)' : 'none'}
              strokeWidth="3"
            />
          )
        })}
      </g>
      <circle cx={UAE.x} cy={UAE.y} r="16" fill="none" stroke="var(--color-primary-300)" className="v6-pulse" />
      <circle cx={UAE.x} cy={UAE.y} r="8" fill="var(--color-primary-300)" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}
