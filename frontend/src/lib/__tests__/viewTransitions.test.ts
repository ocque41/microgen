import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import {
  isMotionSuppressed,
  navigateWithViewTransition,
  shouldUseViewTransitions,
  startViewTransition,
  supportsViewTransitions,
} from "../viewTransitions";

type MutableDocument = Document & {
  startViewTransition?: Document["startViewTransition"];
};

type MutableWindow = typeof globalThis & { matchMedia?: typeof window.matchMedia };

const globalTarget = globalThis as MutableWindow & { document?: MutableDocument };
const originalWindow = globalTarget.window;
const originalDocument = globalTarget.document;

class FakeClassList {
  private tokens = new Set<string>();

  add(token: string) {
    this.tokens.add(token);
  }

  remove(token: string) {
    this.tokens.delete(token);
  }

  contains(token: string) {
    return this.tokens.has(token);
  }
}

function createStubDocument(): MutableDocument {
  return {
    documentElement: {
      classList: new FakeClassList() as unknown as DOMTokenList,
      dataset: {} as DOMStringMap,
    },
    body: {
      classList: new FakeClassList() as unknown as DOMTokenList,
      dataset: {} as DOMStringMap,
    },
  } as unknown as MutableDocument;
}

let stubbedWindow: MutableWindow | undefined;
let stubbedDocument: MutableDocument | undefined;

beforeAll(() => {
  if (!globalTarget.document) {
    stubbedDocument = createStubDocument();
    globalTarget.document = stubbedDocument;
  }
  if (!globalTarget.window) {
    stubbedWindow = {} as MutableWindow;
    globalTarget.window = stubbedWindow;
  }
});

const originalMatchMedia = globalTarget.matchMedia;
const originalWindowMatchMedia = originalWindow?.matchMedia;

function mockMediaQuery(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQuery: MediaQueryList = {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: (_event, handler) => {
      listeners.add(handler as (event: MediaQueryListEvent) => void);
    },
    removeEventListener: (_event, handler) => {
      listeners.delete(handler as (event: MediaQueryListEvent) => void);
    },
    dispatchEvent: (event) => {
      listeners.forEach((listener) => listener(event));
      return true;
    },
    addListener: (handler) => listeners.add(handler as (event: MediaQueryListEvent) => void),
    removeListener: (handler) => listeners.delete(handler as (event: MediaQueryListEvent) => void),
  };
  const matchMedia = vi.fn().mockReturnValue(mediaQuery) as unknown as typeof window.matchMedia;
  globalTarget.matchMedia = matchMedia;
  if (globalTarget.window) {
    globalTarget.window.matchMedia = matchMedia;
  }
}

function mockViewTransitionSupport() {
  (document as MutableDocument).startViewTransition = vi.fn(() => ({
    finished: Promise.resolve(),
    ready: Promise.resolve(),
    updateCallbackDone: Promise.resolve(),
    skip: vi.fn(),
  }));
}

afterEach(() => {
  if (originalMatchMedia) {
    globalTarget.matchMedia = originalMatchMedia;
    if (globalTarget.window) {
      globalTarget.window.matchMedia = originalWindowMatchMedia ?? originalMatchMedia;
    }
  } else {
    delete globalTarget.matchMedia;
    if (globalTarget.window) {
      delete globalTarget.window.matchMedia;
    }
  }
  delete (document as MutableDocument).startViewTransition;
  document.documentElement.classList.remove("motion-disabled");
  document.body.classList.remove("motion-disabled");
});

afterAll(() => {
  if (originalDocument) {
    globalTarget.document = originalDocument;
  } else if (stubbedDocument) {
    delete globalTarget.document;
  }

  if (originalWindow) {
    globalTarget.window = originalWindow;
  } else if (stubbedWindow) {
    delete globalTarget.window;
  }
});

describe("view transition utilities", () => {
  beforeEach(() => {
    mockMediaQuery(false);
  });

  it("detects when the browser cannot start view transitions", () => {
    expect(supportsViewTransitions()).toBe(false);
    mockViewTransitionSupport();
    expect(supportsViewTransitions()).toBe(true);
  });

  it("disables view transitions when motion is suppressed", () => {
    mockViewTransitionSupport();
    mockMediaQuery(true);
    expect(shouldUseViewTransitions()).toBe(false);
    document.documentElement.classList.add("motion-disabled");
    mockMediaQuery(false);
    expect(shouldUseViewTransitions()).toBe(false);
    expect(isMotionSuppressed()).toBe(true);
  });

  it("runs startViewTransition even when support is missing", async () => {
    const update = vi.fn();
    await startViewTransition(update);
    expect(update).toHaveBeenCalledTimes(1);
  });

  it("wraps imperative navigation with view transitions when supported", () => {
    mockViewTransitionSupport();
    const navigate = vi.fn();
    navigateWithViewTransition(navigate, "/brand");
    expect(navigate).toHaveBeenCalledWith(
      "/brand",
      expect.objectContaining({ viewTransition: true })
    );
  });
});
