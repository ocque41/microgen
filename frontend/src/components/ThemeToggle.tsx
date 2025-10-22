import clsx from "clsx";
import type { ColorScheme } from "../hooks/useColorScheme";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  value: ColorScheme;
  onChange: (scheme: ColorScheme) => void;
};

const buttonBase =
  "inline-flex h-9 w-9 items-center justify-center rounded-full text-[0.7rem] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)] focus-visible:outline-offset-2";

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[color:rgba(23,23,23,0.65)] p-1 shadow-[0_20px_60px_-60px_rgba(0,0,0,0.9)]">
      <button
        type="button"
        onClick={() => onChange("light")}
        className={clsx(
          buttonBase,
          value === "light"
            ? "bg-[color:var(--accent)] text-[color:var(--accent-inverse)] shadow-sm"
            : "text-[color:var(--text-muted)] hover:text-[color:var(--accent-inverse)]"
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
            ? "bg-[color:var(--accent)] text-[color:var(--accent-inverse)] shadow-sm"
            : "text-[color:var(--text-muted)] hover:text-[color:var(--accent-inverse)]"
        )}
        aria-label="Use dark theme"
        aria-pressed={value === "dark"}
      >
        <Moon className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
