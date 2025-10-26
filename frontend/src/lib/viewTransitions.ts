import { useSyncExternalStore } from "react";
import type { NavigateFunction, NavigateOptions } from "react-router-dom";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOTION_DISABLED_CLASS = "motion-disabled";
const MOTION_DISABLED_DATA = "disabled";

type ViewTransitionCallback = () => void | Promise<void>;

declare global {
  interface Document {
    startViewTransition?: (callback: ViewTransitionCallback) => ViewTransition;
  }

  interface ViewTransition {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    skip(): void;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function prefersReducedMotion(): boolean {
  if (!isBrowser() || typeof window.matchMedia !== "function") {
    return false;
  }

  try {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  } catch {
    return false;
  }
}

function hasMotionKillSwitch(): boolean {
  if (!isBrowser()) {
    return false;
  }

  const root = document.documentElement;
  const body = document.body;

  const rootDisabled =
    root?.classList.contains(MOTION_DISABLED_CLASS) || root?.dataset.motion === MOTION_DISABLED_DATA;
  const bodyDisabled =
    body?.classList.contains(MOTION_DISABLED_CLASS) || body?.dataset.motion === MOTION_DISABLED_DATA;

  return Boolean(rootDisabled || bodyDisabled);
}

export function isMotionSuppressed(): boolean {
  return prefersReducedMotion() || hasMotionKillSwitch();
}

export function supportsViewTransitions(): boolean {
  return isBrowser() && typeof document.startViewTransition === "function";
}

export function shouldUseViewTransitions(): boolean {
  return supportsViewTransitions() && !isMotionSuppressed();
}

function subscribeToMotionPreference(listener: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  const unsubs: Array<() => void> = [];
  const media = typeof window.matchMedia === "function" ? window.matchMedia(REDUCED_MOTION_QUERY) : undefined;

  if (media) {
    const handler = () => listener();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handler);
      unsubs.push(() => media.removeEventListener("change", handler));
    } else if (typeof media.addListener === "function") {
      media.addListener(handler);
      unsubs.push(() => media.removeListener(handler));
    }
  }

  if (typeof MutationObserver === "function") {
    const observer = new MutationObserver(listener);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-motion"],
    });
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class", "data-motion"],
      });
    }
    unsubs.push(() => observer.disconnect());
  }

  return () => {
    for (const unsubscribe of unsubs) {
      unsubscribe();
    }
  };
}

export function useMotionSuppressed(): boolean {
  return useSyncExternalStore(subscribeToMotionPreference, isMotionSuppressed, () => false);
}

export function useViewTransitionsEnabled(): boolean {
  return useSyncExternalStore(subscribeToMotionPreference, shouldUseViewTransitions, () => false);
}

export async function startViewTransition(update: ViewTransitionCallback): Promise<void> {
  if (!isBrowser()) {
    await Promise.resolve().then(update);
    return;
  }

  if (!shouldUseViewTransitions()) {
    await Promise.resolve().then(update);
    return;
  }

  try {
    const transition = document.startViewTransition?.(() => Promise.resolve(update()));
    await transition?.finished;
  } catch {
    await Promise.resolve().then(update);
  }
}

type NavigateTarget = Parameters<NavigateFunction>[0];

export function navigateWithViewTransition(
  navigate: NavigateFunction,
  to: NavigateTarget,
  options?: NavigateOptions
): ReturnType<NavigateFunction> {
  if (typeof to === "number") {
    return navigate(to);
  }

  const merged: NavigateOptions = {
    ...options,
    viewTransition: shouldUseViewTransitions(),
  };

  return navigate(to, merged);
}

export function getViewTransitionFlag(): boolean {
  return shouldUseViewTransitions();
}

export function viewTransitionLinkProps(): { viewTransition: boolean } {
  return { viewTransition: shouldUseViewTransitions() };
}
