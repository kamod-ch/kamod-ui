import { CheckIcon, PaletteIcon } from "@kamod-ch/icons/lucide";
import { setThemePreset, THEME_PRESETS } from "@kamod-ch/themes";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@kamod-ch/ui";

import { useSiteThemePreset } from "./useSiteThemePreset";

/** A compact site-wide picker, separate from the showcase's local appearance controls. */
export function ThemePresetPicker({
  side = "bottom",
  showLabel = false,
}: {
  side?: "top" | "bottom";
  showLabel?: boolean;
}) {
  const preset = useSiteThemePreset();
  return (
    <Popover class="site-theme-picker">
      <PopoverTrigger
        class={`site-icon-button${showLabel ? " site-theme-picker-labeled" : ""}`}
        aria-label="Choose color theme"
        title="Choose color theme"
      >
        <PaletteIcon size={18} aria-hidden="true" />
        {showLabel && <span>{THEME_PRESETS.find(({ id }) => id === preset)?.label}</span>}
      </PopoverTrigger>
      <PopoverContent class="site-theme-picker-content" side={side} align="end" sideOffset={8}>
        <PopoverTitle>Color theme</PopoverTitle>
        <p>Make the library feel like your project.</p>
        <div class="site-theme-options" role="group" aria-label="Site color theme">
          {THEME_PRESETS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={preset === id}
              onClick={() => setThemePreset(id)}
            >
              <span>{label}</span>
              {preset === id && <CheckIcon size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
