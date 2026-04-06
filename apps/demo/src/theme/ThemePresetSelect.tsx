import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import {
  THEME_PRESETS,
  THEME_PRESET_STORAGE_KEY,
  applyThemePreset,
  isThemePresetId,
  resolveInitialThemePreset,
  type ThemePresetId,
} from "./theme-presets";

export type ThemePresetSelectProps = Omit<JSX.HTMLAttributes<HTMLLabelElement>, "onInput"> & {
  selectClass?: string;
};

export const ThemePresetSelect = ({
  class: className,
  selectClass,
  ...rest
}: ThemePresetSelectProps) => {
  const [preset, setPreset] = useState<ThemePresetId>(resolveInitialThemePreset);
  const selectId = "theme-preset-select";

  useEffect(() => {
    applyThemePreset(preset);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_PRESET_STORAGE_KEY, preset);
    }
  }, [preset]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_PRESET_STORAGE_KEY || !event.newValue) return;
      if (!isThemePresetId(event.newValue)) return;
      setPreset(event.newValue);
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
        onChange={(event) => {
          const next = (event.currentTarget as HTMLSelectElement).value;
          if (isThemePresetId(next)) {
            setPreset(next);
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
