import { ArrowUpRightIcon, PaletteIcon, SunMoonIcon } from "@kamod-ch/icons/lucide";
import { setThemePreset, THEME_PRESETS } from "@kamod-ch/themes";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@kamod-ch/ui";
import { withBasePath } from "../base-path";

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
        <header class="site-theme-picker-header">
          <span class="site-theme-picker-icon" aria-hidden="true">
            <PaletteIcon size={19} />
          </span>
          <div>
            <PopoverTitle>Color theme</PopoverTitle>
            <PopoverDescription>Find your palette, type &amp; surfaces.</PopoverDescription>
          </div>
        </header>
        <div class="site-theme-options" role="group" aria-label="Site color theme">
          {THEME_PRESETS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={preset === id}
              onClick={() => setThemePreset(id)}
            >
              <span>{label}</span>
              {preset === id && (
                <span class="site-theme-selected-label" aria-hidden="true">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
        <footer class="site-theme-picker-footer">
          <span>
            <SunMoonIcon size={13} aria-hidden="true" />
            Light &amp; dark ready
          </span>
          <a href={withBasePath("/docs/theming/installation")}>
            Theming guide
            <ArrowUpRightIcon size={13} aria-hidden="true" />
          </a>
        </footer>
      </PopoverContent>
    </Popover>
  );
}
