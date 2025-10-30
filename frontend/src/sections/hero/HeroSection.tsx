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
const HORIZONTAL_EXTENSION = 220;
const AMBIENT_AMPLITUDE_FACTOR = 0.13;

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
        duration: "12.2s",
        begin: "-1.4s",
        amplitude: 2.25,
        interactiveGain: 180,
        base: {
          start: [70, 130],
          c1: [300, 10],
          c2: [620, 190],
          end: [990, 150],
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
        duration: "12.8s",
        begin: "-2s",
        amplitude: 2.35,
        interactiveGain: 190,
        base: {
          start: [90, 290],
          c1: [280, 380],
          c2: [620, 320],
          end: [980, 350],
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
        duration: "13.6s",
        begin: "-2.4s",
        amplitude: 2.2,
        interactiveGain: 170,
        base: {
          start: [130, 380],
          c1: [340, 360],
          c2: [700, 440],
          end: [980, 380],
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
        duration: "14.4s",
        begin: "-1.8s",
        amplitude: 2.4,
        interactiveGain: 210,
        base: {
          start: [50, 60],
          c1: [260, 130],
          c2: [640, 90],
          end: [980, 140],
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
        duration: "11.6s",
        begin: "-1.6s",
        amplitude: 2.45,
        interactiveGain: 215,
        base: {
          start: [100, 210],
          c1: [280, 160],
          c2: [660, 240],
          end: [980, 210],
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
      const originalBase = definition.base;
      const extendedBase = {
        start: [originalBase.start[0] - HORIZONTAL_EXTENSION, originalBase.start[1]] as Point,
        c1: [originalBase.c1[0] - HORIZONTAL_EXTENSION, originalBase.c1[1]] as Point,
        c2: [originalBase.c2[0] + HORIZONTAL_EXTENSION, originalBase.c2[1]] as Point,
        end: [originalBase.end[0] + HORIZONTAL_EXTENSION, originalBase.end[1]] as Point,
      };

      const centerY = (originalBase.start[1] + originalBase.end[1]) / 2;
      const centerX = (originalBase.start[0] + originalBase.end[0]) / 2;
      const labelWidth = Math.max(132, definition.label.length * 8 + 40);
      const labelHeight = 32;
      return {
        ...definition,
        base: extendedBase,
        centerX,
        centerY,
        labelWidth,
        labelHeight,
      } as FlowInternal;
    });
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const query = window.matchMedia("(max-width: 768px)");

    const update = () => {
      setIsMobile(query.matches);
    };

    update();

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
    } else {
      query.addListener(update);
    }

    return () => {
      if (typeof query.removeEventListener === "function") {
        query.removeEventListener("change", update);
      } else {
        query.removeListener(update);
      }
    };
  }, []);

  const horizontalGuides = useMemo(() => {
    const guideSet = new Set<number>();
    flows.forEach((flow) => {
      guideSet.add(Math.round(flow.centerY));
    });
    return Array.from(guideSet).sort((a, b) => a - b);
  }, [flows]);

  const [pathOffsets, setPathOffsets] = useState<number[]>(() => flows.map(() => 0));
  const pointerActiveRef = useRef(false);
  const relaxFrameRef = useRef<number | undefined>(undefined);
  const ambientFrameRef = useRef<number | undefined>(undefined);
  const ambientStartRef = useRef<number | undefined>(undefined);
  const ambientRestartTimeoutRef = useRef<number | undefined>(undefined);
  const ambientEnabledRef = useRef(false);
  const coarseDeviceRef = useRef(false);

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
          if (Math.abs(offset) < 0.12) {
            return 0;
          }
          shouldContinue = true;
          return offset * 0.96;
        });

        if (shouldContinue) {
          relaxFrameRef.current = requestAnimationFrame(step);
        }

        return next;
      });
    };

    relaxFrameRef.current = requestAnimationFrame(step);
  }, []);

  const stopAmbient = useCallback(() => {
    if (ambientFrameRef.current !== undefined) {
      cancelAnimationFrame(ambientFrameRef.current);
      ambientFrameRef.current = undefined;
    }
    if (typeof window !== "undefined" && ambientRestartTimeoutRef.current !== undefined) {
      window.clearTimeout(ambientRestartTimeoutRef.current);
      ambientRestartTimeoutRef.current = undefined;
    }
    ambientEnabledRef.current = false;
    ambientStartRef.current = undefined;
  }, []);

  const runAmbientStep = useCallback(
    (time: number) => {
      if (!ambientEnabledRef.current || pointerActiveRef.current) {
        ambientFrameRef.current = undefined;
        return;
      }

      if (ambientStartRef.current === undefined) {
        ambientStartRef.current = time;
      }

      const elapsed = (time - ambientStartRef.current) / 1000;

      setPathOffsets(() =>
        flows.map((flow, index) => {
          const frequency = 0.32 + index * 0.045;
          const amplitude = flow.interactiveGain * AMBIENT_AMPLITUDE_FACTOR;
          const phase = index * 0.9;
          return Math.sin(elapsed * frequency + phase) * amplitude;
        })
      );

      ambientFrameRef.current = requestAnimationFrame(runAmbientStep);
    },
    [flows]
  );

  const startAmbient = useCallback(() => {
    if (typeof window === "undefined" || !coarseDeviceRef.current) {
      return;
    }
    if (ambientEnabledRef.current) {
      return;
    }
    ambientEnabledRef.current = true;
    ambientFrameRef.current = window.requestAnimationFrame(runAmbientStep);
  }, [runAmbientStep]);

  const scheduleAmbientResume = useCallback(() => {
    if (typeof window === "undefined" || !coarseDeviceRef.current) {
      return;
    }
    if (ambientRestartTimeoutRef.current !== undefined) {
      window.clearTimeout(ambientRestartTimeoutRef.current);
    }
    ambientRestartTimeoutRef.current = window.setTimeout(() => {
      if (!pointerActiveRef.current) {
        startAmbient();
      }
    }, 240);
  }, [startAmbient]);

  const applyPointerInfluence = useCallback(
    (clientX: number, clientY: number, element: HTMLDivElement) => {
      const bounds = element.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) {
        return;
      }

      const pointerX = ((clientX - bounds.left) / bounds.width) * VIEWBOX_WIDTH;
      const pointerY = ((clientY - bounds.top) / bounds.height) * VIEWBOX_HEIGHT;

      setPathOffsets((prev) =>
        prev.map((offset, index) => {
          const flow = flows[index];
          const dx = (pointerX - flow.centerX) * 0.22;
          const dy = pointerY - flow.centerY;
          const distance = Math.hypot(dx, dy);
          const depthFactor = flow.centerY / VIEWBOX_HEIGHT;
          const radius = 420 + depthFactor * 420;
          const influence = Math.max(0, 1 - distance / radius);

          if (influence <= 0.0004) {
            const eased = offset * 0.95;
            return Math.abs(eased) < 0.08 ? 0 : eased;
          }

          const direction = dy >= 0 ? 1 : -1;
          const strength = flow.interactiveGain * (0.32 + depthFactor * 0.28);
          const target = direction * influence * strength;
          const next = offset * 0.9 + target * 0.1;
          return Math.abs(next) < 0.1 ? 0 : next;
        })
      );
    },
    [flows]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      stopAmbient();
      pointerActiveRef.current = true;
      applyPointerInfluence(event.clientX, event.clientY, event.currentTarget);
    },
    [applyPointerInfluence, stopAmbient]
  );

  const handlePointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      stopAmbient();
      pointerActiveRef.current = true;
      if (relaxFrameRef.current !== undefined) {
        cancelAnimationFrame(relaxFrameRef.current);
      }
      applyPointerInfluence(event.clientX, event.clientY, event.currentTarget);
    },
    [applyPointerInfluence, stopAmbient]
  );

  const handlePointerLeave = useCallback(() => {
    pointerActiveRef.current = false;
    scheduleRelax();
    scheduleAmbientResume();
  }, [scheduleRelax, scheduleAmbientResume]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const hoverQuery = window.matchMedia("(hover: none)");

    const evaluate = () => {
      const touchPoints = typeof navigator !== "undefined" ? navigator.maxTouchPoints || 0 : 0;
      const isCoarse = coarseQuery.matches || hoverQuery.matches || touchPoints > 0;
      coarseDeviceRef.current = isCoarse;

      if (!isCoarse) {
        stopAmbient();
        if (!pointerActiveRef.current) {
          setPathOffsets(() => flows.map(() => 0));
        }
        return;
      }

      if (!pointerActiveRef.current) {
        startAmbient();
      }
    };

    evaluate();

    const addListener = (query: MediaQueryList) => {
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", evaluate);
      } else {
        query.addListener(evaluate);
      }
    };

    const removeListener = (query: MediaQueryList) => {
      if (typeof query.removeEventListener === "function") {
        query.removeEventListener("change", evaluate);
      } else {
        query.removeListener(evaluate);
      }
    };

    addListener(coarseQuery);
    addListener(hoverQuery);

    return () => {
      removeListener(coarseQuery);
      removeListener(hoverQuery);
      stopAmbient();
    };
  }, [flows, startAmbient, stopAmbient]);

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
            style={{ overflow: "visible" }}
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
                x1={80 - HORIZONTAL_EXTENSION}
                y1={y}
                x2={960 + HORIZONTAL_EXTENSION}
                y2={y}
                stroke="url(#guide-stroke)"
                strokeWidth={1}
                strokeDasharray="6 22"
              />
            ))}

            {flows.map((flow, index) => {
              const offset = pathOffsets[index] ?? 0;
              const pathD = buildPathD(flow, offset);
              const baseLabelWidth = flow.labelWidth;
              const baseLabelHeight = flow.labelHeight;
              const labelWidth = isMobile ? baseLabelWidth * 1.18 : baseLabelWidth;
              const labelHeight = isMobile ? baseLabelHeight * 1.3 : baseLabelHeight;
              const energyFactor = Math.min(1, Math.abs(offset) / (flow.interactiveGain * 0.5 + 60));
              const ambientBase = ambientEnabledRef.current ? (isMobile ? 0.45 : 0.32) : 0;
              const labelOpacity = ambientBase + (1 - ambientBase) * Math.pow(energyFactor, 0.78);
              const nodeScale = 1 + labelOpacity * 0.55;
              const haloScale = 1 + labelOpacity * 0.65;
              const labelScaleBase = isMobile ? 0.85 : 0.7;
              const labelScaleRange = isMobile ? 0.5 : 0.42;
              const labelScale = labelScaleBase + labelOpacity * labelScaleRange;
              const translateBase = labelHeight - 2;
              const translateActive = labelHeight + (isMobile ? 22 : 16);
              const translateY = translateBase + (translateActive - translateBase) * labelOpacity;
              const strokeAlpha = 0.5 + labelOpacity * 0.4;
              const strokeColor = `rgba(255,255,255,${strokeAlpha})`;

              return (
                <g key={flow.id} filter="url(#path-glow)">
                  <path
                    id={flow.id}
                    d={pathD}
                    stroke={strokeColor}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <g
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      transition: "transform 620ms cubic-bezier(.21,.79,.26,1)",
                      transform: `scale(${nodeScale})`,
                    }}
                  >
                    <circle
                      r={6}
                      fill="url(#node-glow)"
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "center",
                        transition: "transform 620ms cubic-bezier(.21,.79,.26,1)",
                        transform: `scale(${haloScale})`,
                      }}
                    />
                    <g
                      style={{
                        pointerEvents: "none",
                        opacity: labelOpacity,
                        transformOrigin: "left center",
                        transform: `translate(24,-${translateY}) scale(${labelScale})`,
                        transition: "opacity 560ms cubic-bezier(.25,.7,.28,1), transform 620ms cubic-bezier(.25,.78,.26,1)",
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
                        strokeWidth={isMobile ? 1.4 : 1.2}
                      />
                      <text
                        x={labelWidth / 2}
                        y={-labelHeight / 2 + 2}
                        fill="rgba(255,255,255,0.92)"
                        fontSize={isMobile ? 15 : 13}
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
          <span className="pointer-events-none absolute inset-0 mx-auto aspect-[11/3] w-[110%] max-w-[1600px] -translate-y-[9%] rounded-full bg-[radial-gradient(circle_at_center,rgba(58,124,165,0.58) 0%,rgba(58,124,165,0.26) 38%,rgba(58,124,165,0)_78%)] blur-[120px] sm:w-[64%] sm:max-w-[1280px]" aria-hidden="true" />
          <img
            data-hero-wordmark
            id="hero-wordmark-image"
            src="/white-logo-trans.png"
            alt="Microagents wordmark"
            className="w-[720%] max-w-none -mt-56 opacity-100 sm:w-[320%] sm:-mt-44 md:w-[180%] md:max-w-[2600px] md:-mt-32 lg:-mt-28 xl:-mt-24"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
