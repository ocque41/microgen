import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

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
  import.meta.env.VITE_STACK_APP_URL ??
  (typeof window !== "undefined" ? window.location.origin : undefined);

export const stackClientApp = new StackClientApp({
  projectId,
  publishableClientKey,
  baseUrl: stackBaseUrl,
  tokenStore: "cookie",
  redirectMethod: { useNavigate },
  urls: {
    signIn: "/login",
    signUp: "/signup",
    afterSignIn: "/chat",
    afterSignUp: "/chat",
  },
});
