import { cn } from "../../lib/utils";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandList,
  useCommand,
} from "../command";
import { DialogDescription, DialogHeader, DialogTitle } from "../dialog";
import { KeyboardShortcutKeys } from "./KeyboardShortcutKeys";
import type { KeyboardShortcutsHelpProps, ShortcutPlatform } from "./shortcuts-help-types";
import {
  groupShortcutsByCategory,
  matchesShortcutSearch,
  resolveShortcutPlatform,
} from "./shortcuts-help-utils";

const KeyboardShortcutsHelpList = ({
  shortcuts,
  platform,
  labels,
}: {
  shortcuts: KeyboardShortcutsHelpProps["shortcuts"];
  platform: ShortcutPlatform;
  labels: KeyboardShortcutsHelpProps["labels"];
}) => {
  const { query } = useCommand();
  const normalizedQuery = (query.value ?? "").trim();
  const groups = groupShortcutsByCategory(shortcuts).map((group) => ({
    ...group,
    items: group.items.filter((shortcut) =>
      matchesShortcutSearch(shortcut, normalizedQuery, platform),
    ),
  }));
  const visibleGroups = groups.filter((group) => group.items.length > 0);

  if (shortcuts.length === 0) {
    return (
      <div
        data-slot="shortcuts-help-empty"
        class="text-muted-foreground px-4 py-8 text-center text-sm"
      >
        {labels.empty ?? "No keyboard shortcuts configured."}
      </div>
    );
  }

  if (normalizedQuery && visibleGroups.length === 0) {
    return (
      <div data-slot="command-empty" class="text-muted-foreground p-2 text-sm">
        {labels.emptySearch ?? labels.empty ?? "No shortcuts match your search."}
      </div>
    );
  }

  return (
    <>
      {visibleGroups.map((group) => (
        <CommandGroup key={group.category} heading={group.category}>
          {group.items.map((shortcut) => (
            <div
              key={shortcut.id}
              data-slot="command-item"
              data-match="true"
              data-disabled={shortcut.disabled ? "true" : undefined}
              role="listitem"
              class={cn(
                "flex w-full items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-sm",
                shortcut.disabled && "opacity-50",
              )}
            >
              <div class="min-w-0 flex-1 text-start">
                <div class="font-medium leading-snug">{shortcut.label}</div>
                {shortcut.description != null ? (
                  <div class="text-muted-foreground mt-0.5 text-xs leading-snug">
                    {shortcut.description}
                  </div>
                ) : null}
                {shortcut.scope != null ? (
                  <div class="text-muted-foreground mt-0.5 text-xs leading-snug">
                    {shortcut.scope}
                  </div>
                ) : null}
              </div>
              <KeyboardShortcutKeys keys={shortcut.keys} platform={platform} />
            </div>
          ))}
        </CommandGroup>
      ))}
    </>
  );
};

export const KeyboardShortcutsHelp = ({
  shortcuts,
  open,
  defaultOpen,
  onOpenChange,
  platform: platformProp,
  labels,
  showSearch = true,
}: KeyboardShortcutsHelpProps) => {
  const platform = resolveShortcutPlatform(platformProp);

  return (
    <CommandDialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Command class="rounded-none border-0 shadow-none" autoHighlight={false}>
        <DialogHeader class="space-y-1 px-4 pt-4 text-start">
          <DialogTitle>{labels.title}</DialogTitle>
          {labels.description != null ? (
            <DialogDescription>{labels.description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {showSearch ? (
          <CommandInput
            placeholder={labels.searchPlaceholder ?? "Search shortcuts…"}
            aria-label={labels.searchPlaceholder ?? "Search shortcuts"}
          />
        ) : null}
        <CommandList role="list">
          <KeyboardShortcutsHelpList shortcuts={shortcuts} platform={platform} labels={labels} />
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
