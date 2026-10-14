import {
  BookOpenIcon,
  MoonIcon,
  PaletteIcon,
  SlidersHorizontalIcon,
  SunIcon,
} from "@kamod-ch/icons/lucide";
import { DeviceDesktopIcon } from "@kamod-ch/icons/tabler/outline";
import type { ColorScheme } from "@kamod-ch/themes";
import { Separator } from "@kamod-ch/ui";
import { useSystemColorScheme } from "./useSystemColorScheme";

const resources = [
  {
    label: "Theming Guide",
    hint: "Learn how to set up and use themes",
    href: "/docs/theming/installation",
    icon: BookOpenIcon,
  },
  {
    label: "Customize Tokens",
    hint: "Customize colors, spacing and other theme tokens",
    href: "/docs/theming/token-overrides",
    icon: SlidersHorizontalIcon,
  },
  {
    label: "Explore Color Themes",
    hint: "Compare every palette in light and dark, and learn how page and preview themes work",
    href: "/docs/theming/installation#color-theme-presets",
    icon: PaletteIcon,
  },
];

/**
 * Shared footer with appearance changes delegated to its owner. Section links use native
 * same-tab navigation so a host router's page-top reset cannot discard their fragments.
 */
export function ThemePickerActions({
  scheme,
  onSchemeChange,
  resolveHref = (href: string) => `https://ui.kamod.ch${href}`,
}: {
  scheme: ColorScheme;
  onSchemeChange: (scheme: ColorScheme) => void;
  resolveHref?: (href: string) => string;
}) {
  const systemScheme = useSystemColorScheme(scheme === "system");
  const resolvedScheme = scheme === "system" ? systemScheme : scheme;
  const dark = resolvedScheme === "dark";
  const system = scheme === "system";
  const ModeIcon = dark ? SunIcon : MoonIcon;
  const modeLabel = dark ? "Switch to light mode" : "Switch to dark mode";
  const modeHint = `${modeLabel}. Uses a manual preference.`;
  const systemHint = system
    ? "Following your device. Turn off to keep the current mode."
    : "Follow your device’s light or dark mode automatically";
  return (
    <footer class="site-theme-picker-footer">
      <Separator decorative />
      <div
        class="site-theme-picker-actions"
        role="group"
        aria-label="Theme resources and appearance"
      >
        {resources.map(({ label, hint, href, icon: Icon }, index) => (
          <span
            key={label}
            class="site-theme-picker-action-slot"
            style={{ "--action-index": index }}
          >
            <a
              class="site-theme-picker-button docs-icon-button site-theme-picker-action"
              href={href.startsWith("/") ? resolveHref(href) : href}
              target={href.includes("#") ? "_self" : undefined}
              aria-label={label}
              data-tooltip={hint}
              title={hint}
            >
              <span class="site-theme-picker-action-icon">
                <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
              </span>
            </a>
          </span>
        ))}
        <span class="site-theme-picker-action-slot" style={{ "--action-index": 3 }}>
          <button
            type="button"
            class="site-theme-picker-button docs-icon-button site-theme-picker-action"
            aria-label={modeLabel}
            data-tooltip={modeHint}
            title={modeHint}
            onClick={() => onSchemeChange(dark ? "light" : "dark")}
          >
            <span class="site-theme-picker-action-icon">
              <ModeIcon size={15} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </button>
        </span>
        <span class="site-theme-picker-action-slot" style={{ "--action-index": 4 }}>
          <button
            type="button"
            class="site-theme-picker-button docs-icon-button site-theme-picker-action"
            aria-label="Use system color mode"
            aria-pressed={system}
            data-tooltip={systemHint}
            title={systemHint}
            onClick={() => onSchemeChange(system ? resolvedScheme : "system")}
          >
            <span class="site-theme-picker-action-icon">
              <DeviceDesktopIcon size={15} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </button>
        </span>
      </div>
    </footer>
  );
}
