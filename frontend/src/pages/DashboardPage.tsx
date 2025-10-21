import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

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
  const { token, logout } = useAuth();
  const [agent, setAgent] = useState<MicroAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameSubmitting, setRenameSubmitting] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  useEffect(() => {
    async function loadAgent() {
      setLoading(true);
      setError(null);
      setStatus(null);
      try {
        const response = await fetch("/api/microagents/me", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const payload = (await response.json().catch(() => ({}))) as MicroAgentResponse;
        if (response.status === 401) {
          logout();
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
  }, [token, logout]);

  async function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agent) return;
    setRenameSubmitting(true);
    setError(null);
    setStatus(null);

    try {
      const response = await fetch("/api/microagents/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name: renameValue }),
      });
      const payload = (await response.json().catch(() => ({}))) as MicroAgentResponse;
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
      const response = await fetch("/api/microagents/me/cancel", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const payload = (await response.json().catch(() => ({}))) as MicroAgentResponse;
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
    <div className="min-h-screen bg-slate-50 px-6 py-16 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Customer Dashboard</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Manage your micro-agent subscription and jump back into conversations when you are ready.
            </p>
          </div>
          <Link
            to="/chat"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Open chat
          </Link>
        </header>

        <div className="mt-10 rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl dark:border-slate-800/70 dark:bg-slate-900">
          {loading ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">Loading your micro-agent...</p>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          ) : null}

          {status ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
              {status}
            </div>
          ) : null}

          {agent ? (
            <div className="mt-6 grid gap-10 md:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Micro-agent overview</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Track the status of your assistant and keep its branding up to date.
                  </p>
                </div>

                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                    <dt className="font-medium text-slate-700 dark:text-slate-200">Agent name</dt>
                    <dd className="mt-1 text-slate-900 dark:text-slate-100">{agent.name}</dd>
                  </div>
                  <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                    <dt className="font-medium text-slate-700 dark:text-slate-200">Status</dt>
                    <dd className="mt-1 capitalize text-slate-900 dark:text-slate-100">{agent.status}</dd>
                  </div>
                  <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                    <dt className="font-medium text-slate-700 dark:text-slate-200">Plan</dt>
                    <dd className="mt-1 text-slate-900 dark:text-slate-100">{agent.plan ?? "Starter"}</dd>
                  </div>
                  <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                    <dt className="font-medium text-slate-700 dark:text-slate-200">Agent ID</dt>
                    <dd className="mt-1 text-slate-900 dark:text-slate-100">{agent.id}</dd>
                  </div>
                </dl>

                <form className="space-y-4" onSubmit={handleRename}>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="rename">
                      Rename micro-agent
                    </label>
                    <input
                      id="rename"
                      type="text"
                      value={renameValue}
                      onChange={(event) => setRenameValue(event.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-200/60 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={renameSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    {renameSubmitting ? "Updating..." : "Save"}
                  </button>
                </form>
              </div>

              <aside className="space-y-4 rounded-3xl border border-slate-200/60 bg-slate-100/70 p-6 text-sm dark:border-slate-700 dark:bg-slate-800/70">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Manage subscription</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Cancel anytime. Your data stays available for 30 days in case you need to reactivate.
                </p>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-500 hover:bg-red-500/20 disabled:opacity-60 dark:border-red-500/60 dark:bg-red-500/10 dark:text-red-300"
                >
                  {cancelSubmitting ? "Processing..." : "Cancel subscription"}
                </button>
              </aside>
            </div>
          ) : null}

          {!loading && !agent && !error ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              You have not purchased a micro-agent yet. Visit the marketing page to compare plans.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
