import type { CSSProperties } from "react";

import "./story.css";

type StoryStep = {
  title: string;
  description: string;
  metric?: string;
};

type Story = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  steps: StoryStep[];
};

const stories: Story[] = [
  {
    id: "launch",
    eyebrow: "Operational launch",
    title: "Pinned accountability through every rollout",
    description:
      "Each launch cadence keeps compliance, operators, and product in the same glass workspace so approvals never fall out of view.",
    steps: [
      {
        title: "Frame the guardrails",
        description:
          "Summarize the policy envelope, escalation matrix, and fallback playbooks in a single pinned brief that stays visible while scrolling the rollout log.",
        metric: "Policy gaps ↓37%",
      },
      {
        title: "Stream the shadow runs",
        description:
          "Pinned QA panes scrub transcripts and scores as they arrive. Teams annotate risks inline while the panel glides with the scroll timeline.",
        metric: "QA velocity ×2.1",
      },
      {
        title: "Sign off with context",
        description:
          "Compliance snapshots freeze the final state with immutable evidence, letting legal and ops approve in a single view transition.",
        metric: "Approval cycle 48h",
      },
    ],
  },
  {
    id: "monitoring",
    eyebrow: "Live monitoring",
    title: "Glass dashboards that surface the right escalation",
    description:
      "Pinned panels highlight accountable metrics with subtle parallax so incident reviewers can glance the trend while scrolling archived sessions.",
    steps: [
      {
        title: "Blend retention & risk",
        description:
          "Risk-weighted retention shows which automations are worth the lift. Every card keeps AA+ contrast against the blurred background for late-night shifts.",
        metric: "Retention +18%",
      },
      {
        title: "Track interventions",
        description:
          "Scroll-guided toasts replay human overrides and tool invocations right inside the timeline, making accountability effortless.",
        metric: "Escalations in <6m",
      },
      {
        title: "Spot drift instantly",
        description:
          "Pinned comparison states reveal when assistants drift from policy. Motion-sensitive teams can flip to static summaries with the kill switch.",
        metric: "Drift detection 94%",
      },
    ],
  },
  {
    id: "handoff",
    eyebrow: "Human handoff",
    title: "Confident transitions from agent to expert",
    description:
      "Pinned glass panes package transcripts, tool outputs, and next steps so experts never lose the thread when they accept an escalation.",
    steps: [
      {
        title: "Capture the transcript",
        description:
          "Scroll-driven cards preserve the conversation with highlighted policy citations. Reduced motion users see the same context without timelines.",
        metric: "Context loss 0%",
      },
      {
        title: "Hand off the insights",
        description:
          "Agents attach structured insights—root cause, customer sentiment, affected systems—while parallax glows keep attention on the key callouts.",
        metric: "Prep time ↓62%",
      },
      {
        title: "Close the loop",
        description:
          "Pinned follow-up tasks sync back to ChatKit so the assistant learns from every resolution and future runs stay on script.",
        metric: "Resolution SLA 99%",
      },
    ],
  },
];

export function StorySections() {
  return (
    <div className="story-stack" aria-label="Story walkthroughs for Microagents customers">
      {stories.map((story, storyIndex) => (
        <section
          key={story.id}
          className="story-section scroll-scene"
          aria-labelledby={`story-${story.id}-title`}
        >
          <div className="story-shell">
            <div className="story-copy" role="presentation">
              <p className="story-eyebrow">{story.eyebrow}</p>
              <h2 id={`story-${story.id}-title`} className="story-heading">
                {story.title}
              </h2>
              <p className="story-description">{story.description}</p>
              <div className="story-progress" aria-hidden="true">
                <span className="story-progress-index">{String(storyIndex + 1).padStart(2, "0")}</span>
                <span className="story-progress-total">/ {String(stories.length).padStart(2, "0")}</span>
              </div>
            </div>
            <ol
              className="story-steps scroll-track"
              style={
                {
                  "--scroll-track-name": `story-${story.id}`,
                  "--scroll-animation-range": "entry 5% exit 95%",
                } as CSSProperties
              }
            >
              {story.steps.map((step, stepIndex) => (
                <li
                  key={step.title}
                  className="story-step scroll-driven"
                  style={
                    {
                      "--scroll-scene-delay": `${stepIndex * 120}ms`,
                    } as CSSProperties
                  }
                >
                  <div
                    className="story-step-glow scroll-driven"
                    style={
                      {
                        "--scroll-animation-range": "entry 0% exit 100%",
                        "--scroll-scene-delay": `${stepIndex * 60}ms`,
                      } as CSSProperties
                    }
                    aria-hidden="true"
                  />
                  <div className="story-step-content">
                    <div className="story-step-meta">
                      <span className="story-step-index" aria-hidden="true">
                        {String(stepIndex + 1).padStart(2, "0")}
                      </span>
                      {step.metric ? (
                        <span className="story-step-metric">{step.metric}</span>
                      ) : null}
                    </div>
                    <h3 className="story-step-title">{step.title}</h3>
                    <p className="story-step-description">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}
    </div>
  );
}

