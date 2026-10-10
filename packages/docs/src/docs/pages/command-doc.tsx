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
} from "@kamod-ch/ui";
import { CopyButton } from "@kamod-ch/ui/copy-button";
import {
  Bell,
  Calculator,
  Calendar,
  ClipboardPaste,
  Code,
  CreditCard,
  FileText,
  Folder,
  FolderPlus,
  HelpCircle,
  Home,
  Image,
  Inbox,
  LayoutGrid,
  List,
  Plus,
  Scissors,
  Settings,
  Smile,
  Trash2,
  User,
  ZoomIn,
  ZoomOut,
} from "lucide-preact";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const commandChrome = "max-w-sm rounded-lg border shadow-sm";

const CommandDemoPreview = () => (
  <Command class={commandChrome}>
    <CommandInput placeholder="Type a command or search…" />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem value="calendar">
          <Calendar class="size-4" />
          <span>Calendar</span>
        </CommandItem>
        <CommandItem value="emoji">
          <Smile class="size-4" />
          <span>Search Emoji</span>
        </CommandItem>
        <CommandItem value="calculator" disabled>
          <Calculator class="size-4" />
          <span>Calculator</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem value="profile">
          <User class="size-4" />
          <span>Profile</span>
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem value="billing">
          <CreditCard class="size-4" />
          <span>Billing</span>
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem value="settings">
          <Settings class="size-4" />
          <span>Settings</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
);

const CommandBasicDialogPreview = () => {
  const [open, setOpen] = useState(false);
  return (
    <div class="flex flex-col gap-4">
      <Button variant="outline" class="w-fit" onClick={() => setOpen(true)}>
        Open menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command class="rounded-none border-0 shadow-none">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">Calendar</CommandItem>
              <CommandItem value="emoji">Search Emoji</CommandItem>
              <CommandItem value="calculator">Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

const CommandShortcutsDialogPreview = () => {
  const [open, setOpen] = useState(false);
  return (
    <div class="flex flex-col gap-4">
      <Button variant="outline" class="w-fit" onClick={() => setOpen(true)}>
        Open menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command class="rounded-none border-0 shadow-none">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Settings">
              <CommandItem value="profile">
                <User class="size-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem value="billing">
                <CreditCard class="size-4" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem value="settings">
                <Settings class="size-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

const CommandGroupsDialogPreview = () => {
  const [open, setOpen] = useState(false);
  return (
    <div class="flex flex-col gap-4">
      <Button variant="outline" class="w-fit" onClick={() => setOpen(true)}>
        Open menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command class="rounded-none border-0 shadow-none">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">
                <Calendar class="size-4" />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem value="emoji">
                <Smile class="size-4" />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem value="calculator">
                <Calculator class="size-4" />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem value="profile">
                <User class="size-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem value="billing">
                <CreditCard class="size-4" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem value="settings">
                <Settings class="size-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

const CommandScrollableDialogPreview = () => {
  const [open, setOpen] = useState(false);
  return (
    <div class="flex flex-col gap-4">
      <Button variant="outline" class="w-fit" onClick={() => setOpen(true)}>
        Open scrollable menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command class="rounded-none border-0 shadow-none">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList class="max-h-80">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem value="home">
                <Home class="size-4" />
                <span>Home</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem value="inbox">
                <Inbox class="size-4" />
                <span>Inbox</span>
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
              <CommandItem value="documents">
                <FileText class="size-4" />
                <span>Documents</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem value="folders">
                <Folder class="size-4" />
                <span>Folders</span>
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem value="new file">
                <Plus class="size-4" />
                <span>New File</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem value="new folder">
                <FolderPlus class="size-4" />
                <span>New Folder</span>
                <CommandShortcut>⇧⌘N</CommandShortcut>
              </CommandItem>
              <CopyButton
                value="Command palette example"
                subject="example"
                renderControl={({ defaultControl }) => (
                  <CommandItem {...defaultControl.props} value="copy" data-slot="command-item">
                    {defaultControl.props.children}
                    <CommandShortcut>⌘C</CommandShortcut>
                  </CommandItem>
                )}
              />
              <CommandItem value="cut">
                <Scissors class="size-4" />
                <span>Cut</span>
                <CommandShortcut>⌘X</CommandShortcut>
              </CommandItem>
              <CommandItem value="paste">
                <ClipboardPaste class="size-4" />
                <span>Paste</span>
                <CommandShortcut>⌘V</CommandShortcut>
              </CommandItem>
              <CommandItem value="delete">
                <Trash2 class="size-4" />
                <span>Delete</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="View">
              <CommandItem value="grid">
                <LayoutGrid class="size-4" />
                <span>Grid View</span>
              </CommandItem>
              <CommandItem value="list">
                <List class="size-4" />
                <span>List View</span>
              </CommandItem>
              <CommandItem value="zoom in">
                <ZoomIn class="size-4" />
                <span>Zoom In</span>
                <CommandShortcut>⌘+</CommandShortcut>
              </CommandItem>
              <CommandItem value="zoom out">
                <ZoomOut class="size-4" />
                <span>Zoom Out</span>
                <CommandShortcut>⌘-</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem value="profile">
                <User class="size-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem value="billing">
                <CreditCard class="size-4" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem value="settings">
                <Settings class="size-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
              <CommandItem value="notifications">
                <Bell class="size-4" />
                <span>Notifications</span>
              </CommandItem>
              <CommandItem value="help">
                <HelpCircle class="size-4" />
                <span>Help &amp; Support</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tools">
              <CommandItem value="calculator">
                <Calculator class="size-4" />
                <span>Calculator</span>
              </CommandItem>
              <CommandItem value="calendar">
                <Calendar class="size-4" />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem value="image">
                <Image class="size-4" />
                <span>Image Editor</span>
              </CommandItem>
              <CommandItem value="code">
                <Code class="size-4" />
                <span>Code Editor</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<
  Lang,
  {
    dir: "ltr" | "rtl";
    placeholder: string;
    empty: string;
    suggestions: string;
    settings: string;
    calendar: string;
    emoji: string;
    calculator: string;
    profile: string;
    billing: string;
    settingsLabel: string;
  }
> = {
  en: {
    dir: "ltr",
    placeholder: "Type a command or search…",
    empty: "No results found.",
    suggestions: "Suggestions",
    settings: "Settings",
    calendar: "Calendar",
    emoji: "Search Emoji",
    calculator: "Calculator",
    profile: "Profile",
    billing: "Billing",
    settingsLabel: "Settings",
  },
  ar: {
    dir: "rtl",
    placeholder: "اكتب أمرًا أو ابحث…",
    empty: "لم يتم العثور على نتائج.",
    suggestions: "اقتراحات",
    settings: "الإعدادات",
    calendar: "التقويم",
    emoji: "البحث عن الرموز التعبيرية",
    calculator: "الآلة الحاسبة",
    profile: "الملف الشخصي",
    billing: "الفوترة",
    settingsLabel: "الإعدادات",
  },
  he: {
    dir: "rtl",
    placeholder: "הקלד פקודה או חפש…",
    empty: "לא נמצאו תוצאות.",
    suggestions: "הצעות",
    settings: "הגדרות",
    calendar: "לוח שנה",
    emoji: "חפש אמוג'י",
    calculator: "מחשבון",
    profile: "פרופיל",
    billing: "חיוב",
    settingsLabel: "הגדרות",
  },
};

const CommandRtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];
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
      <Command class={commandChrome} dir={t.dir}>
        <CommandInput placeholder={t.placeholder} dir={t.dir} />
        <CommandList>
          <CommandEmpty>{t.empty}</CommandEmpty>
          <CommandGroup heading={t.suggestions}>
            <CommandItem value="calendar">
              <Calendar class="size-4" />
              <span>{t.calendar}</span>
            </CommandItem>
            <CommandItem value="emoji">
              <Smile class="size-4" />
              <span>{t.emoji}</span>
            </CommandItem>
            <CommandItem value="calculator" disabled>
              <Calculator class="size-4" />
              <span>{t.calculator}</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t.settings}>
            <CommandItem value="profile">
              <User class="size-4" />
              <span>{t.profile}</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem value="billing">
              <CreditCard class="size-4" />
              <span>{t.billing}</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem value="settings">
              <Settings class="size-4" />
              <span>{t.settingsLabel}</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export const commandDocPage = createGenericDocPage({
  slug: "command",
  title: "Command",
  previewCode: `import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/kamod-ui/command";

export const Example = () => (
  <Command class="max-w-sm rounded-lg border">
    <CommandInput placeholder="Search…" />
    <CommandList>
      <CommandEmpty>No results.</CommandEmpty>
      <CommandGroup heading="Items">
        <CommandItem value="a">Alpha</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
);`,
  usageLabel:
    "Command palette surface: filterable list via `CommandInput` + `value` on each `CommandItem`. Official shadcn uses `cmdk` (React); Kamod implements the same UX with Preact signals and `data-match` visibility for `CommandEmpty`.",
  installationText:
    "Use `@kamod-ch/ui` — no `cmdk` dependency. For modal palettes, wrap with `CommandDialog` (`Dialog` + padded `DialogContent`).",
  usageText:
    '`CommandItem` requires a `value` string used for filtering (case-insensitive substring). Use `onSelect` or `onClick` for actions. `CommandEmpty` appears only when the query is non-empty and no item matches. `CommandList` measures matches after layout. Inside `CommandDialog`, drop the inner `Command` border: `class="rounded-none border-0 shadow-none"`.',
  exampleSections: [
    {
      id: "demo-inline",
      title: "Inline Demo",
      text: "**Organize Commands Around Tasks.** Compose a command list from groups, separators, shortcuts and icons to make available actions searchable. The inline example keeps the list in the page, allowing you to inspect its organization before adding a dialog layer.\n\nConnect each item's selection handler to a real action, provide a clear empty state, and remember that a displayed shortcut does not register a keyboard listener by itself.",
      code: "// command-doc.tsx — CommandDemoPreview",
      renderPreview: () => <CommandDemoPreview />,
    },
    {
      id: "dialog-basic",
      title: "Dialog: Basic",
      text: "**Keep the Command Surface Easy to Enter and Leave.** Use `CommandDialog` with controlled `open` and `onOpenChange` when the command palette should appear over the current screen. The command list owns its choices while the parent decides when the palette is available.\n\nName the launcher, preserve dismissal and focus return, and keep command execution separate from the dialog's visibility state so actions do not accidentally run twice.",
      code: "// CommandBasicDialogPreview",
      renderPreview: () => <CommandBasicDialogPreview />,
    },
    {
      id: "dialog-shortcuts",
      title: "Dialog: Shortcuts",
      text: "**Advertise Shortcuts that Actually Exist.** Add `CommandShortcut` beside an action label to show a keyboard hint in a consistent trailing position. The hint documents a shortcut; the application must still register and handle that key combination where appropriate.\n\nAvoid conflicting with browser or assistive-technology shortcuts, and keep a normal selectable command available for people who do not use the advertised key sequence.",
      code: "// CommandShortcutsDialogPreview",
      renderPreview: () => <CommandShortcutsDialogPreview />,
    },
    {
      id: "dialog-groups",
      title: "Dialog: Groups",
      text: "**Separate Frequent Suggestions from Broader Settings.** Separate suggestions and settings with named groups and `CommandSeparator`. This preserves the relationship between related actions, helping readers interpret the list even before they begin filtering its contents.\n\nKeep category names stable and remove empty groups when appropriate; commands should remain understandable when search results appear outside their original context.",
      code: "// CommandGroupsDialogPreview",
      renderPreview: () => <CommandGroupsDialogPreview />,
    },
    {
      id: "dialog-scrollable",
      title: "Dialog: Scrollable",
      text: "**Constrain the List without Hiding Navigation.** Constrain `CommandList` with `max-h-80` when many actions would otherwise make the palette too tall. The surrounding dialog stays compact while the results form a scrollable area within it.\n\nTest keyboard movement into offscreen items and long labels, and keep the search field and empty-result feedback visible without requiring users to scroll the entire page.",
      code: "// CommandScrollableDialogPreview",
      renderPreview: () => <CommandScrollableDialogPreview />,
    },
    {
      id: "rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Set matching `dir` values on `Command` and `CommandInput` for translated search and results. Check shortcut hints, icons and item labels together so their order remains understandable in each language.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
      code: "// CommandRtlPreview",
      renderPreview: () => <CommandRtlPreview />,
    },
  ],
  apiRows: [
    { prop: "CommandItem value", type: "string", defaultValue: "required (filter key)" },
    { prop: "CommandItem onSelect", type: "(value: string) => void", defaultValue: "undefined" },
    { prop: "CommandGroup heading", type: "string", defaultValue: "undefined" },
    { prop: "CommandDialog open / onOpenChange", type: "boolean + callback", defaultValue: "—" },
    { prop: "CommandDialog contentClass", type: "string", defaultValue: "p-0 gap-0 sm:max-w-lg" },
  ],
  accessibilityText:
    "Provide a visible label or `aria-label` on the input; keep shortcut text as supplementary. For production, consider roving `tabindex` / arrow-key navigation (cmdk parity) — current focus is click and type-to-filter.",
});
