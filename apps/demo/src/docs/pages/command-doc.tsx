import { useState } from "preact/hooks";
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
  CommandShortcut
} from "@kamod-ui/core";
import {
  Bell,
  Calculator,
  Calendar,
  ClipboardPaste,
  Code,
  Copy,
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
  ZoomOut
} from "lucide-preact";
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
              <CommandItem value="copy">
                <Copy class="size-4" />
                <span>Copy</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
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
    settingsLabel: "Settings"
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
    settingsLabel: "الإعدادات"
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
    settingsLabel: "הגדרות"
  }
};

const CommandRtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];
  return (
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button key={key} size="sm" variant={lang === key ? "default" : "outline"} onClick={() => setLang(key)}>
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
  previewCode: `import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@kamod-ui/core";

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
    "Use `@kamod-ui/core` — no `cmdk` dependency. For modal palettes, wrap with `CommandDialog` (`Dialog` + padded `DialogContent`).",
  usageText:
    "`CommandItem` requires a `value` string used for filtering (case-insensitive substring). Use `onSelect` or `onClick` for actions. `CommandEmpty` appears only when the query is non-empty and no item matches. `CommandList` measures matches after layout. Inside `CommandDialog`, drop the inner `Command` border: `class=\"rounded-none border-0 shadow-none\"`.",
  exampleSections: [
    {
      id: "demo-inline",
      title: "Inline demo",
      text: "Groups, separator, shortcuts, icons, and disabled row — aligned with the shadcn overview example.",
      code: "// command-doc.tsx — CommandDemoPreview",
      renderPreview: () => <CommandDemoPreview />
    },
    {
      id: "dialog-basic",
      title: "Dialog: basic",
      text: "`CommandDialog` + controlled `open` / `onOpenChange`.",
      code: "// CommandBasicDialogPreview",
      renderPreview: () => <CommandBasicDialogPreview />
    },
    {
      id: "dialog-shortcuts",
      title: "Dialog: shortcuts",
      text: "Settings group with `CommandShortcut` trailing hints.",
      code: "// CommandShortcutsDialogPreview",
      renderPreview: () => <CommandShortcutsDialogPreview />
    },
    {
      id: "dialog-groups",
      title: "Dialog: groups",
      text: "Suggestions + Settings with `CommandSeparator`.",
      code: "// CommandGroupsDialogPreview",
      renderPreview: () => <CommandGroupsDialogPreview />
    },
    {
      id: "dialog-scrollable",
      title: "Dialog: scrollable",
      text: "Many items; `CommandList` uses `max-h-80` for scroll.",
      code: "// CommandScrollableDialogPreview",
      renderPreview: () => <CommandScrollableDialogPreview />
    },
    {
      id: "rtl",
      title: "RTL",
      text: "`dir` on `Command` and `CommandInput`; localized strings EN/AR/HE.",
      code: "// CommandRtlPreview",
      renderPreview: () => <CommandRtlPreview />
    }
  ],
  apiRows: [
    { prop: "CommandItem value", type: "string", defaultValue: "required (filter key)" },
    { prop: "CommandItem onSelect", type: "(value: string) => void", defaultValue: "undefined" },
    { prop: "CommandGroup heading", type: "string", defaultValue: "undefined" },
    { prop: "CommandDialog open / onOpenChange", type: "boolean + callback", defaultValue: "—" },
    { prop: "CommandDialog contentClass", type: "string", defaultValue: "p-0 gap-0 sm:max-w-lg" }
  ],
  accessibilityText:
    "Provide a visible label or `aria-label` on the input; keep shortcut text as supplementary. For production, consider roving `tabindex` / arrow-key navigation (cmdk parity) — current focus is click and type-to-filter."
});
