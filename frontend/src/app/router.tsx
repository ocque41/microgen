/* eslint-disable react-refresh/only-export-components */
import { Suspense } from "react";
import { Await, Navigate, Outlet, createBrowserRouter, useLoaderData, useLocation } from "react-router-dom";
import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";

import { BackendAuthProvider } from "../contexts/BackendAuthContext";
import ProtectedRoute from "../routes/ProtectedRoute";
import { StackNavigationBridge } from "../components/StackNavigationBridge";
import { ChatSkeleton } from "../components/skeletons/ChatSkeleton";
import { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton";
import { BrandSkeleton } from "../components/skeletons/BrandSkeleton";
import { QaSkeleton } from "../components/skeletons/QaSkeleton";
import { WorkbenchDetailSkeleton } from "../components/skeletons/WorkbenchSkeleton";
import type { FactRecord } from "../lib/facts";
import { FACTS_STORAGE_KEY } from "../lib/facts";
import type { MicroAgent } from "../pages/DashboardPage";
import { ChatPage } from "../pages/ChatPage";
import type { BrandPreview } from "../pages/BrandPage";
import { BrandPage } from "../pages/BrandPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { LoginPage } from "../pages/LoginPage";
import { MarketingPage } from "../pages/MarketingPage";
import { SignupPage } from "../pages/SignupPage";
import { stackClientApp } from "../stack";
import { WorkbenchDetailRoute, workbenchDetailAction, workbenchDetailLoader } from "../routes/(workbench)/detail";
import { WorkbenchIndexRoute } from "../routes/(workbench)/index";
import { WorkbenchLayout, workbenchLoader } from "../routes/(workbench)/layout";
import { QaRoute, qaLoader } from "../routes/qa";

const stackBrandTheme = {
  dark: {
    background: "#090909",
    foreground: "#d9dcd6",
    card: "#242423",
    cardForeground: "#d9dcd6",
    popover: "#333533",
    popoverForeground: "#d9dcd6",
    primary: "#0091ad",
    primaryForeground: "#090909",
    secondary: "#333533",
    secondaryForeground: "#d9dcd6",
    muted: "#333533",
    mutedForeground: "#c5c9c2",
    accent: "#0091ad",
    accentForeground: "#090909",
    destructive: "#eb6424",
    destructiveForeground: "#090909",
    border: "#001427",
    input: "#001427",
    ring: "#0091ad",
  },
  light: {
    background: "#090909",
    foreground: "#d9dcd6",
  },
} as const;

function HandlerRoutes() {
  const location = useLocation();
  const stackLocation = `${location.pathname}${location.search ?? ""}${location.hash ?? ""}`;

  if (location.pathname === "/handler/sign-in") {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === "/handler/sign-up") {
    return <Navigate to="/signup" replace />;
  }

  return <StackHandler app={stackClientApp} location={stackLocation} fullPage />;
}

function AppLayout() {
  return (
    <StackProvider app={stackClientApp}>
      <BackendAuthProvider>
        <StackTheme theme={stackBrandTheme}>
          <StackNavigationBridge />
          <Outlet />
        </StackTheme>
      </BackendAuthProvider>
    </StackProvider>
  );
}

type ChatLoaderResult = {
  facts: Promise<FactRecord[]>;
};

type DashboardLoaderResult = {
  dashboard: Promise<{
    agent: MicroAgent | null;
    errorMessage?: string | null;
    statusMessage?: string | null;
  }>;
};

type BrandLoaderResult = {
  preview: Promise<BrandPreview>;
};

async function loadFactsFromSession(): Promise<FactRecord[]> {
  if (typeof window === "undefined") {
    return [];
  }

  return new Promise((resolve) => {
    window.setTimeout(() => {
      try {
        const stored = window.sessionStorage.getItem(FACTS_STORAGE_KEY);
        if (!stored) {
          resolve([]);
          return;
        }
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
          resolve([]);
          return;
        }
        const records = parsed.filter((entry: unknown): entry is FactRecord => {
          if (!entry || typeof entry !== "object") {
            return false;
          }
          const candidate = entry as Record<string, unknown>;
          return (
            typeof candidate.id === "string" &&
            typeof candidate.text === "string" &&
            typeof candidate.status === "string" &&
            typeof candidate.createdAt === "string"
          );
        });
        resolve(records);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("[router] Failed to parse stored facts", error);
        }
        resolve([]);
      }
    }, 0);
  });
}

async function loadDashboardSnapshot() {
  if (typeof window === "undefined") {
    return { agent: null };
  }

  try {
    const response = await fetch("/api/microagents/me", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
    const payload = (await response.json().catch(() => ({}))) as {
      agent?: MicroAgent;
      message?: string;
    };

    if (response.status === 401) {
      return {
        agent: null,
        errorMessage: "Your session expired. Please log in again.",
      };
    }

    if (!response.ok || !payload.agent) {
      return {
        agent: null,
        errorMessage: payload.message ?? "We could not load your micro-agent details.",
      };
    }

    return {
      agent: payload.agent,
      statusMessage: payload.message,
    };
  } catch (error) {
    return {
      agent: null,
      errorMessage:
        error instanceof Error
          ? error.message
          : "Something went wrong while loading your dashboard.",
    };
  }
}

const brandPreviewSeed: BrandPreview = {
  surfaces: [
    {
      id: "background",
      label: "Background",
      description: "Primary canvas for application chrome and immersive layouts.",
      token: "--brand-color-background",
      textToken: "--brand-color-text",
      accentToken: "--brand-color-accent",
    },
    {
      id: "surface",
      label: "Elevated surface",
      description: "Cards and modals, using stronger border for hierarchy and softness.",
      token: "--brand-color-surface",
      textToken: "--brand-color-text",
      accentToken: "--brand-color-accent-soft",
    },
    {
      id: "glass",
      label: "Glass overlay",
      description: "Translucent panes for navigation rails and detail inspectors.",
      token: "--glass-bg",
      textToken: "--brand-color-text",
      accentToken: "--brand-color-accent-strong",
    },
  ],
  focusNotes: [
    {
      id: "focus-halo",
      title: "3px halo",
      description: "Focus rings use a 3px outline with accent lift to meet WCAG 2.2 3.2.7 contrast requirements.",
    },
    {
      id: "focus-radius",
      title: "Radius aligned",
      description: "Outline respects the component radius tokens so controls feel precise, not bloated.",
    },
    {
      id: "focus-motion",
      title: "Motion aware",
      description: "Transitions respect reduced-motion preferences and avoid scroll-driven timelines by default.",
    },
  ],
  contrastChecks: [
    {
      id: "glass-body",
      label: "Body copy on glass",
      ratio: "≥ 4.8:1",
      backgroundToken: "--glass-bg",
      foregroundToken: "--brand-color-text",
      description: "Primary text uses the full-spectrum foreground color even on translucent panes.",
    },
    {
      id: "glass-muted",
      label: "Secondary on glass",
      ratio: "≥ 3.4:1",
      backgroundToken: "--glass-bg",
      foregroundToken: "--brand-color-text-secondary",
      description: "Muted copy remains above AA by mixing ambient slate into the glass stack.",
    },
    {
      id: "glass-accent",
      label: "Accent over glow",
      ratio: "≥ 3:1",
      backgroundToken: "--brand-color-surface-glow",
      foregroundToken: "--brand-color-accent",
      description: "Use accent tones against glow surfaces for primary CTAs and interactive states.",
    },
  ],
};

async function loadBrandPreview() {
  return new Promise<BrandPreview>((resolve) => {
    setTimeout(() => resolve(brandPreviewSeed), 80);
  });
}

function ProtectedOutlet() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

function ChatRoute() {
  const { facts } = useLoaderData() as ChatLoaderResult;

  return (
    <Suspense fallback={<ChatSkeleton />}>
      <Await resolve={facts} errorElement={<ChatSkeleton />}>
        {(initialFacts) => <ChatPage initialFacts={initialFacts} />}
      </Await>
    </Suspense>
  );
}

function DashboardRoute() {
  const { dashboard } = useLoaderData() as DashboardLoaderResult;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Await resolve={dashboard} errorElement={<DashboardSkeleton />}>
        {(snapshot) => (
          <DashboardPage
            initialAgent={snapshot.agent}
            initialError={snapshot.errorMessage}
            initialStatus={snapshot.statusMessage}
          />
        )}
      </Await>
    </Suspense>
  );
}

function BrandRoute() {
  const { preview } = useLoaderData() as BrandLoaderResult;

  return (
    <Suspense fallback={<BrandSkeleton />}>
      <Await resolve={preview} errorElement={<BrandSkeleton />}>
        {(data) => <BrandPage preview={data} />}
      </Await>
    </Suspense>
  );
}

export const router = createBrowserRouter(
  [
    {
      id: "root",
      element: <AppLayout />,
      children: [
        {
          path: "/handler/*",
          element: <HandlerRoutes />,
        },
        {
          index: true,
          element: <MarketingPage />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "signup",
          element: <SignupPage />,
        },
        {
          path: "forgot-password",
          element: <ForgotPasswordPage />,
        },
        {
          path: "brand",
          loader: () => ({ preview: loadBrandPreview() }),
          element: <BrandRoute />,
          pendingElement: <BrandSkeleton />,
        },
        {
          path: "qa",
          loader: qaLoader,
          element: <QaRoute />,
          pendingElement: <QaSkeleton />,
        },
        {
          path: "workbench",
          loader: workbenchLoader,
          element: <WorkbenchLayout />,
          children: [
            {
              index: true,
              element: <WorkbenchIndexRoute />,
            },
            {
              path: ":taskId",
              loader: workbenchDetailLoader,
              action: workbenchDetailAction,
              element: <WorkbenchDetailRoute />,
              pendingElement: <WorkbenchDetailSkeleton />,
            },
          ],
        },
        {
          element: <ProtectedOutlet />,
          children: [
            {
              path: "chat",
              loader: () => ({ facts: loadFactsFromSession() }),
              element: <ChatRoute />,
              pendingElement: <ChatSkeleton />,
            },
            {
              path: "dashboard",
              loader: () => ({ dashboard: loadDashboardSnapshot() }),
              element: <DashboardRoute />,
              pendingElement: <DashboardSkeleton />,
            },
          ],
        },
        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ],
  {
    future: {
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
      v7_relativeSplatPath: true,
    },
  }
);
