# Microagents Brand Architecture (Dark Mentor System)

A single graphite canvas (`#171717`) and bone text (`#F4F1EA`) now ground every experience. Accent energy is reserved for the hero, keeping the brand formal and minimal while still signalling action at the precise moment a user is ready to engage.

## Core palette

| Token | Hex | Usage |
| ----- | --- | ----- |
| `Canvas` | `#171717` | Sole background across marketing, product, docs. |
| `Copy` | `#F4F1EA` | All typography, icons, neutral UI chrome. |
| `Hero accent` | `#936639` | “Get started” link, primary CTA fills. |
| `Hero glow` | `#7F4F24` | Base wash within the hero gradient/image. |
| `Hero highlight` | `#A68A64` | Hover state and soft lighting layered above the wash. |

Depth comes from transparent overlays of the copy colour (e.g. `rgba(244,241,234,0.06)` on raised cards) and soft drop shadows. No borders or secondary hues are introduced.

## Application summary
- **Navigation**: Logo only; CTA sits independently to keep focus on the hero headline.
- **Hero**: Full viewport, gradient overlay referencing `#7F4F24 → #A68A64 → #171717`, plus a gradient card image mirroring that wash. Animated microcopy cycles through the top ten agent capabilities every three seconds.
- **Buttons & links**: Primary CTA and “Get started” link use `#936639` and hover to `#A68A64`.
- **Body sections**: Each section fills the viewport (How it works, Pricing, Testimonial) with graphite backgrounds and translucent cards.
- **Footer**: Also viewport height, centered copy reminding audiences of the mentor-style promise.

## Token map (`frontend/src/index.css`)

| Token | Value |
| ----- | ----- |
| `--bg`, `--bg-elev`, `--bg-overlay` | `#171717` |
| `--text`, `--text-muted`, `--accent-inverse` | `#F4F1EA` |
| `--accent`, `--ring`, `--destructive` | `#936639` |
| `--accent-hover` | `#A68A64` |
| `--support-*`, `--positive`, `--warning`, `--critical` | Reuse graphite base with translucent overlays of `#936639`, `#7F4F24`, `#A68A64` as needed. |

## Motion & behavior
- Text swap animation on the hero feature list updates every 3 seconds with a 250 ms cross-fade/slide.
- Hover states remain understated: opacity shifts on graphite elements, colour shift to `#A68A64` on the CTA.
- Focus indicators hold a 2 px outline in `#936639` with a 4 px offset to remain visible on the dark canvas.

## Governance
- Any colour change updates this document first, then propagates to `frontend/src/index.css` and component usage.
- Hard-coded hex values are prohibited in components; reference CSS variables instead.
- Contrast ratios (copy vs. canvas) remain ≥ 9:1; verify via automated contrast checks before shipping.
