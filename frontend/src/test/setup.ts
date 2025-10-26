import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
});

if (typeof globalThis.atob !== "function") {
  globalThis.atob = (input: string): string => {
    const buffer = Buffer.from(input, "base64");
    return buffer.toString("binary");
  };
}
