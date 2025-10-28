const horizontalGuides = [140, 220, 300, 380, 460];

const flowPaths = [
  {
    id: "flux-1",
    d: "M140 220 C 280 170 440 210 560 180 C 720 140 840 220 940 180",
    duration: "7.2s",
    begin: "-1.8s",
  },
  {
    id: "flux-2",
    d: "M100 300 C 260 360 420 280 560 330 C 700 380 820 320 960 360",
    duration: "6.1s",
    begin: "-3.4s",
  },
  {
    id: "flux-3",
    d: "M160 390 C 320 340 460 420 620 360 C 760 320 860 360 940 320",
    duration: "8.4s",
    begin: "-2.6s",
  },
  {
    id: "flux-4",
    d: "M80 150 C 260 190 420 140 620 220 C 760 280 880 240 980 280",
    duration: "9.6s",
    begin: "-4.1s",
  },
  {
    id: "flux-5",
    d: "M120 260 C 220 200 420 260 520 220 C 700 150 840 260 960 210",
    duration: "5.8s",
    begin: "-5s",
  },
];

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-[#050505] px-6 pb-24 pt-24 text-[color:rgba(244,241,234,0.85)] md:px-12">
      <h1 className="sr-only">microagents</h1>

      <div className="flex w-full max-w-6xl flex-col items-center gap-6">
        <div className="relative w-full max-w-5xl">
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
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
              </radialGradient>
              <filter id="path-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {horizontalGuides.map((y) => (
              <line
                key={y}
                x1={120}
                y1={y}
                x2={920}
                y2={y}
                stroke="url(#guide-stroke)"
                strokeWidth={1}
                strokeDasharray="4 16"
              />
            ))}

            {flowPaths.map(({ id, d, duration, begin }) => (
              <g key={id} filter="url(#path-glow)">
                <path
                  id={id}
                  d={d}
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle r={6} fill="url(#node-glow)" className="motion-reduce:hidden">
                  <animateMotion dur={duration} begin={begin} repeatCount="indefinite" keySplines="0.42 0 0.58 1" keyTimes="0;1" calcMode="spline">
                    <mpath href={`#${id}`} />
                  </animateMotion>
                </circle>
              </g>
            ))}
          </svg>
        </div>

        <div className="relative flex w-full justify-center">
          <img
            src="/white-logo-trans.png"
            alt="Microagents wordmark"
            className="w-full max-w-[1500px] opacity-100 -mt-20 md:-mt-28 lg:-mt-36"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
