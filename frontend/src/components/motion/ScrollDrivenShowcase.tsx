import { useId, type CSSProperties } from "react";

const SCROLL_FEATURES = [
  {
    id: "capture",
    title: "Capture context as you scroll",
    description:
      "Timeline cards pin at 16px spacing while the content pulses in with a fade-up tied to the scroll track.",
  },
  {
    id: "approve",
    title: "Approve without breaking flow",
    description:
      "Review checkpoints scale in gently so teams see the newest state without abrupt jumps or layout shifts.",
  },
  {
    id: "handoff",
    title: "Handoff with clarity",
    description:
      "Escalation summaries slide upward on entry and settle into position for screen-reader friendly reading order.",
  },
];

export function ScrollDrivenShowcase() {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const timelineName = `scroll-${rawId}`;

  const trackStyle: CSSProperties = {
    ["--scroll-track-name" as const]: timelineName,
    ["--scroll-track-axis" as const]: "block",
  };

  return (
    <div className="scroll-scene rounded-3xl border border-[color:var(--border-glass)] bg-[color:rgba(16,20,32,0.78)] p-6 shadow-[0_45px_120px_-90px_rgba(0,0,0,0.9)]">
      <div className="scroll-track flex flex-col gap-8" style={trackStyle}>
        {SCROLL_FEATURES.map((feature, index) => {
          const itemStyle: CSSProperties = {
            animationName: "scroll-fade-in-up",
            ["--scroll-scene-delay" as const]: `${index * 80}ms`,
          };

          return (
            <article
              key={feature.id}
              className="scroll-driven rounded-2xl border border-[color:var(--border-glass)] bg-[color:rgba(7,12,22,0.82)] p-5 text-left backdrop-blur-sm"
              style={itemStyle}
            >
              <header className="flex flex-col gap-2">
                <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[color:rgba(226,232,240,0.55)]">
                  {feature.id}
                </span>
                <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{feature.title}</h3>
              </header>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-muted)]">{feature.description}</p>
            </article>
          );
        })}
      </div>
      <div className="scroll-poster mt-4 rounded-2xl border border-dashed border-[color:var(--border-default)] bg-[color:rgba(12,16,26,0.6)] p-4 text-xs text-[color:var(--text-muted)]">
        Motion is paused for reduced-motion users—cards render fully visible with the same reading order.
      </div>
    </div>
  );
}
