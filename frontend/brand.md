# Microagents Brand Architecture (Dark Mentor System)

The current home experience stays anchored to the obsidian canvas (`#090909`) while typography steps up to crisp bone copy (`#f9f9f9`). Warm neutrals from cream through graphite introduce subtle elevation accents without stealing focus from the deep base.

## Core palette

| Token | Hex | Usage |
| ----- | --- | ----- |
| `Canvas` | `#090909` | Primary page background and mesh overlay base. |
| `Surface` | `#21201c` | Cards, panels, and elevated shells. |
| `Surface muted` | `#2f2d28` | Secondary cards, skeleton placeholders, form chrome. |
| `Surface glow` | `#9d937c` | Hero glow layers, accent backlighting, radar gradients. |
| `Copy` | `#f9f9f9` | Headline text, navigation, iconography. |
| `Copy secondary` | `#ccc5a3` | Body copy, captions, muted UI states. |
| `Accent` | `#e8cca3` | Primary CTA fills, interactive states, key links. |
| `Accent strong` | `color-mix(in srgb, #e8cca3 72%, #ccc5a3 28%)` | Hover states and warm highlights. |
| `Accent soft` | `color-mix(in srgb, #e8cca3 18%, transparent)` | Pills, tinted backgrounds, subtle dividers. |
| `Border` | `#171c12` | Card outlines, grid separators, table rules. |
| `Border strong` | `color-mix(in srgb, #171c12 65%, #f9f9f9 15%)` | Focused dividers, data viz frames. |
| `Critical` | `#eb6424` | Error badges, destructive confirmations. |
| `Positive` | `#9ceaef` | Success status ribbons, celebratory highlights. |
| `Warning` | `#fa9500` | Awaiting-action nudges, retention banners. |
| `Info` | `#1b9aaa` | Informational tags, secondary metrics. |

Depth comes from reuse of the glass system variables: `--glass-bg`, `--glass-border`, and the surface overlay ladder defined in `src/styles/tokens.css`. These keep elevation cues consistent without introducing new hues.

## Application summary
- **Navigation**: Canvas background with primary copy (`#f9f9f9`); accent colour only on call-to-action link states.
- **Hero**: Mesh background over `#090909`, glass panels in `#21201c`, glow cast using the taupe ladder (`#9d937c`) for subtle warmth. CTA button pulls from `#e8cca3` with `accent strong` on hover.
- **Buttons & links**: Primary calls use `--accent-primary`; secondary and ghost controls lean on `--border-default` and `--text-muted` for calm contrast.
- **Body sections**: Section shells stay on `Canvas`; cards step up through `Surface` and `Surface muted`, optionally layering overlays (`--surface-overlay-70` etc.) for spotlight moments.
- **Footer**: Reverts to the base canvas with muted copy, dotted by soft accent links to maintain visual calm.

## Token map (`frontend/src/styles/tokens.css`)

| Token | Value |
| ----- | ----- |
| `--brand-color-background` | `#090909` |
| `--brand-color-surface` | `#21201c` |
| `--brand-color-surface-muted` | `#2f2d28` |
| `--brand-color-surface-glow` | `#9d937c` |
| `--brand-color-border` | `#171c12` |
| `--brand-color-border-strong` | `color-mix(in srgb, #171c12 65%, #f9f9f9 15%)` |
| `--brand-color-text` | `#f9f9f9` |
| `--brand-color-text-secondary` | `#ccc5a3` |
| `--brand-color-text-muted` | `#9d937c` |
| `--brand-color-accent` | `#e8cca3` |
| `--brand-color-accent-strong` | `color-mix(in srgb, #e8cca3 72%, #ccc5a3 28%)` |
| `--brand-color-accent-soft` | `color-mix(in srgb, #e8cca3 18%, transparent)` |
| `--brand-color-critical` | `#eb6424` |
| `--brand-color-positive` | `#9ceaef` |
| `--brand-color-warning` | `#fa9500` |
| `--brand-color-info` | `#1b9aaa` |

## Motion & behavior
- Text swap animation in the hero remains on a 3-second cadence with a 250 ms cross-fade using the copy palette to avoid color flicker.
- Hover states amplify via `accent strong` or overlay variables instead of introducing new colours.
- Focus indicators hold a 3 px warm ivory outline derived from `--brand-focus-outline`, keeping accessibility contrast against the dark canvas.

## Governance
- Update this document first when palette adjustments ship, then propagate to `frontend/src/styles/tokens.css` and component usage.
- Avoid hard-coded hex values in components; reference CSS variables or tokens to keep overrides centralized.
- Maintain contrast ratios ≥ 9:1 for copy against `Canvas`; run automated contrast checks before merges.
