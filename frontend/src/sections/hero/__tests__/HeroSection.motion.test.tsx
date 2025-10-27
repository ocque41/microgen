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
  it("renders the hero composition with branding", () => {
    const markup = renderToString(<HeroSection />);

    expect(markup).toContain("microagents");
    expect(markup).toContain("/logo.svg");
    expect(markup).toContain("<svg");
  });

  it("includes the hero logotype", () => {
    const markup = renderToString(<HeroSection />);

    expect(markup).toContain("<img");
    expect(markup).toContain("alt=\"Microagents\"");
  });
});
