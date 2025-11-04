import "./hero.css";

import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/utils";

export function HeroSection() {
  const frames = useMemo(
    () => [
      {
        id: "orange",
        imageSrc: "/orange.png",
        imageAlt: "Granular orange gradient backdrop",
        logoSrc: "/logo-hero-5.png",
      },
      {
        id: "blue",
        imageSrc: "/blue.png",
        imageAlt: "Granular blue gradient backdrop",
        logoSrc: "/logo-hero-4.png",
      },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % frames.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [frames.length]);

  const activeFrame = frames[activeIndex];

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
        <div className="hero__visual-wrapper">
          <div className="hero__visual" role="presentation">
            {frames.map((frame, index) => (
              <img
                key={frame.id}
                src={frame.imageSrc}
                alt={frame.imageAlt}
                className={cn(
                  "hero__visual-frame",
                  index === activeIndex ? "hero__visual-frame--active" : "hero__visual-frame--inactive",
                )}
              />
            ))}
            <div key={activeFrame.id} className="hero__artifact" aria-hidden="true">
              <div className="hero__artifact-glow" />
              <img
                src={activeFrame.logoSrc}
                alt=""
                role="presentation"
                className="hero__artifact-logo"
              />
            </div>
          </div>
          {/* Plan Step 4: swapped shader for rotating hero imagery with logo artifact. */}
        </div>
      </div>
      {/* Plan Step 4: entire hero layout updated around rotating gallery system. */}
    </section>
  );
}
