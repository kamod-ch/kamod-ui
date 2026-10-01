import { isThemePresetId, setThemePreset, THEME_PRESETS } from "@kamod-ch/themes";
import type { HTMLAttributes } from "preact";
import { useId, useLayoutEffect, useRef } from "preact/hooks";

import { useSiteThemePreset } from "./useSiteThemePreset";

export type ThemePresetSelectProps = Omit<HTMLAttributes<HTMLLabelElement>, "onInput"> & {
  selectClass?: string;
};

export const ThemePresetSelect = ({
  class: className,
  selectClass,
  ...rest
}: ThemePresetSelectProps) => {
  const preset = useSiteThemePreset();
  const selectRef = useRef<HTMLSelectElement>(null);
  const selectId = useId();

  useLayoutEffect(() => {
    const select = selectRef.current;
    if (!select || select.value === preset) return;
    select.value = preset;
  }, [preset]);

  return (
    <label class={className} {...(rest as Record<string, unknown>)}>
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
