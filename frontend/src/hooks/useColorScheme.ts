import { useCallback, useEffect, useState } from "react";

import { THEME_STORAGE_KEY } from "../lib/config";

export type ColorScheme = "light" | "dark";

function getInitialScheme(): ColorScheme {
  if (typeof window === "undefined") {
    return "dark";
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ColorScheme | null;
  if (stored === "dark") {
    return "dark";
  }
  return "dark";
}

export function useColorScheme() {
  const [scheme, setScheme] = useState<ColorScheme>(getInitialScheme);

  const applyDark = useCallback(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("dark");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    }
  }, []);

  useEffect(() => {
    applyDark();
  }, [applyDark, scheme]);

  const toggle = useCallback(() => {
    setScheme("dark");
    applyDark();
  }, [applyDark]);

  const setExplicit = useCallback((value: ColorScheme) => {
    void value;
    setScheme("dark");
    applyDark();
  }, [applyDark]);

  return { scheme, toggle, setScheme: setExplicit };
}
