import {
  BracesIcon,
  CheckIcon,
  CodeXmlIcon,
  EclipseIcon,
  LayersIcon,
  MoonIcon,
  PaintbrushIcon,
  ShieldCheckIcon,
  SunIcon,
  SwatchBookIcon,
  XIcon,
} from "@kamod-ch/icons/lucide";
import { DeviceDesktopIcon } from "@kamod-ch/icons/tabler/outline";
import type { ColorScheme, ThemePresetId } from "@kamod-ch/themes";
import {
  DropdownItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  Separator,
  useDropdown,
} from "@kamod-ch/ui";
import { withBasePath } from "../base-path";

export const colorModeOptions = [
  { value: "light", label: "Light", heading: "Light & bright", Icon: SunIcon },
  { value: "dark", label: "Dark", heading: "Dark & focused", Icon: MoonIcon },
  { value: "system", label: "System", heading: "Follow your device", Icon: DeviceDesktopIcon },
] as const;

const resources = [
  {
    label: "Theme CSS Setup",
    hint: "Connect theme styles and source detection to your project",
    href: "/docs/theming/css-setup",
    Icon: CodeXmlIcon,
  },
  {
    label: "Customize Theme Tokens",
    hint: "Tune semantic colors, spacing and other design tokens",
    href: "/docs/theming/token-overrides",
    Icon: LayersIcon,
  },
  {
    label: "Compare Color Themes",
    hint: "Compare the eight palettes in light and dark appearance",
    href: "/docs/theming/installation#color-theme-presets",
    Icon: PaintbrushIcon,
  },
  {
    label: "Appearance Checks",
    hint: "Review theme behavior, first paint and both color modes",
    href: "/docs/theming/installation#accessibility",
    Icon: ShieldCheckIcon,
  },
  {
    label: "Theme Runtime Reference",
    hint: "Read the provider, preference state and startup APIs",
    href: "/docs/theming/installation#api-reference",
    Icon: BracesIcon,
  },
] as const;

type PaletteSample = {
  role: "background" | "foreground" | "primary" | "secondary";
  preset?: ThemePresetId;
};
/* Mix current-theme surfaces with representative accents; CSS resolves every scoped color. */
const paletteSamples = {
  light: [
    { role: "background" },
    { role: "primary" },
    { preset: "sunset", role: "primary" },
    { preset: "voltage", role: "primary" },
  ],
  dark: [
    { role: "background" },
    { role: "secondary" },
    { preset: "watson", role: "primary" },
    { preset: "professional", role: "primary" },
  ],
  system: [
    { role: "foreground" },
    { preset: "cursor-warm", role: "primary" },
    { preset: "sunset", role: "secondary" },
    { preset: "voltage", role: "secondary" },
  ],
} satisfies Record<ColorScheme, readonly PaletteSample[]>;

/** Use the palette picker's header chrome, with keyboard-reachable help and close actions. */
export function ColorModeMenuHeader() {
  const { setOpen, triggerRef } = useDropdown();
  return (
    <>
      <header class="site-theme-picker-header" role="presentation">
        <div class="site-theme-picker-heading">
          <span data-slot="popover-title">
            <EclipseIcon size={16} strokeWidth={2} aria-hidden="true" />
            Appearance
          </span>
          <span class="site-theme-picker-count site-color-mode-caption">
            <span aria-hidden="true">·</span>
            <span>Pick a mood</span>
          </span>
          <span class="site-color-mode-header-actions">
            <DropdownItem
              href={withBasePath("/docs/theming/installation#provider-controls")}
              target="_self"
              class="site-theme-picker-button docs-icon-button site-theme-picker-close"
              aria-label="How appearance works"
              data-tooltip="How page and device appearance settings work"
              title="How appearance works"
            >
              <SwatchBookIcon class="size-[13px]" size={13} strokeWidth={2} aria-hidden="true" />
            </DropdownItem>
            <DropdownItem
              class="site-theme-picker-button docs-icon-button site-theme-picker-close"
              aria-label="Close color mode picker"
              title="Close color mode picker"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              <XIcon class="size-[13px]" size={13} aria-hidden="true" />
            </DropdownItem>
          </span>
        </div>
      </header>
      <div class="site-theme-picker-separator">
        <Separator decorative />
      </div>
    </>
  );
}

/** Shared row/plate classes keep radio choices visually identical to preset buttons. */
export function ColorModeMenuChoices({
  mode,
  preset,
  selection,
  choose,
}: {
  mode: ColorScheme;
  preset: ThemePresetId;
  selection: number;
  choose: (mode: ColorScheme) => void;
}) {
  return (
    <DropdownRadioGroup
      value={mode}
      class="site-theme-options site-color-mode-options"
      data-mode={mode}
      data-selected=""
      style={{ "--theme-index": colorModeOptions.findIndex(({ value }) => value === mode) }}
      aria-label="Color mode"
    >
      {colorModeOptions.map(({ value, label, heading, Icon }) => (
        <DropdownRadioItem
          key={value}
          value={value}
          class="site-color-mode-option"
          aria-label={label}
          onClick={(event) => {
            event.preventDefault();
            choose(value);
          }}
        >
          <span class="site-theme-option-label">
            <span
              class="site-color-mode-icon"
              key={value === mode ? selection : "idle"}
              aria-hidden="true"
            >
              <Icon size={14} strokeWidth={1.75} />
            </span>
            <span class="site-theme-option-name">{heading}</span>
            {value === mode && (
              <span class="site-theme-option-status" aria-hidden="true">
                <span>·</span> active
              </span>
            )}
          </span>
          <span class="site-theme-option-detail" aria-hidden="true">
            <ModePalette preset={preset} scheme={value} />
            <CheckIcon class="site-theme-selection-check" size={14} strokeWidth={2} />
          </span>
        </DropdownRadioItem>
      ))}
    </DropdownRadioGroup>
  );
}

/** The same compact footer and staggered icon wrappers, with appearance-specific references. */
export function ColorModeMenuFooter() {
  return (
    <footer class="site-theme-picker-footer site-color-mode-footer" role="presentation">
      <Separator decorative />
      <div class="site-theme-picker-actions" role="group" aria-label="Appearance resources">
        {resources.map(({ label, hint, href, Icon }, index) => (
          <span
            key={label}
            class="site-theme-picker-action-slot"
            style={{ "--action-index": index }}
          >
            <DropdownItem
              class="site-theme-picker-button docs-icon-button site-theme-picker-action"
              href={withBasePath(href)}
              target={href.includes("#") ? "_self" : undefined}
              aria-label={label}
              data-tooltip={hint}
              title={hint}
            >
              <span class="site-theme-picker-action-icon">
                <Icon class="size-[15px]" size={15} strokeWidth={1.75} aria-hidden="true" />
              </span>
            </DropdownItem>
          </span>
        ))}
      </div>
    </footer>
  );
}

/** Four palette-sized bars per mode; System follows CSS media preference without subscriptions. */
function ModePalette({ preset, scheme }: { preset: ThemePresetId; scheme: ColorScheme }) {
  return (
    <span class="site-color-mode-palette" data-mode={scheme}>
      {(scheme === "system" ? ["light", "dark"] : [scheme]).map((appearance) => (
        <span
          key={appearance}
          class={`site-theme-swatches site-color-mode-swatches ${appearance}`}
          data-theme-scope=""
          data-theme={preset}
        >
          {paletteSamples[scheme].map((sample: PaletteSample, index) => (
            <i
              key={index}
              class={appearance}
              data-theme-scope=""
              data-theme={sample.preset ?? preset}
              data-color-role={sample.role}
              style={{ backgroundColor: `var(--${sample.role})` }}
            />
          ))}
        </span>
      ))}
    </span>
  );
}
