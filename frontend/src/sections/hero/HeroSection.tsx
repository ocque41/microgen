import "./hero.css";

import { HeroImageStack, type HeroImageStackItem } from "@/components/HeroImageStack";

const heroImages: HeroImageStackItem[] = [
  {
    id: "primary",
    src: "/hero section (1).png",
    alt: "Microagents hero concept collage",
  },
  {
    id: "secondary",
    src: "/pic.png",
    alt: "Microagents workspace preview",
  },
  {
    id: "tertiary",
    src: "/pic1.png",
    alt: "Microagents interface close-up",
  },
];

export function HeroSection() {
  return (
    <section className="hero" data-hero-section>
      <div className="hero__content">
        <HeroImageStack images={heroImages} />
      </div>
    </section>
  );
}
