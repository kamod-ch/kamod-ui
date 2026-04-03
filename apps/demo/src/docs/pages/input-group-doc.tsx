import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  Kbd,
  Label,
  Spinner
} from "@kamod-ui/core";
import {
  Check,
  ChevronDown,
  CornerDownLeft,
  Copy,
  CreditCard,
  EyeOff,
  FileCode,
  Info,
  Loader2,
  Mail,
  MoreHorizontal,
  Search,
  Star
} from "lucide-preact";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

function InputGroupDemo() {
  return (
    <InputGroup class="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Search class="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText>12 results</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}

function InputGroupCopyRow() {
  const [copied, setCopied] = useState(false);
  return (
    <InputGroup>
      <InputGroupInput readOnly value="https://x.com/shadcn" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label="Copy"
          title="Copy"
          size="icon-xs"
          onClick={() => {
            void navigator.clipboard.writeText("https://x.com/shadcn").then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
        >
          {copied ? <Check class="size-4" /> : <Copy class="size-4" />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

function InputGroupFavoriteRow() {
  const [fav, setFav] = useState(false);
  return (
    <InputGroup class="rounded-full [--radius:9999px]">
      <InputGroupAddon align="inline-start" class="ps-1.5">
        <InputGroupButton variant="secondary" size="icon-xs" type="button" aria-label="Security info">
          <Info class="size-4" />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupAddon class="text-muted-foreground">https://</InputGroupAddon>
      <InputGroupInput id="secure-ig-doc" placeholder="example.com" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" type="button" aria-label="Favorite" onClick={() => setFav(!fav)}>
          <Star class={`size-4 ${fav ? "fill-blue-600 stroke-blue-600" : ""}`} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

function InputGroupDropdownRow() {
  return (
    <InputGroup>
      <InputGroupInput placeholder="Enter file name" />
      <InputGroupAddon align="inline-end">
        <Dropdown>
          <DropdownTrigger>
            <InputGroupButton variant="ghost" size="icon-xs" aria-label="More">
              <MoreHorizontal class="size-4" />
            </InputGroupButton>
          </DropdownTrigger>
          <DropdownContent class="min-w-40">
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Copy path</DropdownItem>
            <DropdownItem>Open location</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </InputGroupAddon>
    </InputGroup>
  );
}

export const inputGroupDocPage = createGenericDocPage({
  slug: "input-group",
  title: "Input Group",
  usageLabel: "Compose inputs with addons, icons, text, buttons, dropdowns, spinners — aligned with shadcn input-group docs.",
  installationText:
    "Import InputGroup, InputGroupInput or InputGroupTextarea, InputGroupAddon, InputGroupText, InputGroupButton from `@/components/kamod-ui/input-group`.",
  usageText:
    "Place InputGroupInput or InputGroupTextarea first in the DOM; use InputGroupAddon align=inline-start | inline-end | block-start | block-end to position visually (shadcn recommendation).",
  exampleSections: [
    {
      id: "ig-demo",
      title: "Demo",
      text: "Search field with trailing icon and result count (shadcn InputGroupDemo).",
      code: `import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/kamod-ui/input-group";
import { Search } from "lucide-preact";

export const Example = () => (
  <InputGroup class="max-w-xs">
    <InputGroupInput placeholder="Search..." />
    <InputGroupAddon>
      <Search class="text-muted-foreground" />
    </InputGroupAddon>
    <InputGroupAddon align="inline-end">
      <InputGroupText>12 results</InputGroupText>
    </InputGroupAddon>
  </InputGroup>
);`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <InputGroupDemo />
        </div>
      )
    },
    {
      id: "ig-usage",
      title: "Usage",
      text: "Minimal search + icon addon.",
      code: `import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/kamod-ui/input-group";
import { Search } from "lucide-preact";

export const Example = () => (
  <InputGroup>
    <InputGroupInput placeholder="Search..." />
    <InputGroupAddon>
      <Search />
    </InputGroupAddon>
  </InputGroup>
);`,
      renderPreview: () => (
        <InputGroup class="max-w-xs">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search class="size-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      )
    },
    {
      id: "url-input-group",
      title: "URL",
      text: "Protocol prefix and Go button.",
      code: `import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/kamod-ui/input-group";

export const Example = () => (
  <InputGroup class="max-w-md">
    <InputGroupAddon align="inline-start">
      <InputGroupText>https://</InputGroupText>
    </InputGroupAddon>
    <InputGroupInput placeholder="kamod-ui.dev" />
    <InputGroupAddon align="inline-end">
      <InputGroupButton>Go</InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
);`,
      renderPreview: () => (
        <InputGroup class="max-w-md">
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="kamod-ui.dev" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>Go</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      )
    },
    {
      id: "username-input-group",
      title: "Username",
      text: "@ prefix for handles.",
      code: `import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/kamod-ui/input-group";

export const Example = () => (
  <InputGroup class="w-full max-w-md">
    <InputGroupAddon align="inline-start">
      <InputGroupText>@</InputGroupText>
    </InputGroupAddon>
    <InputGroupInput placeholder="username" />
  </InputGroup>
);`,
      renderPreview: () => (
        <InputGroup class="w-full max-w-md">
          <InputGroupAddon align="inline-start">
            <InputGroupText>@</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="username" />
        </InputGroup>
      )
    },
    {
      id: "ig-inline-start",
      title: "Align: inline-start",
      text: "Icon before the field; control stays first in DOM.",
      code: `import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/kamod-ui/input-group";
import { Search } from "lucide-preact";

export const Example = () => (
  <div class="grid max-w-sm gap-2">
    <Label htmlFor="inline-start-ig">Search</Label>
    <InputGroup>
      <InputGroupInput id="inline-start-ig" placeholder="Search..." />
      <InputGroupAddon align="inline-start">
        <Search class="text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
    <p class="text-muted-foreground text-sm">Icon at the start (visual).</p>
  </div>
);`,
      renderPreview: () => (
        <div class="grid max-w-sm gap-2">
          <Label htmlFor="inline-start-ig-doc">Search</Label>
          <InputGroup>
            <InputGroupInput id="inline-start-ig-doc" placeholder="Search..." />
            <InputGroupAddon align="inline-start">
              <Search class="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          <p class="text-muted-foreground text-sm">Icon at the start (visual).</p>
        </div>
      )
    },
    {
      id: "ig-inline-end",
      title: "Align: inline-end",
      text: "Trailing icon (e.g. password visibility affordance).",
      code: `import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/kamod-ui/input-group";
import { EyeOff } from "lucide-preact";

export const Example = () => (
  <div class="grid max-w-sm gap-2">
    <Label htmlFor="inline-end-ig">Password</Label>
    <InputGroup>
      <InputGroupInput id="inline-end-ig" type="password" placeholder="Enter password" />
      <InputGroupAddon align="inline-end">
        <EyeOff class="text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  </div>
);`,
      renderPreview: () => (
        <div class="grid max-w-sm gap-2">
          <Label htmlFor="inline-end-ig-doc">Password</Label>
          <InputGroup>
            <InputGroupInput id="inline-end-ig-doc" type="password" placeholder="Enter password" />
            <InputGroupAddon align="inline-end">
              <EyeOff class="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      )
    },
    {
      id: "ig-block-start",
      title: "Align: block-start",
      text: "Addon row above input or textarea.",
      code: `import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/kamod-ui/input-group";
import { Copy, FileCode } from "lucide-preact";

export const Example = () => (
  <div class="grid max-w-sm gap-4">
    <div class="grid gap-2">
      <Label htmlFor="bs-input">Name</Label>
      <InputGroup class="h-auto">
        <InputGroupInput id="bs-input" placeholder="Enter your name" />
        <InputGroupAddon align="block-start">
          <InputGroupText>Full name</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
    <div class="grid gap-2">
      <Label htmlFor="bs-ta">Script</Label>
      <InputGroup>
        <InputGroupTextarea id="bs-ta" placeholder={"console.log('hello');"} class="font-mono text-sm" />
        <InputGroupAddon align="block-start">
          <FileCode class="text-muted-foreground" />
          <InputGroupText class="font-mono">script.js</InputGroupText>
          <InputGroupButton size="icon-xs" class="ms-auto" aria-label="Copy">
            <Copy class="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="grid max-w-sm gap-4">
          <div class="grid gap-2">
            <Label htmlFor="bs-input-doc">Name</Label>
            <InputGroup class="h-auto">
              <InputGroupInput id="bs-input-doc" placeholder="Enter your name" />
              <InputGroupAddon align="block-start">
                <InputGroupText>Full name</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div class="grid gap-2">
            <Label htmlFor="bs-ta-doc">Script</Label>
            <InputGroup>
              <InputGroupTextarea id="bs-ta-doc" placeholder={"console.log('hello');"} class="font-mono text-sm" />
              <InputGroupAddon align="block-start">
                <FileCode class="text-muted-foreground" />
                <InputGroupText class="font-mono">script.js</InputGroupText>
                <InputGroupButton size="icon-xs" class="ms-auto" aria-label="Copy">
                  <Copy class="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      )
    },
    {
      id: "ig-block-end",
      title: "Align: block-end",
      text: "Footer row with suffix or actions.",
      code: `import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/kamod-ui/input-group";

export const Example = () => (
  <div class="grid max-w-sm gap-4">
    <InputGroup class="h-auto">
      <InputGroupInput placeholder="Enter amount" />
      <InputGroupAddon align="block-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupTextarea placeholder="Write a comment..." />
      <InputGroupAddon align="block-end">
        <InputGroupText>0/280</InputGroupText>
        <InputGroupButton variant="default" size="sm" class="ms-auto">
          Post
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
);`,
      renderPreview: () => (
        <div class="grid max-w-sm gap-4">
          <InputGroup class="h-auto">
            <InputGroupInput placeholder="Enter amount" />
            <InputGroupAddon align="block-end">
              <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupTextarea placeholder="Write a comment..." />
            <InputGroupAddon align="block-end">
              <InputGroupText>0/280</InputGroupText>
              <InputGroupButton variant="default" size="sm" class="ms-auto">
                Post
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      )
    },
    {
      id: "ig-icons",
      title: "Icons",
      text: "Multiple icon patterns in a grid.",
      code: `// Search, Mail, Card + Check, trailing icon cluster — see preview`,
      renderPreview: () => (
        <div class="grid max-w-sm gap-4">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <Search class="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput type="email" placeholder="Enter your email" />
            <InputGroupAddon>
              <Mail class="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Card number" />
            <InputGroupAddon>
              <CreditCard class="text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Check class="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Card number" />
            <InputGroupAddon align="inline-end">
              <Star class="text-muted-foreground" />
              <Info class="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      )
    },
    {
      id: "ig-text",
      title: "Text addons",
      text: "Currency, URL, domain suffix, character hint.",
      code: `import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/kamod-ui/input-group";

export const Example = () => (
  <div class="grid max-w-sm gap-4">
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="0.00" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" class="ps-0.5!" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>.com</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput placeholder="Enter your username" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>@company.com</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupTextarea placeholder="Enter your message" />
      <InputGroupAddon align="block-end">
        <InputGroupText class="text-xs text-muted-foreground">120 characters left</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </div>
);`,
      renderPreview: () => (
        <div class="grid max-w-sm gap-4">
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="0.00" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="example.com" class="ps-0.5!" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>.com</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Enter your username" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>@company.com</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupTextarea placeholder="Enter your message" />
            <InputGroupAddon align="block-end">
              <InputGroupText class="text-xs text-muted-foreground">120 characters left</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      )
    },
    {
      id: "ig-button",
      title: "Buttons",
      text: "Copy action, chrome row, secondary search button.",
      code: `// Copy URL, pill chrome, Search button — see preview`,
      renderPreview: () => (
        <div class="grid max-w-sm gap-4">
          <InputGroupCopyRow />
          <InputGroupFavoriteRow />
          <InputGroup>
            <InputGroupInput placeholder="Type to search..." />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">Search</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      )
    },
    {
      id: "ig-kbd",
      title: "Kbd",
      text: "Shortcut hint in inline-end addon.",
      code: `import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/kamod-ui/input-group"
import { Kbd } from "@/components/kamod-ui/kbd";
import { Search } from "lucide-preact";

export const Example = () => (
  <InputGroup class="max-w-sm">
    <InputGroupInput placeholder="Search..." />
    <InputGroupAddon>
      <Search class="text-muted-foreground" />
    </InputGroupAddon>
    <InputGroupAddon align="inline-end">
      <Kbd size="sm">⌘</Kbd>
      <Kbd size="sm">K</Kbd>
    </InputGroupAddon>
  </InputGroup>
);`,
      renderPreview: () => (
        <InputGroup class="max-w-sm">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search class="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      )
    },
    {
      id: "ig-dropdown",
      title: "Dropdown",
      text: "InputGroupButton as dropdown trigger (Kamod Dropdown).",
      code: `// DropdownTrigger wraps InputGroupButton — see preview`,
      renderPreview: () => (
        <div class="grid max-w-sm gap-4">
          <InputGroupDropdownRow />
          <InputGroup class="[--radius:1rem]">
            <InputGroupInput placeholder="Enter search query" />
            <InputGroupAddon align="inline-end">
              <Dropdown>
                <DropdownTrigger>
                  <InputGroupButton variant="ghost" class="pr-1.5 text-xs">
                    Search in… <ChevronDown class="size-3" />
                  </InputGroupButton>
                </DropdownTrigger>
                <DropdownContent class="min-w-44">
                  <DropdownItem>Documentation</DropdownItem>
                  <DropdownItem>Blog posts</DropdownItem>
                  <DropdownItem>Changelog</DropdownItem>
                </DropdownContent>
              </Dropdown>
            </InputGroupAddon>
          </InputGroup>
        </div>
      )
    },
    {
      id: "ig-spinner",
      title: "Spinner",
      text: "Loading indicators in addons.",
      code: `import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/kamod-ui/input-group"
import { Spinner } from "@/components/kamod-ui/spinner";
import { Loader2 } from "lucide-preact";

export const Example = () => (
  <div class="grid max-w-sm gap-4">
    <InputGroup>
      <InputGroupInput placeholder="Searching..." />
      <InputGroupAddon align="inline-end">
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput placeholder="Processing..." />
      <InputGroupAddon>
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput placeholder="Saving changes..." />
      <InputGroupAddon align="inline-end">
        <InputGroupText>Saving…</InputGroupText>
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput placeholder="Refreshing data..." />
      <InputGroupAddon>
        <Loader2 class="size-4 animate-spin" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText class="text-muted-foreground">Please wait…</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </div>
);`,
      renderPreview: () => (
        <div class="grid max-w-sm gap-4">
          <InputGroup>
            <InputGroupInput placeholder="Searching..." />
            <InputGroupAddon align="inline-end">
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Processing..." />
            <InputGroupAddon>
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Saving changes..." />
            <InputGroupAddon align="inline-end">
              <InputGroupText>Saving…</InputGroupText>
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Refreshing data..." />
            <InputGroupAddon>
              <Loader2 class="size-4 animate-spin" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupText class="text-muted-foreground">Please wait…</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      )
    },
    {
      id: "ig-textarea-code",
      title: "Textarea (code)",
      text: "Block-start and block-end toolbars around a monospace textarea.",
      code: `import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from "@/components/kamod-ui/input-group";
import { CornerDownLeft } from "lucide-preact";

export const Example = () => (
  <InputGroup class="max-w-md">
    <InputGroupTextarea
      id="ta-code-doc"
      placeholder={"console.log('Hello, world!');"}
      class="min-h-[200px] font-mono text-sm"
    />
    <InputGroupAddon align="block-end" class="border-t">
      <InputGroupText>Line 1, Column 1</InputGroupText>
      <InputGroupButton size="sm" class="ms-auto" variant="default" type="button">
        Run <CornerDownLeft class="size-4" />
      </InputGroupButton>
    </InputGroupAddon>
    <InputGroupAddon align="block-start" class="border-b">
      <InputGroupText class="font-mono font-medium">script.js</InputGroupText>
    </InputGroupAddon>
  </InputGroup>
);`,
      renderPreview: () => (
        <InputGroup class="max-w-md">
          <InputGroupTextarea
            id="ta-code-doc"
            placeholder={"console.log('Hello, world!');"}
            class="min-h-[200px] font-mono text-sm"
          />
          <InputGroupAddon align="block-end" class="border-t">
            <InputGroupText>Line 1, Column 1</InputGroupText>
            <InputGroupButton size="sm" class="ms-auto" variant="default" type="button">
              Run <CornerDownLeft class="size-4" />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupAddon align="block-start" class="border-b">
            <InputGroupText class="font-mono font-medium">script.js</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      )
    },
    {
      id: "ig-rtl",
      title: "RTL",
      text: "Set dir=\"rtl\" on a wrapper; logical align props still apply.",
      code: `import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/kamod-ui/input-group";

export const Example = () => (
  <div dir="rtl" class="max-w-sm">
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="domain" />
    </InputGroup>
  </div>
);`,
      renderPreview: () => (
        <div dir="rtl" class="max-w-sm">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="domain" />
          </InputGroup>
        </div>
      )
    }
  ],
  apiRows: [
    { prop: "InputGroupAddon align", type: '"inline-start" | "inline-end" | "block-start" | "block-end"', defaultValue: '"inline-start"' },
    { prop: "InputGroupButton size", type: '"sm" | "icon-xs" | "icon-sm"', defaultValue: '"sm"' },
    { prop: "InputGroupInput / Textarea", type: "control (data-slot=input-group-control)", defaultValue: "—" }
  ],
  accessibilityText:
    "Label inputs clearly; use aria-label on icon-only InputGroupButton. Add-ons that open menus should expose aria-expanded via the dropdown trigger pattern."
});
