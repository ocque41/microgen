import type { ReactNode } from "react";

const BORDER_COLOR = "rgba(244, 241, 234, 0.16)";
const TEXT_SOFT = "color-mix(in srgb, var(--text-primary) 68%, transparent)";
const TITLE_SPACING_STYLE = { letterSpacing: "-1.5px", lineHeight: "10px" } as const;
const TEXT_SPACING_STYLE = { letterSpacing: "-0.5px", lineHeight: "18px" } as const;

type Step = {
  id: string;
  title: string;
  highlight: string;
  description: ReactNode;
  imageSrc: string;
};

const steps: Step[] = [
  {
    id: "brief",
    title: "Clarify the brief",
    highlight: "Capture the workflow, guardrails, and success metrics so everyone sees the same definition of done.",
    imageSrc: "/gradient2.png",
    description: (
      <>
        <p>
          Gather policies, escalation paths, and expected outputs inside a shared kickoff canvas. Legal, operators, and product stay in the same view, so approval never drifts into a side thread.
        </p>
        <p>
          Teams annotate the canvas live while transcripts and tool traces flow in, making it obvious what the automation should and should not attempt on day one.
        </p>
      </>
    ),
  },
  {
    id: "approve",
    title: "Approve the agent",
    highlight: "Run shadow sessions in a guided sandbox before production traffic ever hits the API.",
    imageSrc: "frontend/public/background.png",
    description: (
      <>
        <p>
          Every proposed action streams into a review lane with pinned evidence. Compliance flips switches, operators leave inline feedback, and product sees exactly how the sequence behaves.
        </p>
        <p>
          When the run looks right, the same panel publishes a sign-off record that travels with the workflow for future audits.
        </p>
      </>
    ),
  },
  {
    id: "run",
    title: "Run with confidence",
    highlight: "Launch the automation with real-time accountability dashboards and human-ready escalation trails.",
    imageSrc: "frontend/public/gradient1.jpg",
    description: (
      <>
        <p>
          Live traces replay decisions, tool calls, and handoffs without leaving the dashboard. If something drifts from policy, teams can pause instantly or rewind to the signed-off version.
        </p>
        <p>
          Usage metrics, retention signals, and safety alerts stay anchored in one glass pane so leaders know what the agent did—and why—at a glance.
        </p>
      </>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section aria-label="How Microagents works" className="relative mt-24 md:mt-32 xl:mt-40" data-how-it-works>
      <div className="flex flex-col gap-4 px-6 pb-12 text-left sm:px-10 lg:px-16 xl:px-20">
        <h2
          className="text-3xl font-semibold text-[color:rgba(249,249,249,0.94)] sm:text-4xl md:text-5xl"
          style={TITLE_SPACING_STYLE}
        >
          How it works
        </h2>
      </div>
      {steps.map((step, index) => {
        const nextStep = steps[index + 1];

        return (
          <article
            key={step.id}
            className="relative flex min-h-screen flex-col bg-[#090909] md:flex-row"
            aria-labelledby={`how-it-works-${step.id}`}
          >
            <div className="relative flex-1 border-t" style={{ borderColor: BORDER_COLOR }}>
              <div
                className="absolute left-6 top-16 bottom-16 hidden w-px md:block"
                style={{ backgroundColor: BORDER_COLOR }}
                aria-hidden="true"
              />
              <div className="relative z-[1] flex h-full flex-col gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-20 xl:py-24">
                <header className="border-b pb-10" style={{ borderColor: BORDER_COLOR }}>
                  <div className="flex items-baseline gap-4 text-sm font-semibold uppercase tracking-[0.6em] text-[color:rgba(244,241,234,0.55)]">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="tracking-[0.3em]">Step</span>
                  </div>
                  <div
                    className="mt-6 flex items-center gap-3 text-left text-2xl font-semibold sm:text-3xl md:text-4xl"
                    id={`how-it-works-${step.id}`}
                  >
                    <span className="text-base font-semibold uppercase tracking-[0.4em] text-[color:rgba(244,241,234,0.45)]">—</span>
                    <span style={TITLE_SPACING_STYLE}>{step.title}</span>
                  </div>
                </header>

                <div className="flex flex-1 flex-col gap-8 justify-end">
                  <p
                    className="text-lg font-medium leading-relaxed text-[color:rgba(249,249,249,0.88)] sm:text-xl"
                    style={TEXT_SPACING_STYLE}
                  >
                    {step.highlight}
                  </p>
                  <div
                    className="space-y-5 text-base leading-relaxed sm:text-lg"
                    style={{ ...TEXT_SPACING_STYLE, color: TEXT_SOFT }}
                  >
                    {step.description}
                  </div>
                </div>

                {nextStep ? (
                  <footer className="border-t pt-8" style={{ borderColor: BORDER_COLOR }}>
                    <p className="text-xs uppercase tracking-[0.4em] text-[color:rgba(244,241,234,0.45)]">Next</p>
                    <p className="mt-3 text-sm font-medium uppercase tracking-[0.3em] text-[color:rgba(244,241,234,0.65)]">
                      {String(index + 2).padStart(2, "0")} — {nextStep.title}
                    </p>
                  </footer>
                ) : (
                  <footer className="border-t pt-8" style={{ borderColor: BORDER_COLOR }}>
                    <p className="text-xs uppercase tracking-[0.4em] text-[color:rgba(244,241,234,0.45)]">You&apos;re ready</p>
                    <p className="mt-3 text-sm font-medium uppercase tracking-[0.3em] text-[color:rgba(244,241,234,0.65)]">
                      Launch your microagents
                    </p>
                  </footer>
                )}
              </div>
            </div>

            <div
              className="relative h-[55vh] w-full overflow-hidden border-t border-l md:h-auto md:min-h-screen md:w-[42%]"
              style={{ borderColor: BORDER_COLOR }}
            >
              <img
                src={step.imageSrc}
                alt="Atmospheric gradient background"
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(58,124,165,0.22),transparent_55%)] mix-blend-screen"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.1)_0%,rgba(9,9,9,0.55)_100%)]"
                aria-hidden="true"
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}
