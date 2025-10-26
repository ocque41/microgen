import { useEffect, type RefObject } from "react";

import { isMotionSuppressed } from "@/lib/viewTransitions";

type UseHeroScrubOptions = {
  containerRef: RefObject<HTMLElement>;
  videoRef: RefObject<HTMLVideoElement>;
  enabled?: boolean;
};

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}

export function useHeroScrub({ containerRef, videoRef, enabled = true }: UseHeroScrubOptions) {
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video || !enabled || isMotionSuppressed()) {
      return;
    }

    let frame: number | null = null;
    let duration = video.duration || 0;

    video.pause();
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "muted");
    video.setAttribute("playsinline", "true");

    const handleMetadata = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
    };

    if (video.readyState >= 1) {
      handleMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleMetadata, { once: true });
    }

    const updateProgress = () => {
      frame = null;
      if (!container || !video || duration <= 0) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const total = rect.height + viewportHeight;
      const offset = viewportHeight - rect.top;
      const progress = clamp(offset / total);

      container.style.setProperty("--hero-progress", progress.toString());
      video.currentTime = progress * duration;
    };

    const scheduleUpdate = () => {
      if (frame === null) {
        frame = window.requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [containerRef, enabled, videoRef]);
}

