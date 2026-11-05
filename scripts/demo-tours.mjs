// Scripted tours for the bilingual iteration 2 versions (v5–v8), used by scripts/record-demos.mjs.
// Every tour switches between English and Arabic from its first seconds and films the interactive parts,
// with a caption pill naming what is on screen. A step that can't find its target logs a warning and the
// tour carries on, so one changed selector doesn't lose a whole recording.
import {
  caption,
  captionOut,
  clickVisibly,
  dragVisibly,
  hoverVisibly,
  scrollToEl,
  scrollTop,
  sleep,
  smoothScroll,
  switchLang,
  typeSlowly,
  visit,
} from './demo-kit.mjs'

/** Runs one filmed step under a caption; logs and continues if it fails. */
async function step(page, label, fn) {
  if (label) await caption(page, label)
  try {
    await fn()
  } catch (error) {
    console.warn(`  step skipped: ${label || '(no caption)'}: ${error.message.split('\n')[0]}`)
  }
}

/** Opening shared by every tour: English hero, then the same page in Arabic. */
async function bilingualOpening(page, version, { enMs = 2800, arMs = 2600 } = {}) {
  await page.mouse.move(720, 520, { steps: 10 })
  await caption(page, 'English · left to right')
  await sleep(enMs)
  await switchLang(page, version, 'ar')
  await sleep(arMs)
}

/** Empty submit, then fixes one field so its error clears. */
async function contactValidation(page, formSel) {
  const form = page.locator(formSel).first()
  const submit = form.locator('button[type="submit"]')
  await scrollToEl(page, submit, { ratio: 0.6 })
  await clickVisibly(page, submit)
  await sleep(2200)
  const name = form.locator('input[autocomplete="name"]')
  await scrollToEl(page, name, { ratio: 0.35, ms: 900 })
  await typeSlowly(page, name, page.url().includes('/ar') ? 'مريم' : 'Mariam', { delay: 120, pause: 1500 })
}

/** Moves the cursor off interactive content so hover-paused widgets resume. */
const parkCursor = (page) => page.mouse.move(40, 860, { steps: 15 })

// ---------------------------------------------------------------- v5 Federal Prestige

const v5 = {
  async desktop(page, version) {
    const hero = page.locator('main[data-page=home] > section:first-child')
    await bilingualOpening(page, version)

    await step(page, 'Leadership quotes carousel', async () => {
      await clickVisibly(page, hero.locator('.v5-hero-control').nth(1))
      await sleep(2200)
      await clickVisibly(page, hero.locator('ul button').nth(2))
      await sleep(2400)
      await parkCursor(page)
    })

    await step(page, 'Site search in Arabic', async () => {
      await typeSlowly(page, page.locator('.header-desktop form[role=search] input[type=search]'), 'حكوم', { pause: 1800 })
      await page.keyboard.press('Escape')
      await page.locator('.header-desktop form[role=search] input[type=search]').fill('')
      await parkCursor(page)
    })

    await step(page, 'Figures count up', async () => {
      await scrollToEl(page, page.locator('section[aria-labelledby="v5-home-stats"]'), { ratio: 0.3, ms: 2200 })
      await sleep(2000)
    })

    await step(page, 'Areas of cooperation', async () => {
      const cards = page.locator('section[aria-labelledby="v5-home-areas"] article')
      await scrollToEl(page, cards.first(), { ratio: 0.25, ms: 1400 })
      await hoverVisibly(page, cards.nth(1), 900)
      await hoverVisibly(page, cards.nth(3), 900)
    })

    await step(page, 'Five stages of a partnership', async () => {
      await scrollToEl(page, page.locator('.v5-workflow'), { ratio: 0.35, ms: 1400 })
      await sleep(1400)
    })

    await step(page, 'Partnership details in a dialog', async () => {
      const card = page.locator('section[aria-labelledby="v5-home-countries"] button[aria-haspopup="dialog"]').nth(1)
      await scrollToEl(page, card, { ratio: 0.45, ms: 1400 })
      await clickVisibly(page, card)
      await sleep(3200)
      await page.keyboard.press('Escape')
      await sleep(600)
    })

    await step(page, 'Leadership words and the programme film', async () => {
      await scrollToEl(page, page.locator('section[aria-labelledby="v5-home-film"]'), { ratio: 0.15, ms: 2400 })
      await hoverVisibly(page, page.locator('section[aria-labelledby="v5-home-film"] figure button'), 1200)
      await smoothScroll(page, { maxMs: 2500 })
    })

    await scrollTop(page)
    await switchLang(page, version, 'en')
    await visit(page, version, 'countries')
    await step(page, 'Filter partners by area and status', async () => {
      const form = page.locator('main[data-page=countries] form[role=search]')
      await scrollToEl(page, form, { ratio: 0.25, ms: 1000 })
      await clickVisibly(page, form.locator('select').nth(0))
      await form.locator('select').nth(0).selectOption('government-innovation')
      await page.keyboard.press('Escape')
      await sleep(1500)
      await form.locator('select').nth(1).selectOption('active')
      await sleep(1500)
    })
    await step(page, 'Partner details, in English and in Arabic', async () => {
      const card = page.locator('main[data-page=countries] ul button[aria-haspopup="dialog"]').first()
      await clickVisibly(page, card)
      await sleep(2600)
      await page.keyboard.press('Escape')
      await sleep(500)
      await scrollTop(page, 700)
      await switchLang(page, version, 'ar')
      await sleep(800)
      await clickVisibly(page, card)
      await sleep(2800)
      await page.keyboard.press('Escape')
      await sleep(600)
    })

    await visit(page, version, 'activities', 'ar')
    await step(page, 'Signing record: timeline and sortable results', async () => {
      const tabs = page.locator('#record [role=tab]')
      await scrollToEl(page, tabs.first(), { ratio: 0.2, ms: 1600 })
      await sleep(1200)
      await clickVisibly(page, tabs.nth(1))
      await sleep(1400)
      await clickVisibly(page, page.locator('#record table thead th button').nth(2))
      await sleep(1600)
    })

    await visit(page, version, 'best-practices', 'ar')
    await step(page, 'Best practices', async () => {
      const items = page.locator('#practices .accordion-title button')
      await scrollToEl(page, items.first(), { ratio: 0.2, ms: 1400 })
      await clickVisibly(page, items.nth(2))
      await sleep(1800)
    })

    await scrollTop(page)
    await switchLang(page, version, 'en')
    await visit(page, version, 'media')
    await step(page, 'Photo gallery', async () => {
      const tabs = page.locator('#gallery [role=tab]')
      await scrollToEl(page, tabs.first(), { ratio: 0.2, ms: 1600 })
      await clickVisibly(page, tabs.nth(1))
      await sleep(1000)
      await clickVisibly(page, page.locator('#gallery [role=tabpanel]:not([hidden]) button[aria-haspopup="dialog"]').nth(1))
      await sleep(2600)
      await page.keyboard.press('Escape')
      await sleep(500)
    })

    await visit(page, version, 'contact')
    await step(page, 'Form validation', () => contactValidation(page, 'main[data-page=contact] form[novalidate]'))

    await visit(page, version, '')
    await captionOut(page)
    await sleep(1500)
  },

  async mobile(page, version) {
    await caption(page, 'العربية · mobile')
    await sleep(1500)
    await step(page, 'Menu', async () => {
      await clickVisibly(page, page.locator('.header-mobile .hamburger-icon'))
      await sleep(2200)
      await page.keyboard.press('Escape')
      await sleep(600)
    })
    await smoothScroll(page, { maxMs: 6000, to: 2600 })
    await scrollTop(page, 1200)
    await switchLang(page, version, 'en')
    await smoothScroll(page, { maxMs: 6000, to: 2600 })
    await visit(page, version, 'countries')
    await smoothScroll(page, { maxMs: 4000, to: 1400 })
  },
}

// ---------------------------------------------------------------- v6 Flowing Globe

/** Screen centre of the UAE origin dot on the globe, or null when it is on the far side. */
async function uaePoint(page, globeSel) {
  return page.evaluate((sel) => {
    const dot = document.querySelector(`${sel} g:has(> circle.v6-pulse) > circle:not(.v6-pulse)`)
    if (!dot) return null
    const b = dot.getBoundingClientRect()
    const shown = b.width > 0 && getComputedStyle(dot.parentElement).visibility !== 'hidden' && Number(getComputedStyle(dot.parentElement).opacity) > 0.5
    return shown ? { x: b.left + b.width / 2, y: b.top + b.height / 2 } : null
  }, globeSel)
}

/** Grabs the globe at the UAE and pulls it to the front-centre, so arcs to nearby partners stay short. */
async function turnBackToUae(page, globeSel) {
  const globe = await page.locator(globeSel).boundingBox()
  const centre = { x: globe.x + globe.width / 2, y: globe.y + globe.height / 2 }
  const uae = await uaePoint(page, globeSel)
  if (!uae) {
    // Far side: pull the visible surface round in two strokes until the UAE comes back into view.
    for (let k = 0; k < 2 && !(await uaePoint(page, globeSel)); k++) {
      await dragVisibly(page, page.locator(globeSel), { dx: -260, steps: 70, from: { dx: 130, dy: 0 } })
      await sleep(500)
    }
  }
  const from = (await uaePoint(page, globeSel)) ?? centre
  await page.mouse.move(from.x, from.y, { steps: 25 })
  await sleep(350)
  await page.mouse.down()
  for (let i = 1; i <= 70; i++) {
    await page.mouse.move(from.x + ((centre.x - from.x) * i) / 70, from.y + ((centre.y - from.y) * i) / 70)
    await sleep(16)
  }
  await sleep(150)
  await page.mouse.up()
}

/** Index of the clickable marker nearest the UAE dot (but clear of it), or -1. */
async function markerNearUae(page, globeSel) {
  const uae = await uaePoint(page, globeSel)
  if (!uae) return -1
  return page.evaluate(
    ([sel, o]) => {
      let best = -1
      let bestD = Infinity
      document.querySelectorAll(`${sel} g.v6-marker`).forEach((m, i) => {
        if (getComputedStyle(m).pointerEvents === 'none') return
        const b = m.getBoundingClientRect()
        const d = Math.hypot(b.left + b.width / 2 - o.x, b.top + b.height / 2 - o.y)
        if (d >= 45 && d < bestD) {
          best = i
          bestD = d
        }
      })
      return best
    },
    [globeSel, uae],
  )
}

const v6 = {
  async desktop(page, version) {
    const globeSel = 'main[data-page=home] svg.v6-globe'
    const globe = page.locator(globeSel)
    const chip = page.locator(`${globeSel} + button.v6-chip`)
    await bilingualOpening(page, version, { enMs: 3200, arMs: 2400 })

    await step(page, 'Drag to turn the globe', async () => {
      // Frame the globe with its pause chip once, so the clicks below don't scroll the hero.
      const chipBox = await chip.boundingBox()
      const overflow = chipBox.y + chipBox.height - 880
      if (overflow > 0) await smoothScroll(page, { to: (await page.evaluate(() => scrollY)) + overflow, maxMs: 900 })
      await dragVisibly(page, globe, { dx: -320, dy: 70, steps: 90, from: { dx: 140, dy: -40 } })
      await sleep(1200)
      await dragVisibly(page, globe, { dx: 260, dy: -60, steps: 80, from: { dx: -120, dy: 20 } })
      await sleep(1600)
    })

    await step(page, 'Pause, then turn the globe back to the UAE', async () => {
      await clickVisibly(page, chip)
      await sleep(800)
      await turnBackToUae(page, globeSel)
      await sleep(1200)
    })

    await step(page, 'Pick a partner near the UAE', async () => {
      const i = await markerNearUae(page, globeSel)
      if (i < 0) throw new Error('no partner marker near the UAE is on the front of the globe')
      const marker = page.locator(`${globeSel} g.v6-marker`).nth(i)
      await hoverVisibly(page, marker, 1100)
      await clickVisibly(page, marker, { pause: 150 })
      await sleep(3200)
    })

    await step(page, 'Keyboard: arrow keys move between partners', async () => {
      await page.keyboard.press('Escape')
      await sleep(700)
      for (let k = 0; k < 3; k++) {
        await page.keyboard.press('ArrowRight')
        await sleep(1100)
      }
      await page.keyboard.press('Enter')
      await sleep(3000)
      await page.keyboard.press('Escape')
      await sleep(500)
      await page.evaluate(() => document.activeElement?.blur())
      await clickVisibly(page, chip)
      await sleep(1500)
      await parkCursor(page)
    })

    await scrollTop(page)
    await switchLang(page, version, 'en')

    await step(page, 'Programme figures, drawn as Unified Impact bursts', async () => {
      await scrollToEl(page, page.locator('section[aria-labelledby="v6-home-impact"] dl'), { ratio: 0.2, ms: 2200 })
      await sleep(2800)
    })

    await step(page, 'Ambient film from programme photography', async () => {
      await scrollToEl(page, page.locator('section[aria-labelledby="v6-film-title"]'), { ratio: 0.05, ms: 1600 })
      await sleep(3500)
    })

    const timeline = page.locator('section[aria-labelledby="v6-home-timeline"]')
    await step(page, 'How the network grew: drag back to 2018', async () => {
      await scrollToEl(page, timeline, { ratio: 0.02, ms: 1600 })
      await sleep(800)
      const range = timeline.locator('input[type=range].v6-range')
      const box = await range.boundingBox()
      const fromX = box.x + box.width * (7 / 8)
      const y = box.y + box.height / 2
      await page.mouse.move(fromX, y, { steps: 25 })
      await sleep(300)
      await page.mouse.down()
      for (let i = 1; i <= 50; i++) {
        await page.mouse.move(fromX - (fromX - box.x) * (i / 50), y)
        await sleep(30)
      }
      await page.mouse.up()
      await sleep(1200)
    })
    await step(page, 'Play the timeline: each partnership lights up in its signing year', async () => {
      await clickVisibly(page, timeline.locator('button.v6-icon-btn'))
      await sleep(10500)
    })
    await step(page, 'Filter the map by region', async () => {
      const chips = timeline.locator('[role=group] > button.v6-chip')
      await clickVisibly(page, chips.nth(1))
      await sleep(1900)
      await clickVisibly(page, chips.nth(4))
      await sleep(1900)
      await clickVisibly(page, chips.nth(0))
      await sleep(1200)
    })

    await step(page, 'Areas of cooperation carousel', async () => {
      const carousel = page.locator('[aria-roledescription=carousel]')
      await scrollToEl(page, carousel, { ratio: 0.12, ms: 1600 })
      const next = carousel.locator('> div > button').nth(1)
      for (let k = 0; k < 3; k++) {
        await clickVisibly(page, next, { pause: 150 })
        await sleep(1000)
      }
    })

    await step(page, 'In the words of the UAE leadership', async () => {
      const tabs = page.locator('[role=tablist] [role=tab]')
      await scrollToEl(page, tabs.first(), { ratio: 0.5, ms: 1400 })
      await clickVisibly(page, tabs.nth(1))
      await sleep(1700)
      await clickVisibly(page, tabs.nth(2))
      await sleep(1700)
    })

    await step(page, 'Five stages as connected circles', async () => {
      await scrollToEl(page, page.locator('ol.v6-rings').first(), { ratio: 0.35, ms: 1400 })
      await sleep(1600)
      await smoothScroll(page, { maxMs: 3000 })
    })

    await visit(page, version, 'countries')
    await scrollTop(page)
    await switchLang(page, version, 'ar')
    await step(page, 'Partner globe, filtered to Europe', async () => {
      const form = page.locator('main form[role=search]')
      await scrollToEl(page, form, { ratio: 0.15, ms: 1200 })
      await clickVisibly(page, form.locator('button.v6-chip').nth(4))
      await sleep(1800)
      await scrollToEl(page, page.locator('main[data-page=countries] svg.v6-globe'), { ratio: 0.15, ms: 1000 })
      await sleep(1500)
    })
    await step(page, 'Partnership drawer, from the inline end', async () => {
      await clickVisibly(page, page.locator('main section.v6-dark ul button[aria-haspopup=dialog]').nth(1))
      await sleep(3200)
      await page.keyboard.press('Escape')
      await sleep(600)
    })
    await step(page, 'List view, sorted by training hours', async () => {
      await clickVisibly(page, page.locator('main form[role=search] button.v6-chip').nth(4))
      await sleep(600)
      await clickVisibly(page, page.locator('main button[aria-pressed]:has(svg)').nth(1))
      await sleep(1000)
      await page.locator('main form[role=search] select').nth(2).selectOption('hours')
      await sleep(1200)
      await smoothScroll(page, { maxMs: 3000, to: (await page.evaluate(() => scrollY)) + 900 })
    })

    await visit(page, version, 'activities', 'ar')
    await step(page, 'Results by partnership, sortable', async () => {
      const tabs = page.locator('#record [role=tab]')
      await scrollToEl(page, tabs.first(), { ratio: 0.2, ms: 1600 })
      await sleep(1000)
      await clickVisibly(page, tabs.nth(1))
      await sleep(1200)
      await clickVisibly(page, page.locator('#record thead button').nth(2))
      await sleep(1600)
    })

    await scrollTop(page)
    await switchLang(page, version, 'en')
    await visit(page, version, 'contact')
    await step(page, 'Form validation', () => contactValidation(page, 'main form[novalidate]'))

    await visit(page, version, '')
    await captionOut(page)
    await sleep(2500)
  },

  async mobile(page, version) {
    await caption(page, 'العربية · mobile')
    await sleep(1500)
    await step(page, 'Menu', async () => {
      await clickVisibly(page, page.locator('.header-mobile button[aria-controls="v6-mobile-menu"]'))
      await sleep(2000)
      await page.keyboard.press('Escape')
      await sleep(600)
    })
    const globe = page.locator('main[data-page=home] svg.v6-globe')
    await step(page, 'Drag the globe', async () => {
      await scrollToEl(page, globe, { ratio: 0.1, ms: 1200 })
      await dragVisibly(page, globe, { dx: -160, dy: 30, steps: 60 })
      await sleep(1500)
    })
    await step(page, 'Tap a partner near the UAE', async () => {
      const globeSel = 'main[data-page=home] svg.v6-globe'
      await clickVisibly(page, page.locator(`${globeSel} + button.v6-chip`))
      await sleep(600)
      await turnBackToUae(page, globeSel)
      await sleep(800)
      const i = await markerNearUae(page, globeSel)
      if (i < 0) throw new Error('no partner marker near the UAE is on the front of the globe')
      await clickVisibly(page, page.locator(`${globeSel} g.v6-marker`).nth(i))
      await sleep(1000)
      await smoothScroll(page, { maxMs: 1500, to: (await page.evaluate(() => scrollY)) + 380 })
      await sleep(2000)
    })
    await scrollTop(page, 1000)
    await switchLang(page, version, 'en')
    await step(page, 'How the network grew', async () => {
      const timeline = page.locator('section[aria-labelledby="v6-home-timeline"]')
      await scrollToEl(page, timeline, { ratio: 0.02, ms: 3500 })
      await timeline.locator('input[type=range]').fill('2018')
      await clickVisibly(page, timeline.locator('button.v6-icon-btn'))
      await sleep(6000)
    })
  },
}

// ---------------------------------------------------------------- v7 Chronicle

/** v7 starts scroll-driven motion on the first scroll event: nudge the page once. */
const wakeMotion = async (page) => {
  await page.mouse.wheel(0, 120)
  await sleep(250)
  await page.mouse.wheel(0, -120)
  await sleep(250)
}

const v7 = {
  async desktop(page, version) {
    await sleep(1200) // headline rise
    await bilingualOpening(page, version, { enMs: 3000, arMs: 2800 })

    await step(page, 'Opening film: pause and play', async () => {
      await clickVisibly(page, page.locator('.v7-film-toggle'))
      await sleep(1300)
      await clickVisibly(page, page.locator('.v7-film-toggle'))
      await sleep(1200)
      await parkCursor(page)
    })

    await wakeMotion(page)
    await step(page, 'Chapter one: Communication', async () => {
      await scrollToEl(page, page.locator('#communication'), { ratio: 0.05, ms: 2600 })
      await sleep(1200)
      await smoothScroll(page, { maxMs: 2600, to: (await page.evaluate(() => scrollY)) + 900 })
    })

    await step(page, 'Chapter two: hover an area to see its photograph', async () => {
      const rows = page.locator('a.v7-index-row')
      await scrollToEl(page, rows.first(), { ratio: 0.25, ms: 1800 })
      for (const i of [1, 3, 5, 7]) await hoverVisibly(page, rows.nth(i), 1000)
      await parkCursor(page)
    })

    await scrollTop(page)
    await switchLang(page, version, 'en')
    await wakeMotion(page)
    await step(page, 'Chapter three: the figures', async () => {
      await scrollToEl(page, page.locator('#development'), { ratio: 0.05, ms: 3200 })
      await sleep(2200)
    })

    await step(page, 'Years of partnership', async () => {
      const strip = page.locator('section:has(ol.v7-years)')
      await scrollToEl(page, strip, { ratio: 0.05, ms: 1600 })
      const later = strip.locator('.v7-round-btn').last()
      for (let k = 0; k < 4; k++) {
        await clickVisibly(page, later, { pause: 150 })
        await sleep(900)
      }
    })

    await step(page, 'Leadership portraits', async () => {
      await smoothScroll(page, { maxMs: 4500, to: (await page.evaluate(() => scrollY)) + 1500 })
    })

    await step(page, 'The programme on film', async () => {
      await scrollToEl(page, page.locator('button.v7-film-facade'), { ratio: 0.2, ms: 1600 })
      await hoverVisibly(page, page.locator('button.v7-film-facade'), 1400)
      await smoothScroll(page, { maxMs: 2500 })
    })

    await visit(page, version, 'about')
    await step(page, 'Long read: chapter contents and reading progress', async () => {
      await page.mouse.move(1200, 500, { steps: 10 })
      for (let k = 0; k < 26; k++) {
        await page.mouse.wheel(0, 140)
        await sleep(90)
      }
      await sleep(800)
      await clickVisibly(page, page.locator('nav a.v7-toc-link').nth(4))
      await sleep(1600)
    })

    await visit(page, version, 'countries')
    await scrollTop(page)
    await switchLang(page, version, 'ar')
    await step(page, 'Atlas: jump by Arabic letter', async () => {
      const letters = page.locator('a.v7-letter')
      await scrollToEl(page, letters.first(), { ratio: 0.3, ms: 1400 })
      await clickVisibly(page, letters.nth(3))
      await sleep(1400)
    })
    await step(page, 'Reading panel, previous and next country', async () => {
      await clickVisibly(page, page.locator('button.v7-atlas-entry').nth(1))
      await sleep(2400)
      await clickVisibly(page, page.locator('.v7-panel .v7-text-btn.text-end'))
      await sleep(2000)
      await clickVisibly(page, page.locator('.v7-panel .v7-text-btn.text-end'))
      await sleep(2000)
      await page.keyboard.press('Escape')
      await sleep(600)
    })

    await visit(page, version, 'media', 'ar')
    await step(page, 'Gallery filters and lightbox', async () => {
      const tabs = page.locator('button.v7-tab[role="tab"]')
      await scrollToEl(page, tabs.first(), { ratio: 0.2, ms: 1600 })
      await clickVisibly(page, tabs.nth(2))
      await sleep(1000)
      await clickVisibly(page, page.locator('button.v7-thumb').first())
      await sleep(1800)
      const next = page.locator('.v7-lightbox .v7-round-btn').last()
      await clickVisibly(page, next)
      await sleep(1500)
      await clickVisibly(page, next)
      await sleep(1500)
      await page.keyboard.press('Escape')
      await sleep(500)
    })

    await scrollTop(page)
    await switchLang(page, version, 'en')
    await visit(page, version, 'activities')
    await step(page, 'Chronicle of signings', async () => {
      await wakeMotion(page)
      await scrollToEl(page, page.locator('ol.v7-chronicle'), { ratio: 0.15, ms: 1600 })
      await smoothScroll(page, { maxMs: 4000, to: (await page.evaluate(() => scrollY)) + 1600 })
    })

    await visit(page, version, 'contact')
    await step(page, 'Form validation', () => contactValidation(page, 'form.v7-form'))

    await visit(page, version, '')
    await captionOut(page)
    await sleep(2000)
  },

  async mobile(page, version) {
    await caption(page, 'العربية · mobile')
    await sleep(1800)
    await step(page, 'Menu', async () => {
      await clickVisibly(page, page.locator('.header-mobile button.hamburger-icon'))
      await sleep(2000)
      await page.keyboard.press('Escape')
      await sleep(600)
    })
    await wakeMotion(page)
    await smoothScroll(page, { maxMs: 7000, to: 3200 })
    await scrollTop(page, 1200)
    await switchLang(page, version, 'en')
    await visit(page, version, 'countries')
    await step(page, 'Reading panel', async () => {
      await clickVisibly(page, page.locator('button.v7-atlas-entry').nth(2))
      await sleep(2600)
      await page.keyboard.press('Escape')
      await sleep(500)
    })
  },
}

// ---------------------------------------------------------------- v8 Impact Grid

const v8 = {
  async desktop(page, version) {
    await bilingualOpening(page, version)

    await step(page, 'Command palette (Ctrl K), searching in Arabic', async () => {
      await clickVisibly(page, page.locator('.header-desktop button[aria-haspopup="dialog"]'))
      await sleep(700)
      await page.locator('input[role="combobox"]').pressSequentially('مصر', { delay: 220 })
      await sleep(1200)
      await page.keyboard.press('Escape')
      await sleep(500)
      await page.keyboard.press('Control+k')
      await sleep(600)
      await page.locator('input[role="combobox"]').pressSequentially('ابتكار', { delay: 180 })
      await sleep(900)
      await page.keyboard.press('ArrowDown')
      await sleep(700)
      await page.keyboard.press('Escape')
      await sleep(500)
    })

    await step(page, 'Hero tiles', async () => {
      const tiles = page.locator('section[aria-labelledby="v8-home-title"] .v8-lift')
      for (const i of [1, 2, 3]) await hoverVisibly(page, tiles.nth(i), 800)
      await parkCursor(page)
    })

    await step(page, 'Impact dashboard: bars grow in, hover for values', async () => {
      const dash = page.locator('section[aria-labelledby="v8-dash-title"]')
      await scrollToEl(page, dash, { ratio: 0.05, ms: 2200 })
      await sleep(1600)
      await scrollToEl(page, dash.locator('figure.v8-tile').nth(0), { ratio: 0.1, ms: 900 })
      await sleep(900)
      const bars = dash.locator('figure.v8-tile').nth(0).locator('.v8-chart svg > g')
      for (const i of [5, 6, 7]) await hoverVisibly(page, bars.nth(i), 900)
    })

    await step(page, 'Top 10 partners: switch the metric', async () => {
      const toggles = page.locator('section[aria-labelledby="v8-dash-title"] [role="group"] button')
      await clickVisibly(page, toggles.nth(2))
      await sleep(1600)
      await clickVisibly(page, toggles.nth(1))
      await sleep(1600)
      await parkCursor(page)
    })

    await scrollTop(page)
    await switchLang(page, version, 'en')

    await step(page, 'Each chart has a data table', async () => {
      const dash = page.locator('section[aria-labelledby="v8-dash-title"]')
      const chart = dash.locator('figure.v8-tile').nth(2)
      await scrollToEl(page, chart, { ratio: 0.08, ms: 2600 })
      await sleep(1500)
      const toggle = chart.locator('button[aria-controls$="-table"]')
      await clickVisibly(page, toggle)
      await sleep(1800)
      await clickVisibly(page, toggle)
      await sleep(600)
    })

    await step(page, 'The four EGEEP programmes', async () => {
      const tiles = page.locator('section[aria-labelledby="v8-prog-title"] article')
      await scrollToEl(page, tiles.first(), { ratio: 0.3, ms: 1400 })
      for (const i of [0, 1, 2, 3]) await hoverVisibly(page, tiles.nth(i), 700)
    })

    await step(page, 'Latest partnerships', async () => {
      const card = page.locator('section[aria-labelledby="v8-latest-title"] article button[aria-haspopup="dialog"]').first()
      await scrollToEl(page, card, { ratio: 0.4, ms: 1400 })
      await clickVisibly(page, card)
      await sleep(2800)
      await page.keyboard.press('Escape')
      await sleep(500)
    })

    await visit(page, version, 'countries')
    await step(page, 'Table view, sorted by trainees', async () => {
      await clickVisibly(page, page.locator('main[data-page="countries"] [role="group"] button').nth(1))
      await sleep(1200)
      const heads = page.locator('main table thead th button')
      await scrollToEl(page, heads.first(), { ratio: 0.25, ms: 1000 })
      await clickVisibly(page, heads.nth(5))
      await sleep(1400)
    })
    await step(page, 'Compare up to three partners', async () => {
      const checks = page.locator('main[data-page="countries"] .aegov-check-item input[type="checkbox"]')
      for (const i of [0, 1, 2]) {
        await clickVisibly(page, checks.nth(i), { pause: 200 })
        await sleep(700)
      }
      await clickVisibly(page, page.locator('section.fixed.bottom-0 .aegov-btn:not(.btn-link)'))
      await sleep(3800)
      await page.keyboard.press('Escape')
      await sleep(500)
      await clickVisibly(page, page.locator('section.fixed.bottom-0 .btn-link'))
      await sleep(600)
    })
    await scrollTop(page)
    await switchLang(page, version, 'ar')
    await step(page, 'Partner drawer, in Arabic', async () => {
      await clickVisibly(page, page.locator('main table tbody th button').nth(0))
      await sleep(3000)
      await page.keyboard.press('Escape')
      await sleep(500)
    })

    await visit(page, version, 'areas', 'ar')
    await step(page, 'Areas by partner region', async () => {
      const chips = page.locator('main[data-page="areas"] [role="group"] > div:first-child button')
      await scrollToEl(page, chips.first(), { ratio: 0.25, ms: 1200 })
      await clickVisibly(page, chips.nth(1))
      await sleep(1600)
      await clickVisibly(page, chips.nth(4))
      await sleep(1600)
      await clickVisibly(page, chips.nth(0))
      await sleep(800)
      await clickVisibly(page, page.locator('main[data-page="areas"] article button[aria-controls$="-body"]').first())
      await sleep(1800)
    })

    await visit(page, version, 'activities', 'ar')
    await step(page, 'Signings by year, MOU programme colour', async () => {
      const chips = page.locator('#signings form[role="search"] [role="group"] button')
      await scrollToEl(page, chips.first(), { ratio: 0.25, ms: 1400 })
      await clickVisibly(page, chips.nth(3))
      await sleep(1800)
      await clickVisibly(page, chips.nth(0))
      await sleep(800)
    })

    await scrollTop(page)
    await switchLang(page, version, 'en')
    await visit(page, version, 'contact')
    await step(page, 'Form validation', () => contactValidation(page, 'main[data-page="contact"] form'))

    await visit(page, version, '')
    await captionOut(page)
    await sleep(1500)
  },

  async mobile(page, version) {
    await caption(page, 'العربية · mobile')
    await sleep(1500)
    await step(page, 'Menu', async () => {
      await clickVisibly(page, page.locator('button[aria-controls="v8-mobile-menu"]'))
      await sleep(2000)
      await page.keyboard.press('Escape')
      await sleep(600)
    })
    await smoothScroll(page, { maxMs: 7000, to: 3600 })
    await scrollTop(page, 1200)
    // The mobile language link lives in the menu.
    await step(page, '', async () => {
      await clickVisibly(page, page.locator('button[aria-controls="v8-mobile-menu"]'))
      await sleep(800)
    })
    await switchLang(page, version, 'en')
    await visit(page, version, 'countries')
    await smoothScroll(page, { maxMs: 4500, to: 1600 })
  },
}

export const TOURS = { v5, v6, v7, v8 }
