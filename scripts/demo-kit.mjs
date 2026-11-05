// Shared helpers for the demo recorder (scripts/record-demos.mjs) and the scripted tours (scripts/demo-tours.mjs).
import { setTimeout as delay } from 'node:timers/promises'

export const PORT = 4174
export const BASE = `http://127.0.0.1:${PORT}`
export const SIZE = { width: 1440, height: 900 }
export const MOBILE = { width: 390, height: 844 }
export const BILINGUAL = new Set(['v5', 'v6', 'v7', 'v8'])

export const sleep = (ms) => delay(ms)

/** Root path of a version: "/v2" for iteration 1, "/v5/en" or "/v5/ar" for the bilingual versions. */
export const rootOf = (version, lang = 'en') => (BILINGUAL.has(version) ? `/${version}/${lang}` : `/${version}`)

/** Init script: a visible cursor (headless video has none), the title card and the caption pill. */
export const INIT = () => {
  const install = () => {
    if (document.getElementById('__demo-cursor')) return
    const c = document.createElement('div')
    c.id = '__demo-cursor'
    c.style.cssText =
      'position:fixed;z-index:2147483647;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;' +
      'background:rgba(20,20,20,.35);border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.4);pointer-events:none;' +
      'transition:transform .12s;left:-50px;top:-50px'
    document.documentElement.appendChild(c)
    const last = window.__demoPointer
    if (last) {
      c.style.left = last.x + 'px'
      c.style.top = last.y + 'px'
    }
    addEventListener('mousemove', (e) => {
      window.__demoPointer = { x: e.clientX, y: e.clientY }
      sessionStorage.setItem('__demoPointer', JSON.stringify(window.__demoPointer))
      c.style.left = e.clientX + 'px'
      c.style.top = e.clientY + 'px'
    }, true)
    addEventListener('mousedown', () => (c.style.transform = 'scale(.7)'), true)
    addEventListener('mouseup', () => (c.style.transform = ''), true)
  }
  try {
    window.__demoPointer = JSON.parse(sessionStorage.getItem('__demoPointer') ?? 'null')
  } catch {}
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', install)
  else install()

  window.__demoTitle = (title, sub, langs) => {
    const d = document.createElement('div')
    d.id = '__demo-title'
    d.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
      'gap:14px;background:#1a1a19;color:#f9f7f1;font:600 56px Inter,system-ui,sans-serif;text-align:center;padding:0 10%;transition:opacity .6s;' +
      'direction:ltr;unicode-bidi:isolate'
    d.innerHTML =
      `<div>${title}</div><div style="font:400 22px Roboto,system-ui,sans-serif;opacity:.75;max-width:900px;line-height:1.5">${sub}</div>` +
      (langs ? `<div style="margin-top:18px;font:400 20px Roboto,system-ui,sans-serif;color:#e1ba82;letter-spacing:.04em">${langs}</div>` : '')
    document.documentElement.appendChild(d)
  }
  window.__demoTitleOut = () => {
    const d = document.getElementById('__demo-title')
    if (d) {
      d.style.opacity = '0'
      setTimeout(() => d.remove(), 700)
    }
  }
  // Caption pill: what the viewer is looking at. Bottom start corner, outside most content.
  window.__demoCaption = (text) => {
    let p = document.getElementById('__demo-caption')
    if (!p) {
      p = document.createElement('div')
      p.id = '__demo-caption'
      p.style.cssText =
        'position:fixed;left:24px;bottom:24px;z-index:2147483645;max-width:80vw;padding:10px 18px;border-radius:999px;' +
        'background:rgba(26,26,25,.88);color:#f9f7f1;font:500 17px Inter,system-ui,sans-serif;letter-spacing:.01em;' +
        'box-shadow:0 6px 24px rgba(0,0,0,.25);border:1px solid rgba(201,156,89,.7);transition:opacity .4s;opacity:0;pointer-events:none;' +
        'direction:ltr;unicode-bidi:isolate'
      document.documentElement.appendChild(p)
    }
    p.textContent = text
    requestAnimationFrame(() => (p.style.opacity = '1'))
  }
  window.__demoCaptionOut = () => {
    const p = document.getElementById('__demo-caption')
    if (p) p.style.opacity = '0'
  }
}

/** Shows a caption pill; it survives until the next caption, captionOut or navigation. */
export async function caption(page, text) {
  await page.evaluate((t) => window.__demoCaption?.(t), text).catch(() => {})
}

export async function captionOut(page) {
  await page.evaluate(() => window.__demoCaptionOut?.()).catch(() => {})
}

export async function smoothScroll(page, { maxMs = 7000, to } = {}) {
  const start = await page.evaluate(() => scrollY)
  const end = to ?? (await page.evaluate(() => document.documentElement.scrollHeight - innerHeight))
  const total = end - start
  if (Math.abs(total) < 4) return sleep(800)
  const steps = Math.max(20, Math.round(maxMs / 33))
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
    await page.evaluate((y) => window.scrollTo(0, y), start + total * eased)
    await sleep(33)
  }
  await sleep(500)
}

/** Smoothly scrolls so the element sits at `ratio` of the viewport height (0 = top). */
export async function scrollToEl(page, locator, { ratio = 0.2, ms = 1600 } = {}) {
  await locator.first().waitFor({ state: 'attached', timeout: 10000 })
  const y = await locator.first().evaluate((el, r) => {
    const top = el.getBoundingClientRect().top + scrollY
    return Math.max(0, Math.min(top - innerHeight * r, document.documentElement.scrollHeight - innerHeight))
  }, ratio)
  await smoothScroll(page, { to: y, maxMs: ms })
}

export async function scrollTop(page, ms = 0) {
  if (ms) return smoothScroll(page, { to: 0, maxMs: ms })
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await sleep(300)
}

/** Moves the visible cursor to the centre of an element (or an offset inside it). */
export async function moveTo(page, locator, { dx = 0, dy = 0, steps = 25 } = {}) {
  const box = await locator.first().boundingBox()
  if (!box) return null
  const x = box.x + box.width / 2 + dx
  const y = box.y + box.height / 2 + dy
  await page.mouse.move(x, y, { steps })
  return { x, y }
}

/** Brings the element into view if it is off screen, moves the cursor there and clicks. */
export async function clickVisibly(page, locator, { pause = 250 } = {}) {
  const target = locator.first()
  if (!(await target.count())) return false
  const box = await target.boundingBox()
  const viewport = page.viewportSize()
  if (!box || box.y < 10 || box.y + box.height > viewport.height - 10) {
    await scrollToEl(page, target, { ratio: 0.4, ms: 700 })
  }
  const at = await moveTo(page, target)
  if (!at) return false
  await sleep(pause)
  await page.mouse.down()
  await sleep(90)
  await page.mouse.up()
  return true
}

/** Rests the cursor on an element for `ms` so hover states show. */
export async function hoverVisibly(page, locator, ms = 1200) {
  if (!(await locator.first().count())) return false
  await moveTo(page, locator)
  await sleep(ms)
  return true
}

/** Presses on an element and drags by (dx, dy) in small steps, like a hand turning it. */
export async function dragVisibly(page, locator, { dx = 0, dy = 0, steps = 60, from = { dx: 0, dy: 0 } } = {}) {
  const at = await moveTo(page, locator, from)
  if (!at) return false
  await sleep(300)
  await page.mouse.down()
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(at.x + (dx * i) / steps, at.y + (dy * i) / steps)
    await sleep(16)
  }
  await sleep(120)
  await page.mouse.up()
  return true
}

export async function typeSlowly(page, locator, text, { delay = 140, pause = 1200 } = {}) {
  await clickVisibly(page, locator)
  await locator.first().pressSequentially(text, { delay })
  await sleep(pause)
}

/** Navigate like a user: click a visible header/nav link to the page if one exists, else load the URL. */
export async function visit(page, version, path, lang = 'en') {
  const href = path ? `${rootOf(version, lang)}/${path}` : rootOf(version, lang)
  await scrollTop(page)
  const link = page.locator(`header a[href="${href}"]:visible, nav a[href="${href}"]:visible`).first()
  const clicked = (await link.count()) ? await clickVisibly(page, link).catch(() => false) : false
  if (!clicked) await page.goto(BASE + href)
  await page.waitForURL((u) => u.pathname === href)
  await page.waitForSelector('main#main')
  await page.waitForLoadState('networkidle')
  await sleep(900)
}

/** Clicks the header language switch and waits for the new direction; loads the URL if the click didn't switch. */
export async function switchLang(page, version, lang) {
  const ready = `html[lang="${lang}"][dir="${lang === 'ar' ? 'rtl' : 'ltr'}"] main#main`
  const toggle = page.locator(`a[hreflang="${lang}"]:visible`).first()
  const clicked = (await toggle.count()) ? await clickVisibly(page, toggle, { pause: 400 }).catch(() => false) : false
  const switched = clicked && (await page.waitForSelector(ready, { timeout: 5000 }).then(() => true, () => false))
  if (!switched) {
    console.warn(`  language switch to ${lang} fell back to a URL load`)
    const { pathname, search } = new URL(page.url())
    await page.goto(BASE + pathname.replace(/^\/(v\d)\/(en|ar)/, `/$1/${lang}`) + search)
    await page.waitForSelector(ready)
  }
  await page.waitForLoadState('networkidle')
  await caption(page, lang === 'ar' ? 'العربية · right to left' : 'English · left to right')
  await sleep(600)
}
