import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Point = [number, number];

type FlowDefinition = {
  id: string;
  label: string;
  duration: string;
  begin: string;
  amplitude: number;
  interactiveGain: number;
  base: {
    start: Point;
    c1: Point;
    c2: Point;
    end: Point;
  };
  shape: {
    start: number;
    end: number;
    c1: number;
    c2: number;
    c1X?: number;
    c2X?: number;
  };
};

type FlowInternal = FlowDefinition & {
  centerX: number;
  centerY: number;
  labelWidth: number;
  labelHeight: number;
};

const VIEWBOX_WIDTH = 1040;
const VIEWBOX_HEIGHT = 560;

function buildPathD(flow: FlowInternal, offset: number) {
  const amplitude = offset * flow.amplitude;
  const { base, shape } = flow;

  const startY = base.start[1] + amplitude * shape.start;
  const endY = base.end[1] + amplitude * shape.end;
  const c1Y = base.c1[1] + amplitude * shape.c1;
  const c2Y = base.c2[1] + amplitude * shape.c2;
  const c1X = base.c1[0] + amplitude * (shape.c1X ?? 0);
  const c2X = base.c2[0] + amplitude * (shape.c2X ?? 0);

  return `M ${base.start[0]} ${startY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${base.end[0]} ${endY}`;
}

export function HeroSection() {
  const flows = useMemo<FlowInternal[]>(() => {
    const definitions: FlowDefinition[] = [
      {
        id: "flux-1",
        label: "Data Intelligence",
        duration: "12.8s",
        begin: "-1.6s",
        amplitude: 1.25,
        interactiveGain: 210,
        base: {
          start: [70, 190],
          c1: [300, 70],
          c2: [620, 260],
          end: [990, 210],
        },
        shape: {
          start: -0.16,
          end: 0.14,
          c1: 1.05,
          c2: -0.9,
          c1X: 0.1,
          c2X: -0.08,
        },
      },
      {
        id: "flux-2",
        label: "Security & Trust",
        duration: "11.6s",
        begin: "-2.4s",
        amplitude: 1.35,
        interactiveGain: 240,
        base: {
          start: [90, 260],
          c1: [280, 360],
          c2: [620, 280],
          end: [980, 340],
        },
        shape: {
          start: 0.2,
          end: -0.18,
          c1: -1,
          c2: 0.9,
          c1X: -0.06,
          c2X: 0.04,
        },
      },
      {
        id: "flux-3",
        label: "Search & Discovery",
        duration: "14.2s",
        begin: "-3.2s",
        amplitude: 1.2,
        interactiveGain: 200,
        base: {
          start: [130, 360],
          c1: [340, 320],
          c2: [700, 410],
          end: [980, 320],
        },
        shape: {
          start: 0.22,
          end: -0.2,
          c1: -0.75,
          c2: 0.68,
          c1X: 0.02,
          c2X: -0.04,
        },
      },
      {
        id: "flux-4",
        label: "Autonomous Ops",
        duration: "16.5s",
        begin: "-4s",
        amplitude: 1.45,
        interactiveGain: 260,
        base: {
          start: [50, 150],
          c1: [260, 210],
          c2: [640, 140],
          end: [980, 220],
        },
        shape: {
          start: -0.22,
          end: 0.18,
          c1: 0.85,
          c2: -0.7,
          c1X: 0.04,
          c2X: -0.06,
        },
      },
      {
        id: "flux-5",
        label: "Observability",
        duration: "10.8s",
        begin: "-5.2s",
        amplitude: 1.5,
        interactiveGain: 280,
        base: {
          start: [100, 230],
          c1: [280, 170],
          c2: [660, 240],
          end: [980, 200],
        },
        shape: {
          start: -0.12,
          end: 0.1,
          c1: 0.9,
          c2: -0.75,
          c1X: 0.08,
          c2X: -0.05,
        },
      },
    ];

    return definitions.map((definition) => {
      const centerY = (definition.base.start[1] + definition.base.end[1]) / 2;
      const centerX = (definition.base.start[0] + definition.base.end[0]) / 2;
      const labelWidth = Math.max(132, definition.label.length * 8 + 40);
      const labelHeight = 32;
      return {
        ...definition,
        centerX,
        centerY,
        labelWidth,
        labelHeight,
      } as FlowInternal;
    });
  }, []);

  const horizontalGuides = useMemo(() => {
    const guideSet = new Set<number>();
    flows.forEach((flow) => {
      guideSet.add(Math.round(flow.centerY));
    });
    return Array.from(guideSet).sort((a, b) => a - b);
  }, [flows]);

  const [pathOffsets, setPathOffsets] = useState<number[]>(() => flows.map(() => 0));
  const [isHovered, setIsHovered] = useState(false);
  const pointerActiveRef = useRef(false);
  const relaxFrameRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (relaxFrameRef.current !== undefined) {
        cancelAnimationFrame(relaxFrameRef.current);
      }
    };
  }, []);

  const scheduleRelax = useCallback(() => {
    if (pointerActiveRef.current) return;
    if (relaxFrameRef.current !== undefined) {
      cancelAnimationFrame(relaxFrameRef.current);
    }

    const step = () => {
      setPathOffsets((prev) => {
        let shouldContinue = false;
        const next = prev.map((offset) => {
          if (Math.abs(offset) < 0.25) {
            return 0;
          }
          shouldContinue = true;
          return offset * 0.9;
        });

        if (shouldContinue) {
          relaxFrameRef.current = requestAnimationFrame(step);
        }

        return next;
      });
    };

    relaxFrameRef.current = requestAnimationFrame(step);
  }, []);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pointerActiveRef.current = true;

      const bounds = event.currentTarget.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * VIEWBOX_WIDTH;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * VIEWBOX_HEIGHT;

      setPathOffsets((prev) =>
        prev.map((offset, index) => {
          const flow = flows[index];
          const dx = (pointerX - flow.centerX) * 0.48;
          const dy = pointerY - flow.centerY;
          const distance = Math.hypot(dx, dy);
          const depthFactor = flow.centerY / VIEWBOX_HEIGHT;
          const radius = 220 + depthFactor * 220;
          const influence = Math.max(0, 1 - distance / radius);

          if (influence <= 0.002) {
            const eased = offset * 0.86;
            return Math.abs(eased) < 0.18 ? 0 : eased;
          }

          const direction = dy >= 0 ? 1 : -1;
          const strength = flow.interactiveGain * 0.55;
          const target = direction * influence * strength;
          const next = offset * 0.78 + target * 0.22;
          return Math.abs(next) < 0.18 ? 0 : next;
        })
      );
    },
    [flows]
  );

  const handlePointerEnter = useCallback(() => {
    pointerActiveRef.current = true;
    setIsHovered(true);
    if (relaxFrameRef.current !== undefined) {
      cancelAnimationFrame(relaxFrameRef.current);
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    pointerActiveRef.current = false;
    setIsHovered(false);
    scheduleRelax();
  }, [scheduleRelax]);

  return (
    <section
      data-hero-section
      className="relative isolate flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-[#090909] px-6 pb-24 pt-24 text-[color:rgba(244,241,234,0.85)] md:px-12"
    >
      <h1 className="sr-only">microagents</h1>

      <div className="flex w-full max-w-6xl flex-col items-center gap-2">
        <div
          className="relative w-full max-w-[1200px] sm:max-w-[1700px] lg:max-w-[2300px] xl:max-w-[2800px]"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        >
          <svg
            className="block h-full w-full"
            viewBox="0 0 1040 560"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            role="presentation"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="guide-stroke" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
              </linearGradient>
              <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
              </radialGradient>
              <filter id="path-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {horizontalGuides.map((y) => (
              <line
                key={`guide-${y}`}
                x1={80}
                y1={y}
                x2={960}
                y2={y}
                stroke="url(#guide-stroke)"
                strokeWidth={1}
                strokeDasharray="6 22"
              />
            ))}

            {flows.map((flow, index) => {
              const offset = pathOffsets[index] ?? 0;
              const pathD = buildPathD(flow, offset);
              const labelWidth = flow.labelWidth;
              const labelHeight = flow.labelHeight;

              return (
                <g key={flow.id} filter="url(#path-glow)">
                  <path
                    id={flow.id}
                    d={pathD}
                    stroke="rgba(255,255,255,0.62)"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <g
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      transition: "transform 280ms cubic-bezier(.2,.7,.3,1)",
                      transform: `scale(${isHovered ? 1.22 : 1})`,
                    }}
                  >
                    <circle
                      r={6}
                      fill="url(#node-glow)"
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "center",
                        transition: "transform 280ms cubic-bezier(.2,.7,.3,1)",
                        transform: `scale(${isHovered ? 1.35 : 1})`,
                      }}
                    />
                    <g
                      style={{
                        pointerEvents: "none",
                        opacity: isHovered ? 0.95 : 0,
                        transformOrigin: "left center",
                        transform: isHovered
                          ? `translate(18,-${labelHeight + 6}) scale(1)`
                          : `translate(18,-${labelHeight - 4}) scale(0.84)` ,
                        transition: "opacity 260ms ease, transform 300ms cubic-bezier(.22,.68,.3,1)",
                      }}
                    >
                      <rect
                        x={0}
                        y={-labelHeight}
                        width={labelWidth}
                        height={labelHeight}
                        rx={labelHeight / 2}
                        fill="rgba(9,9,9,0.82)"
                        stroke="rgba(255,255,255,0.28)"
                        strokeWidth={1.2}
                      />
                      <text
                        x={labelWidth / 2}
                        y={-labelHeight / 2 + 2}
                        fill="rgba(255,255,255,0.92)"
                        fontSize={13}
                        fontFamily="var(--font-sans, 'Inter', sans-serif)"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        letterSpacing="0.12em"
                      >
                        {flow.label.toUpperCase()}
                      </text>
                    </g>
                    <animateMotion
                      dur={flow.duration}
                      begin={flow.begin}
                      repeatCount="indefinite"
                      keySplines="0.42 0 0.58 1"
                      keyTimes="0;1"
                      calcMode="spline"
                    >
                      <mpath href={`#${flow.id}`} />
                    </animateMotion>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="relative flex w-full justify-center">
          <span className="pointer-events-none absolute inset-0 mx-auto w-[70%] max-w-[1800px] -translate-y-[18%] rounded-full bg-[radial-gradient(circle,rgba(58,124,165,0.32),rgba(58,124,165,0)_75%)] blur-[180px]" aria-hidden="true" />
          <img
            data-hero-wordmark
            id="hero-wordmark-image"
            src="/white-logo-trans.png"
            alt="Microagents wordmark"
            className="w-full max-w-[2200px] sm:max-w-[2600px] lg:max-w-[3200px] opacity-100 -mt-52 md:-mt-72 lg:-mt-96"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
