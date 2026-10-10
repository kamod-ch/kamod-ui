import { CheckIcon, PaletteIcon, XIcon } from "@kamod-ch/icons/lucide";
import { type ColorScheme, THEME_PRESETS, type ThemePresetId } from "@kamod-ch/themes";
import { Dropdown, DropdownContent, DropdownTrigger, Separator, useDropdown } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";
import { ThemePickerActions } from "./ThemePickerActions";

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

const paletteDescriptions: Record<ThemePresetId, string> = {
  kamod: "Clean neutral surfaces with fuchsia accents: crisp, rounded and quietly playful.",
  shadcn: "Monochrome surfaces and clean Geist type: minimal, restrained and precise.",
  ocean: "Cool cyan and indigo accents over slate surfaces: calm, clear and refreshing.",
  sunset: "Rose and orange accents with warm surfaces: welcoming, bright and energetic.",
  "cursor-warm": "Cream neutrals, orange accents and soft Lato type: warm, relaxed and editorial.",
  voltage: "Emerald green and indigo accents with deep charcoal darks: sharp and technical.",
  watson: "Vivid pink and cyan accents: bold, expressive and full of playful contrast.",
  professional: "Yellow and black accents with geometric Poppins type: confident and purposeful.",
};

export type ThemePickerProps = {
  preset: ThemePresetId;
  onPresetChange: (preset: ThemePresetId) => void;
  scheme: ColorScheme;
  onSchemeChange: (scheme: ColorScheme) => void;
  presets?: readonly { id: ThemePresetId; label: string }[];
  description?: ComponentChildren;
  /** Optional host controls, e.g. radius and Copy CSS. */
  children?: ComponentChildren;
  triggerClass?: string;
  labelClass?: string;
  label?: string;
  side?: "top" | "bottom";
  showLabel?: boolean;
  /** Resolve documentation URLs for a site hosted below a base path. */
  resolveHref?: (href: string) => string;
};

/** Controlled picker: presentation only; the host owns its target and persistence. */
export function ThemePicker({
  preset,
  onPresetChange,
  scheme,
  onSchemeChange,
  presets = THEME_PRESETS,
  description,
  children,
  triggerClass = "site-theme-picker-trigger",
  labelClass,
  label = "Choose color theme",
  side = "bottom",
  showLabel = false,
  resolveHref,
}: ThemePickerProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <Dropdown class="site-theme-picker">
      <DropdownTrigger
        class={`site-theme-picker-button docs-icon-button ${triggerClass}`}
        aria-label={label}
        title={label}
        aria-haspopup="dialog"
        data-preset={preset}
      >
        <PaletteIcon size={18} aria-hidden="true" />
        {showLabel && (
          <span class={labelClass}>{presets.find(({ id }) => id === preset)?.label}</span>
        )}
      </DropdownTrigger>
      <DropdownContent
        portal
        role="dialog"
        class="site-theme-picker-content"
        side={side}
        align="end"
        sideOffset={8}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <header class="site-theme-picker-header">
          <div class="site-theme-picker-heading">
            <h2 id={titleId} data-slot="popover-title">
              <PaletteIcon size={12} strokeWidth={2} aria-hidden="true" />
              Find your Palette
            </h2>
            <span class="site-theme-picker-count">
              <span aria-hidden="true">·</span> {presets.length} presets
            </span>
            <ThemePickerClose />
          </div>
          {description && (
            <p id={descriptionId} data-slot="popover-description">
              {description}
            </p>
          )}
        </header>
        <div class="site-theme-picker-separator">
          <Separator decorative />
        </div>
        <div class="site-theme-options" role="group" aria-label={label}>
          {presets.map(({ id, label }) => (
            <button
              key={id}
              data-theme-preset={id}
              type="button"
              aria-label={label}
              aria-pressed={preset === id}
              data-tooltip={paletteDescriptions[id]}
              title={paletteDescriptions[id]}
              onClick={() => onPresetChange(id)}
            >
              <span class="site-theme-option-label">
                <span class="site-theme-option-name">{label}</span>
                {preset === id && (
                  <span class="site-theme-option-status" aria-hidden="true">
                    <span>·</span> active
                  </span>
                )}
              </span>
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
        {children}
        <ThemePickerActions
          scheme={scheme}
          onSchemeChange={onSchemeChange}
          resolveHref={resolveHref}
        />
      </DropdownContent>
    </Dropdown>
  );
}

function ThemePickerClose() {
  const { setOpen, triggerRef } = useDropdown();
  return (
    <button
      type="button"
      class="site-theme-picker-button docs-icon-button site-theme-picker-close"
      aria-label="Close color theme picker"
      title="Close color theme picker"
      onClick={() => {
        setOpen(false);
        triggerRef.current?.focus();
      }}
    >
      <XIcon size={13} aria-hidden="true" />
    </button>
  );
}
