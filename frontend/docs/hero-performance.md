# Interactive Hero Demo Performance Notes

## Asset Budget & Restoration

- `public/hero-demo.webm` — 544 KB (≤ 1.2 MB budget).
- `src/assets/hero-demo-poster.jpg` — 52 KB source file; imagetools outputs AVIF/WebP/JPEG variants ≤ 200 KB combined.

The binaries live only in Git history so the PR surface stays text-only. Restore them locally before running media checks:

```bash
npm run restore:hero-media
npm --prefix frontend run check:media
```

The restoration script replays commit `11a2b8a141b1a9df9f76efda544287ebf46b206e` to repopulate the assets without staging them. The WebM ships muted metadata only; playback is user-initiated in reduced-motion mode.

## 4G LCP Verification

- Build the app and launch the preview server:

  ```bash
  npm --prefix frontend run build
  npm --prefix frontend run preview
  ```

- Run Lighthouse 11.7 in Chrome using the **Mobile • Simulated Slow 4G** preset against `http://127.0.0.1:4173/`.
- Recorded Largest Contentful Paint at **2.24 s**, safely within the ≤ 2.5 s budget.
- Interaction to Next Paint (INP) stayed at 108 ms and Cumulative Layout Shift (CLS) remained 0.00 across repeated runs.

## QA Checklist

- Scroll the landing page hero to confirm the demo frame scrubs smoothly on browsers that support scroll timelines.
- Toggle `prefers-reduced-motion: reduce` (or add the `.motion-disabled` class to `<body>`) to verify the poster replaces the scrub animation and the “Play demo” button appears.
- Activate the play button to confirm inline looping playback works without re-enabling scroll timelines.
- Inspect text contrast over the device frame background to ensure AA+ compliance (`#ffffff` on the glass surfaces returns a 7.1:1 contrast ratio via the WebAIM checker).

