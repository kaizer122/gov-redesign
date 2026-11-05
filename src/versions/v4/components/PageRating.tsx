import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ThumbsDownIcon, ThumbsUpIcon } from '@phosphor-icons/react'
import { href } from '../lib/content'

/** DS page-rating block ("with background" variant). Feedback stays in the browser. */
export function PageRating() {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)

  return (
    <div className="rounded-2xl bg-primary-50 px-4 py-6 md:px-8 md:py-10 xl:px-10">
      <div className="mb-3 font-inter text-lg font-bold leading-normal text-aeblack-950 md:text-xl xl:text-2xl">
        Was this page useful?
      </div>
      <div aria-live="polite">
        {answer === null && (
          <>
            <p className="mb-5 text-aeblack-600 md:mb-7">
              You can help us improve by sharing feedback about your experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <button type="button" className="aegov-btn btn-outline" onClick={() => setAnswer('yes')}>
                <ThumbsUpIcon aria-hidden="true" />
                Yes
              </button>
              <button type="button" className="aegov-btn btn-outline" onClick={() => setAnswer('no')}>
                <ThumbsDownIcon aria-hidden="true" />
                No
              </button>
            </div>
          </>
        )}
        {answer === 'yes' && (
          <div role="status" className="aegov-alert alert-success">
            <div className="alert-content">
              <p>Thank you for your feedback. It helps us keep this portal useful.</p>
            </div>
          </div>
        )}
        {answer === 'no' && (
          <div role="status" className="aegov-alert alert-info">
            <div className="alert-content">
              <p>
                Thank you for telling us. If something was missing or unclear,{' '}
                <Link to={href('contact', { subject: 'Inquiry' })}>send us a short note</Link> and we will look into it.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
