import type { ComponentChildren, JSX } from "preact";
import { useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import { Button } from "../button";

export type ThemeToggleProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "class"> & {
  class?: string;
  children?: ComponentChildren;
};

const SunIcon = ({ class: className }: { class?: string }) => (
  <svg
    class={cn("size-4 shrink-0", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ class: className }: { class?: string }) => (
  <svg
    class={cn("size-4 shrink-0", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const THEME_STORAGE_KEY = "theme";

const readInitialDarkMode = () => {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
};

const persistTheme = (darkMode: boolean) => {
  const value = darkMode ? "dark" : "light";
  document.documentElement.classList.toggle("dark", darkMode);
  window.localStorage.setItem(THEME_STORAGE_KEY, value);
  document.cookie = `${THEME_STORAGE_KEY}=${value}; path=/; max-age=31536000; SameSite=Lax`;
};

export const ThemeToggle = ({ children, onClick, ...rest }: ThemeToggleProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(readInitialDarkMode);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      data-slot="theme-toggle"
      data-state={darkMode ? "dark" : "light"}
      aria-label={children == null ? (darkMode ? "Light mode" : "Dark mode") : undefined}
      onClick={(event) => {
        setDarkMode((current) => {
          const next = !current;
          persistTheme(next);
          return next;
        });
        onClick?.(event);
      }}
      {...rest}
    >
      {children ?? (darkMode ? <SunIcon /> : <MoonIcon />)}
    </Button>
  );
};
