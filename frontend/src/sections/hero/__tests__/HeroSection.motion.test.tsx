import { describe, expect, it } from "vitest";

import { renderToString } from "react-dom/server";

import { HeroSection } from "../HeroSection";

describe("HeroSection", () => {
  it("renders the hero gallery with all configured images", () => {
    const markup = renderToString(<HeroSection />);

    expect(markup).toContain("data-hero-section");
    expect(markup).toContain("data-hero-gallery");
    expect(markup).toContain('src="/hero section (1).png"');
    expect(markup).toContain('src="/pic.png"');
    expect(markup).toContain('src="/pic1.png"');
  });
});
