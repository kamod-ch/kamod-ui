import {
  applyThemePreset,
  isThemePresetId,
  setThemePreset,
  THEME_PRESET_STORAGE_KEY,
  THEME_PRESETS,
  themePresetSignal,
  useThemePreset,
} from "@kamod-ch/themes";
import type { JSX } from "preact";
import { useEffect, useLayoutEffect, useRef } from "preact/hooks";

export type ThemePresetSelectProps = Omit<JSX.HTMLAttributes<HTMLLabelElement>, "onInput"> & {
  selectClass?: string;
};

export const ThemePresetSelect = ({
  class: className,
  selectClass,
  ...rest
}: ThemePresetSelectProps) => {
  const preset = useThemePreset();
  const selectRef = useRef<HTMLSelectElement>(null);
  const selectId = "theme-preset-select";

  useLayoutEffect(() => {
    const select = selectRef.current;
    if (!select || select.value === preset) return;
    select.value = preset;
  }, [preset]);

  useEffect(() => {
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
        ref={selectRef}
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
