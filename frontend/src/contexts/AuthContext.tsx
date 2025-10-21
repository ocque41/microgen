import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AUTH_TOKEN_STORAGE_KEY } from "../lib/config";

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getInitialToken() {
  if (typeof window === "undefined") {
    return null;
  }
  const stored = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  return stored && stored.length > 0 ? stored : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getInitialToken);

  const login = useCallback((nextToken: string) => {
    setToken(nextToken);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, nextToken);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), login, logout }),
    [token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
