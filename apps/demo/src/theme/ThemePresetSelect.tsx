import {
  applyThemePreset,
  isThemePresetId,
  setThemePreset,
  syncThemeFromStorage,
  THEME_PRESET_STORAGE_KEY,
  THEME_PRESETS,
  themePresetSignal,
} from "@kamod-ch/themes";
import type { JSX } from "preact";
import { useEffect } from "preact/hooks";

export type ThemePresetSelectProps = Omit<JSX.HTMLAttributes<HTMLLabelElement>, "onInput"> & {
  selectClass?: string;
};

export const ThemePresetSelect = ({
  class: className,
  selectClass,
  ...rest
}: ThemePresetSelectProps) => {
  const preset = themePresetSignal.value;
  const selectId = "theme-preset-select";

  useEffect(() => {
    syncThemeFromStorage();

    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_PRESET_STORAGE_KEY || !event.newValue) return;
      if (!isThemePresetId(event.newValue)) return;
      themePresetSignal.value = event.newValue;
      applyThemePreset(event.newValue);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <label class={className} {...rest}>
      <span class="sr-only" id={`${selectId}-label`}>
        Color theme preset
      </span>
      <select
        id={selectId}
        name="theme-preset"
        data-slot="theme-preset-select"
        class={selectClass}
        value={preset}
        aria-labelledby={`${selectId}-label`}
        title="Theme preset"
        onInput={(event) => {
          const next = (event.currentTarget as HTMLSelectElement).value;
          if (isThemePresetId(next)) {
            setThemePreset(next);
          }
        }}
      >
        {THEME_PRESETS.map((themePreset) => (
          <option key={themePreset.id} value={themePreset.id}>
            {themePreset.label}
          </option>
        ))}
      </select>
    </label>
  );
};
