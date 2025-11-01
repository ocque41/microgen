import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createAuthenticatedFetch,
  requestJwtExchange,
  type EnsureOptions,
} from "./BackendAuthContext";

describe("BackendAuth helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exchanges Stack tokens for a backend JWT", async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.body).toBeUndefined();
      const headers = new Headers(init?.headers);
      expect(headers.get("X-Stack-Access-Token")).toBe("stack-access");
      expect(headers.get("X-Stack-Refresh-Token")).toBe("stack-refresh");
      return new Response(JSON.stringify({ access_token: "jwt-token" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    vi.stubGlobal("fetch", fetchMock);

    const token = await requestJwtExchange({
      accessToken: "stack-access",
      refreshToken: "stack-refresh",
    });

    expect(token).toBe("jwt-token");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect(init?.credentials).toBe("include");
    const headers = new Headers(init?.headers);
    expect(headers.get("X-Stack-Access-Token")).toBe("stack-access");
    expect(headers.get("X-Stack-Refresh-Token")).toBe("stack-refresh");
  });

  it("adds authorization headers and retries once after a 401", async () => {
    const ensure = vi.fn<(options?: EnsureOptions) => Promise<string>>().mockResolvedValue("jwt-primary");
    const refresh = vi.fn<() => Promise<string>>().mockResolvedValue("jwt-refreshed");

    const headersSeen: Array<string | null> = [];
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers ?? {});
      headersSeen.push(headers.get("Authorization"));

      if (headersSeen.length === 1) {
        return new Response(null, { status: 401 });
      }

      return new Response("ok", { status: 200 });
    });

    vi.stubGlobal("fetch", fetchMock);

    const authorizedFetch = createAuthenticatedFetch(ensure, refresh);
    const response = await authorizedFetch("/chatkit/session", { method: "POST" });

    expect(response.status).toBe(200);
    expect(headersSeen).toEqual(["Bearer jwt-primary", "Bearer jwt-refreshed"]);
    expect(ensure).toHaveBeenCalledTimes(1);
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
