import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@stackframe/react";

type MicroAgent = {
  id: string;
  name: string;
  status: string;
  plan?: string;
};

type MicroAgentResponse = {
  agent?: MicroAgent;
  message?: string;
};

export function DashboardPage() {
  const user = useUser({ or: "throw" });
  const [agent, setAgent] = useState<MicroAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameSubmitting, setRenameSubmitting] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

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

  useEffect(() => {
    async function loadAgent() {
      setLoading(true);
      setError(null);
      setStatus(null);
      try {
        const response = await authorizedFetch("/api/microagents/me");
        const payload = (await response.json().catch(() => ({}))) as MicroAgentResponse;
        if (response.status === 401) {
          await user.signOut();
          throw new Error("Your session expired. Please log in again.");
        }
        if (!response.ok || !payload.agent) {
          throw new Error(payload.message ?? "We could not load your micro-agent details.");
        }
        setAgent(payload.agent);
        setRenameValue(payload.agent.name);
      } catch (fetchError) {
        if (fetchError instanceof Error) {
          setError(fetchError.message);
        } else {
          setError("Something went wrong while loading your dashboard.");
        }
      } finally {
        setLoading(false);
      }
    }

    void loadAgent();
  }, [authorizedFetch, user]);

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

  return (
    <div className="min-h-screen bg-brand-background px-6 py-16 text-brand-text">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Customer dashboard</h1>
            <p className="text-sm text-brand-textMuted">
              Manage your Microagents subscription and return to live conversations when you are ready.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center rounded-full border border-brand-accent bg-brand-accent px-5 py-2 text-sm font-semibold text-brand-accentInverse transition hover:bg-brand-background hover:text-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent focus-visible:outline-offset-2"
            >
              Open chat
            </Link>
            <Link
              to="/handler/account-settings"
              className="inline-flex items-center justify-center rounded-full border border-brand-border px-5 py-2 text-sm font-semibold text-brand-text transition hover:border-brand-accent hover:text-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent focus-visible:outline-offset-2"
            >
              Account settings
            </Link>
          </div>
        </header>

        <div className="mt-10 rounded-3xl border border-brand-border bg-brand-backgroundElevated p-8 shadow-card">
          {loading ? (
            <p className="text-sm text-brand-textMuted">Loading your micro-agent...</p>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-state-critical bg-state-criticalSurface px-4 py-3 text-sm text-state-critical">
              {error}
            </div>
          ) : null}

          {status ? (
            <div className="rounded-xl border border-state-positive bg-state-positiveSurface px-4 py-3 text-sm text-state-positive">
              {status}
            </div>
          ) : null}

          {agent ? (
            <div className="mt-6 grid gap-10 md:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-brand-text">Micro-agent overview</h2>
                  <p className="text-sm text-brand-textMuted">
                    Track the status of your assistant and keep its branding up to date.
                  </p>
                </div>

                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-brand-border bg-brand-background p-4 text-sm">
                    <dt className="font-medium text-brand-textMuted">Agent name</dt>
                    <dd className="mt-1 text-brand-text">{agent.name}</dd>
                  </div>
                  <div className="rounded-2xl border border-brand-border bg-brand-background p-4 text-sm">
                    <dt className="font-medium text-brand-textMuted">Status</dt>
                    <dd className="mt-1 capitalize text-brand-text">{agent.status}</dd>
                  </div>
                  <div className="rounded-2xl border border-brand-border bg-brand-background p-4 text-sm">
                    <dt className="font-medium text-brand-textMuted">Plan</dt>
                    <dd className="mt-1 text-brand-text">{agent.plan ?? "Starter"}</dd>
                  </div>
                  <div className="rounded-2xl border border-brand-border bg-brand-background p-4 text-sm">
                    <dt className="font-medium text-brand-textMuted">Agent ID</dt>
                    <dd className="mt-1 text-brand-text">{agent.id}</dd>
                  </div>
                </dl>

                <form className="space-y-4" onSubmit={handleRename}>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-brand-text" htmlFor="rename">
                      Rename micro-agent
                    </label>
                    <input
                      id="rename"
                      type="text"
                      value={renameValue}
                      onChange={(event) => setRenameValue(event.target.value)}
                      required
                      className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 text-sm text-brand-text transition focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={renameSubmitting}
                    className="inline-flex items-center justify-center rounded-full border border-brand-accent bg-brand-accent px-5 py-2 text-sm font-semibold text-brand-accentInverse transition hover:bg-brand-background hover:text-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent focus-visible:outline-offset-2 disabled:opacity-60"
                  >
                    {renameSubmitting ? "Updating..." : "Save"}
                  </button>
                </form>
              </div>

              <aside className="space-y-4 rounded-3xl border border-brand-border bg-brand-backgroundElevated p-6 text-sm">
                <h3 className="text-lg font-semibold text-brand-text">Manage subscription</h3>
                <p className="text-brand-textMuted">
                  Cancel anytime. Your data stays available for 30 days in case you need to reactivate.
                </p>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full border border-state-critical bg-state-criticalSurface px-4 py-2 text-sm font-semibold text-state-critical transition hover:border-state-critical hover:bg-state-criticalSurface/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-state-critical focus-visible:outline-offset-2 disabled:opacity-60"
                >
                  {cancelSubmitting ? "Processing..." : "Cancel subscription"}
                </button>
              </aside>
            </div>
          ) : null}

          {!loading && !agent && !error ? (
            <p className="text-sm text-brand-textMuted">
              You have not purchased a micro-agent yet. Visit the marketing page to compare plans.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
