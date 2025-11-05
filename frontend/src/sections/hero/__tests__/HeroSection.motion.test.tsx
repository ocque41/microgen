import { describe, expect, it } from "vitest";

import { renderToString } from "react-dom/server";

import { HeroSection } from "../HeroSection";

describe("HeroSection", () => {
  it("renders the monochrome hero with the stacked gallery", () => {
    const markup = renderToString(<HeroSection />);

    expect(markup).toContain("data-hero-section");
    expect(markup).toContain("Monochrome product gallery");
    expect(markup).toContain('Operational clarity, without the glow');
    expect(markup).toContain('src="/hero section (1).png"');
    expect(markup).toContain('src="/pic.png"');
    expect(markup).toContain('src="/pic1.png"');
  });
});
