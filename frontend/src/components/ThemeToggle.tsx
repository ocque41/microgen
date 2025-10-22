import clsx from "clsx";
import type { ColorScheme } from "../hooks/useColorScheme";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  value: ColorScheme;
  onChange: (scheme: ColorScheme) => void;
};

const buttonBase =
  "inline-flex h-9 w-9 items-center justify-center rounded-full text-[0.7rem] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent focus-visible:outline-offset-2";

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-brand-border bg-brand-backgroundElevated p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onChange("light")}
        className={clsx(
          buttonBase,
          value === "light"
            ? "bg-brand-accent text-brand-accentInverse shadow-sm"
            : "text-brand-textMuted hover:text-brand-text"
        )}
        aria-label="Use light theme"
        aria-pressed={value === "light"}
      >
        <Sun className="h-4 w-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onChange("dark")}
        className={clsx(
          buttonBase,
          value === "dark"
            ? "bg-brand-accent text-brand-accentInverse shadow-sm"
            : "text-brand-textMuted hover:text-brand-text"
        )}
        aria-label="Use dark theme"
        aria-pressed={value === "dark"}
      >
        <Moon className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
