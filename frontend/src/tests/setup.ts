import "@testing-library/jest-dom/vitest";
import "vitest-axe/extend-expect";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

const elementPrototype = window.HTMLElement.prototype as {
  hasPointerCapture?: (pointerId: number) => boolean;
  setPointerCapture?: (pointerId: number) => void;
  releasePointerCapture?: (pointerId: number) => void;
  scrollIntoView?: (options?: ScrollIntoViewOptions) => void;
};

if (!elementPrototype.hasPointerCapture) {
  elementPrototype.hasPointerCapture = () => false;
}

if (!elementPrototype.setPointerCapture) {
  elementPrototype.setPointerCapture = () => {};
}

if (!elementPrototype.releasePointerCapture) {
  elementPrototype.releasePointerCapture = () => {};
}

if (!elementPrototype.scrollIntoView) {
  elementPrototype.scrollIntoView = () => {};
}

if (typeof window.matchMedia !== "function") {
  window.matchMedia = () => ({
    matches: false,
    media: "",
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

if (typeof window.ResizeObserver !== "function") {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserverStub as unknown as typeof window.ResizeObserver;
}
