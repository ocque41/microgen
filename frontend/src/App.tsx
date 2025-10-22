import { Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { ChatPage } from "./pages/ChatPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LoginPage } from "./pages/LoginPage";
import { MarketingPage } from "./pages/MarketingPage";
import { SignupPage } from "./pages/SignupPage";
import { stackClientApp } from "./stack";

function HandlerRoutes() {
  const location = useLocation();
  const stackLocation = `${location.pathname}${location.search ?? ""}${location.hash ?? ""}`;
  return <StackHandler app={stackClientApp} location={stackLocation} fullPage />;
}

export default function App() {
  const stackBrandTheme = {
    dark: {
      background: "#171717",
      foreground: "#ede8e0",
      card: "#1f2518",
      cardForeground: "#ede8e0",
      popover: "#272b1e",
      popoverForeground: "#ede8e0",
      primary: "#b57033",
      primaryForeground: "#171717",
      secondary: "#1f2518",
      secondaryForeground: "#ede8e0",
      muted: "#272b1e",
      mutedForeground: "#d3cebc",
      accent: "#b57033",
      accentForeground: "#171717",
      destructive: "#9f5519",
      destructiveForeground: "#171717",
      border: "#343929",
      input: "#343929",
      ring: "#b57033",
    },
    light: {
      background: "#171717",
      foreground: "#ede8e0",
    },
  } as const;

  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <StackProvider app={stackClientApp}>
          <StackTheme theme={stackBrandTheme}>
            <Routes>
              <Route path="/handler/*" element={<HandlerRoutes />} />
              <Route path="/" element={<MarketingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </StackTheme>
        </StackProvider>
      </BrowserRouter>
    </Suspense>
  );
}
