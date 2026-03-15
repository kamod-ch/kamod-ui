import { Toggle } from "@kamod-ui/core";
import { Bold, Italic, Underline } from "lucide-preact";
import { createGenericDocPage } from "./create-generic-doc-page";

export const toggleDocPage = createGenericDocPage({
  slug: "toggle",
  title: "Toggle",
  usageLabel: "Toggle controls a binary pressed/unpressed state with modern Radix-style variants and sizes.",
  installationText: "Import Toggle from @kamod-ui/core.",
  usageText: "Use `variant`, `size`, and controlled state props to match toolbar and settings use-cases.",
  exampleSections: [
    {
      id: "basic-toggle",
      title: "Basic Toggle",
      text: "A compact default toggle with an initial pressed state.",
      code: `import { Toggle } from "@kamod-ui/core";
import { Bold } from "lucide-preact";

export const Example = () => (
  <Toggle defaultPressed aria-label="Toggle bold">
    <Bold class="size-4" />
  </Toggle>
);`,
      renderPreview: () => (
        <div class="docs-toggle-toolbar-demo">
          <Toggle defaultPressed aria-label="Toggle bold">
            <Bold class="size-4" />
          </Toggle>
        </div>
      )
    },
    {
      id: "toggle-options",
      title: "Toolbar Actions",
      text: "Render grouped actions in a compact, modern formatting toolbar.",
      code: `import { Toggle } from "@kamod-ui/core";
import { Bold, Italic, Underline } from "lucide-preact";

export const Example = () => (
  <div class="flex items-center gap-2">
    <Toggle defaultPressed aria-label="Toggle bold">
      <Bold class="size-4" />
    </Toggle>
    <Toggle aria-label="Toggle italic">
      <Italic class="size-4" />
    </Toggle>
    <Toggle aria-label="Toggle underline">
      <Underline class="size-4" />
    </Toggle>
  </div>
);`,
      renderPreview: () => (
        <div class="docs-toggle-toolbar-demo">
          <Toggle defaultPressed aria-label="Toggle bold">
            <Bold class="size-4" />
          </Toggle>
          <Toggle aria-label="Toggle italic">
            <Italic class="size-4" />
          </Toggle>
          <Toggle aria-label="Toggle underline">
            <Underline class="size-4" />
          </Toggle>
        </div>
      )
    },
    {
      id: "variants-and-sizes",
      title: "Variants and Sizes",
      text: "Use `outline` for elevated surfaces and `icon` size for compact controls.",
      code: `import { Toggle } from "@kamod-ui/core";
import { Bold, Underline } from "lucide-preact";

export const Example = () => (
  <div class="flex flex-wrap items-center gap-2">
    <Toggle variant="default" size="sm" defaultPressed>
      Small
    </Toggle>
    <Toggle variant="outline">Default</Toggle>
    <Toggle variant="outline" size="lg">Large</Toggle>
    <Toggle variant="outline" size="icon" aria-label="Toggle bold">
      <Bold class="size-4" />
    </Toggle>
    <Toggle variant="outline" size="icon" aria-label="Toggle underline">
      <Underline class="size-4" />
    </Toggle>
  </div>
);`,
      renderPreview: () => (
        <div class="docs-toggle-toolbar-demo docs-toggle-toolbar-demo--wrap">
          <Toggle variant="default" size="sm" defaultPressed>
            Small
          </Toggle>
          <Toggle variant="outline">Default</Toggle>
          <Toggle variant="outline" size="lg">
            Large
          </Toggle>
          <Toggle variant="outline" size="icon" aria-label="Toggle bold">
            <Bold class="size-4" />
          </Toggle>
          <Toggle variant="outline" size="icon" aria-label="Toggle underline">
            <Underline class="size-4" />
          </Toggle>
        </div>
      )
    }
  ],
  apiRows: [
    { prop: "defaultPressed", type: "boolean", defaultValue: "false" },
    { prop: "pressed", type: "boolean", defaultValue: "uncontrolled" },
    { prop: "onPressedChange", type: "(next: boolean) => void", defaultValue: "undefined" },
    { prop: "variant", type: '"default" | "outline"', defaultValue: '"default"' },
    { prop: "size", type: '"sm" | "default" | "lg" | "icon"', defaultValue: '"default"' }
  ],
  accessibilityText: "Ensure pressed state is visually distinct and use concise labels for screen reader clarity."
});
