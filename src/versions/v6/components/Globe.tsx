import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Pause, Play, X } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import type { Country } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { COUNTRY_COORDS, UAE_COORDS } from '../../../shared/geo'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { enCountry, partnershipPeriod, partnershipStatus, useLinks } from '../lib/content'
import { arcPoints, graticule, graticuleNodes, lonDelta, pathFor, toVec, viewMatrix, type Vec3, type View } from '../lib/globe'
import { useOnScreen, usePageVisible, useReducedMotion } from '../lib/hooks'
import { S } from '../lib/strings'

const T = {
  instructions: {
    en: 'Drag to turn the globe. Use the arrow keys to move between partner countries and Enter to open one.',
    ar: 'اسحب لتدوير الكرة الأرضية. استخدم مفاتيح الأسهم للتنقل بين الدول الشريكة ومفتاح الإدخال لفتح التفاصيل.',
  },
  pauseRotation: { en: 'Pause rotation', ar: 'إيقاف الدوران' },
  playRotation: { en: 'Resume rotation', ar: 'استئناف الدوران' },
  uae: { en: 'UAE', ar: 'الإمارات' },
  since: { en: 'partner since', ar: 'شريكة منذ' },
  closeCard: { en: 'Close country card', ar: 'إغلاق بطاقة الدولة' },
}

const SIZE = 600
const C = SIZE / 2
const R = 262
/** Auto-rotation speed in degrees per second. */
const SPIN = 6
const HOME_VIEW: View = { lat: 18, lon: UAE_COORDS[1] }

const GRID = graticule(15, 3)
const NODES = graticuleNodes(30)
const ORIGIN = toVec(UAE_COORDS[0], UAE_COORDS[1])
const VEC = new Map<number, Vec3>(Object.entries(COUNTRY_COORDS).map(([id, [lat, lon]]) => [Number(id), toVec(lat, lon)]))
const ARC = new Map<number, Vec3[]>([...VEC].map(([id, v]) => [id, arcPoints(ORIGIN, v, 36, 0.32)]))

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * Where the view settles to bring a country to the front, slightly from above like the home view.
 * `shift` (degrees of longitude) moves it off-centre, e.g. away from the country card.
 */
function viewFor(id: number, shift = 0): View {
  const [lat, lon] = COUNTRY_COORDS[id]
  return { lat: clamp(lat * 0.7 + 6, -45, 50), lon: lon + shift }
}

interface GlobeProps {
  /** Partner country ids shown on the globe. */
  ids: number[]
  /** Accessible name of the marker group. */
  label: string
  /** When given, activating a marker calls this instead of opening the built-in country card. */
  onActivate?: (id: number) => void
  className?: string
}

/**
 * Interactive orthographic Flowing Globe: dotted gold graticule with its intersections, a marker
 * per partner and flowing arcs from the UAE. Drag (mouse or touch) to turn it; markers are one
 * roving tab stop with arrow-key navigation. Auto-rotation pauses on request, off-screen, in a
 * hidden tab, while interacting and under reduced motion (static view centred on the UAE).
 */
export function Globe({ ids, label, onActivate, className = '' }: GlobeProps) {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const uid = useId()
  const reduced = useReducedMotion()
  const pageVisible = usePageVisible()
  const wrapRef = useRef<HTMLDivElement>(null)
  const onScreen = useOnScreen(wrapRef)

  const svgRef = useRef<SVGSVGElement>(null)
  const gridRef = useRef<SVGPathElement>(null)
  const nodesRef = useRef<SVGPathElement>(null)
  const uaeRef = useRef<SVGGElement>(null)
  const labelRef = useRef<SVGTextElement>(null)
  const arcRefs = useRef(new Map<number, SVGPathElement>())
  const markerRefs = useRef(new Map<number, SVGGElement>())

  const viewRef = useRef<View>({ ...HOME_VIEW })
  const tweenRef = useRef<{ from: View; to: View; t0: number } | null>(null)
  const spinRef = useRef(false)
  const rafRef = useRef(0)
  const lastRef = useRef(0)
  const dragRef = useRef<{ x: number; y: number; view: View; moved: boolean } | null>(null)
  const labelIdRef = useRef<number | null>(null)

  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const [hoverId, setHoverId] = useState<number | null>(null)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [openId, setOpenId] = useState<number | null>(null)

  const countries = getSite(lang).countries
  const byId = useMemo(() => new Map(countries.map((c) => [c.id, c])), [countries])
  /** West to east: the order arrow keys move in. */
  const order = useMemo(() => [...ids].sort((a, b) => COUNTRY_COORDS[a][1] - COUNTRY_COORDS[b][1]), [ids])
  const tabId = activeId !== null && order.includes(activeId) ? activeId : order[0]
  const labelId = hoverId ?? openId ?? (focusWithin ? activeId : null)
  const highlight = openId ?? hoverId ?? (focusWithin ? activeId : null)

  function draw() {
    const project = viewMatrix(viewRef.current)
    gridRef.current?.setAttribute('d', GRID.map((line) => pathFor(line, project, C, C, R)).join(''))
    let nodes = ''
    for (const v of NODES) {
      const p = project(v)
      if (p.z > 0) nodes += `M${(C + p.x * R - 2.2).toFixed(1)} ${(C + p.y * R).toFixed(1)}a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0`
    }
    nodesRef.current?.setAttribute('d', nodes)
    for (const [id, el] of arcRefs.current) el.setAttribute('d', pathFor(ARC.get(id)!, project, C, C, R))
    for (const [id, el] of markerRefs.current) {
      const p = project(VEC.get(id)!)
      const alpha = clamp(p.z * 5, 0, 1)
      el.setAttribute('transform', `translate(${(C + p.x * R).toFixed(1)} ${(C + p.y * R).toFixed(1)})`)
      el.style.opacity = String(alpha)
      el.style.pointerEvents = alpha > 0.3 ? 'auto' : 'none'
    }
    const o = project(ORIGIN)
    if (uaeRef.current) {
      uaeRef.current.setAttribute('transform', `translate(${(C + o.x * R).toFixed(1)} ${(C + o.y * R).toFixed(1)})`)
      uaeRef.current.style.opacity = String(clamp(o.z * 5, 0, 1))
    }
    const lid = labelIdRef.current
    if (labelRef.current) {
      const p = lid !== null ? project(VEC.get(lid)!) : null
      labelRef.current.style.opacity = p && p.z > 0 ? '1' : '0'
      if (p) labelRef.current.setAttribute('transform', `translate(${(C + p.x * R).toFixed(1)} ${(C + p.y * R - 18).toFixed(1)})`)
    }
  }

  function tick(now: number) {
    rafRef.current = 0
    const dt = lastRef.current ? Math.min(0.05, (now - lastRef.current) / 1000) : 0
    lastRef.current = now
    const tween = tweenRef.current
    if (tween) {
      if (tween.t0 < 0) tween.t0 = now
      const p = Math.min(1, (now - tween.t0) / 900)
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
      viewRef.current = {
        lat: tween.from.lat + (tween.to.lat - tween.from.lat) * e,
        lon: tween.from.lon + lonDelta(tween.from.lon, tween.to.lon) * e,
      }
      if (p >= 1) tweenRef.current = null
    } else if (spinRef.current) {
      viewRef.current = { ...viewRef.current, lon: viewRef.current.lon - SPIN * dt }
    }
    draw()
    if (tweenRef.current || spinRef.current) rafRef.current = requestAnimationFrame(tick)
    else lastRef.current = 0
  }

  function kick() {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
  }

  function turnTo(id: number, shift = 0) {
    const to = viewFor(id, shift)
    if (reduced) {
      viewRef.current = to
      draw()
      return
    }
    // t0 is stamped by the first frame
    tweenRef.current = { from: { ...viewRef.current }, to, t0: -1 }
    kick()
  }

  // Geometry follows every render (markers and arcs may have changed).
  useLayoutEffect(() => {
    labelIdRef.current = labelId
    draw()
  })

  const spinning = !paused && !reduced && onScreen && pageVisible && !dragging && !focusWithin && openId === null
  useEffect(() => {
    spinRef.current = spinning
    if (spinning) {
      lastRef.current = 0
      kick()
    }
  })

  useEffect(() => {
    if (reduced) {
      tweenRef.current = null
      viewRef.current = { ...HOME_VIEW }
    }
  }, [reduced])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const activate = (id: number) => {
    setActiveId(id)
    if (onActivate) {
      turnTo(id)
      onActivate(id)
    } else {
      // The card sits at the inline end: move the country towards the inline start.
      turnTo(id, lang === 'ar' ? -32 : 32)
      setOpenId(id)
    }
  }

  const closeCard = () => {
    const id = openId
    setOpenId(null)
    if (id !== null) markerRefs.current.get(id)?.focus()
  }

  const onMarkerKey = (e: KeyboardEvent, id: number) => {
    const i = order.indexOf(id)
    const moves: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: order.length - 1,
    }
    if (e.key in moves) {
      e.preventDefault()
      const next = order[(moves[e.key] + order.length) % order.length]
      markerRefs.current.get(next)?.focus()
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      activate(id)
    } else if (e.key === 'Escape' && openId !== null) {
      e.preventDefault()
      closeCard()
    }
  }

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return
    dragRef.current = { x: e.clientX, y: e.clientY, view: { ...viewRef.current }, moved: false }
  }

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = e.clientX - drag.x
    const dy = e.clientY - drag.y
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 5) return
      drag.moved = true
      tweenRef.current = null
      e.currentTarget.setPointerCapture(e.pointerId)
      setDragging(true)
    }
    const radiusPx = (e.currentTarget.getBoundingClientRect().width * R) / SIZE
    const degPerPx = 180 / (Math.PI * radiusPx)
    viewRef.current = { lat: clamp(drag.view.lat + dy * degPerPx, -60, 60), lon: drag.view.lon - dx * degPerPx }
    draw()
  }

  const endDrag = () => {
    dragRef.current = null
    setDragging(false)
  }

  const open = openId !== null ? byId.get(openId) : undefined

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <p id={`${uid}-help`} className="sr-only">
        {t('instructions')}
      </p>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={`v6-globe block h-auto w-full ${dragging ? 'is-dragging' : ''} ${spinning ? 'is-flowing' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onFocus={() => setFocusWithin(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false)
        }}
      >
        <defs>
          <radialGradient id={`${uid}-sphere`} cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#2e2b25" />
            <stop offset="0.65" stopColor="#1f1e1c" />
            <stop offset="1" stopColor="#141413" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={R + 22} fill="none" stroke="var(--color-primary-400)" strokeOpacity="0.18" strokeDasharray="0 9" strokeLinecap="round" strokeWidth="2" aria-hidden="true" />
        <circle cx={C} cy={C} r={R} fill={`url(#${uid}-sphere)`} stroke="var(--color-primary-400)" strokeOpacity="0.55" aria-hidden="true" />
        <path ref={gridRef} fill="none" stroke="var(--color-primary-400)" strokeOpacity="0.55" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0 7" aria-hidden="true" />
        <path ref={nodesRef} fill="none" stroke="var(--color-primary-300)" strokeOpacity="0.6" strokeWidth="1" aria-hidden="true" />
        <g aria-hidden="true">
          {ids.map((id) => (
            <path
              key={id}
              ref={(el) => {
                if (el) arcRefs.current.set(id, el)
                else arcRefs.current.delete(id)
              }}
              className={`v6-arc ${highlight === id ? 'is-active' : openId !== null ? 'is-dim' : ''}`}
            />
          ))}
        </g>
        <g ref={uaeRef} aria-hidden="true">
          <circle r="9" fill="none" stroke="var(--color-primary-300)" className="v6-pulse" />
          <circle r="9" fill="none" stroke="var(--color-primary-300)" className="v6-pulse delay" />
          <circle r="6.5" fill="var(--color-primary-300)" stroke="#fff" strokeWidth="1.5" />
          <text y="26" textAnchor="middle" className="v6-marker-label" style={{ fontSize: 20 }}>
            {t('uae')}
          </text>
        </g>
        <g role="group" aria-label={label} aria-describedby={`${uid}-help`}>
          {order.map((id) => {
            const c = byId.get(id)!
            return (
              <g
                key={id}
                ref={(el) => {
                  if (el) markerRefs.current.set(id, el)
                  else markerRefs.current.delete(id)
                }}
                role="button"
                tabIndex={id === tabId ? 0 : -1}
                aria-label={`${c.name}, ${t('since')} ${c.startYear ?? ''}`}
                aria-haspopup={onActivate ? 'dialog' : undefined}
                aria-expanded={onActivate ? undefined : openId === id}
                className={`v6-marker ${highlight === id ? 'is-active' : ''}`}
                onClick={() => {
                  if (!dragRef.current?.moved) activate(id)
                }}
                onKeyDown={(e) => onMarkerKey(e, id)}
                onFocus={() => {
                  setActiveId(id)
                  turnTo(id)
                }}
                onPointerEnter={() => setHoverId(id)}
                onPointerLeave={() => setHoverId((h) => (h === id ? null : h))}
              >
                <circle r="16" fill="transparent" />
                <circle className="v6-marker-focus" r="13" />
                <circle className="v6-marker-dot" r={highlight === id ? 7 : 4.5} />
              </g>
            )
          })}
        </g>
        <text
          ref={labelRef}
          textAnchor="middle"
          direction={lang === 'ar' ? 'rtl' : 'ltr'}
          className="v6-marker-label"
          aria-hidden="true"
          style={{ opacity: 0 }}
        >
          {labelId !== null ? byId.get(labelId)?.name : ''}
        </text>
      </svg>

      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="v6-chip absolute bottom-0 start-0 bg-[color:var(--egeep-charcoal)]/80 text-[color:var(--egeep-ivory)]"
        >
          {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
          {paused ? t('playRotation') : t('pauseRotation')}
        </button>
      )}

      {!onActivate && open && <GlobeCard country={open} onClose={closeCard} closeLabel={t('closeCard')} viewLabel={st('viewPartnership')} />}
    </div>
  )
}

interface GlobeCardProps {
  country: Country
  onClose: () => void
  closeLabel: string
  viewLabel: string
}

const FIGURES = ['Training hours', 'Workshops', 'Trainees'] as const

/** Floating country card opened from a globe marker. */
function GlobeCard({ country, onClose, closeLabel, viewLabel }: GlobeCardProps) {
  const lang = useLang()
  const links = useLinks()
  const en = enCountry(country.id)
  const status = partnershipStatus(country)
  const figures = FIGURES.flatMap((label) => {
    const i = en.stats?.findIndex((s) => s.label === label) ?? -1
    return i >= 0 && country.stats ? [country.stats[i]] : []
  })
  const ws = country.workstreams ?? []

  return (
    <section
      aria-labelledby="v6-globe-card-title"
      aria-live="polite"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onClose()
        }
      }}
      className="v6-light relative z-10 mt-4 w-full rounded-2xl border border-primary-400/40 bg-[color:var(--egeep-ivory)] p-6 shadow-2xl lg:absolute lg:end-0 lg:bottom-14 lg:mt-0 lg:w-[21rem]"
    >
      <button type="button" onClick={onClose} className="v6-icon-btn absolute end-2 top-2">
        <X aria-hidden="true" className="size-5" />
        <span className="sr-only">{closeLabel}</span>
      </button>
      <div className="flex items-center gap-3 pe-10">
        <Flag iso={country.iso} alt="" className="h-7 w-10 shrink-0 rounded-sm object-cover ring-1 ring-aeblack-900/10" />
        <h2 id="v6-globe-card-title" className="text-2xl leading-tight">
          {country.name}
        </h2>
      </div>
      <p className="v6-muted mt-2 text-base">
        <bdi>{partnershipPeriod(country)}</bdi> · {status === 'active' ? UI.active[lang] : UI.completed[lang]}
        {ws.length > 0 && ` · ${ws.length} ${UI.workstreams[lang]}`}
      </p>
      {figures.length > 0 && (
        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-primary-600/30 pt-4">
          {figures.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="v6-muted text-sm leading-snug">{s.label}</dt>
              <dd className="text-2xl leading-tight text-primary-800">
                <bdi>{s.value}</bdi>
              </dd>
            </div>
          ))}
        </dl>
      )}
      {ws.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {ws.slice(0, 4).map((w) => (
            <li key={w} className="aegov-badge whitespace-normal!">
              {w}
            </li>
          ))}
          {ws.length > 4 && <li className="aegov-badge">+{ws.length - 4}</li>}
        </ul>
      )}
      <Link to={links.country(country.id)} className="aegov-link mt-4">
        {viewLabel}
        <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
      </Link>
    </section>
  )
}
