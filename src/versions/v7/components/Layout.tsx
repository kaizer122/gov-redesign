import { useEffect, type ReactNode } from 'react'
import { useLang } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { Footer } from './Footer'
import { Header } from './Header'

/**
 * Scroll-driven reveals switch on with the reader's first scroll (theme.css), so content seen
 * without scrolling is never held back in its pre-reveal state.
 */
function useScrollMotion() {
  useEffect(() => {
    const html = document.documentElement
    const onScroll = () => {
      html.dataset.v7Motion = ''
      window.removeEventListener('scroll', onScroll)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      delete html.dataset.v7Motion
    }
  }, [])
}

export function Layout({ children }: { children: ReactNode }) {
  const lang = useLang()
  useScrollMotion()
  return (
    <>
      <a href="#main" className="v7-skip-link">
        {UI.skipToContent[lang]}
      </a>
      <Header />
      {children}
      <Footer />
    </>
  )
}
