import { describe, expect, it } from "vitest";

import { renderToString } from "react-dom/server";

import { HeroSection } from "../HeroSection";

describe("HeroSection", () => {
  it("renders the new brand headline and messaging", () => {
    const markup = renderToString(<HeroSection />);

    expect(markup).toContain("microagents");
    expect(markup).toContain("AI FOR BUSINESS");
    expect(markup).toContain("NOW FOR EVERY TASK");
  });

  it("exposes the gradient card container", () => {
    const markup = renderToString(<HeroSection />);

    expect(markup).toContain("hero__gradient-card");
  });
});
