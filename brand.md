# Microagents Brand Guide (Light Minimal)

The refreshed Microagents identity is bright, formal, and minimal. Marketing surfaces lean on a serif display headline, generous spacing, and a cool cyan accent to communicate clarity.

## Core principles
- **Neutral light palette** – White backgrounds (#ffffff) with near-black copy (#111111) improve legibility and convey seriousness.
- **Serif display headline + sans body** – Headlines use the platform serif stack while supporting copy uses the system sans stack.
- **Generous spacing** – Minimum 24px padding/margins to keep the site airy and focused on the copy.
- **Single accent** – Cyan (#0ea5e9) drives CTAs, focus rings, and data callouts; hover states darken to #0284c7.

## Typography
- **Headlines**: `font-family: ui-serif, Georgia, serif;`
- **Body**: `font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif;`
- **Headline casing**: Sentence case only (e.g., “Microagents that work for you”).

## Color tokens
| Token | Value | Usage |
| ----- | ----- | ----- |
| `--bg` | `#ffffff` | Page background |
| `--fg` | `#111111` | Primary text |
| `--muted` | `#4b5563` | Supporting copy |
| `--accent` | `#0ea5e9` | Buttons, links, focus outlines |
| `--accent-hover` | `#0284c7` | Hover state for interactive controls |

## Components
- **Navbar** – Left-aligned “Microagents” wordmark, right-aligned primary CTA. 32px vertical padding, 32px horizontal gutter.
- **Primary button** – 16px × 28px padding, 12px radius, white text on cyan background, focus-visible ring using the accent.
- **Cards** – 32px padding, 18px radius, soft shadow (`0 10px 30px rgba(15,23,42,0.06)`).
- **Hero media** – 20px outer radius, 8px inner padding, light gray frame for screenshots.

## Assets
Placeholder JPEGs live under `site/assets/` and should be replaced with product captures when available:
- `hero-placeholder.jpg`
- `step1-placeholder.jpg`
- `step2-placeholder.jpg`
- `step3-placeholder.jpg`
- `og-image.jpg`

## Accessibility reminders
- Ensure text contrast ≥4.5:1 and large headings ≥3:1.
- Maintain focus-visible outlines on all interactive elements.
- Provide descriptive alt text for informative imagery following the W3C decision tree.
