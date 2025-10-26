# Story Sections — Glass + Pinned Narratives

The `/` marketing route now includes three scroll-guided story sections that demonstrate how to combine glass surfaces, pinned copy, and subtle parallax without shipping heavy JavaScript.

## When to use glass vs. solid surfaces

- **Use glass** when content reinforces a high-signal metric or escalation. The blur keeps the background contextually present while AA+ contrast is preserved with `color-mix` overlays and `var(--text-primary)` foregrounds.
- **Use solid** (`var(--surface-base)` / `var(--surface-muted)`) when dense tables, long-form copy, or form elements need maximum legibility. Solid panels should fall back to the standard surface tokens without the blur filter.
- Avoid stacking more than two glass panes without additional spacing—the blur layer has a `--glass-blur` of `24px`, so nested glass can wash out focus states.

## Interaction & motion behavior

- Each section pins the left column using `position: sticky` so the context and progress indicator stay visible throughout the scroll scene.
- Steps animate with the shared `.scroll-driven` utilities defined in `frontend/src/styles/scroll.css`. The cards rely on the `scroll-fade-in-up` keyframe and a custom `story-parallax` glow for depth.
- Reduced-motion users (or anyone toggling the `motion-disabled` kill switch) see static cards: the CSS disables the timelines, removes transforms, and keeps the glass opacity toned down so the reading order and contrast stay intact.

## QA checklist

1. Load `/` on a modern browser with scroll-timeline support. Scroll slowly through the story stack and confirm:
   - The left column remains pinned.
   - Cards fade up sequentially with a subtle parallax glow.
   - Metrics (e.g., `Policy gaps ↓37%`) are readable against the glass background (≥4.5:1 contrast).
2. Enable the OS-level "Reduce Motion" setting **or** add `motion-disabled` to `<body>` in DevTools. Reload `/` and verify:
   - Cards render without scroll-driven animation or parallax shifts.
   - The sections collapse to natural height (no 140vh padding).
   - Text contrast still meets AA+ on every panel.

All styling lives in `frontend/src/sections/story/story.css`; tweak the glass mix values there if future art direction changes require different contrast ratios.

