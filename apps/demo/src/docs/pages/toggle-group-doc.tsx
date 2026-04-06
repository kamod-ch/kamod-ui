import { ToggleGroup, ToggleGroupItem } from "@kamod-ui/core";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-preact";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const ControlledToggleGroupPreview = () => {
  const [value, setValue] = useState("list");
  const handleValueChange = (next: string | string[]) => {
    if (typeof next === "string") {
      setValue(next);
    }
  };

  return (
    <div class="space-y-2">
      <ToggleGroup type="single" value={value} onValueChange={handleValueChange} variant="outline">
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="cards">Cards</ToggleGroupItem>
      </ToggleGroup>
      <p class="text-xs text-muted-foreground">Current value: {value || "none"}</p>
    </div>
  );
};

export const toggleGroupDocPage = createGenericDocPage({
  slug: "toggle-group",
  title: "Toggle Group",
  usageLabel:
    "Toggle Group manages modern single- or multi-select controls with a segmented, toolbar-friendly style.",
  installationText:
    "Import ToggleGroup and ToggleGroupItem from `@/components/kamod-ui/toggle-group`.",
  usageText:
    "Use `type`, `variant`, `size`, `spacing`, and `orientation` to build compact, modern segmented controls.",
  exampleSections: [
    {
      id: "single-selection",
      title: "Single Selection",
      text: "Allow one active option at a time with a segmented control look.",
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/kamod-ui/toggle-group";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-preact";

export const Example = () => (
  <ToggleGroup type="single" defaultValue="left" variant="outline">
    <ToggleGroupItem value="left" aria-label="Align left">
      <AlignLeft class="size-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Align center">
      <AlignCenter class="size-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Align right">
      <AlignRight class="size-4" />
    </ToggleGroupItem>
  </ToggleGroup>
);`,
      renderPreview: () => (
        <div class="docs-toggle-toolbar-demo">
          <ToggleGroup type="single" defaultValue="left" variant="outline">
            <ToggleGroupItem value="left" aria-label="Align left">
              <AlignLeft class="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <AlignCenter class="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <AlignRight class="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      ),
    },
    {
      id: "sizes",
      title: "Sizes",
      text: "Use a compact or prominent size depending on your context.",
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/kamod-ui/toggle-group";

export const Example = () => (
  <>
    <ToggleGroup type="single" defaultValue="all" size="sm" variant="outline">
      <ToggleGroupItem value="all">All</ToggleGroupItem>
      <ToggleGroupItem value="missed">Missed</ToggleGroupItem>
    </ToggleGroup>

    <ToggleGroup type="single" defaultValue="all" size="lg" variant="outline" class="mt-3">
      <ToggleGroupItem value="all">All</ToggleGroupItem>
      <ToggleGroupItem value="missed">Missed</ToggleGroupItem>
    </ToggleGroup>
  </>
);`,
      renderPreview: () => (
        <div class="docs-toggle-toolbar-demo docs-toggle-toolbar-demo--wrap">
          <ToggleGroup type="single" defaultValue="all" size="sm" variant="outline">
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="missed">Missed</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" defaultValue="all" size="lg" variant="outline">
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="missed">Missed</ToggleGroupItem>
          </ToggleGroup>
        </div>
      ),
    },
    {
      id: "spacing",
      title: "Spacing",
      text: "Tune the density between items with spacing presets.",
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/kamod-ui/toggle-group";

export const Example = () => (
  <ToggleGroup type="single" defaultValue="top" spacing="lg" variant="outline">
    <ToggleGroupItem value="top">Top</ToggleGroupItem>
    <ToggleGroupItem value="bottom">Bottom</ToggleGroupItem>
    <ToggleGroupItem value="left">Left</ToggleGroupItem>
    <ToggleGroupItem value="right">Right</ToggleGroupItem>
  </ToggleGroup>
);`,
      renderPreview: () => (
        <div class="docs-toggle-toolbar-demo">
          <ToggleGroup type="single" defaultValue="top" spacing="lg" variant="outline">
            <ToggleGroupItem value="top">Top</ToggleGroupItem>
            <ToggleGroupItem value="bottom">Bottom</ToggleGroupItem>
            <ToggleGroupItem value="left">Left</ToggleGroupItem>
            <ToggleGroupItem value="right">Right</ToggleGroupItem>
          </ToggleGroup>
        </div>
      ),
    },
    {
      id: "vertical",
      title: "Vertical",
      text: "Set orientation to vertical for stacked controls.",
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/kamod-ui/toggle-group";

export const Example = () => (
  <ToggleGroup type="single" defaultValue="list" orientation="vertical" variant="outline">
    <ToggleGroupItem value="list">List</ToggleGroupItem>
    <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
    <ToggleGroupItem value="cards">Cards</ToggleGroupItem>
  </ToggleGroup>
);`,
      renderPreview: () => (
        <div class="docs-toggle-toolbar-demo">
          <ToggleGroup type="single" defaultValue="list" orientation="vertical" variant="outline">
            <ToggleGroupItem value="list">List</ToggleGroupItem>
            <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
            <ToggleGroupItem value="cards">Cards</ToggleGroupItem>
          </ToggleGroup>
        </div>
      ),
    },
    {
      id: "disabled",
      title: "Disabled",
      text: "Disable a full group or single items to reflect unavailable actions.",
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/kamod-ui/toggle-group";

export const Example = () => (
  <>
    <ToggleGroup type="single" defaultValue="public" variant="outline">
      <ToggleGroupItem value="public">Public</ToggleGroupItem>
      <ToggleGroupItem value="private">Private</ToggleGroupItem>
      <ToggleGroupItem value="team" disabled>Team</ToggleGroupItem>
    </ToggleGroup>

    <ToggleGroup type="multiple" defaultValue={["mail"]} variant="outline" disabled class="mt-3">
      <ToggleGroupItem value="mail">Mail</ToggleGroupItem>
      <ToggleGroupItem value="push">Push</ToggleGroupItem>
    </ToggleGroup>
  </>
);`,
      renderPreview: () => (
        <div class="docs-toggle-toolbar-demo docs-toggle-toolbar-demo--wrap">
          <ToggleGroup type="single" defaultValue="public" variant="outline">
            <ToggleGroupItem value="public">Public</ToggleGroupItem>
            <ToggleGroupItem value="private">Private</ToggleGroupItem>
            <ToggleGroupItem value="team" disabled>
              Team
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="multiple" defaultValue={["mail"]} variant="outline" disabled>
            <ToggleGroupItem value="mail">Mail</ToggleGroupItem>
            <ToggleGroupItem value="push">Push</ToggleGroupItem>
          </ToggleGroup>
        </div>
      ),
    },
    {
      id: "custom-font-weight",
      title: "Custom Font Weight",
      text: "Use custom item classes to build segmented font-weight selectors.",
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/kamod-ui/toggle-group";

export const Example = () => (
  <ToggleGroup type="single" defaultValue="normal" variant="pill" class="rounded-full">
    <ToggleGroupItem value="light" class="font-light">Aa Light</ToggleGroupItem>
    <ToggleGroupItem value="normal" class="font-normal">Aa Normal</ToggleGroupItem>
    <ToggleGroupItem value="medium" class="font-medium">Aa Medium</ToggleGroupItem>
    <ToggleGroupItem value="bold" class="font-bold">Aa Bold</ToggleGroupItem>
  </ToggleGroup>
);`,
      renderPreview: () => (
        <ToggleGroup type="single" defaultValue="normal" variant="pill" class="rounded-full">
          <ToggleGroupItem value="light" class="font-light">
            Aa Light
          </ToggleGroupItem>
          <ToggleGroupItem value="normal" class="font-normal">
            Aa Normal
          </ToggleGroupItem>
          <ToggleGroupItem value="medium" class="font-medium">
            Aa Medium
          </ToggleGroupItem>
          <ToggleGroupItem value="bold" class="font-bold">
            Aa Bold
          </ToggleGroupItem>
        </ToggleGroup>
      ),
    },
    {
      id: "icon-only",
      title: "Icon Only",
      text: "Build dense, icon-only controls for editor-like toolbars.",
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/kamod-ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-preact";

export const Example = () => (
  <ToggleGroup type="multiple" defaultValue={["bold"]} variant="outline" size="sm">
    <ToggleGroupItem value="bold" aria-label="Toggle bold">
      <Bold class="size-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Toggle italic">
      <Italic class="size-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="underline" aria-label="Toggle underline">
      <Underline class="size-4" />
    </ToggleGroupItem>
  </ToggleGroup>
);`,
      renderPreview: () => (
        <ToggleGroup type="multiple" defaultValue={["bold"]} variant="outline" size="sm">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold class="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic class="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline class="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      ),
    },
    {
      id: "multi-selection",
      title: "Multiple Selection",
      text: "Allow many active options in one modern toolbar group.",
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/kamod-ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-preact";

export const Example = () => (
  <ToggleGroup type="multiple" defaultValue={["bold"]} variant="default">
    <ToggleGroupItem value="bold" aria-label="Toggle bold">
      <Bold class="size-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Toggle italic">
      <Italic class="size-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="underline" aria-label="Toggle underline">
      <Underline class="size-4" />
    </ToggleGroupItem>
  </ToggleGroup>
);`,
      renderPreview: () => (
        <div class="docs-toggle-toolbar-demo">
          <ToggleGroup type="multiple" defaultValue={["bold"]}>
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold class="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic class="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline class="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      ),
    },
    {
      id: "pill-style",
      title: "Pill Style",
      text: 'Use `variant="pill"` for a modern, chip-like segmented control.',
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/kamod-ui/toggle-group";

export const Example = () => (
  <ToggleGroup type="single" defaultValue="week" variant="pill" class="rounded-full">
    <ToggleGroupItem value="day">Day</ToggleGroupItem>
    <ToggleGroupItem value="week">Week</ToggleGroupItem>
    <ToggleGroupItem value="month">Month</ToggleGroupItem>
  </ToggleGroup>
);`,
      renderPreview: () => (
        <ToggleGroup type="single" defaultValue="week" variant="pill" class="rounded-full">
          <ToggleGroupItem value="day">Day</ToggleGroupItem>
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
      ),
    },
    {
      id: "controlled",
      title: "Controlled",
      text: "Control selection with external state using `value` and `onValueChange`.",
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/kamod-ui/toggle-group";
import { useState } from "preact/hooks";

export const Example = () => {
  const [value, setValue] = useState("list");
  const handleValueChange = (next) => {
    if (typeof next === "string") setValue(next);
  };

  return (
    <>
      <ToggleGroup type="single" value={value} onValueChange={handleValueChange} variant="outline">
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="cards">Cards</ToggleGroupItem>
      </ToggleGroup>
      <p>Current value: {value}</p>
    </>
  );
};`,
      renderPreview: () => <ControlledToggleGroupPreview />,
    },
    {
      id: "rtl",
      title: "RTL",
      text: 'Use `dir="rtl"` to display Toggle Group correctly in right-to-left layouts.',
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/kamod-ui/toggle-group";

export const Example = () => (
  <div dir="rtl">
    <ToggleGroup type="single" defaultValue="grid" variant="outline">
      <ToggleGroupItem value="list">List</ToggleGroupItem>
      <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      <ToggleGroupItem value="cards">Cards</ToggleGroupItem>
    </ToggleGroup>
  </div>
);`,
      renderPreview: () => (
        <div dir="rtl">
          <ToggleGroup type="single" defaultValue="grid" variant="outline">
            <ToggleGroupItem value="list">List</ToggleGroupItem>
            <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
            <ToggleGroupItem value="cards">Cards</ToggleGroupItem>
          </ToggleGroup>
        </div>
      ),
    },
  ],
  apiRows: [
    { prop: "type", type: '"single" | "multiple"', defaultValue: '"single"' },
    { prop: "value / defaultValue", type: "string | string[]", defaultValue: "undefined" },
    {
      prop: "onValueChange",
      type: "(value: string | string[]) => void",
      defaultValue: "undefined",
    },
    { prop: "variant", type: '"default" | "outline" | "pill"', defaultValue: '"default"' },
    { prop: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"' },
    { prop: "spacing", type: '"none" | "sm" | "default" | "lg"', defaultValue: '"sm"' },
    { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
  ],
  accessibilityText:
    "Use clear labels for each option and ensure selected state is perceivable with more than color alone.",
});
