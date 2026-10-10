import {
  Button,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@kamod-ch/ui";
import { CopyButton } from "@kamod-ch/ui/copy-button";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardPaste,
  Pencil,
  RotateCw,
  Scissors,
  Share2,
  Trash2,
} from "lucide-preact";
import { cloneElement } from "preact";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const triggerClass =
  "border-border text-muted-foreground flex aspect-video w-full max-w-xs cursor-default items-center justify-center rounded-xl border border-dashed text-sm select-none";

const TriggerHints = () => (
  <>
    <span class="pointer-fine:inline hidden">Right click here</span>
    <span class="pointer-coarse:inline hidden">Long press here</span>
  </>
);

const ContextMenuFullDemoPreview = () => (
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>
      <TriggerHints />
    </ContextMenuTrigger>
    <ContextMenuContent class="w-48">
      <ContextMenuGroup>
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-44">
            <ContextMenuGroup>
              <ContextMenuItem>Save Page…</ContextMenuItem>
              <ContextMenuItem>Create Shortcut…</ContextMenuItem>
              <ContextMenuItem>Name Window…</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem>Developer Tools</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuRadioGroup defaultValue="pedro">
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
);

const ContextMenuBasicPreview = () => (
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>
      <TriggerHints />
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem disabled>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
);

const ContextMenuSubmenuPreview = () => (
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>
      <TriggerHints />
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <CopyButton
          value="Context menu example"
          subject="example"
          role="menuitem"
          class="w-full"
          renderControl={({ defaultControl }) =>
            cloneElement(
              defaultControl,
              {},
              <>
                {defaultControl.props.children}
                <ContextMenuShortcut>⌘C</ContextMenuShortcut>
              </>,
            )
          }
        />
        <ContextMenuItem>
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSub>
        <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuGroup>
            <ContextMenuItem>Save Page…</ContextMenuItem>
            <ContextMenuItem>Create Shortcut…</ContextMenuItem>
            <ContextMenuItem>Name Window…</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuSubContent>
      </ContextMenuSub>
    </ContextMenuContent>
  </ContextMenu>
);

const ContextMenuShortcutsPreview = () => (
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>
      <TriggerHints />
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuItem>
          Save
          <ContextMenuShortcut>⌘S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Save As…
          <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
);

const ContextMenuGroupsPreview = () => (
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>
      <TriggerHints />
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuLabel>File</ContextMenuLabel>
        <ContextMenuItem>
          New File
          <ContextMenuShortcut>⌘N</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Open File
          <ContextMenuShortcut>⌘O</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Save
          <ContextMenuShortcut>⌘S</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuLabel>Edit</ContextMenuLabel>
        <ContextMenuItem>
          Undo
          <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Redo
          <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuItem>
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <CopyButton
          value="Context menu example"
          subject="example"
          role="menuitem"
          class="w-full"
          renderControl={({ defaultControl }) =>
            cloneElement(
              defaultControl,
              {},
              <>
                {defaultControl.props.children}
                <ContextMenuShortcut>⌘C</ContextMenuShortcut>
              </>,
            )
          }
        />
        <ContextMenuItem>
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuItem variant="destructive">
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
);

const ContextMenuIconsPreview = () => (
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>
      <TriggerHints />
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <CopyButton value="Context menu example" subject="example" role="menuitem" class="w-full" />
        <ContextMenuItem>
          <Scissors class="size-4" />
          Cut
        </ContextMenuItem>
        <ContextMenuItem>
          <ClipboardPaste class="size-4" />
          Paste
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuItem variant="destructive">
          <Trash2 class="size-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
);

const ContextMenuCheckboxesPreview = () => (
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>
      <TriggerHints />
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuCheckboxItem defaultChecked>Show Bookmarks Bar</ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem defaultChecked>Show Developer Tools</ContextMenuCheckboxItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
);

const ContextMenuRadioPreview = () => {
  const [user, setUser] = useState("pedro");
  const [theme, setTheme] = useState("light");
  return (
    <ContextMenu>
      <ContextMenuTrigger class={triggerClass}>
        <TriggerHints />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuRadioGroup value={user} onValueChange={setUser}>
            <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Theme</ContextMenuLabel>
          <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
            <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
            <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
            <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const ContextMenuDestructivePreview = () => (
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>
      <TriggerHints />
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuItem>
          <Pencil class="size-4" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem>
          <Share2 class="size-4" />
          Share
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuItem variant="destructive">
          <Trash2 class="size-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
);

type Lang = "en" | "ar" | "he";

const rtl: Record<
  Lang,
  {
    dir: "ltr" | "rtl";
    rightClick: string;
    longPress: string;
    navigation: string;
    back: string;
    forward: string;
    reload: string;
  }
> = {
  en: {
    dir: "ltr",
    rightClick: "Right click here",
    longPress: "Long press here",
    navigation: "Navigation",
    back: "Back",
    forward: "Forward",
    reload: "Reload",
  },
  ar: {
    dir: "rtl",
    rightClick: "انقر بزر الماوس الأيمن هنا",
    longPress: "اضغط مطولاً هنا",
    navigation: "التنقل",
    back: "رجوع",
    forward: "تقدم",
    reload: "إعادة تحميل",
  },
  he: {
    dir: "rtl",
    rightClick: "לחץ לחיצה ימנית כאן",
    longPress: "לחץ לחיצה ארוכה כאן",
    navigation: "ניווט",
    back: "חזור",
    forward: "קדימה",
    reload: "רענן",
  },
};

const ContextMenuRtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtl[lang];
  return (
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button
            key={key}
            size="sm"
            variant={lang === key ? "default" : "outline"}
            onClick={() => setLang(key)}
          >
            {key.toUpperCase()}
          </Button>
        ))}
      </div>
      <ContextMenu>
        <ContextMenuTrigger class={triggerClass} dir={t.dir}>
          <span class="pointer-fine:inline hidden">{t.rightClick}</span>
          <span class="pointer-coarse:inline hidden">{t.longPress}</span>
        </ContextMenuTrigger>
        <ContextMenuContent class="w-48" dir={t.dir}>
          <ContextMenuGroup>
            <ContextMenuSub>
              <ContextMenuSubTrigger>{t.navigation}</ContextMenuSubTrigger>
              <ContextMenuSubContent class="w-44" dir={t.dir}>
                <ContextMenuGroup>
                  <ContextMenuItem>
                    <ArrowLeft class="size-4" />
                    {t.back}
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem disabled>
                    <ArrowRight class="size-4" />
                    {t.forward}
                    <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <RotateCw class="size-4" />
                    {t.reload}
                    <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export const contextMenuDocPage = createGenericDocPage({
  slug: "context-menu",
  title: "Context Menu",
  previewCode: `import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/kamod-ui/context-menu";

export const Example = () => (
  <ContextMenu>
    <ContextMenuTrigger class="rounded-md border border-dashed p-6">Right click</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem>Profile</ContextMenuItem>
      <ContextMenuItem>Billing</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
);`,
  usageLabel:
    "Context menu opens at the pointer on right-click (fine pointer) or long-press ~500ms (touch). Content is portaled with fixed positioning, outside-click / Escape dismiss, and submenu hover/click like shadcn.",
  installationText:
    "Import primitives from `@/components/kamod-ui/context-menu`. Compose `ContextMenu`, `ContextMenuTrigger`, and `ContextMenuContent`; add `ContextMenuGroup`, `ContextMenuItem`, `ContextMenuShortcut`, `ContextMenuSeparator`, `ContextMenuSub*`, checkbox and radio items as needed.",
  usageText:
    "Optional controlled root: `open`, `defaultOpen`, `onOpenChange`. `ContextMenuItem` closes the menu on activate; checkbox/radio/sub-triggers do not. Use `pointer-fine:` / `pointer-coarse:` on the trigger hint text (see examples). Subpanels use `absolute` placement with RTL chevron flip.",
  exampleSections: [
    {
      id: "full-demo",
      title: "Combined Demo",
      text: "**Combine Commands without Obscuring Their Roles.** Combine ordinary actions, submenus, checkbox items and a radio group inside one context menu. The example demonstrates their different roles: invoking an operation, revealing more actions, toggling a setting or choosing one value.\n\nKeep common actions near the start and provide another discoverable entry point for essential functionality; right-click alone is not enough for every input method.",
      code: "// See context-menu-doc.tsx — ContextMenuFullDemoPreview",
      renderPreview: () => <ContextMenuFullDemoPreview />,
    },
    {
      id: "basic-example",
      title: "Basic",
      text: "**Start with a Short, Contextual Action List.** Start with a small `ContextMenu` action group attached to a clearly identifiable target. This keeps the relationship between the selected content and the available commands easy to understand before adding nested or stateful options.\n\nAvoid placing unrelated global navigation here, and ensure the same important operations remain reachable from an ordinary visible control.",
      code: "// ContextMenuBasicPreview in context-menu-doc.tsx",
      renderPreview: () => <ContextMenuBasicPreview />,
    },
    {
      id: "submenu-example",
      title: "Submenu",
      text: "**Group Secondary Choices One Level Deeper.** Compose `ContextMenuSub`, `ContextMenuSubTrigger` and `ContextMenuSubContent` when related actions need a secondary panel. The parent item names the category, while the nested content contains the actual operations.\n\nKeep nesting shallow, label the parent according to its contents, and test keyboard travel between levels rather than checking only pointer movement.",
      code: "// ContextMenuSubmenuPreview in context-menu-doc.tsx",
      renderPreview: () => <ContextMenuSubmenuPreview />,
    },
    {
      id: "shortcuts-example",
      title: "Shortcuts",
      text: "**Use Key Hints as Accurate Documentation.** Use `ContextMenuShortcut` for a trailing keyboard hint that stays visually separate from the action label. Keep the hint consistent with the shortcut your application implements; displaying it does not register a key handler.\n\nKeep hints synchronized with registered actions and platform conventions, and avoid implying that a command works while its contextual target is unavailable.",
      code: "// ContextMenuShortcutsPreview",
      renderPreview: () => <ContextMenuShortcutsPreview />,
    },
    {
      id: "groups-example",
      title: "Groups",
      text: "**Use Headings to Explain Relationships.** Use `ContextMenuLabel` to name a section and `ContextMenuSeparator` between distinct action groups. A small amount of structure can make a longer menu readable without assigning every operation its own submenu.\n\nKeep groups small and meaningful, and avoid decorative separators between every item when spacing and clear labels already provide enough structure.",
      code: "// ContextMenuGroupsPreview",
      renderPreview: () => <ContextMenuGroupsPreview />,
    },
    {
      id: "icons-example",
      title: "Icons",
      text: "**Support Recognition without Replacing Labels.** Place a supporting icon before each menu label, reserving destructive styling for the operation with that consequence. The icons reinforce recognizable actions, while the text remains sufficient to choose the correct command.\n\nTreat decorative icons as hidden from assistive technology and keep destructive meaning explicit in the label rather than relying on an icon or color alone.",
      code: "// ContextMenuIconsPreview",
      renderPreview: () => <ContextMenuIconsPreview />,
    },
    {
      id: "checkboxes-example",
      title: "Checkboxes",
      text: "**Expose Persistent Independent Preferences.** Use `ContextMenuCheckboxItem` for an independent on/off setting, with `defaultChecked` for initial state or `checked` and `onCheckedChange` for parent-owned state. Its checkmark represents a persistent choice rather than a one-time action.\n\nConnect checked state to the application's actual preference source, and decide whether it persists beyond the current page; reopening the menu should accurately reflect the latest value.",
      code: "// ContextMenuCheckboxesPreview",
      renderPreview: () => <ContextMenuCheckboxesPreview />,
    },
    {
      id: "radio-example",
      title: "Radio",
      text: "**Choose One Value from a Related Set.** Use `ContextMenuRadioGroup` with `value` and `onValueChange` for mutually exclusive choices. Each item's value identifies one option, and the group's selected value remains the single source of truth for the setting.\n\nUse stable values, keep the selected option consistent with the visible result, and ensure the group label explains what changing that choice affects.",
      code: "// ContextMenuRadioPreview",
      renderPreview: () => <ContextMenuRadioPreview />,
    },
    {
      id: "destructive-example",
      title: "Destructive",
      text: "**Keep Risky Commands Unmistakable.** Set `variant=\"destructive\"` on the context-menu item that performs a dangerous operation. Keep its label specific, and use the application's confirmation or recovery flow to handle the consequence beyond the menu itself.\n\nThe styling does not perform confirmation; compose [Alert Dialog](/docs/alert-dialog/installation) or offer undo according to the application's recovery model.",
      code: "// ContextMenuDestructivePreview",
      renderPreview: () => <ContextMenuDestructivePreview />,
    },
    {
      id: "rtl-example",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Apply the translated direction to both the context-menu trigger area and its content. Review nested panels and shortcut hints as well as the labels, since these elements may be positioned outside the trigger's normal layout.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
      code: "// ContextMenuRtlPreview",
      renderPreview: () => <ContextMenuRtlPreview />,
    },
  ],
  apiRows: [
    {
      prop: "open / defaultOpen / onOpenChange",
      type: "boolean + callback",
      defaultValue: "uncontrolled",
    },
    { prop: "ContextMenuTrigger", type: "div", defaultValue: "right-click + long-press (touch)" },
    {
      prop: "ContextMenuItem variant",
      type: '"default" | "destructive"',
      defaultValue: '"default"',
    },
    { prop: "ContextMenuItem inset", type: "boolean", defaultValue: "false" },
    { prop: "ContextMenuCheckboxItem", type: "checked / onCheckedChange", defaultValue: "—" },
    {
      prop: "ContextMenuRadioGroup",
      type: "value / onValueChange / defaultValue",
      defaultValue: "—",
    },
  ],
  accessibilityText:
    'Prefer not to hide the only path to an action behind the context menu alone. Menu uses `role="menu"` and items `role="menuitem"` / `menuitemcheckbox` / `menuitemradio`. Escape closes the root menu.',
});
