import {
  Button,
  ButtonGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Kbd,
  KbdGroup,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@kamod-ch/ui";
import { Search } from "lucide-preact";
import { createGenericDocPage } from "./create-generic-doc-page";

export const kbdDocPage = createGenericDocPage({
  slug: "kbd",
  title: "Kbd",
  usageLabel:
    "Keyboard keys and shortcuts — shadcn-style grouping, button hints, tooltips, and input addons.",
  installationText: "Import Kbd and optionally KbdGroup from `@/components/kamod-ui/kbd`.",
  usageText:
    'Use Kbd for single keys. Wrap related keys in KbdGroup with gap-1. Use size="sm" for denser UI. On buttons, set data-icon="inline-end" on Kbd for slight nudge (matches Button inline-end icon pattern).',
  exampleSections: [
    {
      id: "kbd-demo",
      title: "Demo",
      text: "**Describe a Key Combination Accurately.** Use `Kbd` for individual keys and `KbdGroup` when several keys form one command, such as Ctrl + B. The visual convention distinguishes a keyboard instruction from ordinary prose without making it an interactive button.\n\nMatch the displayed modifiers and ordering to the behavior your application implements, and provide an ordinary control for the same action so the shortcut remains an enhancement rather than the only way forward.",
      code: `import { Kbd, KbdGroup } from "@/components/kamod-ui/kbd";

export const Example = () => (
  <div class="flex flex-col items-center gap-4">
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⌃</Kbd>
    </KbdGroup>
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>B</Kbd>
    </KbdGroup>
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-col items-center gap-4">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>⌥</Kbd>
            <Kbd>⌃</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>B</Kbd>
          </KbdGroup>
        </div>
      ),
    },
    {
      id: "kbd-usage",
      title: "Usage",
      text: "**Use a Keycap When You Mean a Keyboard Key.** Wrap the name of one key in `Kbd` to give it a compact, recognizable keyboard treatment. Use the actual key label readers should press, keeping the surrounding text responsible for explaining when that input is relevant.\n\nKeep the instruction explicit about whether users should press, hold or combine it with another key.",
      code: `import { Kbd } from "@/components/kamod-ui/kbd";

export const Example = () => <Kbd>Ctrl</Kbd>;`,
      renderPreview: () => <Kbd>Ctrl</Kbd>,
    },
    {
      id: "kbd-group",
      title: "Group",
      text: "**Make a Sequence Readable as One Instruction.** Place related `Kbd` elements inside `KbdGroup` when documenting a combination within a sentence. The group keeps the keys visually connected while the prose explains the command and any required modifier.\n\nDistinguish simultaneous combinations from sequential steps, and keep platform-specific differences accurate rather than showing one modifier convention to every user.",
      code: `import { Kbd, KbdGroup } from "@/components/kamod-ui/kbd";

export const Example = () => (
  <p class="text-muted-foreground text-sm">
    Use{" "}
    <KbdGroup>
      <Kbd>Ctrl + B</Kbd>
      <Kbd>Ctrl + K</Kbd>
    </KbdGroup>{" "}
    to open the command palette
  </p>
);`,
      renderPreview: () => (
        <p class="text-muted-foreground max-w-md text-sm">
          Use{" "}
          <KbdGroup>
            <Kbd>Ctrl + B</Kbd>
            <Kbd>Ctrl + K</Kbd>
          </KbdGroup>{" "}
          to open the command palette
        </p>
      ),
    },
    {
      id: "kbd-button",
      title: "Button",
      text: '**Keep the Action Label Primary.** Place a shortcut hint inside a `Button` and use `data-icon="inline-end"` to align it with trailing content. The button\'s label still describes the action, while the key hint offers another way to invoke it.\n\nEnsure the hinted combination performs the same operation, and do not let the extra keycaps crowd out the label at compact widths.',
      code: `import { Button } from "@/components/kamod-ui/button"
import { Kbd } from "@/components/kamod-ui/kbd";

export const Example = () => (
  <Button variant="outline">
    Accept{" "}
    <Kbd data-icon="inline-end" class="translate-x-0.5">
      ⏎
    </Kbd>
  </Button>
);`,
      renderPreview: () => (
        <Button variant="outline">
          Accept{" "}
          <Kbd data-icon="inline-end" class="translate-x-0.5">
            ⏎
          </Kbd>
        </Button>
      ),
    },
    {
      id: "kbd-tooltip",
      title: "Tooltip",
      text: "**Reveal a Shortcut Where It Is Useful.** Add `Kbd` inside `TooltipContent` when a control has a useful keyboard equivalent. The tooltip can pair the action name with the key combination, keeping the visible toolbar compact without hiding its purpose.\n\nKeep the trigger's accessible name independent of the tooltip, and only advertise combinations that work in the current application context.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group"
import { Kbd, KbdGroup } from "@/components/kamod-ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/kamod-ui/tooltip";

export const Example = () => (
  <ButtonGroup>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Save</Button>
      </TooltipTrigger>
      <TooltipContent>
        Save changes <Kbd>S</Kbd>
      </TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Print</Button>
      </TooltipTrigger>
      <TooltipContent>
        Print document{" "}
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  </ButtonGroup>
);`,
      renderPreview: () => (
        <div class="flex flex-wrap gap-4">
          <ButtonGroup>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Save</Button>
              </TooltipTrigger>
              <TooltipContent>
                Save changes <Kbd>S</Kbd>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Print</Button>
              </TooltipTrigger>
              <TooltipContent>
                Print document{" "}
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>P</Kbd>
                </KbdGroup>
              </TooltipContent>
            </Tooltip>
          </ButtonGroup>
        </div>
      ),
    },
    {
      id: "kbd-input-group",
      title: "Input Group",
      text: "**Show How to Reach the Field Quickly.** Use a keyboard hint in an inline-end `InputGroupAddon` to advertise a shortcut that focuses or opens search. Keep it secondary to the field's label and ensure the documented shortcut is actually handled by the application.\n\nRegister the handler separately, prevent conflicts thoughtfully, and avoid activating it while users are typing in another editable field unless that is intentional.",
      code: `import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/kamod-ui/input-group"
import { Kbd } from "@/components/kamod-ui/kbd";
import { Search } from "lucide-preact";

export const Example = () => (
  <InputGroup class="max-w-xs">
    <InputGroupInput placeholder="Search..." />
    <InputGroupAddon>
      <Search />
    </InputGroupAddon>
    <InputGroupAddon align="inline-end">
      <Kbd size="sm">⌘</Kbd>
      <Kbd size="sm">K</Kbd>
    </InputGroupAddon>
  </InputGroup>
);`,
      renderPreview: () => (
        <div class="flex w-full max-w-xs flex-col gap-6">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd size="sm">⌘</Kbd>
              <Kbd size="sm">K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </div>
      ),
    },
    {
      id: "kbd-sizes",
      title: "Sizes",
      text: "**Match the Keycap to Its Surrounding Text.** Compare the `sm` and `md` keyboard treatments against the surrounding text or control height. Matching their scale keeps the hint legible without allowing a secondary shortcut to dominate the action it describes.\n\nPreserve consistent baseline alignment and enough contrast; a secondary appearance should not make the actual key name difficult to distinguish.",
      code: `import { Kbd } from "@/components/kamod-ui/kbd";

export const Example = () => (
  <div class="flex items-center gap-2">
    <Kbd size="sm">Esc</Kbd>
    <Kbd size="md">Esc</Kbd>
  </div>
);`,
      renderPreview: () => (
        <div class="flex items-center gap-2">
          <Kbd size="sm">Esc</Kbd>
          <Kbd size="md">Esc</Kbd>
        </div>
      ),
    },
    {
      id: "kbd-rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Let `Kbd` inherit direction from its surrounding text, then verify combinations containing modifiers and separators. The translated explanation and the written key sequence should remain understandable together rather than being mirrored independently.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
      code: `import { Kbd, KbdGroup } from "@/components/kamod-ui/kbd";

export const Example = () => (
  <div class="flex flex-col items-center gap-4" dir="rtl">
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>B</Kbd>
    </KbdGroup>
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-col items-center gap-4" dir="rtl">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>B</Kbd>
          </KbdGroup>
        </div>
      ),
    },
  ],
  apiRows: [
    { prop: "size", type: '"sm" | "md"', defaultValue: '"md"' },
    { prop: "data-icon", type: '"inline-end"', defaultValue: "—" },
    { prop: "children", type: "ComponentChildren", defaultValue: "required" },
  ],
  accessibilityText:
    "Kbd is often decorative context; ensure shortcuts are described in visible text or aria-label where needed. Do not rely on Kbd alone for critical instructions.",
});
