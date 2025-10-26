import { useRef, useState } from "react";

import type { Picture } from "imagetools-core";

import { TransitionLink } from "@/components/motion/TransitionLink";
import { Button } from "@/components/ui/button";
import { createPictureAttributes } from "@/lib/media";
import { useMotionSuppressed } from "@/lib/viewTransitions";

import { useHeroScrub } from "./useHeroScrub";

import "./hero.css";

const HERO_POSTER_ALT = "Microagents orchestrating an operational workflow inside a device frame.";

const heroPosterCandidates = import.meta.glob<Picture>(
  "@/assets/hero-demo-poster.jpg?as=picture&width=640;960;1280&format=avif;webp;jpeg&quality=78",
  {
    eager: true,
    import: "default",
  },
);

const heroPosterPicture = Object.values(heroPosterCandidates)[0];

const HERO_POSTER = heroPosterPicture
  ? createPictureAttributes(heroPosterPicture, {
      alt: HERO_POSTER_ALT,
      sizes: "(min-width: 1024px) 340px, (min-width: 768px) 50vw, 80vw",
      fallbackFormat: "jpeg",
    })
  : null;

const heroVideoSource = import.meta.env.VITE_HERO_VIDEO_SOURCE ?? "/hero-demo.webm";

const HERO_VIDEO_SOURCES: Array<{ src: string; type?: string }> = heroVideoSource
  ? [{ src: heroVideoSource, type: inferMimeType(heroVideoSource) }]
  : [];

function inferMimeType(path: string | undefined) {
  if (!path) return undefined;
  const extension = path.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "webm":
      return "video/webm";
    case "mp4":
      return "video/mp4";
    default:
      return undefined;
  }
}

function HeroDevice({
  allowScrub,
  showControls,
}: {
  allowScrub: boolean;
  showControls: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUnavailable, setVideoUnavailable] = useState(HERO_VIDEO_SOURCES.length === 0);

  useHeroScrub({ containerRef, videoRef, enabled: allowScrub && !videoUnavailable });

  return (
    <div ref={containerRef} className="hero-scroll-track scroll-track">
      <div className="hero-progress-indicator scroll-driven" data-loop="alternate">
        <div className="hero-device-frame aspect-[9/16] w-full max-w-[340px] overflow-hidden">
          {HERO_POSTER ? (
            <picture className="hero-device-poster">
              {HERO_POSTER.sources.map((source) => (
                <source key={`${source.type}-${source.srcSet}`} type={source.type} media={source.media} srcSet={source.srcSet} />
              ))}
              <img
                {...HERO_POSTER.img}
                loading="lazy"
                decoding="async"
              />
            </picture>
          ) : (
            <div className="hero-device-poster hero-device-poster--fallback" role="img" aria-label={`${HERO_POSTER_ALT} (poster available after restoring hero media).`}>
              <span className="hero-device-poster__message">Install hero-demo poster assets to enable imagery.</span>
            </div>
          )}

          {videoUnavailable ? (
            <div className="hero-device-video-placeholder" role="img" aria-label="Restore hero-demo.webm to enable playback.">
              <span className="hero-device-video-placeholder__message">Demo playback available after restoring hero media.</span>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="hero-device-video"
              aria-hidden={allowScrub && !showControls}
              preload="metadata"
              loop={!allowScrub || showControls}
              muted
              playsInline
              autoPlay={!allowScrub && !showControls}
              controls={showControls}
              poster={HERO_POSTER?.defaultSrc}
              onError={() => setVideoUnavailable(true)}
            >
              {HERO_VIDEO_SOURCES.map((source) => (
                <source key={source.src} src={source.src} type={source.type} />
              ))}
              Your browser does not support the demo video.
            </video>
          )}

          <div className="hero-device-overlay" aria-hidden="true" />
        </div>

        <span className="hero-progress-bar mt-6 block h-1.5 w-full max-w-[340px] overflow-hidden rounded-full bg-[color:rgba(244,241,234,0.12)]" />
      </div>
    </div>
  );
}

export function HeroSection() {
  const motionSuppressed = useMotionSuppressed();
  const [manualPlayback, setManualPlayback] = useState(false);

  const videoConfigured = HERO_VIDEO_SOURCES.length > 0;

  const allowScrub = videoConfigured && !motionSuppressed && !manualPlayback;
  const showControls = videoConfigured && (manualPlayback || motionSuppressed);

  return (
    <section className="relative isolate overflow-hidden bg-[color:rgba(10,10,10,0.92)] px-6 pb-20 pt-28 text-left text-text md:px-12 lg:pb-28 lg:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-[-25%] h-[480px] bg-[radial-gradient(circle_at_top,rgba(110,120,255,0.35),transparent_60%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-16 lg:flex-row lg:items-stretch">
        <div className="flex max-w-xl flex-col gap-6">
          <p className="inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.35em] text-[color:rgba(244,241,234,0.56)]">
            <span className="inline-block h-1 w-8 rounded-full bg-[color:var(--accent)]" />
            Guided Ops Demo
          </p>
          <h1 className="text-balance text-[clamp(2.4rem,3.5vw+1.2rem,3.8rem)] font-semibold leading-tight text-[color:var(--text-primary)]">
            Ship accountable AI workflows that teams trust on day one.
          </h1>
          <p className="max-w-lg text-balance text-[clamp(1rem,0.8vw+0.95rem,1.2rem)] text-[color:var(--text-muted)]">
            Orchestrate policy-bound actions, capture review notes, and escalate with context the moment risk shows up.
            Scroll to scrub the workflow preview or launch the guided demo.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <TransitionLink
              to="/contact"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-[color:var(--text-inverse)] bg-[color:var(--accent)] shadow-elevated transition-colors duration-200 hover:bg-[color:var(--accent-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
            >
              Talk with a specialist
            </TransitionLink>
            <Button
              variant="outline"
              onClick={() => setManualPlayback(true)}
              className="rounded-full border-[color:rgba(244,241,234,0.24)] bg-[color:rgba(12,12,12,0.66)] text-[color:var(--text-primary)] hover:bg-[color:rgba(30,30,30,0.7)]"
            >
              Launch interactive demo
            </Button>
          </div>
          {motionSuppressed && !manualPlayback ? (
            <div className="mt-4 flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[color:rgba(244,241,234,0.15)] bg-[color:rgba(23,23,23,0.75)] p-4 text-[0.85rem] text-[color:var(--text-muted)]">
              <p className="font-medium text-[color:var(--text-primary)]">Reduced motion enabled</p>
              <p>
                Animations are paused. Use the play button to preview the workflow in a loop or keep the static poster for a
                distraction-free overview.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex w-full max-w-md flex-col items-center gap-6 self-center lg:items-end">
          <HeroDevice allowScrub={allowScrub} showControls={showControls} />
          {motionSuppressed && !manualPlayback && videoConfigured ? (
            <Button
              variant="secondary"
              onClick={() => setManualPlayback(true)}
              className="w-full max-w-[320px] rounded-full border-[color:rgba(244,241,234,0.24)] bg-[color:rgba(18,18,18,0.85)] text-[color:var(--text-primary)] hover:bg-[color:rgba(30,30,30,0.88)]"
            >
              Play demo
            </Button>
          ) : null}
          {!motionSuppressed || manualPlayback ? (
            <p className="max-w-[320px] text-center text-[0.75rem] uppercase tracking-[0.28em] text-[color:rgba(244,241,234,0.56)]">
              Scroll to explore the briefing → review → deploy loop
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

