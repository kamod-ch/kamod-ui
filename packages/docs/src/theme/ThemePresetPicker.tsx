import { ArrowUpRightIcon, CheckIcon, PaletteIcon, SunMoonIcon } from "@kamod-ch/icons/lucide";
import { setThemePreset, THEME_PRESETS, type ThemePresetId } from "@kamod-ch/themes";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@kamod-ch/ui";
import { withBasePath } from "../base-path";

import { useSiteThemePreset } from "./useSiteThemePreset";

// Representative light-palette colors from packages/themes/src/brands and tokens.css.
// These stay stable while the surrounding picker follows the active appearance.
const paletteSamples: Record<ThemePresetId, readonly [string, string]> = {
  kamod: ["var(--color-neutral-950)", "var(--color-fuchsia-700)"],
  shadcn: ["#09090b", "#e4e4e7"],
  ocean: ["var(--color-cyan-700)", "var(--color-indigo-600)"],
  sunset: ["var(--color-rose-600)", "var(--color-orange-600)"],
  "cursor-warm": ["#f54e00", "#ebeae5"],
  voltage: ["#00a06c", "#818cf8"],
  watson: ["#f40f97", "#00c6ff"],
  professional: ["#fece14", "#000000"],
};

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
          <div class="site-theme-picker-heading">
            <PopoverTitle>Color theme</PopoverTitle>
            <span class="site-theme-picker-count">{THEME_PRESETS.length} presets</span>
          </div>
          <PopoverDescription>Explore palettes, type &amp; surfaces.</PopoverDescription>
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
              <span class="site-theme-option-detail" aria-hidden="true">
                <span class="site-theme-swatches">
                  {paletteSamples[id].map((color) => (
                    <i key={color} style={{ backgroundColor: color }} />
                  ))}
                </span>
                <CheckIcon class="site-theme-selection-check" size={14} strokeWidth={2} />
              </span>
            </button>
          ))}
        </div>
        <footer class="site-theme-picker-footer">
          <p class="site-theme-picker-hint">
            <SunMoonIcon size={13} aria-hidden="true" />
            Light &amp; dark. Saved on this device.
          </p>
          <nav class="site-theme-picker-links" aria-label="Theme resources">
            <a href={withBasePath("/docs/theming/installation")}>
              Theming guide <ArrowUpRightIcon size={12} aria-hidden="true" />
            </a>
            <a href={withBasePath("/docs/theming/token-overrides")}>
              Customize tokens <ArrowUpRightIcon size={12} aria-hidden="true" />
            </a>
          </nav>
        </footer>
      </PopoverContent>
    </Popover>
  );
}
