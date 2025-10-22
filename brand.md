# Microagents Brand Architecture (Dark Mentor System)

The Microagents interface remains a dark-first experience that prioritises formal calm. We lock the base canvas to deep graphite while layering the heritage palette provided by brand—earth, clay, and sage hues—for controlled atmosphere. Every surface now relies on colour-mixed fields instead of borders so the system feels minimal, editorial, and deliberate.

## Foundational constants
- **Canvas**: `#171717` is the universal backdrop across marketing, product, and docs.
- **Copy**: `#c2c5aa` (sage 500) covers all body and heading text; supporting copy shifts to `#dadccc` (sage 700).
- **Radius**: 8 px default system radius (applied via `--radius`).
- **Voice**: Mentor tone; formal, evidential, sentence case, minimal humour.

## Palette dictionary
Each palette supplies start / mid / end stops. Outer stops are unique to individual sections; mid stops can be shared to stitch the system together.

| Palette | 100 | 500 | 900 |
| ------- | --- | --- | --- |
| **Seal brown** | `#120903` | `#582f0e` | `#f4d3b8` |
| **Russet** | `#191007` | `#7f4f24` | `#f0dbc9` |
| **Raw umber** | `#1d140b` | `#936639` | `#eee0d3` |
| **Lion** | `#221c13` | `#a68a64` | `#ede8e0` |
| **Khaki** | `#27241a` | `#b6ad90` | `#f0efe9` |
| **Sage (deep)** | `#2a2c1e` | `#c2c5aa` | `#f3f3ee` |
| **Sage (muted)** | `#222419` | `#a4ac86` | `#edeee7` |
| **Reseda green** | `#14160f` | `#656d4a` | `#e2e5d8` |
| **Ebony** | `#0d0e0a` | `#414833` | `#dadfd2` |
| **Black olive** | `#0a0c08` | `#333d29` | `#d6dece` |

Shared mid accents (russet 600 `#b57033`, lion 500 `#a68a64`, khaki 500 `#b6ad90`) provide the warm articulation points used in buttons, typography accents, and illustrations.

## Section distribution

| Section | Palette | Start (unique) | Shared mids | End (unique) | Notes |
| ------- | ------- | -------------- | ----------- | ------------- | ----- |
| Hero | Seal brown | `#120903` | `#b57033`, `#a68a64` | `#f4d3b8` | Gradient field under hero content; CTAs use russet mid, copy stays sage. |
| How it works | Russet | `#191007` | `#b57033`, `#a68a64` | `#f0dbc9` | Cards float on colour-mix panels; no dividers or strokes. |
| Pricing + CTA | Raw umber | `#1d140b` | `#b57033`, `#b6ad90` | `#eee0d3` | Booking panel uses semi-transparent umber mix; links reuse shared accents. |
| Quote & support | Ebony | `#0d0e0a` | `#c2c5aa`, `#a4ac86` | `#dadfd2` | Testimonials, dashboard shells, and ChatKit frame. |
| Feedback states | Seal brown / Reseda / Raw umber mids | Unique per state | `#c2c5aa` text shared | — | Backgrounds tint via colour-mix with zero outlines. |

## Token map (key exports in `src/index.css`)

| Token | Value | Source |
| ----- | ----- | ------ |
| `--bg` | `#171717` | Canvas |
| `--bg-elev` | `#1a1d14` | Ebony 200 |
| `--bg-overlay` | `#232417` | Black olive 300 |
| `--text` | `#c2c5aa` | Sage (deep) 500 |
| `--text-muted` | `#dadccc` | Sage (deep) 700 |
| `--accent` | `#b57033` | Russet 600 |
| `--accent-hover` | `#de7c2b` | Seal brown 700 |
| `--accent-inverse` | `#c2c5aa` | Matches body text |
| `--positive` | `#6a7553` | Ebony 600 |
| `--warning` | `#ba854f` | Raw umber 600 |
| `--critical` | `#9f5519` | Seal brown 600 |
| `--positive-surface` | `#1f2518` | Black olive 300 |
| `--warning-surface` | `#3b2917` | Raw umber 200 |
| `--critical-surface` | `#351c08` | Seal brown 300 |
| `--section-hero-start` | `#120903` | Seal brown 100 |
| `--section-hero-end` | `#f4d3b8` | Seal brown 900 |
| `--section-how-start` | `#191007` | Russet 100 |
| `--section-how-end` | `#f0dbc9` | Russet 900 |
| `--section-pricing-start` | `#1d140b` | Raw umber 100 |
| `--section-pricing-end` | `#eee0d3` | Raw umber 900 |
| `--section-quote-start` | `#0d0e0a` | Ebony 100 |
| `--section-quote-end` | `#dadfd2` | Ebony 900 |

Gradients and panels use `color-mix` to blend these values with the graphite canvas, eliminating the need for contrasting borders.

## Component guidance
- **Primary actions**: Filled pills (`background: var(--accent)`) with sage text; hover darkens to the section’s unique start colour but keeps text unchanged.
- **Secondary actions**: Semi-transparent graphite fills (`rgba(23,23,23,0.65)`) with the same focus outline as primary.
- **Cards & panels**: Use palette-specific colour mixes plus deep soft shadows; no outlines or strokes.
- **Inputs**: Graphite fills with accent focus outline; idle state has zero border.
- **Feedback**: State colours tint the backdrop via `color-mix`; copy stays `#c2c5aa`.

## Motion & spacing
- 8 px spacing grid, 24 px minimum outer padding, hero image radii at 40 px+ for premium feel.
- Hover transitions at 180 ms ease-out; large overlays at 320 ms.

## Accessibility guardrails
- Body copy maintains ≥4.5:1 contrast on every blended surface; headings are ≥3:1.
- Focus outlines remain 2 px with 4 px offset for dark-field clarity.
- All imagery gets descriptive, process-focused alt text to reinforce the mentor voice.

## Governance
- Palette updates start in this document, then flow to `src/index.css` tokens before component changes.
- Avoid hard-coded hex values in components—reference CSS variables instead.
- Run ESLint and contrast checks before shipping; publish palette updates with version tags for downstream teams.
