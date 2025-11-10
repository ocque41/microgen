import { describe, expect, it } from "vitest";

import { renderToString } from "react-dom/server";

import { HeroSection } from "../HeroSection";

describe("HeroSection", () => {
  it("renders the hero headline and animated automation copy", () => {
    const markup = renderToString(<HeroSection />);

    expect(markup).toContain("data-hero-section");
    expect(markup).toContain("MICROAGENTS");
    expect(markup).toContain("automated");
    expect(markup).toContain("BPMNs");
    expect(markup).toContain("hero__counter-plus");
    expect(markup).toMatch(/hero__counter-value">\d/);
  });
});
