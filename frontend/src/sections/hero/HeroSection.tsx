import "./hero.css";

import { Skiper16 } from "@/components/Skiper16";

export function HeroSection() {
  return (
    <section className="hero" data-hero-section>
      <div className="hero__content">
        <header className="hero__header">
          <p className="hero__eyebrow">Microagents</p>
          <h1 className="hero__headline">Operational clarity, without the glow</h1>
          <p className="hero__description">
            A monochrome canvas keeps the interface steady while your automations carry the detail. Scroll to fold through real teams, from kickoff canvas to audit trail, all built on the same black-and-white surface.
          </p>
        </header>
        <div className="hero__gallery" aria-label="Monochrome product gallery">
          <Skiper16 />
        </div>
      </div>
    </section>
  );
}
