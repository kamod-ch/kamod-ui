import { Toggle } from "@kamod-ch/ui";
import { Bold, Italic, Underline } from "lucide-preact";
import { createGenericDocPage } from "./create-generic-doc-page";

export const toggleDocPage = createGenericDocPage({
  slug: "toggle",
  title: "Toggle",
  usageLabel:
    "Toggle controls a binary pressed/unpressed state with modern Radix-style variants and sizes.",
  installationText: "Import Toggle from `@/components/kamod-ui/toggle`.",
  usageText:
    "Use `variant`, `size`, and controlled state props to match toolbar and settings use-cases.",
  exampleSections: [
    {
      id: "basic-toggle",
      title: "Basic Toggle",
      text: "**Represent a Persistent on/off Choice.** Use `Toggle` for a boolean pressed state, such as an active formatting option. An initial pressed value establishes the starting presentation, while subsequent changes should represent a persistent choice rather than a one-time command.\n\nKeep its accessible name stable enough to understand the state and connect the pressed value to the actual feature; use an ordinary [Button](/docs/button/installation) for actions without a retained selection.",
      code: `import { Toggle } from "@/components/kamod-ui/toggle";
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
      ),
    },
    {
      id: "toggle-options",
      title: "Toolbar Actions",
      text: "**Keep Formatting Choices Independently Meaningful.** Arrange related toggles in a formatting toolbar when each button represents an on/off option. If the choices need shared exclusive or multiple selection behavior, compare [Toggle Group](/docs/toggle-group/installation) before assembling separate state handlers.\n\nGive each icon a clear accessible name and keep pressed states synchronized with the edited content rather than only the last pointer interaction.",
      code: `import { Toggle } from "@/components/kamod-ui/toggle";
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
      ),
    },
    {
      id: "variants-and-sizes",
      title: "Variants and Sizes",
      text: "**Match Visual Weight to the Toolbar.** Choose the outline treatment when a toggle needs a more explicit boundary and an icon size when its symbol is sufficient visually. Give icon-only options accessible names that explain the setting they enable or disable.\n\nPreserve a clear pressed state and visible keyboard focus in every combination, and avoid making the active treatment indistinguishable from a hover effect.",
      code: `import { Toggle } from "@/components/kamod-ui/toggle";
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
      ),
    },
  ],
  apiRows: [
    { prop: "defaultPressed", type: "boolean", defaultValue: "false" },
    { prop: "pressed", type: "boolean", defaultValue: "uncontrolled" },
    { prop: "onPressedChange", type: "(next: boolean) => void", defaultValue: "undefined" },
    { prop: "variant", type: '"default" | "outline"', defaultValue: '"default"' },
    { prop: "size", type: '"sm" | "default" | "lg" | "icon"', defaultValue: '"default"' },
  ],
  accessibilityText:
    "Ensure pressed state is visually distinct and use concise labels for screen reader clarity.",
});
