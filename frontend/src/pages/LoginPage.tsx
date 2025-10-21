import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

type AuthResponse = {
  token?: string;
  message?: string;
};

type LocationState = {
  from?: { pathname?: string };
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectPath =
    ((location.state as LocationState | null)?.from?.pathname as string | undefined) ?? "/chat";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json().catch(() => ({}))) as AuthResponse;

      if (!response.ok || !payload.token) {
        throw new Error(payload.message ?? "Unable to log in with the provided credentials.");
      }

      login(payload.token);
      navigate(redirectPath, { replace: true });
    } catch (loginError) {
      if (loginError instanceof Error) {
        setError(loginError.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/oauth/${provider}`, {
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as AuthResponse;
      if (!response.ok || !payload.token) {
        throw new Error(payload.message ?? `Unable to authenticate with ${provider}.`);
      }
      login(payload.token);
      navigate("/chat", { replace: true });
    } catch (oauthError) {
      if (oauthError instanceof Error) {
        setError(oauthError.message);
      } else {
        setError("OAuth sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/60 bg-white p-10 shadow-xl dark:border-slate-800/70 dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Log in to continue chatting with your micro-agents.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200/60 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200/60 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-600"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-slate-600 underline-offset-2 hover:underline dark:text-slate-300">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200/70 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("apple")}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200/70 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500"
          >
            Continue with Apple
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          New to Microgen?{" "}
          <Link to="/signup" className="font-semibold text-slate-900 underline-offset-2 hover:underline dark:text-slate-100">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
