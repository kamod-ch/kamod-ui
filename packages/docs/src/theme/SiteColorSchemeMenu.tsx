import {
  type ColorScheme,
  colorSchemeSignal,
  resolvedColorSchemeSignal,
  setColorScheme,
  syncThemeFromStorage,
  themePresetSignal,
} from "@kamod-ch/themes";
import { Dropdown, DropdownContent, DropdownTrigger, useDropdown } from "@kamod-ch/ui";
import { useEffect, useState } from "preact/hooks";
import { StateIcon } from "../docs/components/StateIcon";
import {
  ColorModeMenuChoices,
  ColorModeMenuFooter,
  ColorModeMenuHeader,
  colorModeOptions,
} from "./ColorModeMenuParts";

/** Site-only appearance menu; showcase and public ThemeToggle behavior stay independent. */
export function SiteColorSchemeMenu({ class: className = "" }: { class?: string }) {
  const [mounted, setMounted] = useState(false);
  const [selection, setSelection] = useState(0);
  useEffect(() => {
    syncThemeFromStorage();
    setMounted(true);
  }, []);
  const mode = mounted ? colorSchemeSignal.value : "system";
  const iconIndex = colorModeOptions.findIndex((option) => option.value === mode);
  const choose = (next: ColorScheme) => {
    if (next === mode) return;
    setColorScheme(next);
    setSelection((count) => count + 1);
  };
  return (
    <Dropdown class={`site-color-mode ${className}`.trim()}>
      <DropdownTrigger asChild>
        <button
          type="button"
          class="docs-icon-button docs-icon-button-menu-trigger docs-topbar-theme-toggle site-icon-button site-color-mode-trigger"
          aria-label="Choose color mode"
          disabled={!mounted}
          data-color-mode={mode}
          data-resolved-mode={mounted ? resolvedColorSchemeSignal.value : "light"}
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            event.preventDefault();
            if (event.currentTarget.getAttribute("aria-expanded") !== "true") {
              event.currentTarget.click();
            }
          }}
        >
          <span class="site-color-mode-glyph" data-animate={selection > 0 || undefined}>
            <StateIcon active={iconIndex}>
              {colorModeOptions.map(({ Icon }) => (
                <Icon size={17} strokeWidth={2} />
              ))}
            </StateIcon>
          </span>
        </button>
      </DropdownTrigger>
      <ColorModeContent mode={mode} selection={selection} choose={choose} />
    </Dropdown>
  );
}

/** Keep choices open for the selection animation; the shared dropdown owns placement/dismissal. */
function ColorModeContent({
  mode,
  selection,
  choose,
}: {
  mode: ColorScheme;
  selection: number;
  choose: (mode: ColorScheme) => void;
}) {
  const dropdown = useDropdown();
  const open = dropdown.open.value;
  const preset = themePresetSignal.value;
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      dropdown.contentRef.current
        ?.querySelector<HTMLElement>('[aria-checked="true"]')
        ?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, dropdown.contentRef]);
  return (
    <DropdownContent
      portal
      align="end"
      sideOffset={8}
      class="site-theme-picker-content site-color-mode-menu"
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          dropdown.setOpen(false);
          dropdown.triggerRef.current?.focus();
          return;
        }
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const items = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            '[role="menuitem"], [role="menuitemradio"]',
          ),
        ];
        const current = items.indexOf(document.activeElement as HTMLElement);
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items[next]?.focus();
      }}
    >
      <ColorModeMenuHeader />
      <ColorModeMenuChoices mode={mode} preset={preset} selection={selection} choose={choose} />
      <ColorModeMenuFooter />
    </DropdownContent>
  );
}
