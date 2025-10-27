const verticalGuides = [120, 320, 520, 720, 920];

const flowPaths = [
  { id: "flow-1", d: "M140 360 L180 310 L140 270", duration: "5s", begin: "-1.5s" },
  { id: "flow-2", d: "M320 420 Q 360 340 320 260 Q 280 200 340 150", duration: "7s", begin: "-2.8s" },
  { id: "flow-3", d: "M520 170 Q 580 220 540 280 Q 500 340 560 400", duration: "7.5s", begin: "-3.2s" },
  { id: "flow-4", d: "M720 430 Q 760 340 730 240 Q 700 170 760 130", duration: "6.5s", begin: "-4s" },
];

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-[#050505] px-6 pb-24 pt-28 text-[color:rgba(244,241,234,0.85)] md:px-12">
      <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" aria-hidden="true" />
      <h1 className="sr-only">microagents</h1>

      <svg
        className="h-auto w-full max-w-5xl"
        viewBox="0 0 1040 560"
        fill="none"
        role="presentation"
        aria-hidden="true"
      >
        {verticalGuides.map((x) => (
          <line
            key={x}
            x1={x}
            y1={80}
            x2={x}
            y2={480}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
          />
        ))}

        {flowPaths.map(({ id, d, duration, begin }) => (
          <g key={id}>
            <path id={id} d={d} stroke="rgba(255,255,255,0.45)" strokeWidth={1.6} strokeLinecap="round" fill="none" />
            <circle r={4} fill="rgba(255,255,255,0.9)" className="motion-reduce:hidden">
              <animateMotion dur={duration} begin={begin} repeatCount="indefinite" rotate="auto">
                <mpath href={`#${id}`} />
              </animateMotion>
            </circle>
          </g>
        ))}
      </svg>

      <img src="/logo.svg" alt="Microagents" className="mt-12 w-full max-w-[340px]" loading="lazy" />
    </section>
  );
}
