import type { ComponentChildren } from "preact";
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Ban,
  Bot,
  CalendarPlus,
  Check,
  ChevronDown,
  Clock,
  Copy,
  ListFilter,
  MailCheck,
  Minus,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Tag,
  Trash2,
  Volume2
} from "lucide-preact";
import { useState } from "preact/hooks";
import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  DirectionProvider,
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Label,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@kamod-ui/core";
import { ApiReference } from "../components/ApiReference";
import type { DocPageModule } from "../types";

function ToolbarDemo() {
  const [label, setLabel] = useState("personal");

  return (
    <ButtonGroup class="max-w-full flex-wrap">
      <ButtonGroup class="hidden sm:flex">
        <Button variant="outline" size="icon" aria-label="Go back">
          <ArrowLeft />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Snooze</Button>
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More options">
              <MoreHorizontal />
            </Button>
          </DropdownTrigger>
          <DropdownContent side="bottom" align="end" class="w-44">
            <DropdownGroup>
              <DropdownItem>
                <MailCheck class="size-4" />
                Mark as read
              </DropdownItem>
              <DropdownItem>
                <Archive class="size-4" />
                Archive
              </DropdownItem>
            </DropdownGroup>
            <DropdownSeparator />
            <DropdownGroup>
              <DropdownItem>
                <Clock class="size-4" />
                Snooze
              </DropdownItem>
              <DropdownItem>
                <CalendarPlus class="size-4" />
                Add to calendar
              </DropdownItem>
              <DropdownItem>
                <ListFilter class="size-4" />
                Add to list
              </DropdownItem>
              <DropdownSub>
                <DropdownSubTrigger>
                  <Tag class="size-4" />
                  Label as…
                </DropdownSubTrigger>
                <DropdownSubContent class="w-40">
                  <DropdownRadioGroup value={label} onValueChange={setLabel}>
                    <DropdownRadioItem value="personal">Personal</DropdownRadioItem>
                    <DropdownRadioItem value="work">Work</DropdownRadioItem>
                    <DropdownRadioItem value="other">Other</DropdownRadioItem>
                  </DropdownRadioGroup>
                </DropdownSubContent>
              </DropdownSub>
            </DropdownGroup>
            <DropdownSeparator />
            <DropdownGroup>
              <DropdownItem variant="destructive">
                <Trash2 class="size-4" />
                Trash
              </DropdownItem>
            </DropdownGroup>
          </DropdownContent>
        </Dropdown>
      </ButtonGroup>
    </ButtonGroup>
  );
}

function SizeDemo() {
  return (
    <div class="flex flex-col items-start gap-8">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Small
        </Button>
        <Button variant="outline" size="sm">
          Button
        </Button>
        <Button variant="outline" size="sm">
          Group
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Add">
          <Plus />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Default</Button>
        <Button variant="outline">Button</Button>
        <Button variant="outline">Group</Button>
        <Button variant="outline" size="icon" aria-label="Add">
          <Plus />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button variant="outline" size="lg">
          Button
        </Button>
        <Button variant="outline" size="lg">
          Group
        </Button>
        <Button variant="outline" size="icon-lg" aria-label="Add">
          <Plus />
        </Button>
      </ButtonGroup>
    </div>
  );
}

function NestedDemo() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Add">
          <Plus />
        </Button>
      </ButtonGroup>
      <ButtonGroup class="min-w-0">
        <InputGroup>
          <InputGroupInput placeholder="Send a message…" />
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupAddon align="inline-end">
                <AudioLines class="text-muted-foreground size-4" />
              </InputGroupAddon>
            </TooltipTrigger>
            <TooltipContent>Voice mode</TooltipContent>
          </Tooltip>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  );
}

function InputGroupVoiceDemo() {
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  return (
    <ButtonGroup class="max-w-full rounded-full [--radius:9999px]">
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Add">
          <Plus />
        </Button>
      </ButtonGroup>
      <ButtonGroup class="min-w-0 flex-1">
        <InputGroup>
          <InputGroupInput
            placeholder={voiceEnabled ? "Record and send audio…" : "Send a message…"}
            disabled={voiceEnabled}
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  aria-pressed={voiceEnabled}
                  data-active={voiceEnabled ? "true" : undefined}
                  class="data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                >
                  <AudioLines class="size-4" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Voice mode</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  );
}

function DropdownSplitDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">Follow</Button>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button variant="outline" class="!px-2" aria-label="Open menu">
            <ChevronDown />
          </Button>
        </DropdownTrigger>
        <DropdownContent side="bottom" align="end" class="w-52">
          <DropdownGroup>
            <DropdownItem>
              <Volume2 class="size-4" />
              Mute conversation
            </DropdownItem>
            <DropdownItem>
              <Check class="size-4" />
              Mark as read
            </DropdownItem>
            <DropdownItem>
              <AlertTriangle class="size-4" />
              Report conversation
            </DropdownItem>
            <DropdownItem>
              <Ban class="size-4" />
              Block user
            </DropdownItem>
            <DropdownItem>
              <Share2 class="size-4" />
              Share conversation
            </DropdownItem>
            <DropdownItem>
              <Copy class="size-4" />
              Copy conversation
            </DropdownItem>
          </DropdownGroup>
          <DropdownSeparator />
          <DropdownGroup>
            <DropdownItem variant="destructive">
              <Trash2 class="size-4" />
              Delete conversation
            </DropdownItem>
          </DropdownGroup>
        </DropdownContent>
      </Dropdown>
    </ButtonGroup>
  );
}

const CURRENCIES = [
  { value: "$", label: "US Dollar" },
  { value: "€", label: "Euro" },
  { value: "£", label: "British Pound" }
] as const;

function SelectAmountDemo() {
  const [currency, setCurrency] = useState<string>("$");

  return (
    <ButtonGroup class="w-full max-w-md">
      <ButtonGroup class="min-w-0 flex-1">
        <Select class="w-fit shrink-0" value={currency} onValueChange={setCurrency}>
          <SelectTrigger class="font-mono">
            {currency}
          </SelectTrigger>
          <SelectContent class="min-w-36">
            <SelectGroup>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <span class="font-mono">{c.value}</span>{" "}
                  <span class="text-muted-foreground">{c.label}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input placeholder="10.00" inputMode="decimal" class="h-9" />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Send">
          <ArrowRight />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}

function PopoverCopilotDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <Bot class="size-4" />
        Copilot
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open popover">
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" class="w-80 rounded-xl text-sm">
          <PopoverHeader>
            <PopoverTitle>Start a new task with Copilot</PopoverTitle>
            <PopoverDescription>Describe your task in natural language.</PopoverDescription>
          </PopoverHeader>
          <Field>
            <FieldLabel class="sr-only" htmlFor="button-group-copilot-task">
              Task description
            </FieldLabel>
            <Textarea id="button-group-copilot-task" placeholder="I need to…" class="resize-none" />
            <FieldDescription>Copilot will open a pull request for review.</FieldDescription>
          </Field>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  );
}

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<Lang, { dir: "ltr" | "rtl"; label: string; archive: string; report: string; snooze: string; more: string }> = {
  en: { dir: "ltr", label: "English (LTR)", archive: "Archive", report: "Report", snooze: "Snooze", more: "More options" },
  ar: { dir: "rtl", label: "العربية (RTL)", archive: "أرشفة", report: "تقرير", snooze: "تأجيل", more: "المزيد" },
  he: { dir: "rtl", label: "עברית (RTL)", archive: "ארכיון", report: "דוח", snooze: "דחה", more: "עוד" }
};

function RtlToolbarDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-2xl flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button key={key} variant={lang === key ? "default" : "outline"} size="sm" type="button" onClick={() => setLang(key)}>
            {rtlCopy[key].label}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={t.dir}>
        <div dir={t.dir}>
          <ButtonGroup class="max-w-full flex-wrap">
            <ButtonGroup class="hidden sm:flex">
              <Button variant="outline" size="icon" aria-label="Go back">
                <ArrowLeft class={t.dir === "rtl" ? "rotate-180" : ""} />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">{t.archive}</Button>
              <Button variant="outline">{t.report}</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">{t.snooze}</Button>
              <Dropdown>
                <DropdownTrigger asChild>
                  <Button variant="outline" size="icon" aria-label={t.more}>
                    <MoreHorizontal />
                  </Button>
                </DropdownTrigger>
                <DropdownContent side="bottom" align="end" class="w-44">
                  <DropdownItem>
                    <MailCheck class="size-4" />
                    OK
                  </DropdownItem>
                </DropdownContent>
              </Dropdown>
            </ButtonGroup>
          </ButtonGroup>
        </div>
      </DirectionProvider>
    </div>
  );
}

const heroCode = `import {
  Archive,
  ArrowLeft,
  CalendarPlus,
  Clock,
  ListFilter,
  MailCheck,
  MoreHorizontal,
  Tag,
  Trash2,
} from "lucide-preact";
import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group";
import { Dropdown, DropdownContent, DropdownGroup, DropdownItem, DropdownRadioGroup, DropdownRadioItem, DropdownSeparator, DropdownSub, DropdownSubContent, DropdownSubTrigger, DropdownTrigger } from "@/components/kamod-ui/dropdown";

export const Example = () => {
  const [label, setLabel] = useState("personal");
  return (
    <ButtonGroup>
      {/* nested groups + dropdown — see demo source */}
    </ButtonGroup>
  );
};`;

const sectionBlocks: Record<
  string,
  { preview: () => ComponentChildren; code: string }
> = {
  installation: {
    preview: () => (
      <ButtonGroup aria-label="Example group">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    ),
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/kamod-ui/button-group";

export const Example = () => (
  <ButtonGroup>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
  </ButtonGroup>
);`
  },
  accessibility: {
    preview: () => (
      <ButtonGroup aria-label="Pagination controls">
        <Button variant="outline" size="sm">
          Prev
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </ButtonGroup>
    ),
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group";

export const Example = () => (
  <ButtonGroup aria-label="Pagination controls">
    <Button variant="outline" size="sm">Prev</Button>
    <Button variant="outline" size="sm">Next</Button>
  </ButtonGroup>
);`
  },
  orientation: {
    preview: () => (
      <div class="docs-button-row items-start">
        <ButtonGroup orientation="vertical" class="h-fit" aria-label="Media controls">
          <Button variant="outline" size="icon" aria-label="Increase">
            <Plus />
          </Button>
          <Button variant="outline" size="icon" aria-label="Decrease">
            <Minus />
          </Button>
        </ButtonGroup>
      </div>
    ),
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group";
import { Minus, Plus } from "lucide-preact";

export const Example = () => (
  <ButtonGroup orientation="vertical" aria-label="Media controls" class="h-fit">
    <Button variant="outline" size="icon" aria-label="Increase"><Plus /></Button>
    <Button variant="outline" size="icon" aria-label="Decrease"><Minus /></Button>
  </ButtonGroup>
);`
  },
  size: {
    preview: () => <SizeDemo />,
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group";
import { Plus } from "lucide-preact";

export const Example = () => (
  <div class="flex flex-col items-start gap-8">
    <ButtonGroup>
      <Button variant="outline" size="sm">Small</Button>
      <Button variant="outline" size="sm">Button</Button>
      <Button variant="outline" size="icon-sm" aria-label="Add"><Plus /></Button>
    </ButtonGroup>
    {/* default + lg rows */}
  </div>
);`
  },
  nested: {
    preview: () => <NestedDemo />,
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/kamod-ui/input-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/kamod-ui/tooltip";
import { AudioLines, Plus } from "lucide-preact";

export const Example = () => (
  <ButtonGroup>
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Add"><Plus /></Button>
    </ButtonGroup>
    <ButtonGroup class="min-w-0">
      <InputGroup>
        <InputGroupInput placeholder="Send a message…" />
        <Tooltip>
          <TooltipTrigger asChild>
            <InputGroupAddon align="inline-end"><AudioLines class="size-4" /></InputGroupAddon>
          </TooltipTrigger>
          <TooltipContent>Voice mode</TooltipContent>
        </Tooltip>
      </InputGroup>
    </ButtonGroup>
  </ButtonGroup>
);`
  },
  separator: {
    preview: () => (
      <ButtonGroup>
        <Button variant="secondary" size="sm">
          Copy
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary" size="sm">
          Paste
        </Button>
      </ButtonGroup>
    ),
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/kamod-ui/button-group";

export const Example = () => (
  <ButtonGroup>
    <Button variant="secondary" size="sm">Copy</Button>
    <ButtonGroupSeparator />
    <Button variant="secondary" size="sm">Paste</Button>
  </ButtonGroup>
);`
  },
  split: {
    preview: () => (
      <ButtonGroup>
        <Button variant="secondary" size="sm">
          Button
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary" size="icon" aria-label="Add">
          <Plus />
        </Button>
      </ButtonGroup>
    ),
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/kamod-ui/button-group";
import { Plus } from "lucide-preact";

export const Example = () => (
  <ButtonGroup>
    <Button variant="secondary">Button</Button>
    <ButtonGroupSeparator />
    <Button variant="secondary" size="icon" aria-label="Add"><Plus /></Button>
  </ButtonGroup>
);`
  },
  input: {
    preview: () => (
      <ButtonGroup class="max-w-md w-full">
        <Input type="search" placeholder="Search…" class="h-8" />
        <Button variant="outline" size="icon" aria-label="Search">
          <Search />
        </Button>
      </ButtonGroup>
    ),
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group"
import { Input } from "@/components/kamod-ui/input";
import { Search } from "lucide-preact";

export const Example = () => (
  <ButtonGroup class="max-w-md w-full">
    <Input placeholder="Search…" class="h-8" />
    <Button variant="outline" size="icon" aria-label="Search"><Search /></Button>
  </ButtonGroup>
);`
  },
  "input-group": {
    preview: () => <InputGroupVoiceDemo />,
    code: `// Rounded pill group + InputGroup + voice toggle — see InputGroupVoiceDemo in button-group-doc.tsx`
  },
  dropdown: {
    preview: () => <DropdownSplitDemo />,
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group"
import { Dropdown, DropdownContent, DropdownItem, DropdownGroup, DropdownSeparator, DropdownTrigger } from "@/components/kamod-ui/dropdown";
import { ChevronDown } from "lucide-preact";

export const Example = () => (
  <ButtonGroup>
    <Button variant="outline">Follow</Button>
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline" class="!px-2" aria-label="Open menu"><ChevronDown /></Button>
      </DropdownTrigger>
      <DropdownContent side="bottom" align="end">…</DropdownContent>
    </Dropdown>
  </ButtonGroup>
);`
  },
  select: {
    preview: () => <SelectAmountDemo />,
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group"
import { Input } from "@/components/kamod-ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/kamod-ui/select";
import { ArrowRight } from "lucide-preact";

export const Example = () => (
  <ButtonGroup class="w-full max-w-md">
    <ButtonGroup class="min-w-0 flex-1">
      <Select class="w-fit shrink-0" value={currency} onValueChange={setCurrency}>…</Select>
      <Input placeholder="10.00" class="h-9" />
    </ButtonGroup>
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Send"><ArrowRight /></Button>
    </ButtonGroup>
  </ButtonGroup>
);`
  },
  popover: {
    preview: () => <PopoverCopilotDemo />,
    code: `import { Bot, ChevronDown } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group"
import { Field, FieldDescription, FieldLabel } from "@/components/kamod-ui/field"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/kamod-ui/popover"
import { Textarea } from "@/components/kamod-ui/textarea";

export const Example = () => (
  <ButtonGroup>
    <Button variant="outline"><Bot class="size-4" /> Copilot</Button>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open"><ChevronDown /></Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" class="w-80 rounded-xl">…</PopoverContent>
    </Popover>
  </ButtonGroup>
);`
  },
  rtl: {
    preview: () => <RtlToolbarDemo />,
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group"
import { DirectionProvider } from "@/components/kamod-ui/direction"
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/kamod-ui/dropdown";
// Wrap toolbar in DirectionProvider + dir; mirror back icon with rotate-180 in RTL.`
  },
  "group-text": {
    preview: () => (
      <div class="flex flex-col gap-4">
        <ButtonGroup>
          <ButtonGroupText>Filter</ButtonGroupText>
          <Button variant="outline" size="sm">
            Updated
          </Button>
        </ButtonGroup>
        <ButtonGroup class="max-w-md w-full">
          <ButtonGroupText asChild>
            <Label htmlFor="bg-name">Name</Label>
          </ButtonGroupText>
          <Input id="bg-name" placeholder="Type something…" class="h-8" />
        </ButtonGroup>
      </div>
    ),
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup, ButtonGroupText } from "@/components/kamod-ui/button-group"
import { Input } from "@/components/kamod-ui/input"
import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <>
    <ButtonGroup>
      <ButtonGroupText>Filter</ButtonGroupText>
      <Button variant="outline" size="sm">Updated</Button>
    </ButtonGroup>
    <ButtonGroup>
      <ButtonGroupText asChild>
        <Label htmlFor="name">Name</Label>
      </ButtonGroupText>
      <Input id="name" placeholder="Type something…" />
    </ButtonGroup>
  </>
);`
  }
};

const apiRows: Array<{ prop: string; type: string; defaultValue: string }> = [
  { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
  { prop: "class", type: "string", defaultValue: "-" }
];

const separatorApiRows: Array<{ prop: string; type: string; defaultValue: string }> = [
  { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"vertical"' },
  { prop: "class", type: "string", defaultValue: "-" }
];

const textApiRows: Array<{ prop: string; type: string; defaultValue: string }> = [
  { prop: "asChild", type: "boolean", defaultValue: "false" },
  { prop: "class", type: "string", defaultValue: "-" }
];

export const buttonGroupDocPage: DocPageModule = {
  slug: "button-group",
  title: "Button Group",
  command: "pnpm add @kamod-ui/core",
  usageLabel:
    "Groups related actions with shared borders and focus rings; nest groups for spacing; pair with Input, InputGroup, Dropdown, Select, and Popover (shadcn Button Group pattern).",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import ButtonGroup, ButtonGroupSeparator, and ButtonGroupText from `@/components/kamod-ui/button-group`."
    },
    {
      id: "accessibility",
      title: "Accessibility",
      text: "The group uses role=\"group\". Prefer aria-label or aria-labelledby so assistive tech knows what the control set does. Tab moves between focusable controls inside."
    },
    {
      id: "toggle-group",
      title: "Button group vs toggle group",
      text: "Use ButtonGroup for actions (submit, navigate, open menus). Use a toggle group pattern when buttons represent exclusive or multi selection state — Kamod exposes separate primitives for that use case."
    },
    {
      id: "group-text",
      title: "Group text",
      text: "Optional label text before actions, or ButtonGroupText asChild with Label for form fields."
    },
    {
      id: "orientation",
      title: "Orientation",
      text: "Set orientation=\"vertical\" for stacked controls (for example media + / −)."
    },
    {
      id: "size",
      title: "Size",
      text: "Control density with each Button’s size prop (sm, default, lg, icon variants)."
    },
    {
      id: "nested",
      title: "Nested",
      text: "Nest ButtonGroup components to add gap between clusters while keeping flush joins inside each cluster."
    },
    {
      id: "separator",
      title: "Separator",
      text: "Use ButtonGroupSeparator between solid (non-outline) buttons so the hierarchy stays clear. Outline buttons usually do not need a separator."
    },
    {
      id: "split",
      title: "Split",
      text: "Primary action plus a compact icon action, separated by ButtonGroupSeparator."
    },
    {
      id: "input",
      title: "Input",
      text: "Place a full-width Input beside a button; the group applies flex-1 to direct input children."
    },
    {
      id: "input-group",
      title: "Input group",
      text: "Pill-shaped bar with nested groups: icon button + InputGroup with addons (voice toggle example)."
    },
    {
      id: "dropdown",
      title: "Dropdown",
      text: "Split row: text button plus dropdown trigger sharing one continuous outline."
    },
    {
      id: "select",
      title: "Select",
      text: "Currency (or similar) Select next to an amount field and a send button."
    },
    {
      id: "popover",
      title: "Popover",
      text: "Split control with a popover panel on the trailing chevron button."
    },
    {
      id: "rtl",
      title: "RTL",
      text: "Wrap with DirectionProvider and set dir on the document subtree; mirror directional icons (e.g. back arrow) in RTL."
    },
    {
      id: "api-reference",
      title: "API Reference",
      text: "Props for ButtonGroup, ButtonGroupSeparator, and ButtonGroupText."
    }
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return (
          <ApiReference
            sections={[
              { title: "Button Group", rows: apiRows },
              { title: "Button Group Separator", rows: separatorApiRows },
              { title: "Button Group Text", rows: textApiRows }
            ]}
          />
        );
      }
      if (sectionId === "toggle-group") {
        return null;
      }
      const block = sectionBlocks[sectionId];
      if (!block) {
        return null;
      }
      return context.renderPreviewAndCodeTabs({
        preview: block.preview(),
        codeSnippet: block.code
      });
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <ToolbarDemo />,
          codeSnippet: heroCode,
          previewClass: "overflow-x-auto"
        })}
        {context.sections.map((docSection) => (
          <section key={docSection.id} id={docSection.id} class="docs-section">
            <h2>{docSection.title}</h2>
            <p class="docs-copy">{docSection.text}</p>
            {context.renderSectionExtraContent(docSection.id)}
            {renderSectionBody(docSection.id)}
          </section>
        ))}
      </>
    );
  }
};
