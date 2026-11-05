# gov-redesign

Redesign concepts for [governmentexchange.gov.ae](https://governmentexchange.gov.ae/en), the UAE Government Experience Exchange Programme. All are built on the [UAE Design System 3.0](https://designsystem.gov.ae/docs/getting-started) with Tailwind CSS v4.

| Route | Concept |
|---|---|
| `/` | Launcher listing every version, newest iteration first |
| `/v1` | Iteration 1. Federal Standard: a reference-grade execution of the DS (the favourite of iteration 1) |
| `/v2` | Iteration 1. Global Atlas: data-led, with the partner-country network up front |
| `/v3` | Iteration 1. Editorial: storytelling in a magazine-style long read |
| `/v4` | Iteration 1. Partner Portal: task-first, service-oriented |
| `/v5/en`, `/v5/ar` | Iteration 2. Federal Prestige: v1 rebuilt on the EGEEP brand |
| `/v6/en`, `/v6/ar` | Iteration 2. Flowing Globe: the brand's globe as an interactive map of the partnerships |
| `/v7/en`, `/v7/ar` | Iteration 2. Chronicle: a cinematic, chaptered story on charcoal and ivory |
| `/v8/en`, `/v8/ar` | Iteration 2. Impact Grid: a light modular platform with interactive data |

Iteration 1 predates the brand guideline and is English-only. Iteration 2 applies [`DESIGN.md`](DESIGN.md) (EGEEP logo, colours, Sakkal Majalla, patterns) and serves every page in English and Arabic (`/v5` redirects to `/v5/en`).

Every version implements the same 8 pages: home, about, areas, countries, best-practices, activities, media and contact (`src/shared/pages.ts`).

## Run it locally

You need [Node.js](https://nodejs.org) 20.19 or newer (22 LTS works) and access to this private repository.

```sh
git clone https://github.com/kaizer122/gov-redesign.git
cd gov-redesign
npm install
npm run build
npm run preview -- --open
```

The last command opens http://localhost:4173. The launcher there links every version, in English and Arabic. Keep the terminal open while presenting; press Ctrl+C to stop. To present without a network, start it before you lose the connection: everything is local except the featured YouTube film.

To change the designs, use `npm run dev` instead (http://localhost:5173, reloads on save).

The walkthrough videos (`videos/`) and screenshots (`screenshots/`) are not in the repository because of their size. Regenerate them with `npm run demos` and `npm run check`, or ask for the files.

## Commands

```sh
npm run dev       # local dev server
npm run build     # typecheck + production build
npm run check     # Playwright: all versions × languages × pages × {desktop, mobile}; needs a prior build
npm run extract   # regenerate data/site.json from data/raw (and fetch missing images from the Wayback Machine)
npm run demos     # record walkthrough videos to videos/<version>.mp4; needs a prior build (`-- v5` for one version)
```

`npm run check` serves `dist/` with `vite preview`. It fails on any console error, uncaught exception or failed request. For iteration 2 it also checks `lang`/`dir` on `<html>` and fails on any Eastern Arabic digit (the brand allows Western digits only). It writes full-page screenshots to `screenshots/<version>/<page>-<desktop|mobile>.png`, or `screenshots/<version>/<lang>/...` for iteration 2. Playwright's Chromium is installed inside the project (`PLAYWRIGHT_BROWSERS_PATH=0`). If it's missing, run `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium`.

`npm run demos` records a tour of each version, encoded as H.264 MP4 at 1440×900, and ends with a mobile segment (390×844). Every video opens with a title card.

- **Iteration 1** goes through all 8 pages: scrolling, the site search, the country search and detail view, and contact-form validation.
- **Iteration 2** (`scripts/demo-tours.mjs`) films each version's interactive parts and switches between English and Arabic from the first seconds, with a caption naming what is on screen. Examples: dragging and pausing the v6 globe, opening a partner from it and playing the "How the network grew" timeline; the v8 command palette, charts and compare tray; the v7 atlas panel and lightbox. Its mobile segment opens in Arabic.

The recorder uses the installed Google Chrome when there is one, because Playwright's bundled Chromium can't play the H.264 ambient video. Shared helpers live in `scripts/demo-kit.mjs`.

## Content

The live site sits behind Cloudflare, which blocked automated access. The content therefore comes from **Wayback Machine captures (August 2025)**, stored in `data/raw/`. `scripts/extract.mjs` parses them into `data/site.json`, typed by `src/data/types.ts`, and saves the images to `public/media/`. The source has no activities or best-practice items, so the versions build those pages from real partnership, area and programme data.

The Arabic site was unreachable too (Cloudflare and the Wayback Machine both refused), so `data/site.ar.json` is a translation of `site.json`, not the official Arabic copy. It holds strings only. `src/data/site.ts` merges it onto `site.json` (`getSite(lang)`) and throws on any missing key. `npm run extract` does not touch it: after a re-extract, translate any new areas, countries or workstreams by hand. Have a native speaker at the office review it before anything ships.

Video:
- `public/media/video/ambient.mp4` is a 33 s muted loop cut with ffmpeg from the programme's own event photography. It stands in for the live site's banner film (`banner_en.mp4`), which couldn't be retrieved.
- The featured film is the World Governments Summit's "Government Experience Exchange Forum" on YouTube. The versions load it only after a click (`youtube-nocookie`); `public/media/video/geef-forum.jpg` is its poster.

## Structure

```
DESIGN.md              EGEEP brand rules: logo, colour, typography, pattern (overrides other docs on brand)
data/site.json         scraped content (generated)
data/site.ar.json      Arabic strings for site.json (hand-maintained)
docs/DESIGN_SYSTEM.md  shared DS setup, tokens, bilingual setup and conventions for all versions
public/brand/          EGEEP logos, pattern artwork and the Sakkal Majalla web font (see DESIGN.md)
public/media/          photography, flags, area logos and video
src/shared/            page contract, version contract, Flag component; for iteration 2 also the
                       bilingual routing shell, i18n helpers, shared UI strings, brand assets, partner coordinates
src/versions/v1..v8/   one self-contained redesign per folder (meta.ts + index.tsx)
tests/                 Playwright check
```
