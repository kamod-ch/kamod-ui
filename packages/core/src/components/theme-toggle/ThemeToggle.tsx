import { useEffect, useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { Button } from "../button";

export type ThemeToggleProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "class"> & {
  class?: string;
  children?: ComponentChildren;
};

const resolveInitialDarkMode = () => {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem("theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const ThemeToggle = ({ children, onClick, ...rest }: ThemeToggleProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(resolveInitialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      data-slot="theme-toggle"
      data-state={darkMode ? "dark" : "light"}
      onClick={(event) => {
        setDarkMode((current) => !current);
        onClick?.(event);
      }}
      {...rest}
    >
      {children ?? (darkMode ? "Light mode" : "Dark mode")}
    </Button>
  );
};

