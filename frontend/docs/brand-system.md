# Microagents Brand System

The brand system follows a restrained, high-contrast palette inspired by focused productivity tools. Tokens ship in `frontend/src/styles/tokens.css` and `frontend/src/styles/type-scale.css`, and they are imported globally from `src/main.tsx`.

## Color & Surface Tokens

- `--brand-color-background`, `--brand-color-surface`, and `--brand-color-surface-muted` provide layered planes with AA contrast by default.
- Glass panes reuse `--glass-bg`, `--glass-blur`, and `--glass-sat`; pair them with `--brand-color-text` or `--brand-color-text-secondary` for copy that stays above 4.5:1 and 3:1 contrast respectively.
- Accent elements draw from `--brand-color-accent` with a stronger `--brand-color-accent-strong` for critical CTAs, while `--brand-color-accent-soft` creates ambient indicators without harming Core Web Vitals.

Every palette token has a light-mode override through `[data-theme="light"]` and a dark default on `:root`. Prefer the provided variables over raw hex values to maintain contrast budgets.

### Tailwind & shadcn/ui Semantics

- `frontend/tailwind.config.ts` maps the palette to semantic utilities: `bg-surface`, `bg-surface-background`, `text-text-muted`, `shadow-glass`, and `border-border-strong` all resolve to the CSS variables above.
- shadcn/ui’s base theme (`--background`, `--foreground`, etc.) pulls straight from the same tokens in `src/index.css` so components like `Card`, `Popover`, and `Button` inherit the brand palette without local overrides.
- Accent helpers live under the `tone` namespace (`tone-accent`, `tone-accent-strong`, `tone-accent-soft`, and `tone-accent-foreground`) and pair with the shared `ring`/`focus` shadows defined in `tokens.css`.
- Status treatments (`state-critical`, `state-positive`) and glass affordances (`glass-border`) reuse contrast-friendly values for badges and translucent surfaces.

## Spacing, Radii, and Elevation

- Spacing progresses in a 4/8 rhythm: `--brand-space-3xs` (4px) to `--brand-space-2xl` (64px).
- Radii (`--brand-radius-xs` → `--brand-radius-2xl`) keep corners consistent between glass and solid panes.
- Elevation shadows (`--brand-shadow-xs` → `--brand-shadow-lg`) and blur tokens (`--brand-blur-sm` → `--brand-blur-lg`) help communicate depth without introducing layout shift.

## Fluid Type Scale

`frontend/src/styles/type-scale.css` introduces a clamp-based scale:

- Base body size (`--font-size-md`) fluidly shifts between 14px and 20px.
- Headings map up to `--font-size-3xl`, while supporting roles use `--font-size-sm` and `--font-size-xs` with relaxed line heights.
- The scale relies on the Inter variable family registered in `typography.css`; use semantic elements so the clamp-based rules cascade correctly.

## Focus & Motion Guidance

- Focus rings apply a 3px halo defined by `--brand-focus-outline`. Avoid overriding this value directly—extend it via `box-shadow` layers if a component needs secondary emphasis.
- Scroll-driven motion lives in `frontend/src/styles/scroll.css`. Utilities like `.scroll-track`, `.scroll-driven`, and `.scroll-poster` pair with keyframes (`scroll-fade-in-up`, `scroll-scale-in`) and automatically disable timelines when `prefers-reduced-motion` or the `.motion-disabled` class is active.
- View transitions are centralized in `frontend/src/lib/viewTransitions.ts`. `TransitionLink`/`TransitionNavLink` wrappers opt into `Link`/`NavLink` view transitions when supported, while imperative navigation should call `navigateWithViewTransition` or `startViewTransition`.
- Framer Motion is reserved for shared-element choreography inside `frontend/src/components/motion/SharedElementSpotlight.tsx`. When motion is suppressed the transitions fall back to instant state changes so INP budgets stay intact.
- The `/brand` preview route consumes shared helpers in `frontend/src/styles/brand-preview.css` (`.brand-surface-card`, `.brand-focus-card`, `.brand-focus-button`, etc.) so that token spacing, radius, focus styling, and motion scaffolding stay consistent without inline overrides.

## Verifying Contrast on Glass

To confirm translucent panes meet AA+ requirements:

1. Visit `/brand` and tab to the “Test focus ring” control to verify the accent halo renders on both dark and light themes.
2. Inspect Tailwind-driven panes in the main app (`bg-surface-background`, `bg-surface-glass`, `text-text-muted`) to confirm semantic utilities resolve correctly before running contrast tools.
3. Use your preferred contrast checker (e.g., Stark, Polypane) against the glass cards. The body copy samples target ≥ 4.8:1, secondary copy ≥ 3.4:1, and accent CTAs ≥ 3:1 against glow panes.
4. Toggle `prefers-reduced-motion` (or add the `.motion-disabled` class to the `<body>`) to confirm scroll posters appear, view transitions no-op, and Framer Motion components skip animation frames.

Following these steps keeps the glass aesthetic accessible while maintaining Core Web Vitals budgets.
