import { applyThemePreset, resolveInitialThemePreset } from "./theme/theme-presets";
import "./styles/index.css";

const initialTheme = (() => {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem("theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
})();

applyThemePreset(resolveInitialThemePreset());
document.documentElement.classList.toggle("dark", initialTheme);
