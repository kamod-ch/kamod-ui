import { CheckIcon, MoonIcon, SunIcon } from "@kamod-ch/icons/lucide";
import { DeviceDesktopIcon } from "@kamod-ch/icons/tabler/outline";
import {
  type ColorScheme,
  colorSchemeSignal,
  resolvedColorSchemeSignal,
  setColorScheme,
  syncThemeFromStorage,
} from "@kamod-ch/themes";
import {
  Dropdown,
  DropdownContent,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  DropdownTrigger,
  useDropdown,
} from "@kamod-ch/ui";
import { useEffect, useId, useState } from "preact/hooks";

const modes = [
  { value: "light", label: "Light", description: "Bright and clear", Icon: SunIcon },
  { value: "dark", label: "Dark", description: "Easy on the eyes", Icon: MoonIcon },
  { value: "system", label: "System", description: "Follow your device", Icon: DeviceDesktopIcon },
] as const;

/** Site-only appearance menu; showcase and public ThemeToggle behavior stay independent. */
export function SiteColorSchemeMenu({ class: className = "" }: { class?: string }) {
  const [mounted, setMounted] = useState(false);
  const [selection, setSelection] = useState(0);
  useEffect(() => {
    syncThemeFromStorage();
    setMounted(true);
  }, []);
  const mode = mounted ? colorSchemeSignal.value : "system";
  const Icon = modes.find((option) => option.value === mode)!.Icon;
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
          class="docs-icon-button docs-topbar-theme-toggle site-icon-button site-color-mode-trigger"
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
          <span key={mode} class="site-color-mode-glyph" data-animate={selection > 0 || undefined}>
            <Icon size={17} strokeWidth={2} aria-hidden="true" />
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
  const id = useId();
  const dropdown = useDropdown();
  const open = dropdown.open.value;
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
      class="site-color-mode-menu"
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          dropdown.setOpen(false);
          dropdown.triggerRef.current?.focus();
          return;
        }
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const items = [
          ...event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitemradio"]'),
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
      <div class="site-color-mode-heading">
        <strong>Appearance</strong>
        <span>{resolvedColorSchemeSignal.value === "dark" ? "Dark" : "Light"} now</span>
      </div>
      <DropdownSeparator class="site-color-mode-separator" />
      <DropdownRadioGroup
        value={mode}
        class="site-color-mode-options"
        data-mode={mode}
        aria-label="Color mode"
      >
        {modes.map(({ value, label, description, Icon }) => (
          <DropdownRadioItem
            key={value}
            value={value}
            class="site-color-mode-option"
            aria-label={label}
            aria-describedby={`${id}-${value}`}
            onClick={(event) => {
              event.preventDefault();
              choose(value);
            }}
          >
            <span
              class="site-color-mode-icon"
              key={value === mode ? selection : "idle"}
              aria-hidden="true"
            >
              <Icon size={16} strokeWidth={1.8} />
            </span>
            <span class="site-color-mode-text">
              <strong>{label}</strong>
              <small id={`${id}-${value}`}>{description}</small>
            </span>
            <span class="site-color-mode-check" aria-hidden="true">
              {value === mode && <CheckIcon key={selection} size={15} strokeWidth={2.3} />}
            </span>
          </DropdownRadioItem>
        ))}
      </DropdownRadioGroup>
      <DropdownSeparator class="site-color-mode-separator" />
      <div class="site-color-mode-footer">
        <span>
          {mode === "system"
            ? `Device is using ${resolvedColorSchemeSignal.value}.`
            : "Your choice, across the site."}
        </span>
        <kbd>Esc</kbd>
      </div>
    </DropdownContent>
  );
}
