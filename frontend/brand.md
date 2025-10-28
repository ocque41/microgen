# Microagents Brand Architecture (Dark Mentor System)

The current home experience leans on an obsidian canvas (`#090909`) with soft stone typography (`#d9dcd6`). Aqua energy carries the hero actions while glass overlays and deep teal borders add dimension without lifting the site out of its dark mentor tone.

## Core palette

| Token | Hex | Usage |
| ----- | --- | ----- |
| `Canvas` | `#090909` | Primary page background and mesh overlay base. |
| `Surface` | `#242423` | Cards, panels, and elevated shells. |
| `Surface muted` | `#333533` | Secondary cards, skeleton placeholders, form chrome. |
| `Surface glow` | `#3a7ca5` | Hero glow layers, accent backlighting, radar gradients. |
| `Copy` | `#d9dcd6` | Headline text, navigation, iconography. |
| `Copy secondary` | `#c5c9c2` | Body copy, captions, muted UI states. |
| `Accent` | `#0091ad` | Primary CTA fills, interactive states, key links. |
| `Accent strong` | `color-mix(in srgb, #0091ad 78%, #22aecd 22%)` | Hover states and high-energy moments. |
| `Accent soft` | `color-mix(in srgb, #0091ad 20%, transparent)` | Pills, tinted backgrounds, subtle dividers. |
| `Border` | `#001427` | Card outlines, grid separators, table rules. |
| `Border strong` | `color-mix(in srgb, #001427 65%, #ffffff 15%)` | Focused dividers, data viz frames. |
| `Critical` | `#eb6424` | Error badges, destructive confirmations. |
| `Positive` | `#9ceaef` | Success status ribbons, celebratory highlights. |
| `Warning` | `#fa9500` | Awaiting-action nudges, retention banners. |
| `Info` | `#1b9aaa` | Informational tags, secondary metrics. |

Depth comes from reuse of the glass system variables: `--glass-bg`, `--glass-border`, and the surface overlay ladder defined in `src/styles/tokens.css`. These keep elevation cues consistent without introducing new hues.

## Application summary
- **Navigation**: Canvas background with primary copy (`#d9dcd6`); accent colour only on call-to-action link states.
- **Hero**: Mesh background over `#090909`, glass panels in `#242423`, glow cast using `#3a7ca5` gradients. CTA button pulls from `#0091ad` with `accent strong` on hover.
- **Buttons & links**: Primary calls use `--accent-primary`; secondary and ghost controls lean on `--border-default` and `--text-muted` for calm contrast.
- **Body sections**: Section shells stay on `Canvas`; cards step up through `Surface` and `Surface muted`, optionally layering overlays (`--surface-overlay-70` etc.) for spotlight moments.
- **Footer**: Reverts to the base canvas with muted copy, dotted by soft accent links to maintain visual calm.

## Token map (`frontend/src/styles/tokens.css`)

| Token | Value |
| ----- | ----- |
| `--brand-color-background` | `#090909` |
| `--brand-color-surface` | `#242423` |
| `--brand-color-surface-muted` | `#333533` |
| `--brand-color-surface-glow` | `#3a7ca5` |
| `--brand-color-border` | `#001427` |
| `--brand-color-border-strong` | `color-mix(in srgb, #001427 65%, #ffffff 15%)` |
| `--brand-color-text` | `#d9dcd6` |
| `--brand-color-text-secondary` | `#c5c9c2` |
| `--brand-color-text-muted` | `#a8aea6` |
| `--brand-color-accent` | `#0091ad` |
| `--brand-color-accent-strong` | `color-mix(in srgb, #0091ad 78%, #22aecd 22%)` |
| `--brand-color-accent-soft` | `color-mix(in srgb, #0091ad 20%, transparent)` |
| `--brand-color-critical` | `#eb6424` |
| `--brand-color-positive` | `#9ceaef` |
| `--brand-color-warning` | `#fa9500` |
| `--brand-color-info` | `#1b9aaa` |

## Motion & behavior
- Text swap animation in the hero remains on a 3-second cadence with a 250 ms cross-fade using the copy palette to avoid color flicker.
- Hover states amplify via `accent strong` or overlay variables instead of introducing new colours.
- Focus indicators hold a 3 px aqua outline derived from `--brand-focus-outline`, keeping accessibility contrast against the dark canvas.

## Governance
- Update this document first when palette adjustments ship, then propagate to `frontend/src/styles/tokens.css` and component usage.
- Avoid hard-coded hex values in components; reference CSS variables or tokens to keep overrides centralized.
- Maintain contrast ratios ≥ 9:1 for copy against `Canvas`; run automated contrast checks before merges.
