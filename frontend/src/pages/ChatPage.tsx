import { ChatKitPanel } from "../components/ChatKitPanel";
import { useFacts } from "../hooks/useFacts";
import { useColorScheme } from "../hooks/useColorScheme";

export function ChatPage() {
  const { setScheme } = useColorScheme();
  const { performAction, refresh } = useFacts();

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
