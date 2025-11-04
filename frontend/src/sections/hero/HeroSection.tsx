import "./hero.css";

import { GradientCard } from "../../components/hero-gradient";

export function HeroSection() {
  return (
    <section className="hero" data-hero-section>
      <div className="hero__layout">
        <header className="hero__headline">
          <h1 className="hero__title" data-hero-wordmark>
            microagents
          </h1>
          <div className="hero__divider" aria-hidden="true" />
          <div className="hero__tagline">
            <span className="hero__tagline-primary">AI FOR BUSINESS</span>
            <span className="hero__tagline-secondary">NOW FOR EVERY TASK</span>
          </div>
          <div className="hero__divider" aria-hidden="true" />
        </header>
        <div className="hero__gradient-wrapper">
          <GradientCard
            className="hero__gradient-card"
            borderRadiusClassName="hero__gradient-radius"
            colors={{ top: "#f9f9f9", bottom: "#090909", accent: "#3a7ca5" }}
            noise={{ scale: 4.2, intensity: 0.18, accentStrength: 0.58 }}
          />
        </div>
      </div>
      {/* Plan Step 2: hero rebuilt to match refreshed reference with expanded shader coverage. */}
    </section>
  );
}
