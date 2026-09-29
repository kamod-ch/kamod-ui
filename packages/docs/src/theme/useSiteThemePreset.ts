import {
  applyThemePreset,
  isThemePresetId,
  THEME_PRESET_STORAGE_KEY,
  themePresetSignal,
  useThemePreset,
} from "@kamod-ch/themes";
import { useEffect } from "preact/hooks";

/** Keep both site picker presentations synchronized with changes made in another tab. */
export function useSiteThemePreset() {
  const preset = useThemePreset();
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (
        event.key !== THEME_PRESET_STORAGE_KEY ||
        !event.newValue ||
        !isThemePresetId(event.newValue)
      )
        return;
      themePresetSignal.value = event.newValue;
      applyThemePreset(event.newValue);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return preset;
}
