#!/usr/bin/env node
// Extracts real content from the Wayback captures in data/raw/ into data/site.json
// (shape: SiteData in src/data/types.ts) and localizes images into public/media/.
// Rerunnable: images already on disk (and valid) are not downloaded again.
import * as cheerio from 'cheerio'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const RAW = path.join(ROOT, 'data/raw')
const PUBLIC = path.join(ROOT, 'public')
const OUT = path.join(ROOT, 'data/site.json')
const CAPTURED_AT = '2025-08-10'
const NO_IMAGE = /\/assets\/defaults\/no-image\.svg$/

const load = (name) => cheerio.load(fs.readFileSync(path.join(RAW, `${name}.html`), 'utf8'))
const clean = (s) => (s ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const htmlToText = (html) => {
  const $ = cheerio.load(`<div id="x">${html}</div>`)
  return $('#x p, #x li').length
    ? $('#x p, #x li').map((_, e) => clean($(e).text())).get().filter(Boolean).join('\n\n')
    : clean($('#x').text())
}
const firstSentence = (s) => s.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? s

/** Cloudflare email obfuscation: first byte is the XOR key for the remaining bytes. */
const decodeCfEmail = (hex) => {
  const key = parseInt(hex.slice(0, 2), 16)
  let out = ''
  for (let i = 2; i < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key)
  return out
}

// ---------------------------------------------------------------- images
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const imageStats = { downloaded: 0, skipped: 0, failed: [] }
const urlCache = new Map()

const sniffExt = (buf) => {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg'
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png'
  if (buf.subarray(0, 4).toString('latin1') === 'GIF8') return 'gif'
  if (buf.subarray(0, 4).toString('latin1') === 'RIFF' && buf.subarray(8, 12).toString('latin1') === 'WEBP') return 'webp'
  const head = buf.subarray(0, 2048).toString('utf8').trimStart().toLowerCase()
  if ((head.startsWith('<svg') || head.startsWith('<?xml') || head.startsWith('<!--')) && head.includes('<svg') && !head.includes('<html')) return 'svg'
  return null
}

const existingFile = (dir, slug) => {
  if (!fs.existsSync(dir)) return null
  const hit = fs.readdirSync(dir).find((f) => path.parse(f).name === slug)
  if (!hit) return null
  const file = path.join(dir, hit)
  return sniffExt(fs.readFileSync(file)) ? file : null
}

/** Downloads `url` via Wayback into public/media/<section>/<slug>.<ext>; returns "/media/..." or undefined. */
async function localize(url, section, slug) {
  if (!url || NO_IMAGE.test(url)) return undefined
  const abs = new URL(url, 'https://governmentexchange.gov.ae/').href
  if (urlCache.has(abs)) return urlCache.get(abs)
  const dir = path.join(PUBLIC, 'media', section)
  const existing = existingFile(dir, slug)
  if (existing) {
    imageStats.skipped++
    const rel = '/' + path.relative(PUBLIC, existing).split(path.sep).join('/')
    urlCache.set(abs, rel)
    return rel
  }
  // Some /storage/post/<file> uploads were never archived (or archived as the site's 404 page),
  // while the same upload is archived under /storage/post/large/<file>.
  const candidates = [abs]
  if (/\/storage\/post\/(?!large\/)/.test(abs)) candidates.push(abs.replace('/storage/post/', '/storage/post/large/'))
  const errors = []
  for (const candidate of candidates) {
    const wb = `https://web.archive.org/web/2025im_/${candidate}`
    for (let attempt = 1; attempt <= 3; attempt++) {
      await sleep(500 * attempt)
      try {
        const res = await fetch(wb, { redirect: 'follow', headers: { 'User-Agent': 'gov-redesign content extraction (polite; single requests)' } })
        // 404 = never archived; HTML = the site's own error page was archived. Neither improves on retry.
        if (res.status === 404) throw Object.assign(new Error('HTTP 404'), { permanent: true })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const buf = Buffer.from(await res.arrayBuffer())
        const ext = sniffExt(buf)
        if (!ext) throw Object.assign(new Error(`not an image (${res.headers.get('content-type')})`), { permanent: res.url.includes('error-404') })
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, `${slug}.${ext}`), buf)
        imageStats.downloaded++
        const rel = `/media/${section}/${slug}.${ext}`
        urlCache.set(abs, rel)
        return rel
      } catch (err) {
        if (err.permanent || attempt === 3) {
          errors.push(`${candidate.includes('/large/') && candidate !== abs ? 'large/: ' : ''}${err.message}`)
          break
        }
      }
    }
  }
  imageStats.failed.push(`${abs} (${errors.join('; ')})`)
  console.warn(`image failed: ${abs}: ${errors.join('; ')}`)
  urlCache.set(abs, undefined)
  return undefined
}

const withImage = (obj, key, value) => (value ? { ...obj, [key]: value } : obj)

// ---------------------------------------------------------------- pages
const home = load('home')
const about = load('about')
const areasPage = load('areas')
const countriesPage = load('participating-countries')
const mediaCenter = load('media-center')
const contactPage = load('contact')
const countriesJson = JSON.parse(fs.readFileSync(path.join(RAW, 'get-participating-countries.json'), 'utf8')).countryData

// meta + nav
const siteName = clean(home('title').text().split('|').pop())
const aboutParas = about('p')
  .filter((_, e) => /knowledge-sharing platform|launched in 2018|Since the programme/.test(about(e).text()))
  .map((_, e) => clean(about(e).text()))
  .get()
const office = clean(home('p.text-center').first().text().match(/^(.*?)\s*©/)?.[1] ?? '')
  .toLowerCase()
  .replace(/\b\w/g, (c) => c.toUpperCase())
const shortName = clean(contactPage('option').filter((_, e) => /\bGEEP\b/.test(contactPage(e).text())).first().text()).match(/\bGEEP\b/)?.[0]

const NAV_KEYS = {
  '/en': 'home',
  '/en/about': 'about',
  '/en/best-practice': 'best-practices',
  '/en/areas': 'areas',
  '/en/participating-countries': 'countries',
  '/en/activities': 'activities',
  '/en/media-center': 'media',
  '/en/contact': 'contact',
}
const nav = home('a.nav-link')
  .map((_, e) => ({ label: clean(home(e).text()), key: NAV_KEYS[new URL(home(e).attr('href')).pathname.replace(/\/$/, '')] }))
  .get()
  .filter((n) => n.key)

const logo = await localize(home('a.navbar-brand img').attr('src'), 'brand', 'logo-en')

// hero + quotes (home slider)
const slides = home('.swiper-slide.slide_').filter((_, e) => home(e).find('.img_box .img_').length > 0)
const quotes = []
const heroImages = []
let hero
for (const el of slides.toArray()) {
  const s = home(el)
  const img = s.find('.img_box .img_').attr('data-src')
  const quoteText = clean(s.find('.content_ p').first().text())
  const spans = s.find('.content_ h4 span').map((_, e) => clean(home(e).text())).get()
  if (spans.length) {
    const image = await localize(img, 'quotes', slugify(spans[0]))
    if (image) heroImages.push(image)
    quotes.push(withImage({ text: quoteText, author: spans[0], ...(spans[1] ? { role: spans[1] } : {}) }, 'image', image))
  } else if (s.find('h2').length) {
    const image = await localize(img, 'hero', 'participate')
    if (image) heroImages.push(image)
    const cta = s.find('a.btn_classic')
    hero = {
      title: clean(s.find('h2').text()),
      subtitle: clean(s.find('label').clone().children().remove().end().text()),
      cta: { label: clean(cta.text()), url: cta.attr('href') },
      images: heroImages,
    }
  }
}

// stats: <div class="item_"><h3>value</h3><label><strong>label</strong></label></div>
const statsFrom = ($) =>
  $('.item_ > h3')
    .filter((_, e) => $(e).next('label').find('strong').length > 0)
    .map((_, e) => ({ value: clean($(e).text()), label: clean($(e).next('label').text()) }))
    .get()
const headline = statsFrom(home)
const byNumbers = statsFrom(about)

// about
const sectionByTitle = ($, title) =>
  $('.section_title').filter((_, e) => clean($(e).text()) === title).first().closest('.page-section, .home-section')
const methodology = clean(sectionByTitle(about, 'Our Work Methodology').find('p').first().text())
const tools = sectionByTitle(about, 'Our tools').find('label').map((_, e) => clean(about(e).text())).get()
const workflow = sectionByTitle(about, 'Our Workflow').find('p').map((_, e) => clean(about(e).text())).get().filter(Boolean)
const slogan = sectionByTitle(home, 'Our Slogan').find('h4').map((_, e) => clean(home(e).text())).get()

// areas
const areas = []
for (const el of areasPage('section.page-section').toArray()) {
  const sec = areasPage(el)
  const title = clean(sec.find('.section_title').text())
  if (!title) continue
  const body = sec
    .find('.text_ p, .text_ li')
    .map((_, e) => clean(areasPage(e).text()))
    .get()
    .filter(Boolean)
  const slug = slugify(title)
  const image = await localize(sec.find('.image_wrapper .img_').attr('data-src'), 'areas', slug)
  const logo = await localize(sec.find('.logo_box .img_').attr('data-src'), 'areas/logos', slug)
  areas.push(withImage(withImage({ slug, title, summary: firstSentence(body[0] ?? ''), body }, 'image', image), 'logo', logo))
}

// countries: the rendered page and the JSON list are in the same order; the page carries the
// unique ids, official names and flag images, the JSON carries the description HTML.
// Source ISO codes for Montenegro ("MN", Mongolia's) and Serbia ("SB", Solomon Islands') are wrong;
// the page's own country names make the correct code unambiguous.
const ISO_FIXES = { 'Republic of Montenegro': 'ME', 'Republic of Serbia': 'RS' }
const countryItems = countriesPage('a.item_[href^="#county_"]').toArray()
if (countryItems.length !== countriesJson.length) throw new Error(`country count mismatch: page ${countryItems.length} vs json ${countriesJson.length}`)
const countries = []
for (const [i, el] of countryItems.entries()) {
  const a = countriesPage(el)
  const name = clean(a.find('label').text())
  const json = countriesJson[i]
  const id = Number(a.attr('href').replace('#county_', ''))
  const iso = ISO_FIXES[name] ?? a.attr('data-iso') ?? json.iso
  const flag = await localize(a.find('.img_').attr('data-src'), 'flags', `${iso.toLowerCase()}-${slugify(name)}`)
  // Partnership details modal: "Workstreams" labels, "Numbers and stats" and "General Information"
  // (<h3>year</h3><label>month</label><h4>Signing Date | Completion Date | Duration</h4>).
  const modal = countriesPage(`#county_${id}`)
  const modalSection = (title) =>
    modal.find('.page-section').filter((_, s) => clean(countriesPage(s).find('.section_title').first().text()) === title).first()
  const workstreams = modalSection('Workstreams').find('.swiper-slide label').map((_, e) => clean(countriesPage(e).text())).get().filter(Boolean)
  const stats = modalSection('Numbers and stats')
    .find('.item_')
    .map((_, e) => ({ value: clean(countriesPage(e).find('h3').text()), label: clean(countriesPage(e).find('label').text()) }))
    .get()
    .filter((s) => s.value && s.label)
  const generalYear = (heading) =>
    clean(modalSection('General Information').find('.item_').filter((_, e) => clean(countriesPage(e).find('h4').text()) === heading).find('h3').text())
  const startYear = generalYear('Signing Date')
  const endYear = generalYear('Completion Date')
  countries.push({
    id,
    name,
    iso,
    description: htmlToText(json.description),
    ...(flag ? { flag } : {}),
    ...(workstreams.length ? { workstreams } : {}),
    ...(startYear ? { startYear } : {}),
    ...(endYear ? { endYear } : {}),
    ...(stats.length ? { stats } : {}),
  })
}

// media center (photos / videos / reports tabs); each item is a fancybox link
const media = []
for (const el of mediaCenter('a.item_[data-fancybox]').toArray()) {
  const a = mediaCenter(el)
  const kind = a.attr('data-fancybox').replace('#', '')
  const type = { photos: 'photo', videos: 'video', reports: 'report' }[kind] ?? 'news'
  const title = clean(a.find('p').first().text())
  const src = [a.attr('href'), a.find('.img_').attr('data-src')].find((u) => u && !NO_IMAGE.test(u))
  const image = await localize(src, 'media', slugify(title).slice(0, 80).replace(/-[^-]*$/, ''))
  media.push(withImage({ title, type }, 'image', image))
}

// activities / best practices: the captures render no listings (activities says "No activities found";
// the best-practice page is an intro + submission form). Fail loudly if a newer capture adds content.
const activitiesPage = load('activities')
if (clean(activitiesPage('#activitiesWrapper').children().first().text()) !== 'No activities found') {
  throw new Error('activities.html now has an activity listing; add a parser for it')
}
const activities = []
const bestPractices = []

// best-practice landing page: intro text + Mohammed bin Rashid quote
const bpPage = load('best-practice')
const bpQuoteBox = bpPage('.practice-main')
const bpAuthor = clean(bpQuoteBox.find('.about-highness h5').text())
const bpQuoteImage = await localize(bpQuoteBox.find('.media-width-60 img').attr('src'), 'quotes', `${slugify(bpAuthor)}-best-practices`)
const bestPracticesIntro = {
  title: clean(bpPage('.share-experience h3').first().text()),
  body: bpPage('.share-experience > p').map((_, e) => clean(bpPage(e).text())).get().filter(Boolean),
  quote: withImage(
    {
      text: clean(bpQuoteBox.find('.para strong').text()).replace(/^["“]|["”]$/g, ''),
      author: bpAuthor,
      role: clean(bpQuoteBox.find('.about-highness p').text()),
    },
    'image',
    bpQuoteImage,
  ),
}

// contact form subjects ("Reason for contacting us" options with a value)
const subjects = contactPage('select[name="contact_reason"] option')
  .filter((_, e) => contactPage(e).attr('value'))
  .map((_, e) => clean(contactPage(e).text()))
  .get()

// contact
const contactBox = contactPage('h3').filter((_, e) => clean(contactPage(e).text()) === 'Get In Touch').first().parent()
const texts = contactBox.find('.text_').map((_, e) => clean(contactPage(e).text())).get()
const cfHex = (contactPage('[data-cfemail]').attr('data-cfemail') ?? contactPage('a[href*="email-protection#"]').attr('href').split('#')[1])
const PLATFORMS = { 'x.com': 'X', 'twitter.com': 'X', 'facebook.com': 'Facebook', 'linkedin.com': 'LinkedIn', 'instagram.com': 'Instagram', 'youtube.com': 'YouTube' }
const social = [...new Set(home('footer a[href^="http"], a[href^="http"]').map((_, e) => home(e).attr('href')).get())]
  .map((url) => ({ platform: PLATFORMS[new URL(url).hostname.replace(/^www\./, '')], url }))
  .filter((s) => s.platform)

const site = {
  meta: {
    siteName,
    ...(shortName ? { shortName } : { shortName: siteName }),
    description: aboutParas[0],
    source: 'Wayback Machine captures of governmentexchange.gov.ae/en',
    capturedAt: CAPTURED_AT,
    ...(logo ? { logo } : {}),
  },
  nav,
  hero,
  quotes,
  about: {
    intro: aboutParas.filter((p) => !/launched in 2018/.test(p)),
    launched: aboutParas.find((p) => /launched in 2018/.test(p)),
    methodology,
    tools,
    workflow,
    slogan,
  },
  stats: { headline, byNumbers },
  areas,
  countries,
  bestPractices,
  bestPracticesIntro,
  activities,
  media,
  contact: {
    office,
    address: texts.find((t) => /Dubai|United Arab Emirates/.test(t)),
    phone: texts.find((t) => /^\+?[\d\s]+$/.test(t)),
    email: decodeCfEmail(cfHex),
    social,
  },
  ...(subjects.length ? { contactForm: { subjects } } : {}),
}

fs.writeFileSync(OUT, JSON.stringify(site, null, 2) + '\n')
console.log(
  `wrote ${path.relative(ROOT, OUT)}: areas=${areas.length} countries=${countries.length} quotes=${quotes.length} ` +
    `stats=${headline.length}/${byNumbers.length} media=${media.length} activities=${activities.length} bestPractices=${bestPractices.length}`,
)
console.log(`images: downloaded=${imageStats.downloaded} reused=${imageStats.skipped} failed=${imageStats.failed.length}`)
for (const f of imageStats.failed) console.log(`  failed: ${f}`)
