import { MoonIcon, PaletteIcon, SunIcon } from "@kamod-ch/icons/lucide";
import { isThemePresetId, THEME_PRESETS } from "@kamod-ch/themes";
import type { PreviewAppearance } from "./preview-appearance";

/** Shared local appearance controls; callers own the preview target. */
export function PreviewAppearanceControls({
  value,
  onChange,
}: {
  value: PreviewAppearance;
  onChange: (value: PreviewAppearance) => void;
}) {
  const isDark = value.scheme === "dark";
  const SchemeIcon = isDark ? MoonIcon : SunIcon;
  const presetLabel = THEME_PRESETS.find((preset) => preset.id === value.preset)!.label;
  return (
    <div
      class="blocks-showcase-segmented blocks-showcase-appearance"
      role="group"
      aria-label="Preview appearance"
    >
      <button
        type="button"
        class="blocks-showcase-control"
        aria-label="Dark preview"
        aria-pressed={isDark}
        title={`Switch preview to ${isDark ? "light" : "dark"} mode`}
        onClick={() => onChange({ ...value, scheme: isDark ? "light" : "dark" })}
      >
        <SchemeIcon size={17} aria-hidden="true" />
      </button>
      <label
        class="blocks-showcase-preset blocks-showcase-control"
        title={`Preview theme: ${presetLabel}`}
      >
        <PaletteIcon size={17} aria-hidden="true" />
        <span class="blocks-showcase-control-label" aria-hidden="true">
          {presetLabel}
        </span>
        <select
          aria-label="Preview color theme"
          value={value.preset}
          onChange={(event) => {
            const preset = event.currentTarget.value;
            if (isThemePresetId(preset)) onChange({ ...value, preset });
          }}
        >
          {THEME_PRESETS.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
