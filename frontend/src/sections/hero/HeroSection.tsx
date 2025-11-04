import "./hero.css";

import { GradientCard } from "../../components/gradient";

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__layout">
        <header className="hero__headline">
          <h1 className="hero__title">microagents</h1>
          <div className="hero__subtitle">
            <span className="hero__subtitle-primary">AI FOR BUSINESS</span>
            <span className="hero__subtitle-secondary">NOW FOR EVERY TASK</span>
          </div>
        </header>
        <div className="hero__gradient-wrapper">
          <GradientCard
            className="hero__gradient-card"
            borderRadiusClassName="hero__gradient-radius"
            colors={{ top: "#FF6A00", bottom: "#6A1200", accent: "#FFB400" }}
            noise={{ scale: 7.5, intensity: 0.34, accentStrength: 0.78 }}
          />
        </div>
      </div>
      {/* Plan Step 3: Hero rebuilt to match reference design with integrated gradient card. */}
    </section>
  );
}
