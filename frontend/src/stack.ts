import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

type NavigateFn = (to: string) => void;

let stackNavigate: NavigateFn | undefined;

export function setStackNavigate(fn: NavigateFn | undefined) {
  stackNavigate = fn;
}

function requireEnv(
  name: "VITE_STACK_PROJECT_ID" | "VITE_STACK_PUBLISHABLE_CLIENT_KEY",
  description: string
) {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(
      `[Stack Auth] Missing ${name}. Add ${description} to your .env.local file (e.g. ${name}=...).`
    );
  }
  return value;
}

const projectId = requireEnv("VITE_STACK_PROJECT_ID", "the Stack Auth project ID");
const publishableClientKey = requireEnv(
  "VITE_STACK_PUBLISHABLE_CLIENT_KEY",
  "the Stack Auth publishable client key"
);

const stackBaseUrl =
  import.meta.env.VITE_STACK_APP_URL ||
  (typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? window.location.origin
    : undefined);

if (
  !import.meta.env.VITE_STACK_APP_URL &&
  typeof window !== "undefined" &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname)
) {
  // eslint-disable-next-line no-console -- surfaced once to help diagnose misconfiguration in production
  console.warn(
    "[Stack Auth] VITE_STACK_APP_URL is not set. Falling back to the default Stack cloud endpoint."
  );
}

export const stackClientApp = new StackClientApp({
  projectId,
  publishableClientKey,
  baseUrl: stackBaseUrl,
  tokenStore: "cookie",
  redirectMethod: {
    useNavigate,
    navigate: (to: string) => {
      if (stackNavigate) {
        stackNavigate(to);
      } else if (typeof window !== "undefined") {
        window.location.assign(to);
      }
    },
  },
  urls: {
    signIn: "/login",
    signUp: "/signup",
    afterSignIn: "/dashboard",
    afterSignUp: "/dashboard",
  },
});
