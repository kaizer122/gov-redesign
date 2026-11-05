/**
 * Small orthographic-projection toolkit for the Flowing Globe. Points are unit vectors in an
 * Earth-centred frame (x towards 0°N 0°E, y towards 0°N 90°E, z towards the north pole).
 */

export type Vec3 = readonly [number, number, number]

const RAD = Math.PI / 180

export function toVec(lat: number, lon: number): Vec3 {
  const phi = lat * RAD
  const lambda = lon * RAD
  return [Math.cos(phi) * Math.cos(lambda), Math.cos(phi) * Math.sin(lambda), Math.sin(phi)]
}

/** The view: the point (lat, lon) faces the viewer, north up. */
export interface View {
  lat: number
  lon: number
}

export interface Projected {
  /** Screen x, y in units of the globe radius (y down). */
  x: number
  y: number
  /** Depth towards the viewer; > 0 is the visible hemisphere for points on the surface. */
  z: number
}

/** Precomputed rotation for one frame. */
export function viewMatrix(view: View) {
  const sl = Math.sin(view.lon * RAD)
  const cl = Math.cos(view.lon * RAD)
  const sp = Math.sin(view.lat * RAD)
  const cp = Math.cos(view.lat * RAD)
  return (v: Vec3): Projected => {
    const px = v[0] * cl + v[1] * sl
    const py = -v[0] * sl + v[1] * cl
    const pz = v[2]
    return { x: py, y: -(-sp * px + cp * pz), z: cp * px + sp * pz }
  }
}

/** Points along the great circle from a to b, lifted off the surface towards the middle. */
export function arcPoints(a: Vec3, b: Vec3, steps: number, lift: number): Vec3[] {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const omega = Math.acos(dot)
  const sin = Math.sin(omega) || 1
  const height = lift * (0.25 + omega / Math.PI)
  const points: Vec3[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const ka = Math.sin((1 - t) * omega) / sin
    const kb = Math.sin(t * omega) / sin
    const h = 1 + height * Math.sin(Math.PI * t)
    points.push([(ka * a[0] + kb * b[0]) * h, (ka * a[1] + kb * b[1]) * h, (ka * a[2] + kb * b[2]) * h])
  }
  return points
}

/** Lines of latitude and longitude, sampled as unit vectors. */
export function graticule(stepDeg: number, sampleDeg: number): Vec3[][] {
  const lines: Vec3[][] = []
  for (let lat = -90 + stepDeg; lat < 90; lat += stepDeg) {
    const line: Vec3[] = []
    for (let lon = -180; lon <= 180; lon += sampleDeg) line.push(toVec(lat, lon))
    lines.push(line)
  }
  for (let lon = -180; lon < 180; lon += stepDeg) {
    const line: Vec3[] = []
    for (let lat = -90; lat <= 90; lat += sampleDeg) line.push(toVec(lat, lon))
    lines.push(line)
  }
  return lines
}

/** Graticule crossings: the brand's "intersections". */
export function graticuleNodes(stepDeg: number): Vec3[] {
  const nodes: Vec3[] = []
  for (let lat = -90 + stepDeg; lat < 90; lat += stepDeg) {
    for (let lon = -180; lon < 180; lon += stepDeg) nodes.push(toVec(lat, lon))
  }
  return nodes
}

/**
 * SVG path for a polyline of projected points; only the parts on the near side of the globe are
 * drawn, so arcs to partners beyond the horizon fade out at the limb.
 */
export function pathFor(
  points: Vec3[],
  project: (v: Vec3) => Projected,
  cx: number,
  cy: number,
  r: number,
): string {
  let d = ''
  let pen = false
  for (const v of points) {
    const p = project(v)
    const visible = p.z > 0
    if (!visible) {
      pen = false
      continue
    }
    d += `${pen ? 'L' : 'M'}${(cx + p.x * r).toFixed(1)} ${(cy + p.y * r).toFixed(1)}`
    pen = true
  }
  return d
}

/** Shortest signed difference between two longitudes, in degrees. */
export function lonDelta(from: number, to: number): number {
  return ((((to - from) % 360) + 540) % 360) - 180
}
