import { StartScreenPrompt } from "@openai/chatkit";
import { Sparkles, Target, Keyboard } from "lucide-react";
import { Button } from "../ui/button";

type QuickActionsBarProps = {
  prompts: StartScreenPrompt[];
  onPromptPick: (prompt: StartScreenPrompt) => void;
  onFocusComposer: () => void;
  isBusy: boolean;
};

export function QuickActionsBar({ prompts, onPromptPick, onFocusComposer, isBusy }: QuickActionsBarProps) {
  const featured = prompts.slice(0, 3);

  return (
    <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/40 bg-surface-elevated/40 px-4 py-3 text-sm text-text shadow-[0_30px_90px_-70px_rgba(0,0,0,0.9)] lg:px-6">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-text-muted">
        <Target className="h-4 w-4" aria-hidden />
        <span>Quick actions</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {featured.map((prompt) => (
          <Button
            key={prompt.label}
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border-border/50 bg-surface-background/50 text-xs text-text hover:border-border/60"
            onClick={() => onPromptPick(prompt)}
            disabled={isBusy}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            {prompt.label}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="gap-2 rounded-full text-xs text-text-muted hover:text-text"
          onClick={onFocusComposer}
        >
          <Keyboard className="h-4 w-4" aria-hidden />
          Focus composer
        </Button>
      </div>
    </div>
  );
}
