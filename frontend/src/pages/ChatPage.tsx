import { useCallback, useEffect } from "react";

import { ChatKitPanel } from "../components/ChatKitPanel";
import { useFacts } from "../hooks/useFacts";
import { useColorScheme } from "../hooks/useColorScheme";
import { useBackendAuth } from "../contexts/BackendAuthContext";

export function ChatPage() {
  const { setScheme } = useColorScheme();
  const { performAction, refresh } = useFacts();
  const { status, error, ensureAuthorization } = useBackendAuth();

  useEffect(() => {
    void ensureAuthorization();
  }, [ensureAuthorization]);

  const retry = useCallback(() => ensureAuthorization({ force: true }), [ensureAuthorization]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-background px-4 py-6">
        <div className="text-center text-brand-foreground">Preparing your chat workspace…</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-background px-4 py-6">
        <div className="max-w-md rounded-xl border border-brand-border bg-brand-card p-6 text-center text-brand-foreground">
          <p className="text-lg font-semibold">We couldn&apos;t reach the chat service.</p>
          <p className="mt-3 text-sm opacity-80">
            {error?.message ?? "Please try again in a few moments."}
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-primary px-4 py-2 font-medium text-brand-primary-foreground"
            onClick={() => retry()}
          >
            Retry connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-stretch justify-center bg-brand-background px-4 py-6">
      <div className="h-[85vh] w-full max-w-4xl flex-1">
        <ChatKitPanel
          onWidgetAction={performAction}
          onResponseEnd={refresh}
          onThemeRequest={setScheme}
        />
      </div>
    </div>
  );
}
