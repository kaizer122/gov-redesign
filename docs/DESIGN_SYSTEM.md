# Design system setup: UAE Design System 3.0 + Tailwind v4

All redesigns (iteration 1: v1–v4, iteration 2: v5–v8) share one setup, done as https://designsystem.gov.ae/docs/installation describes for Tailwind v4.

## What is installed

| Package | Role |
|---|---|
| `@aegov/design-system` 3.0.x | The DS Tailwind plugin. It adds base styles, the `aegov-*` component classes and the color tokens |
| `tailwindcss` 4 + `@tailwindcss/vite` | Tailwind v4 through the official Vite plugin, so there is no `tailwind.config.js` |
| `@tailwindcss/forms`, `@tailwindcss/typography` | Required by the DS |
| `@fontsource/inter`, `@fontsource/alexandria` | The DS plugin loads Roboto 300–900, Inter 200/600–800 and Alexandria 200/600–800 from Google Fonts. These packages self-host the weights it leaves out (Inter and Alexandria at 400/500), imported in `src/main.tsx` |
| `country-flag-icons` | Self-hosted SVG flags, used through `src/shared/Flag.tsx` |
| `@phosphor-icons/react` | The icon library the DS iconography guideline names |

`src/index.css` is the single Tailwind entry:

```css
@layer base;
@import "tailwindcss";
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";
@plugin "@aegov/design-system";
```

We use the plugin rather than `@aegov/design-system-react`, because the React package requires Tailwind v3.4.

## Tokens

The DS defines its colors as CSS custom properties on `:where(:root)` and exposes them as Tailwind colors:

- `primary-50…950` (= `aegold`, the default UAE gold), `secondary-50…950` (= `aeblack`)
- `primary-support` (= `camel`), `secondary-support` (= `seablue`), `aered-support`
- Brand palettes: `aegold`, `aered`, `aegreen`, `aeblack`, `whitely` (50–500), `camel`, `slate`, `fuchsia`, `techblue`, `seablue`, `desert`
- Fonts: `--font-body` is Roboto and `--font-heading` is Inter. `--font-alexandria` and `--font-inter` are also defined.

Write utilities such as `bg-primary-600`, `text-aeblack-800`, `border-camel-300`, `font-[family-name:var(--font-alexandria)]`.

### Per-version theming

Overriding `@theme` in `src/index.css` would affect every version, so don't do it. Each version may remap DS tokens under its own root wrapper in `src/versions/<id>/theme.css`:

```css
.v2-root {
  --color-primary-600: var(--color-techblue-600);
  /* ...remap the full primary-50..950 scale so DS components stay consistent */
}
```

DS components read these variables, so a remap restyles `aegov-btn` and the rest. To use `@apply` in a version CSS file, add `@reference "../../index.css";` at the top.

## Component classes (from the plugin)

Components: `aegov-accordion`, `aegov-alert`, `aegov-avatar`, `aegov-badge`, `aegov-banner`, `aegov-breadcrumb`, `aegov-btn` (modifiers `btn-outline`, `btn-soft`, `btn-link`, `btn-secondary`, `btn-sm`, `btn-lg`, `btn-xs`, `btn-icon`, `btn-block`), `aegov-card` (`card-bordered`, `card-glow`, `card-news`, `card-service`, `card-stacked`, `card-creative`, `card-sm`, `card-lg`, inner `card-content`, `card-title`, `card-image`), `aegov-check-item`, `aegov-dropdown`, `aegov-file`, `aegov-form-control` (inner `form-control-input`, `control-suffix`, `control-prefix`), `aegov-hero` / `aegov-hero-static`, `aegov-link`, `aegov-modal`, `aegov-pagination`, `aegov-popover`, `aegov-quote`, `aegov-step`, `aegov-tab`, `aegov-toast`, `aegov-toggle`, `aegov-tooltip`.

Blocks: `aegov-header` and `aegov-footer`.

Before using a component, check its exact markup on its docs page, e.g. `https://designsystem.gov.ae/docs/components/card`, `/docs/components/button`, `/docs/blocks/hero`, `/docs/blocks/header`, `/docs/blocks/footer`. The pattern is `/docs/components/<name>` and `/docs/blocks/<name>`. The DS JavaScript bundle (`aegov-scripts`) is **not** loaded. Implement any interactivity (menus, accordions, tabs, modals) with React state and keep the DS class names and ARIA attributes.

## DS guidelines that apply here

- Meet WCAG 2.2 AA: visible focus, skip link, semantic landmarks, alt text, 4.5:1 text contrast.
- Header: entity logo top-left, at most 7 primary nav items, first item is Home.
- Write icons as Phosphor React components.

## Bilingual versions (iteration 2: v5–v8)

Each iteration 2 version serves every page in English and Arabic: `/v5/en/about`, `/v5/ar/about`. `/v5` redirects to `/v5/en`.

| File | Role |
|---|---|
| `src/shared/BilingualVersion.tsx` | Routing shell. Sets `lang`/`dir` on `<html>` and the version root, sets the document title, restores scroll. Hooks: `usePageHref`, `useLangSwitchHref`, `useCurrentPage` |
| `src/shared/i18n.ts` | `useLang`, `useT(dict)` for `Record<key, { en, ar }>` dictionaries, and `formatNumber`/`formatDate`, which force Western digits (`ar-AE-u-nu-latn`) |
| `src/shared/strings.ts` | Shared UI strings (`UI`) and the four EGEEP programmes with their colours (`PROGRAMMES`) |
| `src/shared/brand.tsx` | `<Logo>` (approved files only), pattern URLs, the ambient video and the featured YouTube film |
| `src/shared/geo.ts` | Partner coordinates and regions for maps |
| `data/site.ar.json` | Arabic strings for `SiteData`. `src/data/site.ts` merges them onto `site.json` (`getSite(lang)`) and throws on a missing key, so arrays stay index-aligned with English |

The DS switches `--font-heading`/`--font-body` to Alexandria and Noto Kufi under `[dir="rtl"]`, and some components set `font-family: var(--font-alexandria)` directly. To keep Sakkal Majalla in both languages, a version overrides `--font-body`, `--font-heading`, `--font-alexandria`, `--font-notokufi` and `--font-inter` on both `.vX-root` and `.vX-root[dir="rtl"]`.

For layout, use logical utilities (`ms-`, `pe-`, `start-`, `text-start`, `border-s`) and flip directional icons with `rtl:-scale-x-100`. Wrap phone numbers, emails and mixed values in `<bdi>` inside Arabic text.
