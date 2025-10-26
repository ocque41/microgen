import "../styles/brand-preview.css";

import { ScrollDrivenShowcase } from "@/components/motion/ScrollDrivenShowcase";
import { SharedElementSpotlight } from "@/components/motion/SharedElementSpotlight";

export type BrandPreview = {
  surfaces: Array<{
    id: string;
    label: string;
    description: string;
    token: string;
    textToken: string;
    accentToken?: string;
  }>;
  focusNotes: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  contrastChecks: Array<{
    id: string;
    label: string;
    ratio: string;
    backgroundToken: string;
    foregroundToken: string;
    description: string;
  }>;
};

type BrandPageProps = {
  preview: BrandPreview;
};

export function BrandPage({ preview }: BrandPageProps) {
  return (
    <main aria-labelledby="brand-system-heading" className="brand-page">
      <div className="brand-page__container">
        <header className="brand-section">
          <p className="caption brand-secondary-text">Sprint 11 Foundations</p>
          <h1 id="brand-system-heading">Microagents Brand System</h1>
          <p className="lead brand-secondary-text">
            High-contrast, glass-forward surfaces inspired by productivity AI tools. Tokens adapt between dark
            and light while protecting Core Web Vitals and focus visibility.
          </p>
        </header>

        <section aria-labelledby="brand-surfaces-heading" className="brand-section">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="brand-section__intro">
              <h2 id="brand-surfaces-heading">Surfaces</h2>
              <p className="brand-secondary-text">
                Structured around background, muted, and glass panes with legible text and ambient accents.
              </p>
            </div>
          </div>
          <div className="grid brand-grid md:grid-cols-3">
            {preview.surfaces.map((surface) => (
              <article
                key={surface.id}
                aria-label={`${surface.label} preview`}
                className="brand-surface-card"
                style={{
                  background: `var(${surface.token})`,
                  color: `var(${surface.textToken})`,
                }}
              >
                <div className="brand-section__intro">
                  <span className="caption brand-secondary-text">{surface.token}</span>
                  <h3>{surface.label}</h3>
                  <p className="brand-secondary-text">{surface.description}</p>
                </div>
                {surface.accentToken ? (
                  <div
                    aria-hidden="true"
                    className="brand-card-accent"
                    style={{ background: `var(${surface.accentToken})` }}
                  />
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="focus-guidance-heading" className="brand-section">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="brand-section__intro">
              <h2 id="focus-guidance-heading">Focus</h2>
              <p className="brand-secondary-text">
                A saturated accent halo maintains AA contrast on both dark and light panes.
              </p>
            </div>
            <button type="button" className="brand-focus-button">
              Test focus ring (press Tab)
            </button>
          </div>
          <ul className="grid brand-grid list-none p-0 md:grid-cols-3">
            {preview.focusNotes.map((note) => (
              <li key={note.id} className="brand-focus-card">
                <h3>{note.title}</h3>
                <p className="brand-secondary-text">{note.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="contrast-heading" className="brand-section">
          <div className="brand-section__intro">
            <h2 id="contrast-heading">Copy contrast on glass</h2>
            <p className="brand-secondary-text">
              These samples meet or exceed WCAG AA+ contrast (4.5:1 for body, 3:1 for large type) against translucent panes.
            </p>
          </div>
          <div className="grid brand-grid md:grid-cols-3">
            {preview.contrastChecks.map((check) => (
              <article
                key={check.id}
                className="brand-contrast-card"
                style={{
                  background: `var(${check.backgroundToken})`,
                  color: `var(${check.foregroundToken})`,
                }}
              >
                <div className="brand-section__intro">
                  <span className="caption brand-secondary-text">{check.label}</span>
                  <p className="brand-body-relaxed">{check.description}</p>
                </div>
                <span className="brand-secondary-text">Target contrast {check.ratio}</span>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="motion-heading" className="brand-section">
          <div className="brand-section__intro">
            <h2 id="motion-heading">Motion</h2>
            <p className="brand-secondary-text">
              Scroll-driven scenes lean on CSS timelines and pause when reduced motion is requested. Shared elements rely on
              Framer Motion only when we need layout-aware choreography.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <ScrollDrivenShowcase />
            <div className="rounded-3xl border border-[color:var(--border-glass)] bg-[color:rgba(12,18,30,0.82)] p-6 shadow-[0_45px_120px_-95px_rgba(0,0,0,0.9)]">
              <SharedElementSpotlight />
            </div>
          </div>
          <p className="mt-6 text-sm text-[color:var(--text-muted)]">
            Respect <code>prefers-reduced-motion</code> and the <code>.motion-disabled</code> class: timelines collapse to posters,
            view transitions no-op, and Framer Motion steps fall back to instant state changes.
          </p>
        </section>
      </div>
    </main>
  );
}
