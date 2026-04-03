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
  TooltipTrigger
} from "@kamod-ui/core";
import { Search } from "lucide-preact";
import { createGenericDocPage } from "./create-generic-doc-page";

export const kbdDocPage = createGenericDocPage({
  slug: "kbd",
  title: "Kbd",
  usageLabel: "Keyboard keys and shortcuts — shadcn-style grouping, button hints, tooltips, and input addons.",
  installationText: "Import Kbd and optionally KbdGroup from `@/components/kamod-ui/kbd`.",
  usageText:
    "Use Kbd for single keys. Wrap related keys in KbdGroup with gap-1. Use size=\"sm\" for denser UI. On buttons, set data-icon=\"inline-end\" on Kbd for slight nudge (matches Button inline-end icon pattern).",
  exampleSections: [
    {
      id: "kbd-demo",
      title: "Demo",
      text: "Modifier row and Ctrl + B style sequence (shadcn KbdDemo).",
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
      )
    },
    {
      id: "kbd-usage",
      title: "Usage",
      text: "Single key element.",
      code: `import { Kbd } from "@/components/kamod-ui/kbd";

export const Example = () => <Kbd>Ctrl</Kbd>;`,
      renderPreview: () => <Kbd>Ctrl</Kbd>
    },
    {
      id: "kbd-group",
      title: "Group",
      text: "KbdGroup clusters keys in prose (shadcn Group example).",
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
      )
    },
    {
      id: "kbd-button",
      title: "Button",
      text: "Shortcut inside Button; data-icon=\"inline-end\" aligns like trailing icons.",
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
      )
    },
    {
      id: "kbd-tooltip",
      title: "Tooltip",
      text: "Kbd inside TooltipContent for discoverability.",
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
      )
    },
    {
      id: "kbd-input-group",
      title: "Input group",
      text: "Shortcut hints in InputGroupAddon (inline-end), with search icon.",
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
      )
    },
    {
      id: "kbd-sizes",
      title: "Sizes",
      text: "sm (h-5) vs md (h-6) for dense toolbars or default body.",
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
      )
    },
    {
      id: "kbd-rtl",
      title: "RTL",
      text: "Direction inherits from dir on an ancestor.",
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
      )
    }
  ],
  apiRows: [
    { prop: "size", type: '"sm" | "md"', defaultValue: '"md"' },
    { prop: "data-icon", type: '"inline-end"', defaultValue: "—" },
    { prop: "children", type: "ComponentChildren", defaultValue: "required" }
  ],
  accessibilityText:
    "Kbd is often decorative context; ensure shortcuts are described in visible text or aria-label where needed. Do not rely on Kbd alone for critical instructions."
});
