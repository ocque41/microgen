import { useCallback, useState } from "react";
import { useUser } from "@stackframe/react";
import { LogOut, MoreHorizontal } from "lucide-react";

import { ChatKitPanel } from "../components/ChatKitPanel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { useBackendAuth } from "../contexts/BackendAuthContext";
import { useFacts } from "../hooks/useFacts";
import { useColorScheme } from "../hooks/useColorScheme";
import type { FactRecord } from "../lib/facts";

type ChatPageProps = {
  initialFacts?: FactRecord[];
};

export function ChatPage({ initialFacts = [] }: ChatPageProps) {
  const { setScheme } = useColorScheme();
  const { performAction, refresh } = useFacts(initialFacts);
  const { clearAuthorization } = useBackendAuth();
  const user = useUser({ or: "throw" });
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = useCallback(async () => {
    if (signingOut) {
      return;
    }
    setSigningOut(true);
    try {
      await user.signOut();
    } finally {
      // plan-step[2]: Clear cached backend JWT when leaving the Stack session.
      clearAuthorization();
      setSigningOut(false);
    }
  }, [clearAuthorization, signingOut, user]);

  return (
    <div className="flex min-h-screen items-stretch justify-center bg-surface-background px-4 py-6">
      <div className="relative h-[85vh] w-full max-w-4xl flex-1">
        <div className="pointer-events-auto absolute right-4 top-4 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-border/60 bg-surface-background/80 text-text hover:bg-surface-elevated/40"
                disabled={signingOut}
              >
                <MoreHorizontal className="h-4 w-4" aria-hidden />
                <span className="sr-only">Open session menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="flex flex-col gap-0.5 text-xs text-text-muted">
                <span className="text-[11px] uppercase tracking-wide">Signed in</span>
                <span className="text-sm text-text">{user.primaryEmail ?? user.displayName ?? "Signed in"}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  void handleSignOut();
                }}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ChatKitPanel
          onWidgetAction={performAction}
          onResponseEnd={refresh}
          onThemeRequest={setScheme}
        />
      </div>
    </div>
  );
}
