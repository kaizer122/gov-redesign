// Records a scripted walkthrough video of each redesign: videos/<version>.mp4
// Usage: npm run build && npm run demos [-- v1 v6]
// Iteration 1 (v1–v4) gets the generic page tour below. Iteration 2 (v5–v8) gets a scripted, bilingual tour
// of its interactive parts from scripts/demo-tours.mjs, switching between English and Arabic from the start.
import { chromium } from '@playwright/test'
import { spawn, execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import {
  BASE,
  BILINGUAL,
  INIT,
  MOBILE,
  PORT,
  SIZE,
  clickVisibly,
  rootOf,
  scrollTop,
  sleep,
  smoothScroll,
  typeSlowly,
  visit,
} from './demo-kit.mjs'
import { TOURS } from './demo-tours.mjs'

const OUT = 'videos'
const ALL = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8']
const versions = process.argv.slice(2).length ? process.argv.slice(2) : ALL

function metaOf(version) {
  const src = readFileSync(`src/versions/${version}/meta.ts`, 'utf8')
  const pick = (key) => src.match(new RegExp(`${key}:\\s*\\n?\\s*['"\`]([^'"\`]+)`))?.[1] ?? ''
  return { name: pick('name'), concept: pick('concept') }
}

// ---------------------------------------------------------------- iteration 1: generic tour

async function demoCountries(page) {
  const search = page.locator('main input[type="search"]').first()
  if (!(await search.count())) return
  await search.scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollBy(0, -160))
  await sleep(500)
  await typeSlowly(page, search, 'Ken')
  // Open the first matching country (card button / row toggle containing a flag).
  const opener = page.locator('main button:has(img):visible').first()
  if (await opener.count()) {
    await opener.scrollIntoViewIfNeeded()
    await clickVisibly(page, opener).catch(() => {})
    await sleep(2800)
    await page.keyboard.press('Escape')
    await sleep(600)
  }
  await search.fill('')
  await sleep(600)
}

async function demoHomeSearch(page) {
  // v1 header search, v4 hero combobox.
  const box = page.locator('input[role="combobox"]:visible, header input[type="search"]:visible').first()
  if (!(await box.count())) return
  await typeSlowly(page, box, 'Innov')
  await page.keyboard.press('ArrowDown')
  await sleep(1200)
  await box.fill('')
  await page.keyboard.press('Escape')
  await sleep(400)
}

async function demoContact(page) {
  const submit = page.locator('main form button[type="submit"]').first()
  if (!(await submit.count())) return smoothScroll(page, { maxMs: 4000 })
  await submit.scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollBy(0, 200))
  await sleep(500)
  await clickVisibly(page, submit) // empty submit → validation errors
  await sleep(2500)
  await smoothScroll(page, { maxMs: 3000 })
}

async function genericDesktop(page, version) {
  await page.mouse.move(700, 450, { steps: 10 })
  await demoHomeSearch(page)
  await smoothScroll(page, { maxMs: 14000 })
  for (const [path, ms] of [['about', 6000], ['areas', 7000], ['countries', 0], ['best-practices', 5000], ['activities', 6000], ['media', 3500], ['contact', 0]]) {
    await visit(page, version, path)
    if (path === 'countries') {
      await demoCountries(page)
      await smoothScroll(page, { maxMs: 5000 })
    } else if (path === 'contact') {
      await demoContact(page)
    } else {
      await smoothScroll(page, { maxMs: ms })
    }
  }
  await visit(page, version, '')
  await sleep(1000)
}

async function genericMobile(page, version) {
  const menu = page.locator('header button[aria-expanded]:visible').first()
  if (await menu.count()) {
    await clickVisibly(page, menu).catch(() => {})
    await sleep(2500)
    await page.keyboard.press('Escape')
    await sleep(900)
  }
  await smoothScroll(page, { maxMs: 9000 })
  await visit(page, version, 'countries')
  await smoothScroll(page, { maxMs: 5000 })
}

// ---------------------------------------------------------------- recording

/** Opens a recording page on `path` and shows a title card; returns the video offset (s) where the card is up. */
async function openWithTitle(browser, version, viewport, path, title, subtitle, langs) {
  const context = await browser.newContext({ viewport, recordVideo: { dir: `${OUT}/.tmp-${version}`, size: viewport } })
  await context.addInitScript(INIT)
  const page = await context.newPage()
  const t0 = Date.now()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(`${BASE}${path}`)
  await page.waitForSelector('main#main')
  await page.waitForLoadState('networkidle')
  await page.evaluate(([t, s, l]) => window.__demoTitle(t, s, l), [title, subtitle, langs])
  const start = (Date.now() - t0) / 1000 + 0.2
  return { context, page, errors, start }
}

async function finish({ context, page, errors, start }) {
  const video = page.video()
  await context.close()
  return { webm: await video.path(), start, errors }
}

async function recordDesktop(browser, version) {
  const { name, concept } = metaOf(version)
  const bilingual = BILINGUAL.has(version)
  const rec = await openWithTitle(browser, version, SIZE, rootOf(version, 'en'), `${version.toUpperCase()} · ${name}`, concept, bilingual ? 'English · العربية' : undefined)
  const { page } = rec
  await sleep(3500)
  await page.evaluate(() => window.__demoTitleOut())
  await sleep(1200)
  if (bilingual) await TOURS[version].desktop(page, version)
  else await genericDesktop(page, version)
  return finish(rec)
}

async function recordMobile(browser, version) {
  const bilingual = BILINGUAL.has(version)
  // Bilingual mobile tours open in Arabic; the tour switches to English itself.
  const path = rootOf(version, bilingual ? 'ar' : 'en')
  const rec = await openWithTitle(browser, version, MOBILE, path, 'Mobile', `${MOBILE.width} × ${MOBILE.height}`, bilingual ? 'العربية · English' : undefined)
  const { page } = rec
  await sleep(1800)
  await page.evaluate(() => window.__demoTitleOut())
  await sleep(1200)
  await scrollTop(page)
  if (bilingual) await TOURS[version].mobile(page, version)
  else await genericMobile(page, version)
  return finish(rec)
}

async function record(version) {
  // Installed Chrome plays the H.264 ambient video; Playwright's bundled Chromium can't, so it is only the fallback.
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch())
  const desktop = await recordDesktop(browser, version)
  const mobile = await recordMobile(browser, version)
  await browser.close()

  // Desktop tour, then the mobile tour scaled and centred on the same 1440×900 dark canvas.
  const mp4 = `${OUT}/${version}.mp4`
  const filter =
    `[0:v]fps=25,setsar=1[d];` +
    `[1:v]fps=25,scale=-2:${SIZE.height - 40},pad=${SIZE.width}:${SIZE.height}:(ow-iw)/2:(oh-ih)/2:color=0x111111,setsar=1[m];` +
    `[d][m]concat=n=2:v=1:a=0[out]`
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-ss', String(desktop.start), '-i', desktop.webm,
    '-ss', String(mobile.start), '-i', mobile.webm,
    '-filter_complex', filter, '-map', '[out]',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4,
  ])
  rmSync(`${OUT}/.tmp-${version}`, { recursive: true, force: true })
  const errors = [...desktop.errors, ...mobile.errors]
  console.log(`${mp4} recorded${errors.length ? ` (page errors: ${errors.join('; ')})` : ''}`)
}

mkdirSync(OUT, { recursive: true })
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { stdio: 'ignore' })
try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE)).ok) break
    } catch {}
    await sleep(500)
  }
  for (const version of versions) await record(version)
} finally {
  server.kill()
}
