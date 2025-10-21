import clsx from "clsx";

import { ChatKitPanel } from "../components/ChatKitPanel";
import { useFacts } from "../hooks/useFacts";
import { useColorScheme } from "../hooks/useColorScheme";

export function ChatPage() {
  const { scheme, setScheme } = useColorScheme();
  const { performAction, refresh } = useFacts();

  const containerClass = clsx(
    "flex min-h-screen items-stretch justify-center px-4 py-6",
    scheme === "dark"
      ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      : "bg-gradient-to-br from-slate-100 via-white to-slate-100"
  );

  return (
    <div className={containerClass}>
      <div className="h-[85vh] w-full max-w-4xl flex-1">
        <ChatKitPanel
          theme={scheme}
          onWidgetAction={performAction}
          onResponseEnd={refresh}
          onThemeRequest={setScheme}
        />
      </div>
    </div>
  );
}
