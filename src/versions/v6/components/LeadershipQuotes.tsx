import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { useLang, useT } from '../../../shared/i18n'
import { useSite } from '../lib/content'
import { S } from '../lib/strings'

const T = {
  choose: { en: 'Leadership messages', ar: 'رسائل القيادة' },
}

/** The leadership quotes with their portraits; portrait tabs switch the quote with a crossfade. */
export function LeadershipQuotes() {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const uid = useId()
  const quotes = useSite().quotes
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: KeyboardEvent) => {
    const fwd = lang === 'ar' ? 'ArrowLeft' : 'ArrowRight'
    const back = lang === 'ar' ? 'ArrowRight' : 'ArrowLeft'
    const moves: Record<string, number> = { [fwd]: active + 1, [back]: active - 1, Home: 0, End: quotes.length - 1 }
    if (!(e.key in moves)) return
    e.preventDefault()
    const next = (moves[e.key] + quotes.length) % quotes.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[color:var(--egeep-grey-light)]">
        {quotes.map((q, i) =>
          q.image ? (
            <img
              key={q.image}
              src={q.image}
              alt={i === active ? `${st('portraitOf')} ${q.author}` : ''}
              aria-hidden={i !== active}
              loading="lazy"
              width={1200}
              height={825}
              className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-700 motion-reduce:transition-none ${i === active ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : null,
        )}
      </div>
      <div>
        {quotes.map((q, i) => (
          <figure
            key={q.author}
            id={`${uid}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${i}`}
            hidden={i !== active}
          >
            <blockquote className="aegov-quote px-0! py-0!">
              <p className="text-3xl leading-snug md:text-4xl">
                <span aria-hidden="true" className="text-primary-600">
                  {lang === 'ar' ? '«' : '“'}
                </span>
                {q.text}
                <span aria-hidden="true" className="text-primary-600">
                  {lang === 'ar' ? '»' : '”'}
                </span>
              </p>
            </blockquote>
            <figcaption className="mt-6 border-s-2 border-primary-600 ps-4">
              <span className="block text-xl">{q.author}</span>
              {q.role && <span className="v6-muted block text-base">{q.role}</span>}
            </figcaption>
          </figure>
        ))}
        <div role="tablist" aria-label={t('choose')} onKeyDown={onKeyDown} className="mt-10 flex flex-wrap gap-3">
          {quotes.map((q, i) => (
            <button
              key={q.author}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${uid}-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`flex items-center gap-3 rounded-full border py-1 ps-1 pe-4 text-start transition-colors ${i === active ? 'border-primary-600 bg-whitely-50' : 'border-transparent hover:border-[color:var(--egeep-grey-light)]'}`}
            >
              {q.image && <img src={q.image} alt="" width={48} height={48} loading="lazy" className="size-11 rounded-full object-cover object-top" />}
              <span className="max-w-[12rem] text-base leading-tight">{q.author}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
