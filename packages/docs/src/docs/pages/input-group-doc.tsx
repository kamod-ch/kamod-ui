import {
  CopyButton,
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
  Spinner,
} from "@kamod-ch/ui";
import {
  Check,
  ChevronDown,
  CornerDownLeft,
  CreditCard,
  EyeOff,
  FileCode,
  Info,
  Loader2,
  Mail,
  MoreHorizontal,
  Search,
  Star,
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
  return (
    <InputGroup>
      <InputGroupInput readOnly value="https://x.com/shadcn" />
      <InputGroupAddon align="inline-end">
        <CopyButton value="https://x.com/shadcn" subject="URL" iconOnly />
      </InputGroupAddon>
    </InputGroup>
  );
}

function InputGroupScriptRow() {
  const [script, setScript] = useState("console.log('hello');");
  return (
    <div class="grid gap-2">
      <Label htmlFor="bs-ta-doc">Script</Label>
      <InputGroup>
        <InputGroupTextarea
          id="bs-ta-doc"
          value={script}
          onInput={(event) => setScript(event.currentTarget.value)}
          class="font-mono text-sm"
        />
        <InputGroupAddon align="block-start">
          <FileCode class="text-muted-foreground" />
          <InputGroupText class="font-mono">script.js</InputGroupText>
          <CopyButton value={script} subject="script" iconOnly class="ms-auto" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function InputGroupFavoriteRow() {
  const [fav, setFav] = useState(false);
  return (
    <InputGroup class="rounded-full [--radius:9999px]">
      <InputGroupAddon align="inline-start" class="ps-1.5">
        <InputGroupButton
          variant="secondary"
          size="icon-xs"
          type="button"
          aria-label="Security info"
        >
          <Info class="size-4" />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupAddon class="text-muted-foreground">https://</InputGroupAddon>
      <InputGroupInput id="secure-ig-doc" placeholder="example.com" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          type="button"
          aria-label="Favorite"
          onClick={() => setFav(!fav)}
        >
          <Star class={`size-4 ${fav ? "fill-blue-600 stroke-blue-600" : ""}`} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

function InputGroupDropdownRow() {
  const [path, setPath] = useState("src/app.tsx");
  return (
    <InputGroup>
      <InputGroupInput
        placeholder="Enter file name"
        value={path}
        onInput={(event) => setPath(event.currentTarget.value)}
      />
      <InputGroupAddon align="inline-end">
        <Dropdown>
          <DropdownTrigger asChild>
            <InputGroupButton variant="ghost" size="icon-xs" aria-label="More">
              <MoreHorizontal class="size-4" />
            </InputGroupButton>
          </DropdownTrigger>
          <DropdownContent class="min-w-40">
            <DropdownItem>Settings</DropdownItem>
            <CopyButton
              value={path}
              label="Copy path"
              subject="path"
              role="menuitem"
              class="w-full"
            />
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
  usageLabel:
    "Compose inputs with addons, icons, text, buttons, dropdowns, spinners — aligned with shadcn input-group docs.",
  installationText:
    "Import InputGroup, InputGroupInput or InputGroupTextarea, InputGroupAddon, InputGroupText, InputGroupButton from `@/components/kamod-ui/input-group`.",
  usageText:
    "Place InputGroupInput or InputGroupTextarea first in the DOM; use InputGroupAddon align=inline-start | inline-end | block-start | block-end to position visually (shadcn recommendation).",
  exampleSections: [
    {
      id: "ig-demo",
      title: "Demo",
      text: "**Keep Search Context Close to the Query.** Compose a search field with a trailing icon and result count inside `InputGroup`. The input holds the query, while the addon reports context about the current result set without becoming part of the typed value.\n\nDerive the count from the actual results, keep the input labeled and distinguish no matches from a request that is still loading.",
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
      ),
    },
    {
      id: "ig-usage",
      title: "Usage",
      text: "**Start with One Useful Addon.** Start with an input and one icon addon to understand the group's shared border and spacing. The icon suggests the field's purpose, while a persistent label or accessible name supplies its actual meaning.\n\nKeep it decorative unless it performs an action, retain an accessible name for the input, and avoid assuming that the icon makes placeholder-only labeling sufficient.",
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
      ),
    },
    {
      id: "url-input-group",
      title: "URL",
      text: "**Clarify Which Part of the Address Is Editable.** Place a protocol prefix before the editable URL segment and a Go action after it. Make clear how the prefix combines with the input when forming a destination, especially if users paste an already complete address.\n\nNormalize and validate the resulting URL in application logic, and make the Go action's destination or effect predictable before activating it.",
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
      ),
    },
    {
      id: "username-input-group",
      title: "Username",
      text: "**Distinguish Display Decoration from Stored Data.** Use an `@` prefix to introduce an account handle while leaving the editable portion distinct. Decide whether that character belongs in the stored value, and apply the same rule when displaying or validating the completed handle.\n\nExplain accepted characters and availability checks separately, and avoid treating a visual prefix as validation.",
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
      ),
    },
    {
      id: "ig-inline-start",
      title: "Align: Inline-Start",
      text: "**Add Context before the Value.** Use the inline-start addon position to show an icon before the field visually. The control can remain first in the markup, so presentation does not require restructuring the input's association with its label and help text.\n\nKeep meaningful text associated with the input and decorative symbols hidden from assistive technology; logical placement should continue to work when direction changes.",
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
      ),
    },
    {
      id: "ig-inline-end",
      title: "Align: Inline-End",
      text: "**Reserve the Trailing Edge for Relevant Assistance.** Place a supporting symbol or action in an inline-end addon when it belongs after the value. If the symbol changes something, such as password visibility, use a named button rather than treating the graphic as decoration.\n\nGive interactive addons a clear name and appropriate button type, and keep them distinct from decorative symbols that should not receive focus.",
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
      ),
    },
    {
      id: "ig-block-start",
      title: "Align: Block-Start",
      text: "**Introduce a Larger Editing Area.** Use a block-start addon for context or tools that belong above an input or textarea. This creates a separate row inside the shared field boundary, leaving the editable content below it with room to expand.\n\nKeep the field's accessible name explicit and ensure the addon does not become a second unrelated toolbar competing with the surrounding form.",
      code: `import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/kamod-ui/input-group";
import { FileCode } from "lucide-preact";
import { CopyButton } from "@kamod-ch/ui/copy-button";
import { useState } from "preact/hooks";

export const Example = () => {
  const [script, setScript] = useState("console.log('hello');");
  return (
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
        <InputGroupTextarea id="bs-ta" value={script} onInput={(event) => setScript(event.currentTarget.value)} class="font-mono text-sm" />
        <InputGroupAddon align="block-start">
          <FileCode class="text-muted-foreground" />
          <InputGroupText class="font-mono">script.js</InputGroupText>
          <CopyButton value={script} subject="script" iconOnly class="ms-auto" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  </div>
);
};`,
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
          <InputGroupScriptRow />
        </div>
      ),
    },
    {
      id: "ig-block-end",
      title: "Align: Block-End",
      text: "**Place Supporting Actions after the Input.** Place suffix information or actions in a block-end addon beneath the editable area. This works for a character count or submit control that should remain part of the same composition without occupying horizontal typing space.\n\nKeep counters derived from the current value, make limits clear, and avoid hiding validation feedback behind a decorative footer.",
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
      ),
    },
    {
      id: "ig-icons",
      title: "Icons",
      text: "**Use Symbols Consistently Across Fields.** Compare leading and trailing icons with the same field structure to decide which symbols add useful context. Keep decorative icons separate from interactive addon buttons so their visual placement does not imply identical behavior.\n\nKeep decorative graphics out of the accessible name and add descriptive labels to real icon actions; the same visual slot should not unpredictably alternate between clickable and static content.",
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
      ),
    },
    {
      id: "ig-text",
      title: "Text Addons",
      text: "**Explain How the Value Will Be Interpreted.** Use text addons for units, protocol prefixes, domain suffixes or concise hints. These strings explain how to interpret the value, but the application must decide which parts actually belong in its stored or submitted representation.\n\nValidate the completed representation, including any fixed prefix or suffix that the service expects. If a narrow layout abbreviates the addon, keep the full format available in the field's helper text rather than leaving users to infer it.",
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
              <InputGroupText class="text-xs text-muted-foreground">
                120 characters left
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      ),
    },
    {
      id: "ig-button",
      title: "Buttons",
      text: "**Keep Field Actions Local and Explicit.** Use `InputGroupButton` for an action directly related to the field, such as copying its value or running a search. The compact button shares the surrounding boundary while retaining its own label and activation behavior.\n\nSet button types intentionally, give icon-only actions accessible names, and provide brief feedback when an operation such as copying succeeds or fails.",
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
      ),
    },
    {
      id: "ig-kbd",
      title: "Kbd",
      text: "**Advertise a Working Shortcut.** Place a [Kbd](/docs/kbd/installation) hint in the inline-end addon when a real keyboard shortcut can focus or activate the field. The hint makes that existing behavior discoverable without registering the shortcut itself.\n\nRegister the behavior in application code, avoid browser conflicts, and keep ordinary tab navigation available regardless of the hinted combination.",
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
      ),
    },
    {
      id: "ig-dropdown",
      title: "Dropdown",
      text: "**Put Secondary Field Options Behind a Named Trigger.** Compose `InputGroupButton` with [Dropdown](/docs/dropdown/installation) when the field needs a short set of related actions. The trigger belongs inside the input group, while the opened menu presents the available operations separately.\n\nKeep selection synchronized with the field's meaning and preserve focus behavior; use [Dropdown](/docs/dropdown/installation) for the menu's own state and keyboard patterns.",
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
      ),
    },
    {
      id: "ig-spinner",
      title: "Spinner",
      text: "**Show Pending Work without Replacing the Field's Meaning.** Put `Spinner` in an addon to show work associated with the field, such as searching for suggestions. Drive it from the real pending state and keep the input value visible while the operation completes.\n\nKeep an understandable text status where needed, cancel stale application requests, and ensure an old response cannot overwrite the latest value's result.",
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
      ),
    },
    {
      id: "ig-textarea-code",
      title: "Textarea (Code)",
      text: "**Separate Editing from Supporting Tools.** Arrange block-start and block-end toolbars around a monospace textarea for code-like content. The field remains an editable text area; the surrounding actions and metadata give it context without implying a full code editor.\n\nKeep toolbar buttons out of the value, preserve ordinary text editing and label the textarea explicitly; this composition is not a full code editor by itself.",
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
      ),
    },
    {
      id: "ig-rtl",
      title: "RTL",
      text: '**Check the Whole Pattern in Its Reading Direction.** Set `dir="rtl"` on the surrounding composition and use logical addon alignment. Inline-start and inline-end then describe the same relationship to the text without hard-coding the icon or action to a physical side.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.',
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
      ),
    },
  ],
  apiRows: [
    {
      prop: "InputGroupAddon align",
      type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
      defaultValue: '"inline-start"',
    },
    { prop: "InputGroupButton size", type: '"sm" | "icon-xs" | "icon-sm"', defaultValue: '"sm"' },
    {
      prop: "InputGroupInput / Textarea",
      type: "control (data-slot=input-group-control)",
      defaultValue: "—",
    },
  ],
  accessibilityText:
    "Label inputs clearly; use aria-label on icon-only InputGroupButton. Add-ons that open menus should expose aria-expanded via the dropdown trigger pattern.",
});
