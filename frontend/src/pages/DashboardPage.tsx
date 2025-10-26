import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRevalidator } from "react-router-dom";
import { useUser } from "@stackframe/react";

import { TransitionLink } from "@/components/motion/TransitionLink";

export type MicroAgent = {
  id: string;
  name: string;
  status: string;
  plan?: string;
};

type MicroAgentResponse = {
  agent?: MicroAgent;
  message?: string;
};

type DashboardPageProps = {
  initialAgent: MicroAgent | null;
  initialError?: string | null;
  initialStatus?: string | null;
};

export function DashboardPage({
  initialAgent,
  initialError = null,
  initialStatus = null,
}: DashboardPageProps) {
  const user = useUser({ or: "throw" });
  const revalidator = useRevalidator();
  const [agent, setAgent] = useState<MicroAgent | null>(initialAgent);
  const [error, setError] = useState<string | null>(initialError);
  const [status, setStatus] = useState<string | null>(initialStatus);
  const [renameValue, setRenameValue] = useState(() => initialAgent?.name ?? "");
  const [renameSubmitting, setRenameSubmitting] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  useEffect(() => {
    setAgent(initialAgent);
  }, [initialAgent]);

  useEffect(() => {
    setRenameValue(initialAgent?.name ?? "");
  }, [initialAgent?.name]);

  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const authorizedFetch = useCallback(
    async (
      input: Parameters<typeof fetch>[0],
      init?: Parameters<typeof fetch>[1]
    ) => {
      const { accessToken } = await user.currentSession.getTokens();
      const headers = new Headers(init?.headers ?? {});
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return fetch(input, {
        ...init,
        headers,
      });
    },
    [user]
  );

  async function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agent) return;
    setRenameSubmitting(true);
    setError(null);
    setStatus(null);

    try {
      const response = await authorizedFetch("/api/microagents/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: renameValue }),
      });
      const payload = (await response.json().catch(() => ({}))) as MicroAgentResponse;
      if (response.status === 401) {
        await user.signOut();
        throw new Error("Your session expired. Please log in again.");
      }
      if (!response.ok || !payload.agent) {
        throw new Error(payload.message ?? "We could not rename your micro-agent.");
      }
      setAgent(payload.agent);
      setStatus("Micro-agent name updated.");
      void revalidator.revalidate();
    } catch (renameError) {
      if (renameError instanceof Error) {
        setError(renameError.message);
      } else {
        setError("Rename failed. Please try again.");
      }
    } finally {
      setRenameSubmitting(false);
    }
  }

  async function handleCancel() {
    if (!agent) return;
    setCancelSubmitting(true);
    setError(null);
    setStatus(null);

    try {
      const response = await authorizedFetch("/api/microagents/me/cancel", {
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as MicroAgentResponse;
      if (response.status === 401) {
        await user.signOut();
        throw new Error("Your session expired. Please log in again.");
      }
      if (!response.ok) {
        throw new Error(payload.message ?? "We could not cancel your subscription.");
      }
      setStatus(payload.message ?? "Subscription canceled. Contact support to reactivate.");
      setAgent((current) =>
        current
          ? {
              ...current,
              status: "canceled",
            }
          : current
      );
      void revalidator.revalidate();
    } catch (cancelError) {
      if (cancelError instanceof Error) {
        setError(cancelError.message);
      } else {
        setError("Cancel request failed. Please try again.");
      }
    } finally {
      setCancelSubmitting(false);
    }
  }

  const showLoadingMessage = revalidator.state === "loading" && !agent;
  const showEmptyState = revalidator.state === "idle" && !agent && !error;

  return (
    <div className="min-h-screen bg-surface-background px-6 py-16 text-text">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Customer dashboard</h1>
            <p className="text-sm text-[color:var(--text-muted)]">
              Manage your Microagents subscription and return to live conversations when you are ready.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <TransitionLink
              to="/chat"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-[color:var(--accent-inverse)] transition hover:bg-[color:var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)] focus-visible:outline-offset-3"
            >
              Open chat
            </TransitionLink>
            <TransitionLink
              to="/handler/account-settings"
              className="inline-flex items-center justify-center rounded-full bg-[color:rgba(23,23,23,0.65)] px-5 py-2 text-sm font-semibold text-[color:var(--accent-inverse)] transition hover:bg-[color:rgba(23,23,23,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)] focus-visible:outline-offset-3"
            >
              Account settings
            </TransitionLink>
          </div>
        </header>

        <div
          className="mt-10 rounded-3xl p-8 shadow-[0_40px_120px_-90px_rgba(0,0,0,0.9)] backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(244,241,234,0.05)",
          }}
        >
          {showLoadingMessage ? (
            <p className="text-sm text-[color:var(--text-muted)]">Loading your micro-agent...</p>
          ) : null}

          {error ? (
            <div
              className="mt-4 rounded-2xl px-4 py-3 text-sm text-[color:var(--accent-inverse)]"
              style={{
                backgroundColor: "rgba(127,79,36,0.25)",
              }}
            >
              {error}
            </div>
          ) : null}

          {status ? (
            <div
              className="mt-4 rounded-2xl px-4 py-3 text-sm text-[color:var(--accent-inverse)]"
              style={{
                backgroundColor: "rgba(166,138,100,0.25)",
              }}
            >
              {status}
            </div>
          ) : null}

          {agent ? (
            <div className="mt-6 grid gap-10 md:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Micro-agent overview</h2>
                  <p className="text-sm text-[color:var(--text-muted)]">
                    Track the status of your assistant and keep its branding up to date.
                  </p>
                </div>

                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div
                    className="rounded-2xl p-4 text-sm shadow-[0_20px_60px_-60px_rgba(0,0,0,0.9)]"
                    style={{
                      backgroundColor: "rgba(244,241,234,0.06)",
                    }}
                  >
                    <dt className="font-medium text-[color:var(--accent)]">Agent name</dt>
                    <dd className="mt-1">{agent.name}</dd>
                  </div>
                  <div
                    className="rounded-2xl p-4 text-sm shadow-[0_20px_60px_-60px_rgba(0,0,0,0.9)]"
                    style={{
                      backgroundColor: "rgba(244,241,234,0.06)",
                    }}
                  >
                    <dt className="font-medium text-[color:var(--accent)]">Status</dt>
                    <dd className="mt-1 capitalize">{agent.status}</dd>
                  </div>
                  <div
                    className="rounded-2xl p-4 text-sm shadow-[0_20px_60px_-60px_rgba(0,0,0,0.9)]"
                    style={{
                      backgroundColor: "rgba(244,241,234,0.06)",
                    }}
                  >
                    <dt className="font-medium text-[color:var(--accent)]">Plan</dt>
                    <dd className="mt-1">{agent.plan ?? "Starter"}</dd>
                  </div>
                  <div
                    className="rounded-2xl p-4 text-sm shadow-[0_20px_60px_-60px_rgba(0,0,0,0.9)]"
                    style={{
                      backgroundColor: "rgba(244,241,234,0.06)",
                    }}
                  >
                    <dt className="font-medium text-[color:var(--accent)]">Agent ID</dt>
                    <dd className="mt-1">{agent.id}</dd>
                  </div>
                </dl>

                <form className="space-y-4" onSubmit={handleRename}>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text" htmlFor="rename">
                      Rename micro-agent
                    </label>
                    <input
                      id="rename"
                      type="text"
                      value={renameValue}
                      onChange={(event) => setRenameValue(event.target.value)}
                      required
                      className="w-full rounded-2xl bg-[color:rgba(23,23,23,0.78)] px-4 py-3 text-sm text-[color:var(--accent-inverse)] transition focus:outline focus:outline-2 focus:outline-[color:var(--accent)] focus:outline-offset-2"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={renameSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-[color:var(--accent-inverse)] transition hover:bg-[color:var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)] focus-visible:outline-offset-3 disabled:opacity-60"
                  >
                    {renameSubmitting ? "Updating..." : "Save"}
                  </button>
                </form>
              </div>

              <aside
                className="space-y-4 rounded-3xl p-6 text-sm shadow-[0_30px_90px_-80px_rgba(0,0,0,0.9)]"
                style={{
                  backgroundColor: "rgba(244,241,234,0.06)",
                }}
              >
                <h3 className="text-lg font-semibold">Manage subscription</h3>
                <p className="text-[color:var(--text-muted)]">
                  Cancel anytime. Your data stays available for 30 days in case you need to reactivate.
                </p>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[color:rgba(127,79,36,0.45)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-inverse)] transition hover:bg-[color:rgba(127,79,36,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)] focus-visible:outline-offset-3 disabled:opacity-60"
                >
                  {cancelSubmitting ? "Processing..." : "Cancel subscription"}
                </button>
              </aside>
            </div>
          ) : null}

          {showEmptyState ? (
            <p className="text-sm text-[color:var(--text-muted)]">
              You have not purchased a micro-agent yet. Visit the marketing page to compare plans.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
