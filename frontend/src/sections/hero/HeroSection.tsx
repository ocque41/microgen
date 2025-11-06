import "./hero.css";

export function HeroSection() {
  return (
    <section className="hero" data-hero-section>
      <div className="hero__content">
        <header className="hero__header">
          <img
            className="hero__insignia"
            src="/logo-hero-4.png"
            alt="Microagents insignia"
            loading="lazy"
          />
          <h1 className="hero__headline">
            <span className="hero__headline-emphasis">Operational</span> clarity, without the glow
          </h1>
          <p className="hero__description">
            A monochrome canvas keeps the interface steady while your automations carry the detail. Scroll to fold through real teams, from kickoff canvas to audit trail, all built on the same black-and-white surface.
          </p>
        </header>
      </div>
    </section>
  );
}
