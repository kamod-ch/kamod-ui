import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SearchIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "@kamod-ch/icons/lucide";
import {
  Button,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  DialogTitle,
  Kbd,
  KbdGroup,
} from "@kamod-ch/ui";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { canUseDOM, isEditableTarget, useControllableState } from "../../shared";
import type { DashboardIcon } from "../shared/types";

export type CommandPaletteItem = {
  id: string;
  label: string;
  keywords?: string[];
  shortcut?: string;
  icon?: DashboardIcon;
  disabled?: boolean;
};

export type CommandPaletteGroup = {
  id: string;
  heading: string;
  items: CommandPaletteItem[];
};

export type CommandPaletteProps = {
  groups?: CommandPaletteGroup[];
  placeholder?: string;
  emptyText?: string;
  triggerLabel?: string;
  showTrigger?: boolean;
  shortcut?: boolean;
  /** Drop preview chrome so the palette can sit in a topbar. */
  embedded?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: CommandPaletteItem) => void;
};

const defaultGroups: CommandPaletteGroup[] = [
  {
    id: "suggestions",
    heading: "Suggestions",
    items: [
      { id: "calendar", label: "Calendar", icon: CalendarIcon, shortcut: "⌘C" },
      { id: "emoji", label: "Search Emoji", icon: SmileIcon, keywords: ["smile", "face"] },
      { id: "calculator", label: "Calculator", icon: CalculatorIcon, disabled: true },
    ],
  },
  {
    id: "settings",
    heading: "Settings",
    items: [
      { id: "profile", label: "Profile", icon: UserIcon, shortcut: "⌘P" },
      { id: "billing", label: "Billing", icon: CreditCardIcon, shortcut: "⌘B" },
      { id: "settings", label: "Settings", icon: SettingsIcon, shortcut: "⌘S" },
    ],
  },
];

export const CommandPalette = ({
  groups = defaultGroups,
  placeholder = "Type a command or search…",
  emptyText = "No results found.",
  triggerLabel = "Search",
  showTrigger = true,
  shortcut = true,
  embedded = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSelect,
}: CommandPaletteProps) => {
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const openRef = useRef(open);
  openRef.current = open;

  const setOpen = useCallback(
    (next: boolean) => {
      if (next && canUseDOM()) {
        const active = document.activeElement;
        if (active instanceof HTMLElement) lastActiveRef.current = active;
      }
      setOpenState(next);
      if (!next && canUseDOM()) {
        const node = lastActiveRef.current;
        requestAnimationFrame(() => node?.focus?.());
      }
    },
    [setOpenState],
  );

  useEffect(() => {
    if (!shortcut || !canUseDOM()) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      if (!openRef.current && isEditableTarget(event.target)) return;
      event.preventDefault();
      setOpen(!openRef.current);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcut, setOpen]);

  const selectItem = (item: CommandPaletteItem) => {
    if (item.disabled) return;
    onSelect?.(item);
    setOpen(false);
  };

  return (
    <div
      data-slot="block-command-palette"
      class={
        embedded
          ? "text-foreground"
          : "flex min-h-[240px] items-start justify-center bg-background p-6 text-foreground"
      }
    >
      {showTrigger ? (
        <Button
          type="button"
          variant="outline"
          class={
            embedded
              ? "text-muted-foreground"
              : "w-full max-w-sm justify-between text-muted-foreground"
          }
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span class="inline-flex items-center gap-2">
            <SearchIcon size={16} aria-hidden="true" />
            {triggerLabel}
          </span>
          {shortcut ? (
            <KbdGroup class="hidden sm:inline-flex">
              <Kbd size="sm">⌘</Kbd>
              <Kbd size="sm">K</Kbd>
            </KbdGroup>
          ) : null}
        </Button>
      ) : null}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle class="sr-only">Command palette</DialogTitle>
        <Command autoHighlight class="border-0 shadow-none">
          <CommandInput placeholder={placeholder} aria-label="Search commands" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {groups.map((group, index) => (
              <div key={group.id}>
                {index > 0 ? <CommandSeparator /> : null}
                <CommandGroup heading={group.heading}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const searchValue = [item.label, ...(item.keywords ?? [])].join(" ");
                    return (
                      <CommandItem
                        key={item.id}
                        value={searchValue}
                        disabled={item.disabled}
                        onSelect={() => selectItem(item)}
                      >
                        {Icon ? <Icon size={16} aria-hidden="true" /> : null}
                        <span>{item.label}</span>
                        {item.shortcut ? <CommandShortcut>{item.shortcut}</CommandShortcut> : null}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};
