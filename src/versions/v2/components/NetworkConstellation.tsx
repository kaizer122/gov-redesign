import { flagUrl } from '../../../shared/Flag'
import { firstSigningYear, lastSigningYear, partners, signingYears } from '../lib/data'

const CENTER = 300
const INNER_RADIUS = 78
const RING_STEP = 28
const NODE_RADIUS = 11
const HUB_RADIUS = 36

/**
 * Authored SVG of the partnership network: the UAE at the hub, each partner flag placed on the
 * ring of the year its partnership was signed.
 */
export function NetworkConstellation() {
  const rings = signingYears.map((group, i) => {
    const r = INNER_RADIUS + i * RING_STEP
    const nodes = group.signed.map((partner, j) => {
      const angle = -Math.PI / 2 + ((j + 0.5) * 2 * Math.PI) / group.signed.length
      return { partner, x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) }
    })
    return { year: group.year, r, nodes }
  })
  const hubFlag = flagUrl('AE')

  return (
    <svg
      viewBox="0 0 600 600"
      role="img"
      aria-labelledby="v2-network-title v2-network-desc"
      className="h-auto w-full max-w-[600px]"
    >
      <title id="v2-network-title">Partnership network constellation</title>
      <desc id="v2-network-desc">
        {`The United Arab Emirates at the centre, linked to ${partners.length} partner governments placed on rings by signing year, from ${firstSigningYear} at the centre to ${lastSigningYear} on the outer ring.`}
      </desc>
      <defs>
        <clipPath id="v2-node-clip" clipPathUnits="objectBoundingBox">
          <circle cx="0.5" cy="0.5" r="0.5" />
        </clipPath>
        <radialGradient id="v2-network-glow">
          <stop offset="0%" stopColor="#3b5bff" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#1b2a8a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0b1240" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CENTER} cy={CENTER} r={298} fill="url(#v2-network-glow)" />

      {rings.map((ring) => (
        <circle
          key={`ring-${ring.year}`}
          cx={CENTER}
          cy={CENTER}
          r={ring.r}
          fill="none"
          className="stroke-techblue-300/40"
          strokeWidth={1}
          strokeDasharray="2 5"
        />
      ))}

      <g className="stroke-techblue-200/25" strokeWidth={1}>
        {rings.flatMap((ring) =>
          ring.nodes.map(({ partner, x, y }) => (
            <line key={`link-${partner.id}`} x1={CENTER} y1={CENTER} x2={x} y2={y} />
          )),
        )}
      </g>

      {rings.flatMap((ring) =>
        ring.nodes.map(({ partner, x, y }) => {
          const href = flagUrl(partner.iso)
          return (
            <g key={`node-${partner.id}`}>
              {href ? (
                <image
                  href={href}
                  x={x - NODE_RADIUS}
                  y={y - NODE_RADIUS}
                  width={NODE_RADIUS * 2}
                  height={NODE_RADIUS * 2}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#v2-node-clip)"
                />
              ) : (
                <circle cx={x} cy={y} r={NODE_RADIUS} className="fill-techblue-500" />
              )}
              <circle
                cx={x}
                cy={y}
                r={NODE_RADIUS + 1.5}
                fill="none"
                className="stroke-whitely-50/70"
                strokeWidth={1.5}
              />
            </g>
          )
        }),
      )}

      {rings.map((ring) => (
        <text
          key={`label-${ring.year}`}
          x={CENTER}
          y={CENTER - ring.r + 4}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          className="fill-aegold-200 stroke-techblue-950"
          strokeWidth={4}
          paintOrder="stroke"
        >
          {ring.year}
        </text>
      ))}

      <circle cx={CENTER} cy={CENTER} r={HUB_RADIUS + 10} className="fill-aegold-300/15 stroke-aegold-300/60" strokeWidth={1} />
      {hubFlag && (
        <image
          href={hubFlag}
          x={CENTER - HUB_RADIUS}
          y={CENTER - HUB_RADIUS}
          width={HUB_RADIUS * 2}
          height={HUB_RADIUS * 2}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#v2-node-clip)"
        />
      )}
      <circle cx={CENTER} cy={CENTER} r={HUB_RADIUS + 1.5} fill="none" className="stroke-aegold-300" strokeWidth={2} />
    </svg>
  )
}
