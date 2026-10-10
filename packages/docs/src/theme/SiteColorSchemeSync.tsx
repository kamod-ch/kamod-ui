import {
  applyColorScheme,
  applyThemePreset,
  colorSchemeSignal,
  DEFAULT_THEME_PRESET,
  isThemePresetId,
  resolvedColorSchemeSignal,
  THEME_PRESET_STORAGE_KEY,
  THEME_STORAGE_KEY,
  themePresetSignal,
} from "@kamod-ch/themes";
import { useEffect } from "preact/hooks";

/** One subscription for the page; preview documents keep their independent appearance. */
export function SiteColorSchemeSync({ page }: { page: unknown }) {
  useEffect(() => {
    if (/\/preview\/?$/.test(window.location.pathname)) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystem = () => {
      if (colorSchemeSignal.value === "system")
        resolvedColorSchemeSignal.value = applyColorScheme("system");
    };
    const syncStorage = (event: StorageEvent) => {
      if (event.key === THEME_PRESET_STORAGE_KEY || event.key === null) {
        const preset = event.newValue ?? DEFAULT_THEME_PRESET;
        if (isThemePresetId(preset)) {
          themePresetSignal.value = preset;
          applyThemePreset(preset);
        }
        if (event.key !== null) return;
      }
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
      const scheme =
        event.newValue === "light" || event.newValue === "dark" ? event.newValue : "system";
      colorSchemeSignal.value = scheme;
      resolvedColorSchemeSignal.value = applyColorScheme(scheme);
    };
    syncSystem();
    media.addEventListener("change", syncSystem);
    window.addEventListener("storage", syncStorage);
    return () => {
      media.removeEventListener("change", syncSystem);
      window.removeEventListener("storage", syncStorage);
    };
  }, [page]);
  return null;
}
