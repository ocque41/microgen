import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUser } from "@stackframe/react";

import { STACK_JWT_EXCHANGE_URL } from "../lib/config";
import { getJwtExpiry, isJwtExpired } from "../lib/jwt";

type BackendAuthStatus = "idle" | "loading" | "ready" | "error";

export type EnsureOptions = {
  force?: boolean;
};

type BackendAuthContextValue = {
  status: BackendAuthStatus;
  token: string | null;
  expiresAt: number | null;
  error: Error | null;
  ensureAuthorization: (options?: EnsureOptions) => Promise<string>;
  refreshAuthorization: () => Promise<string>;
  clearAuthorization: () => void;
  authenticatedFetch: typeof fetch;
};

const BackendAuthContext = createContext<BackendAuthContextValue | null>(null);

type StackSessionTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

export async function requestJwtExchange(tokens: StackSessionTokens): Promise<string> {
  if (!tokens.accessToken) {
    throw new Error("Stack session is missing access token");
  }
  if (!tokens.refreshToken) {
    throw new Error("Stack session is missing refresh token");
  }

  const response = await fetch(STACK_JWT_EXCHANGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`JWT exchange failed with status ${response.status}`);
  }

  const data: { access_token?: unknown } = await response.json();
  const token = typeof data.access_token === "string" ? data.access_token : null;
  if (!token) {
    throw new Error("JWT exchange response did not include an access token");
  }
  return token;
}

export function applyAuthorizationHeader(token: string, init: RequestInit | undefined): RequestInit {
  const headers = new Headers(init?.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);
  return {
    ...init,
    headers,
  };
}

export function createAuthenticatedFetch(
  ensure: (options?: EnsureOptions) => Promise<string>,
  refresh: () => Promise<string>
): typeof fetch {
  return async (input, init) => {
    const jwt = await ensure();
    const firstResponse = await fetch(input, applyAuthorizationHeader(jwt, init));
    if (firstResponse.status !== 401) {
      return firstResponse;
    }

    try {
      const refreshedJwt = await refresh();
      return await fetch(input, applyAuthorizationHeader(refreshedJwt, init));
    } catch (refreshError) {
      if (import.meta.env.DEV) {
        console.error("Failed to refresh backend JWT after 401", refreshError);
      }
      return firstResponse;
    }
  };
}

export function BackendAuthProvider({ children }: { children: ReactNode }) {
  const user = useUser({ or: "return-null" });

  const [status, setStatus] = useState<BackendAuthStatus>("idle");
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const inflight = useRef<Promise<string> | null>(null);

  const clearAuthorization = useCallback(() => {
    inflight.current = null;
    setToken(null);
    setExpiresAt(null);
    setStatus("idle");
    setError(null);
  }, []);

  useEffect(() => {
    if (!user) {
      clearAuthorization();
    }
  }, [user, clearAuthorization]);

  const exchange = useCallback(async () => {
    if (!user) {
      throw new Error("Cannot exchange Stack tokens without an authenticated user");
    }

    setStatus((current) => (current === "loading" ? current : "loading"));
    setError(null);

    const tokens = await user.currentSession.getTokens();
    const jwt = await requestJwtExchange(tokens);
    const expiry = getJwtExpiry(jwt);

    setToken(jwt);
    setExpiresAt(expiry);
    setStatus("ready");
    return jwt;
  }, [user]);

  const ensureAuthorization = useCallback(
    async (options?: EnsureOptions) => {
      const force = options?.force ?? false;

      if (!user) {
        throw new Error("No authenticated user available for backend authorization");
      }

      if (!force && token && !isJwtExpired(expiresAt)) {
        if (status !== "ready") {
          setStatus("ready");
        }
        return token;
      }

      if (inflight.current) {
        return inflight.current;
      }

      const promise = exchange().catch((err) => {
        clearAuthorization();
        setStatus("error");
        setError(err instanceof Error ? err : new Error("Failed to exchange Stack session"));
        throw err;
      });

      inflight.current = promise.finally(() => {
        inflight.current = null;
      });

      return inflight.current;
    },
    [clearAuthorization, exchange, expiresAt, status, token, user]
  );

  const refreshAuthorization = useCallback(() => ensureAuthorization({ force: true }), [ensureAuthorization]);

  const authenticatedFetch = useMemo(
    () => createAuthenticatedFetch(ensureAuthorization, refreshAuthorization),
    [ensureAuthorization, refreshAuthorization]
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await ensureAuthorization();
      } catch (primeError) {
        if (!cancelled && import.meta.env.DEV) {
          console.error("Failed to prime backend JWT", primeError);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ensureAuthorization, user]);

  const value = useMemo<BackendAuthContextValue>(
    () => ({
      status,
      token,
      expiresAt,
      error,
      ensureAuthorization,
      refreshAuthorization,
      clearAuthorization,
      authenticatedFetch,
    }),
    [authenticatedFetch, clearAuthorization, ensureAuthorization, error, expiresAt, refreshAuthorization, status, token]
  );

  return <BackendAuthContext.Provider value={value}>{children}</BackendAuthContext.Provider>;
}

export function useBackendAuth(): BackendAuthContextValue {
  const context = useContext(BackendAuthContext);
  if (!context) {
    throw new Error("useBackendAuth must be used within a BackendAuthProvider");
  }
  return context;
}
