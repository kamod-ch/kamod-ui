import { useState } from "preact/hooks";
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
} from "@kamod-ui/core";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardPaste,
  Copy,
  Pencil,
  RotateCw,
  Scissors,
  Share2,
  Trash2,
} from "lucide-preact";
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
        <ContextMenuItem>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
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
        <ContextMenuItem>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
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
        <ContextMenuItem>
          <Copy class="size-4" />
          Copy
        </ContextMenuItem>
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
      title: "Combined demo",
      text: "Shortcuts, submenu, checkboxes, and radio group in one menu — matches the overview example on ui.shadcn.com.",
      code: "// See context-menu-doc.tsx — ContextMenuFullDemoPreview",
      renderPreview: () => <ContextMenuFullDemoPreview />,
    },
    {
      id: "basic-example",
      title: "Basic",
      text: "Small action list inside a group.",
      code: "// ContextMenuBasicPreview in context-menu-doc.tsx",
      renderPreview: () => <ContextMenuBasicPreview />,
    },
    {
      id: "submenu-example",
      title: "Submenu",
      text: "`ContextMenuSub`, `ContextMenuSubTrigger`, and `ContextMenuSubContent` for nested actions.",
      code: "// ContextMenuSubmenuPreview in context-menu-doc.tsx",
      renderPreview: () => <ContextMenuSubmenuPreview />,
    },
    {
      id: "shortcuts-example",
      title: "Shortcuts",
      text: "`ContextMenuShortcut` for trailing keyboard hints.",
      code: "// ContextMenuShortcutsPreview",
      renderPreview: () => <ContextMenuShortcutsPreview />,
    },
    {
      id: "groups-example",
      title: "Groups",
      text: "`ContextMenuLabel` + `ContextMenuSeparator` to structure sections.",
      code: "// ContextMenuGroupsPreview",
      renderPreview: () => <ContextMenuGroupsPreview />,
    },
    {
      id: "icons-example",
      title: "Icons",
      text: "Leading icons (lucide-preact) with destructive row.",
      code: "// ContextMenuIconsPreview",
      renderPreview: () => <ContextMenuIconsPreview />,
    },
    {
      id: "checkboxes-example",
      title: "Checkboxes",
      text: "`ContextMenuCheckboxItem` with `checked` / `defaultChecked` / `onCheckedChange`.",
      code: "// ContextMenuCheckboxesPreview",
      renderPreview: () => <ContextMenuCheckboxesPreview />,
    },
    {
      id: "radio-example",
      title: "Radio",
      text: "Controlled `ContextMenuRadioGroup` with `value` and `onValueChange`.",
      code: "// ContextMenuRadioPreview",
      renderPreview: () => <ContextMenuRadioPreview />,
    },
    {
      id: "destructive-example",
      title: "Destructive",
      text: '`ContextMenuItem variant="destructive"` for dangerous actions.',
      code: "// ContextMenuDestructivePreview",
      renderPreview: () => <ContextMenuDestructivePreview />,
    },
    {
      id: "rtl-example",
      title: "RTL",
      text: "`dir` on trigger and content; localized trigger hints EN/AR/HE.",
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
