import { expect, test, type Page } from '@playwright/test'
import { LANGS, type Lang } from '../src/shared/i18n'
import { isBilingual, PAGES, pageHref, VERSIONS } from '../src/shared/pages'

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const

/** Collects console errors, uncaught exceptions and failed/4xx-5xx requests for one page load. */
function trackProblems(page: Page): string[] {
  const problems: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console: ${msg.text()}`)
  })
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`))
  page.on('requestfailed', (req) => problems.push(`requestfailed: ${req.url()} ${req.failure()?.errorText}`))
  page.on('response', (res) => {
    if (res.status() >= 400) problems.push(`http ${res.status()}: ${res.url()}`)
  })
  return problems
}

for (const version of VERSIONS) {
  // Iteration 1 is English-only and unprefixed; iteration 2 serves every page in both languages.
  const langs: (Lang | undefined)[] = isBilingual(version) ? [...LANGS] : [undefined]
  for (const lang of langs) {
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      for (const { key } of PAGES) {
        const name = [version, lang, key, viewportName].filter(Boolean).join(' ')
        test(name, async ({ page }) => {
          await page.setViewportSize(viewport)
          const problems = trackProblems(page)

          await page.goto(pageHref(version, key, lang))
          await page.waitForLoadState('networkidle')

          const main = page.locator(`main#main[data-page="${key}"]`)
          await expect(main).toBeVisible()
          await expect(main.locator('h1')).toHaveCount(1)
          // The page must be built on UAE Design System components.
          expect(await page.locator('[class*="aegov-"]').count()).toBeGreaterThan(0)

          if (lang) {
            await expect(page.locator('html')).toHaveAttribute('lang', lang)
            await expect(page.locator('html')).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
            // Brand rule: Western Arabic numerals only, never Eastern Arabic digits (DESIGN.md#typography).
            expect(await page.locator('body').innerText()).not.toMatch(/[\u0660-\u0669\u06F0-\u06F9]/)
          }

          // Scroll through once so lazy images load, as they would for a reader, then shoot from the top.
          await page.evaluate(async () => {
            for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
              window.scrollTo(0, y)
              const { promise, resolve } = Promise.withResolvers<void>()
              setTimeout(resolve, 100)
              await promise
            }
            window.scrollTo(0, 0)
          })
          await page.waitForLoadState('networkidle')

          const shot = lang ? `${version}/${lang}/${key}-${viewportName}` : `${version}/${key}-${viewportName}`
          await page.screenshot({ path: `screenshots/${shot}.png`, fullPage: true })
          expect(problems, problems.join('\n')).toEqual([])
        })
      }
    }
  }
}
