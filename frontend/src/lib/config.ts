import { StartScreenPrompt } from "@openai/chatkit";

export const CHATKIT_API_URL =
  import.meta.env.VITE_CHATKIT_API_URL ?? "/chatkit";

/**
 * ChatKit still expects a domain key at runtime. Use any placeholder locally,
 * but register your production domain at
 * https://platform.openai.com/settings/organization/security/domain-allowlist
 * and deploy the real key.
 */
export const CHATKIT_API_DOMAIN_KEY =
  import.meta.env.VITE_CHATKIT_API_DOMAIN_KEY ?? "domain_pk_localhost_dev";

export const FACTS_API_URL = import.meta.env.VITE_FACTS_API_URL ?? "/facts";

export const THEME_STORAGE_KEY = "microagents-theme";

export const STACK_JWT_EXCHANGE_URL =
  import.meta.env.VITE_STACK_JWT_EXCHANGE_URL ?? "/api/auth/stack/exchange";
// plan-step[1]: Provide utilities so other modules resolve backend-relative endpoints consistently.

export function resolveBackendUrl(candidate: string): string {
  if (/^https?:\/\//i.test(candidate)) {
    return candidate;
  }

  try {
    if (/^https?:\/\//i.test(STACK_JWT_EXCHANGE_URL)) {
      const origin = new URL(STACK_JWT_EXCHANGE_URL).origin;
      return new URL(candidate, origin).toString();
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[config] Failed to resolve backend URL", error);
    }
  }

  return candidate;
}

export const GREETING = "Welcome to Microagents.";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "How do you operate?",
    prompt: "Summarize how you keep Microagents accountable and safe for operators.",
    icon: "circle-question",
  },
  {
    label: "Record a profile fact",
    prompt: "Store the operator name as Morgan Alvarez for future replies.",
    icon: "book-open",
  },
  {
    label: "Check today's forecast",
    prompt: "Provide the Paris weather report for today and cite the data source.",
    icon: "search",
  },
  {
    label: "Confirm brand theme",
    prompt: "Confirm the interface is using the Microagents dark theme.",
    icon: "sparkle",
  },
];

export const PLACEHOLDER_INPUT = "Provide a clear instruction for your microagent";
