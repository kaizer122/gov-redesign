import { PATTERNS } from '../../../shared/brand'

interface EdgePatternProps {
  /** Where the pattern enters from. */
  edge?: 'end' | 'start-bottom'
  className?: string
}

/**
 * Connected Circles entering from one edge and fading out towards the content (the guide's "Edge"
 * density). Thin gold lines at 18% opacity; drifts slowly unless motion is reduced.
 */
export function EdgePattern({ edge = 'end', className = '' }: EdgePatternProps) {
  const placement =
    edge === 'end'
      ? 'inset-y-0 end-0 w-[55%] [mask-image:linear-gradient(to_left,#000_10%,transparent_85%)] rtl:[mask-image:linear-gradient(to_right,#000_10%,transparent_85%)]'
      : '-bottom-24 -start-24 size-[30rem] [mask-image:radial-gradient(closest-side,#000_35%,transparent)]'
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute overflow-hidden ${placement} ${className}`}>
      <div
        className="v5-drift absolute -inset-12 opacity-[0.18]"
        style={{ backgroundImage: `url(${PATTERNS.connectedCircles})`, backgroundSize: '9.5rem auto' }}
      />
    </div>
  )
}
