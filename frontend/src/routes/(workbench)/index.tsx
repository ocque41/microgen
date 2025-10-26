import { useOutletContext } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { WorkbenchContextValue } from "./layout";

export function WorkbenchIndexRoute() {
  const context = useOutletContext<WorkbenchContextValue>();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-full border border-border/40 bg-surface-elevated/20">
        <Sparkles className="h-6 w-6 text-accent" aria-hidden />
      </div>
      <div className="space-y-2 max-w-lg">
        <h2 className="text-xl font-semibold">Select a task to review</h2>
        <p className="text-sm text-text-muted">
          Choose a workbench task from the left pane to stream its detail view. You can also open the command palette to jump
          directly or start a fresh ChatKit session.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={context.openCommandPalette}>Open command palette</Button>
        <Button variant="outline" onClick={() => context.setLatestWidget(null)}>
          Clear widget preview
        </Button>
      </div>
    </div>
  );
}

