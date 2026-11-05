import type { Quote } from '../../../data/site'
import { useLang, useT } from '../../../shared/i18n'
import { COPY } from '../lib/copy'

/** Where each portrait's subject sits, so the crop keeps the face in frame. */
const FOCUS: Record<string, string> = {
  '/media/quotes/the-late-sheikh-zayed-bin-sultan-al-nahyan.jpg': '72% 30%',
  '/media/quotes/his-highness-sheikh-mohammed-bin-rashid-al-maktoum.jpg': '40% 35%',
  '/media/quotes/his-highness-sheikh-mohamed-bin-zayed-al-nahyan.jpg': '62% 30%',
  '/media/quotes/his-highness-sheikh-mohammed-bin-rashid-al-maktoum-best-practices.jpg': '50% 30%',
}

interface QuoteSplitProps {
  quote: Quote
  /** Portrait on the end side instead of the start side. */
  reverse?: boolean
  /** Ivory panel instead of charcoal. */
  light?: boolean
}

/** Leadership quote as a full-bleed split: portrait on one half, the words set large on the other. */
export function QuoteSplit({ quote, reverse = false, light = false }: QuoteSplitProps) {
  const t = useT(COPY)
  const lang = useLang()
  const ink = light ? 'text-[var(--egeep-charcoal)]' : 'text-[var(--egeep-ivory)]'
  return (
    <figure className={`grid md:grid-cols-2 ${light ? 'bg-[var(--egeep-ivory)]' : 'v7-dark'}`}>
      {quote.image && (
        <div className={`v7-clip relative min-h-[18rem] overflow-hidden md:min-h-[36rem] ${reverse ? 'md:order-last' : ''}`}>
          <img
            src={quote.image}
            alt={`${t('portraitOf')} ${quote.author}`}
            width={1280}
            height={880}
            loading="lazy"
            decoding="async"
            className="v7-parallax absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: FOCUS[quote.image] ?? 'center' }}
          />
        </div>
      )}
      <div className="flex flex-col justify-center px-5 py-14 sm:px-10 md:px-14 md:py-20 xl:px-24">
        <span aria-hidden="true" className={`v7-quote-mark ${light ? 'text-primary-600' : 'text-primary-400'}`}>
          {lang === 'ar' ? '”' : '“'}
        </span>
        <blockquote className="aegov-quote v7-quote v7-reveal">
          <p className={ink}>{quote.text}</p>
        </blockquote>
        <figcaption className="v7-reveal mt-8 border-t border-[var(--egeep-gold)] pt-5">
          <span className={`block text-xl ${ink}`}>{quote.author}</span>
          {quote.role && (
            <span className={`mt-1 block text-base ${light ? 'text-[var(--v7-muted)]' : 'text-[var(--v7-on-dark-muted)]'}`}>
              {quote.role}
            </span>
          )}
        </figcaption>
      </div>
    </figure>
  )
}
