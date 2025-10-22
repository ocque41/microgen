# Microagents Brand Architecture (Dark Mentor System)

The Microagents identity stays rooted in a deep graphite backdrop (#171717) while layering a heritage-inspired earth-and-sage palette for structure, motion, and states. The tones come from premium editorial design patterns—warm metallics for action, grounded greens for trust, and soft clay neutrals for content depth.

## Strategic hierarchy
- **Background constant** – `#171717` remains the only base surface so the system feels consistent from marketing to product.
- **Warm authority accents** – Russet and seal brown hues animate CTAs, alerts, and progress, evoking deliberate craftsmanship rather than hype.
- **Balanced sages** – Reseda, ebony, and khaki variants provide calm guidance for cards, navigation, and secondary copy.
- **Tone of voice** – Formal, evidential, and sentence-case; every message should read like a mentor summarizing outcomes.

## Palette roles
| Token | Hex | Palette source | Purpose |
| ----- | --- | -------------- | ------- |
| `--bg` | `#171717` | Base | Primary background on every surface. |
| `--bg-elev` | `#1f2518` | black_olive 300 | Raised containers, dashboard panes. |
| `--bg-overlay` | `#272b1e` | ebony 300 | Hover states, table rows, menus. |
| `--border` | `#343929` | ebony 400 | 1 px separators, input borders. |
| `--text` | `#ede8e0` | lion 900 | Primary text and headings. |
| `--text-muted` | `#d3cebc` | khaki 700 | Supporting copy, helper text. |
| `--accent` | `#b57033` | russet 600 | Primary CTAs, focus ring, key links. |
| `--accent-hover` | `#d1935d` | russet 700 | CTA hover/active states. |
| `--accent-inverse` | `#171717` | Base | Text over warm accents. |
| `--neutral-elev` | `#a7b08a` | reseda_green 700 | Secondary buttons, tabs. |
| `--positive` | `#899465` | reseda_green 600 | Success text/icons. |
| `--positive-surface` | `#282c1e` | reseda_green 200 | Success background fills. |
| `--critical` | `#9f5519` | seal_brown 600 | Errors, destructive actions. |
| `--critical-surface` | `#351c08` | seal_brown 300 | Error background fills. |
| `--warning` | `#ba854f` | raw_umber 600 | Pending states, notices. |
| `--warning-surface` | `#3b2917` | raw_umber 200 | Warning background fills. |

## Typography
- **Typeface**: `"Helvetica Neue", sans-serif` across hierarchy.
- **Weights**: 600 for headings, 400 for body.
- **Casing**: Sentence case. Avoid all caps.

## Component system
- **Primary button** – Fill with `var(--accent)`, text uses `var(--accent-inverse)`. Hover swaps background to `var(--bg)` with text `var(--accent)` and `1px` outline in `var(--accent)`.
- **Secondary button** – Border `var(--neutral-elev)`, text `var(--neutral-elev)`, hover fills with `var(--neutral-elev)` and text flips to `var(--accent-inverse)`.
- **Cards & overlays** – Background `var(--bg-elev)`, border `var(--border)`, 24px radius, `0 32px 70px -50px rgba(0,0,0,0.65)` shadow.
- **Feedback** – Status ribbons use `var(--positive)`/`var(--critical)` text over their matching surface tokens.

## Motion & spacing
- **Spacing grid**: 8 px multiples, 24 px minimum outer padding.
- **Animation**: Ease-out 180 ms for hovers, 320 ms for modals.

## Accessibility guardrails
- Maintain contrast ratios (4.5:1 for body, 3:1 for large text). The accent and state pairings above meet AA on `#171717`.
- Preserve focus-visible outlines (`var(--accent)` or state color) with 2 px offset.
- Provide descriptive alt text for imagery; the hero photo emphasizes control dashboards and should mention that narrative.

## Governance
- Any color tweaks start in this document, then propagate to `src/index.css` tokens.
- Run ESLint + visual contrast checks before PR approval.
- Marketing and product teams share a single palette sheet; no ad-hoc hex codes in commits.
