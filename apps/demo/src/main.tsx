import { LocationProvider } from "preact-iso";
import { render } from "preact";
import { App } from "./App";
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

render(
  <LocationProvider>
    <App />
  </LocationProvider>,
  document.getElementById("app")!
);
