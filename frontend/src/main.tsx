import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./app/router";
import { initWebVitals } from "./app/rum/webVitals";
import "./styles/tokens.css";
import "./styles/typography.css";
import "./styles/type-scale.css";
import "./styles/globals.css";
import "./styles/scroll.css";
import "./index.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element with id 'root' not found");
}

initWebVitals();

createRoot(container).render(
  <StrictMode>
    <Suspense
      fallback={
        <div
          aria-busy="true"
          aria-live="polite"
          className="flex min-h-screen items-center justify-center bg-surface-background text-text"
        >
          <span className="text-sm">Loading Microagents…</span>
        </div>
      }
    >
      <RouterProvider
        router={router}
        fallbackElement={
          <div
            aria-busy="true"
            aria-live="polite"
            className="flex min-h-screen items-center justify-center bg-surface-background text-text"
          >
            <span className="text-sm">Loading Microagents…</span>
          </div>
        }
      />
    </Suspense>
  </StrictMode>
);
