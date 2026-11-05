import type { Quote } from '../../../data/site'
import { focusOf } from '../content'
import { Blockquote } from './Blockquote'

interface LeaderPortraitProps {
  quote: Quote
  id: string
  /** Page URL the quote is published on; combined with `id` for the blockquote `cite`. */
  pageUrl: string
  kicker: string
  tone: 'dark' | 'light'
  imageSide: 'left' | 'right'
}

/** Full-bleed leader portrait paired with an oversized DS blockquote. */
export function LeaderPortrait({ quote, id, pageUrl, kicker, tone, imageSide }: LeaderPortraitProps) {
  return (
    <section
      id={id}
      aria-label={`Words of ${quote.author}`}
      className={`${tone === 'dark' ? 'v3-dark' : 'v3-paper-deep'} grid lg:min-h-[36rem] lg:grid-cols-2`}
    >
      {quote.image && (
        <div className={`relative min-h-[17rem] sm:min-h-[24rem] ${imageSide === 'right' ? 'lg:order-2' : ''}`}>
          <img
            src={quote.image}
            alt={`Portrait of ${quote.author}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: focusOf(quote) }}
            loading="lazy"
          />
        </div>
      )}
      <div className="flex items-center px-5 py-12 md:px-12 lg:px-16 lg:py-20">
        <div className="max-w-xl">
          <p className="v3-kicker">{kicker}</p>
          <Blockquote
            variant="xl"
            text={quote.text}
            author={quote.author}
            role={quote.role}
            cite={`${pageUrl}#${id}`}
            className="mt-8 pe-0!"
          />
        </div>
      </div>
    </section>
  )
}
