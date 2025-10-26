import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MemoryRouter } from "react-router-dom";

import { HeroSection } from "../HeroSection";
import { useMotionSuppressed } from "@/lib/viewTransitions";

vi.mock("@/lib/viewTransitions", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/viewTransitions")>();
  return {
    ...actual,
    useMotionSuppressed: vi.fn(),
  };
});

const mockedUseMotionSuppressed = vi.mocked(useMotionSuppressed);

describe("HeroSection motion fallbacks", () => {
  beforeEach(() => {
    mockedUseMotionSuppressed.mockReturnValue(false);
  });

  it("promotes scroll guidance when motion is available", () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    );

    expect(screen.getByText(/Scroll to explore the briefing/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /play demo/i })).not.toBeInTheDocument();
  });

  it("enables manual playback controls when motion is suppressed", () => {
    mockedUseMotionSuppressed.mockReturnValue(true);
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    );

    expect(screen.getByText(/Reduced motion enabled/i)).toBeInTheDocument();
    const playButton = screen.getByRole("button", { name: /play demo/i });
    expect(playButton).toBeInTheDocument();

    const video = document.querySelector("video");
    expect(video).not.toHaveAttribute("autoplay");
  });
});
