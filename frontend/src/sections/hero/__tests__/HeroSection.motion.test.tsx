import type { ComponentPropsWithoutRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { renderToString } from "react-dom/server";

import { HeroSection } from "../HeroSection";

vi.mock("@/components/motion/TransitionLink", () => {
  return {
    TransitionLink: ({ to, children, href, ...rest }: ComponentPropsWithoutRef<"a"> & { to?: string }) => {
      const resolvedHref = typeof to === "string" ? to : href;
      return (
        <a {...rest} href={resolvedHref}>
          {children}
        </a>
      );
    },
  };
});

describe("HeroSection", () => {
  it("renders the centered heading and call to action", () => {
    const markup = renderToString(<HeroSection />);

    expect(markup).toContain("microagents");
    expect(markup).toContain("Get Started");
    expect(markup).toContain("href=\"/signup\"");
  });

  it("includes the hero illustration", () => {
    const markup = renderToString(<HeroSection />);

    expect(markup).toContain("Microagents workspace showcasing browser-scale flows.");
    expect(markup).toContain("<img");
  });
});
