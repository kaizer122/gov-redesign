# EGEEP brand design rules

Source: *EGEEP Brand Guideline*, August 2026 (`EGEEP BRAND GUIDE Aug 2026.pdf`, 35 pages, Adobe Illustrator export). EGEEP is the Emirates Government Experience Exchange Programme (برنامج الإمارات للتبادل المعرفي الحكومي).

All hex values below come from the PDF's vector fills, which use an sRGB ICC colour space, so they are exact. They are not read off the screenshots. Values marked *measured* were derived from the PDF geometry because the guide gives no number for them.

## Precedence

1. This file. It defines the EGEEP brand: logo, colour, typography and pattern.
2. [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md). This covers the UAE Design System 3.0 setup, its components, markup and accessibility rules.

If they conflict on brand identity (colours, logo, typefaces, graphic motifs), this file wins. The UAE DS still governs component markup, layout behaviour and WCAG 2.2 AA. A brand colour never overrides a contrast requirement (see [Accessibility](#accessibility-on-the-web)).

## Assets

Everything is under `public/brand/` and served at `/brand/...`.

### Logos: `public/brand/logo/`

There are 3 lockups in 4 colourways. Each is a vector SVG (text converted to paths) plus a 300 dpi transparent PNG.

| Lockup | Content | Artboard (pt) |
|---|---|---|
| `bilingual` (primary) | Arabic and English wordmarks stacked, with the UAE emblem on the right | 454 × 166 |
| `arabic` (secondary) | Arabic wordmark and emblem | 436 × 156 |
| `english` (secondary) | English wordmark and emblem | 436 × 135 |

| Colourway | Use on |
|---|---|
| `full-colour` | White backgrounds. This is the default |
| `gold` | Single-colour gold (`#B68A33`). The guide includes it as an artboard but names no background rule for it. Use it only where full colour can't be reproduced |
| `white` | Dark backgrounds |
| `black` | Light (tinted, non-white) backgrounds |

Files are named `egeep-logo-<lockup>-<colourway>.{svg,png}`. For example, `egeep-logo-bilingual-full-colour.svg` is the default header logo.

### Patterns: `public/brand/pattern/`

| File | Concept | Notes |
|---|---|---|
| `flowing-globe.svg` | "Flowing Globe" (الكرة المتدفقة): a sphere drawn from dotted, curving lines | Royal Gold, transparent background |
| `connected-circles.svg` | "Connected Circles" (الدوائر المترابطة): an overlapping open-ring grid | Royal Gold, transparent background |
| `unified-impact.svg` | "Unified Impact" (الأثر الموحّد): a solid radiating burst | Royal Gold, transparent background |
| `unified-impact-dotted.svg` | "Unified Impact", dotted radial variant | Royal Gold, transparent background. The file is large (≈780 KB, 2,600 dots); use the solid variant on performance-sensitive pages |
| `flowing-globe-edge.png` | Full-bleed "Flowing Globe" artwork with two globes at the edges and soft shadows | 200 dpi, transparent. Use as the edge pattern |

The guide presents the tiles on a Light Grey (`#E7E7E7`) card. That card was removed from the exports so the patterns sit directly on Ivory or White, as the pattern rules require.

### Fonts: `public/brand/fonts/`

| File | Face | Notes |
|---|---|---|
| `sakkal-majalla-regular.woff2` | Sakkal Majalla Regular (v5.01, weight 400) | Converted from Microsoft's `majalla.ttf`. Covers Latin and Arabic, including Eastern Arabic digits, which the brand forbids. `src/index.css` declares it with `@font-face` |

### Not provided by the guide

- Video watermark wordmark. The guide calls for an Arabic full name plus English abbreviation, without the emblem, but only shows it inside a mockup. There is no standalone artwork.
- Sakkal Majalla Bold, Tajawal, Cronos Pro and GE Alma. Only Sakkal Majalla Regular is bundled; see [Typography](#typography).
- Partner logos. Third-party marks such as the Sheikh Khalifa Government Excellence Program on page 9 are examples only. Don't reuse them.

## Logo

### Configurations

- The primary logo is the bilingual lockup with both Arabic and English wordmarks. Prefer it everywhere.
- The secondary logos are the Arabic-only and English-only lockups. Use them when the layout can't fit the primary.
- The background rules below apply to every variation: winged, horizontal, vertical and wordmark.

### On backgrounds

| Background | Logo |
|---|---|
| White | Full-colour logo, always |
| Light (tinted) | Black single-colour logo |
| Dark | White single-colour logo |
| Photography / images | **No emblem.** Use the wordmark only |

### Clear space

Keep every other graphic element out of the exclusion zone around the logo. In the guide's construction on page 7, the zone is the same on all four sides. For the primary lockup it is about 18% of the logo height, or about 5% of its width (*measured*: a 19.7 × 18.5 pt margin around a 394.9 × 105.9 pt logo). The guide doesn't name a unit, so treat this as the minimum.

### Partnership / co-branding

- Place the EGEEP logo on the left and the partner logo on the right.
- Set both logos to the same height.
- Make the gap between them equal to the logo height (*measured*: 69 pt gap, 69 pt height).

### Video

- The full logo with the emblem may appear only in the outro.
- If the brand must stay on screen, use the Arabic full name and English abbreviated wordmark, without the emblem, as a watermark in the top-right corner.
- Never use the logo with the emblem as a watermark on footage.
- Don't animate the logo or any part of it. Only simple transitions such as fade in and fade out are allowed.

### Misuse

Always use an approved file, unmodified. Never:

- change opacity, or add drop shadows, colour filters or any other effect;
- stretch, rotate, flip or skew it;
- change its composition or proportions (for example re-stacking the wordmark, changing the emblem's placement, or thickening the type);
- reuse logo elements to build new graphics such as patterns, repeated emblems or new marks;
- recolour it outside the four approved colourways.

## Colour

The palette is meant to express the UAE's values of leadership, collaboration and sustainable progress while staying clear and consistent across every touchpoint.

### Primary

| Name | Hex | RGB | Meaning / role |
|---|---|---|---|
| **Royal Gold** | `#997133` | 153, 113, 51 | Excellence, leadership, prestige, global recognition. The brand colour |
| **Light Grey** | `#E7E7E7` | 231, 231, 231 | Neutrality, balance, structure |
| **Deep Charcoal** | `#1A1A19` | 26, 26, 25 | Use it instead of black: softer, more premium, and it pairs better with gold |
| **Ivory White** | `#F9F7F1` | 249, 247, 241 | A warmer, more refined white. This matters when gold is the primary colour |

### Secondary (programme colours)

Each secondary colour belongs to one EGEEP programme. Use it to identify that programme, not as general decoration.

| Name | Hex | RGB | Programme | Meaning |
|---|---|---|---|---|
| **Deep Blue** | `#2F5CA0` | 47, 92, 160 | International Retreats | Global collaboration, diplomacy, trust |
| **Dark Espresso Brown** | `#4B3B2A` | 75, 59, 42 | VIP Meetings (inside UAE) | Exclusivity, discretion, seniority |
| **Muted Burgundy** | `#7B1F2D` | 123, 31, 45 | MOU Signage | Formal agreements, commitment, authority |
| **Refined Green** | `#417B5D` | 65, 123, 93 | Leadership Program | Growth, development, future leadership |

### Gold usage rules

Use gold for:
- logos and emblems
- headings and key titles
- lines, dividers and accents
- premium materials such as certificates and invitations

Avoid:
- large gold backgrounds
- overusing gold in digital UI
- combining gold with too many other strong colours

### Colours used inside the guide itself

The guide's own layout follows a consistent system that you can copy:

| Role | Hex |
|---|---|
| Section headings, hairline rules, footer band | `#977033` (Royal Gold as rendered; treat it as `#997133`) |
| Body / caption text | `#818385` (mid grey) |
| Logo wordmark gold (logo files only) | `#B68A33` |

Every page uses white, a gold hairline under the heading block, and a solid Royal Gold band at the bottom edge.

### Emblem-only colours: do not use in UI

The UAE emblem in the full-colour logo contains `#2D2A26` / `#231F20` (black), `#CE202F` / `#DA1A32` (red), `#008345` / `#009448` (green) and `#DFDFDE`. These belong to the emblem artwork. They aren't brand palette colours.

### Discrepancy in the source

The pattern page's text gives "Gold `#C8A45D`" and "Light Grey `#E6E6E6`", but the swatches and the pattern artwork itself use `#997133` and `#E7E7E7`. **Use the swatch values** (`#997133`, `#E7E7E7`). `#C8A45D` appears nowhere in the artwork.

### Accessibility on the web

These are WCAG 2.x contrast ratios computed from the hex values above:

| Foreground | on White `#FFFFFF` | on Ivory `#F9F7F1` | on Light Grey `#E7E7E7` | on Charcoal `#1A1A19` |
|---|---|---|---|---|
| Royal Gold `#997133` | 4.41 | 4.11 | 3.56 | 3.95 |
| Deep Charcoal `#1A1A19` | 17.42 | 16.26 | 14.08 | n/a |
| Grey text `#818385` | 3.81 | 3.55 | 3.08 | 4.58 |
| Deep Blue `#2F5CA0` | 6.65 | 6.20 | 5.38 | 2.62 |
| Dark Espresso `#4B3B2A` | 10.72 | 10.01 | 8.67 | 1.62 |
| Muted Burgundy `#7B1F2D` | 10.12 | 9.44 | 8.18 | 1.72 |
| Refined Green `#417B5D` | 4.98 | 4.65 | 4.03 | 3.50 |

What this means for web work (WCAG 2.2 AA):

- **Royal Gold is not body-text safe** on any brand background (all below 4.5). Use it only for large text (≥ 24 px, or ≥ 18.66 px bold), icons, rules and borders (≥ 3:1). That matches the brand's own rule: gold for headings, lines and accents.
- **Body text is Deep Charcoal.** The guide's `#818385` caption grey fails AA for normal text, so on the web keep it to large or non-essential text, or darken it.
- On Charcoal or other dark surfaces, use Ivory or White text. The programme colours (except as large accents) don't have enough contrast there.

### CSS tokens

To bring the palette into code, use these names so every version stays consistent:

```css
--egeep-gold: #997133;          /* Royal Gold */
--egeep-grey-light: #e7e7e7;    /* Light Grey */
--egeep-charcoal: #1a1a19;      /* Deep Charcoal */
--egeep-ivory: #f9f7f1;         /* Ivory White */
--egeep-blue: #2f5ca0;          /* Deep Blue: International Retreats */
--egeep-espresso: #4b3b2a;      /* Dark Espresso Brown: VIP Meetings */
--egeep-burgundy: #7b1f2d;      /* Muted Burgundy: MOU Signage */
--egeep-green: #417b5d;         /* Refined Green: Leadership Program */
```

Follow the per-version theming rule in `docs/DESIGN_SYSTEM.md`: scope tokens under the version root and don't put them in a global `@theme`.

## Typography

| Typeface | Scripts | Used for |
|---|---|---|
| Sakkal Majalla (Regular, Bold) | Arabic + Latin | Primary typeface. Digital materials, publications, reports and advertising, in both languages |
| Tajawal (ExtraLight to Bold) | Arabic + Latin | Social media: Instagram stories and posts |
| Cronos Pro (Latin) + GE Alma (Arabic) | Paired | Federal wordmarks and official stationery only, such as business cards, stamps and document footers. Standard pairing is GE Alma Light + Cronos Pro Regular; bold pairing is GE Alma Black + Cronos Pro Regular |

Rules:
- **Numbers always use Western Arabic numerals** (0–9, as on an English keyboard), in both Arabic and English text. Never use Eastern Arabic digits (٠–٩).
- Don't use Cronos Pro / GE Alma for general content. They are reserved for official wordmarks and stationery.

Notes for the web (not covered by the guide):
- `src/index.css` declares `font-family: "Sakkal Majalla"` at weight 400. It prefers a locally installed copy and falls back to `/brand/fonts/sakkal-majalla-regular.woff2`. Nothing applies it by default. A version opts in under its own root, with a fallback: `font-family: "Sakkal Majalla", sans-serif`.
- There is no Bold file, so `font-weight: 700` text is synthesised by the browser. Ask for `majallab.ttf` before relying on bold headings.
- Sakkal Majalla is a Microsoft font. Its licence (name table, EULA) permits display and embedding in content, but not explicitly web redistribution. Confirm web rights before this ships to a public site.
- Tajawal is open source on Google Fonts and can be self-hosted freely.

## Pattern

### Concept

The circular line pattern represents the continuous exchange of government experience: knowledge flows across entities, borders and programmes, intersections are points of collaboration, and expanding forms show growth and global impact.

Its family name is **"Connected Exchange"** (حلقات التواصل). Interconnected circular lines stand for continuous knowledge exchange, collaboration between governments, expertise flowing across borders, and ongoing development rather than one-off events.

### Building blocks

1. **Circular motion**: overlapping or expanding circles. They must not be perfect concentric targets; keep them slightly dynamic. Circles mean unity, inclusion and continuity; expansion means growth and global reach.
2. **Flowing lines within circles**: thin lines that cross or connect circles, standing for the exchange of knowledge, the movement of ideas and human interaction (not static systems).
3. **Intersections**: the points where lines meet, standing for collaboration and partnerships (MOUs, retreats, leadership programmes).

### Named variants

| Concept | Meaning | Asset |
|---|---|---|
| Connected Circles (الدوائر المترابطة) | Collaboration, continuous communication, strong partnerships between governments | `connected-circles.svg` |
| Flowing Globe (الكرة المتدفقة) | Government knowledge flowing seamlessly between countries | `flowing-globe.svg`, `flowing-globe-edge.png` |
| Unified Impact (الأثر الموحّد) | Radiating lines: unity and collective progress, shared experience creating regional and global impact | `unified-impact.svg`, `unified-impact-dotted.svg` |

### Colour

- Primary lines: Royal Gold.
- Secondary lines: Light Grey (`#E7E7E7`).
- Background: Ivory or White.
- Optional: introduce programme colours (blue, burgundy, green) subtly in some lines to stand for different initiatives.

### Density

| Variation | Form | Use for |
|---|---|---|
| Dense (hero) | More circles and intersections | Event backdrops, opening slides, covers, hero areas |
| Minimal (subtle) | Fewer lines, more spacing | Reports, stationery, VIP materials |
| Edge | The pattern fades in from one side or corner | Keeping layouts clean without visual overload |

### Rules to keep it premium

- Use thin lines only, never thick strokes.
- Keep opacity low, **10–30%**, when the pattern is a background.
- Avoid symmetry that feels mechanical.
- Leave plenty of white or empty space.
- Never build a pattern from logo elements (see [Misuse](#misuse)).
