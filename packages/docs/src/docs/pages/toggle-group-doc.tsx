import { ToggleGroup, ToggleGroupItem } from "@kamod-ch/ui";
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
      text: "**Use One Value to Describe the Current Mode.** Use single selection when the options represent alternative views or settings within one question. Each `ToggleGroupItem` value identifies a choice, and the selected presentation lets the reader see which one is currently active.\n\nDecide whether an empty selection is acceptable and handle it deliberately, keep item values stable, and use radios when the surrounding form's question is better expressed as a standard exclusive choice.",
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
      text: "**Choose a Density that Fits the Labels.** Choose a compact or larger group size to match adjacent controls and the available label space. Apply one consistent scale to the local set of choices instead of resizing individual segments independently.\n\nCheck the longest translation and icon combination before shrinking the group, and maintain enough spacing around it for comfortable touch interaction.",
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
      text: "**Tune the Relationship between Choices.** Use the group's spacing options to tune how closely its choices sit together. A tight arrangement emphasizes their relationship, while more separation can help longer labels remain readable without changing their selection behavior.\n\nKeep related groups visually consistent and avoid using spacing alone to explain whether the selection is exclusive or multiple.",
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
      text: '**Stack Choices When the Container Is Narrow.** Set `orientation="vertical"` when the choices form a short stack alongside content. The layout still represents one related selection group, so its labels and focus order should remain understandable from top to bottom.\n\nKeep labels aligned and meaningful, verify keyboard movement for the chosen orientation and avoid changing the order simply to fit the visual layout.',
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
      text: "**Keep Unavailable Choices Understandable.** Disable the whole group when the setting is unavailable, or individual items when only some choices are restricted. Keep those choices in context and explain any prerequisite that users can act on.\n\nIf the whole group is disabled, keep its current value readable and make clear whether it is a temporary pending state or a lasting restriction.",
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
      text: "**Preview a Choice without Losing Legibility.** Apply custom item classes to preview different font weights within a segmented selector. Store a stable value for the chosen weight, letting the visible typography illustrate the option without becoming the data model itself.\n\nKeep the stored values separate from the visual sample and make selected state distinct from the weight itself.",
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
      text: "**Name Every Mode Explicitly.** Use icon-only items for a compact editor-style toolbar when the symbols are recognizable. Provide an accessible name for every choice and consider a [Tooltip](/docs/tooltip/installation) when the icon's meaning benefits from a short explanation.\n\nChoose symbols that distinguish the options, preserve pressed and focus states, and avoid relying on subtle icon differences that become ambiguous at compact sizes.",
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
      text: "**Allow a Combination Only When It Has Meaning.** Use multiple selection when several formatting options can be active together. Treat the selected values as one collection so external controls and the content being formatted reflect the same combination of choices.\n\nKeep the selected collection synchronized with the application, handle clearing deliberately and make it clear that activating one item does not automatically replace the others.",
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
      text: '**Use Shape to Support a Lightweight Set of Choices.** Set `variant="pill"` for rounded segments with a chip-like appearance. This changes the group\'s silhouette while its selection mode and values continue to define whether the options are exclusive or independently selectable.\n\nKeep the pressed state visible in both themes and preserve the same selection semantics as other variants; a change in silhouette should not imply a different behavior.',
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
      text: "**Keep Selection Owned by the Feature It Changes.** Pass `value` and update it through `onValueChange` when another part of the interface needs the selected options. The group then renders parent-owned state rather than maintaining a second copy of the same preference.\n\nForward changes to the same state source, distinguish single values from multiple selections, and test updates made outside the group as well as direct activation.",
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
      text: '**Check the Whole Pattern in Its Reading Direction.** Set `dir="rtl"` for a group used in a right-to-left interface. Check the option order and any directional icons together, keeping the meaning of the selected value consistent across translated presentations.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.',
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
