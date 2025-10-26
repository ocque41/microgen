import { ChatKitPanel } from "../components/ChatKitPanel";
import { useFacts } from "../hooks/useFacts";
import { useColorScheme } from "../hooks/useColorScheme";
import type { FactRecord } from "../lib/facts";

type ChatPageProps = {
  initialFacts?: FactRecord[];
};

export function ChatPage({ initialFacts = [] }: ChatPageProps) {
  const { setScheme } = useColorScheme();
  const { performAction, refresh } = useFacts(initialFacts);

  return (
    <div className="flex min-h-screen items-stretch justify-center bg-surface-background px-4 py-6">
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
