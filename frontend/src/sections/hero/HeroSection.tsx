import "./hero.css";

import { GradientCard } from "../../components/hero-gradient";

export function HeroSection() {
  return (
    <section className="hero" data-hero-section>
      <div className="hero__layout">
        <header className="hero__headline">
          <h1 className="hero__title" data-hero-wordmark>
            MICROAGENTS
          </h1>
          {/* Plan Step 1: rescaled wordmark and tagline tracking per refreshed spacing brief. */}
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
            colors={{ top: "#d9dcd6", bottom: "#090909", accent: "#0091ad" }}
            noise={{ scale: 7.1, intensity: 0.78, accentStrength: 0.72 }}
          />
          {/* Plan Step 2: shifted to brand palette with cleaner high-speed pulses for futuristic feel. */}
        </div>
      </div>
      {/* Plan Step 2: hero rebuilt to match refreshed reference with expanded shader coverage. */}
    </section>
  );
}
