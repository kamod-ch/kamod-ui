import { createGenericDocPage } from "./create-generic-doc-page";
import {
  PersistedLayoutExample,
  VerticalResizableDemo,
  WorkbenchResizableDemo,
} from "./resizable-demo";

const BASIC_SNIPPET = `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/kamod-ui/resizable";

export const Example = ({ sizes, onSizesChange }) => (
  <ResizablePanelGroup
    sizes={sizes}
    onSizesChange={onSizesChange}
    defaultSizes={[20, 50, 30]}
    class="h-full w-full"
  >
    <ResizablePanel id="tree" minSize={15} maxSize={35}>...</ResizablePanel>
    <ResizableHandle label="Resize tree and editor" />
    <ResizablePanel id="editor" minSize={35}>...</ResizablePanel>
    <ResizableHandle />
    <ResizablePanel id="detail" minSize={18}>...</ResizablePanel>
  </ResizablePanelGroup>
);`;

export const resizableDocPage = createGenericDocPage({
  title: "Resizable Panels",
  slug: "resizable",
  usageLabel: "Resizable Panels",
  previewCode: BASIC_SNIPPET,
  installationText:
    'Import from `@kamod-ch/ui/resizable`. Public sizes use **percent of the group axis** (`0–100`, sum = 100) — `RESIZABLE_SIZE_UNIT` is `"percent"`. SSR renders the same default percentages; listeners attach after mount.',
  usageText:
    "Alternate `ResizablePanel` and `ResizableHandle` children (handles count = panels − 1). Pointer drags use pointer capture, affect only adjacent panels, and base calculations on the group container — not the viewport. Horizontal groups mirror drag/keyboard direction in RTL via `DirectionProvider` or the optional `dir` prop. Collapse is intentionally deferred in v1 until size/focus rules are fully specified.",
  installationExample: {
    code: `import { WorkbenchResizableDemo } from "./resizable-demo";

export const Example = () => <WorkbenchResizableDemo />;`,
    renderPreview: () => <WorkbenchResizableDemo />,
  },
  exampleSections: [
    {
      id: "workbench",
      title: "File tree · editor · detail",
      text: "Three-panel horizontal workbench with min/max constraints and labeled handles.",
      code: `import { WorkbenchResizableDemo } from "./resizable-demo";

export const Example = () => <WorkbenchResizableDemo />;`,
      renderPreview: () => <WorkbenchResizableDemo />,
    },
    {
      id: "vertical",
      title: "Vertical split",
      text: "Nested-friendly vertical group — e.g. preview over console output.",
      code: `import { VerticalResizableDemo } from "./resizable-demo";

export const Example = () => <VerticalResizableDemo />;`,
      renderPreview: () => <VerticalResizableDemo />,
    },
    {
      id: "persistence",
      title: "Consumer persistence (optional)",
      text: "Persist `onSizesChange` values yourself — the primitive performs no storage I/O.",
      code: `import { PersistedLayoutExample } from "./resizable-demo";

export const Example = () => <PersistedLayoutExample />;`,
      renderPreview: () => <PersistedLayoutExample />,
    },
  ],
  apiRows: [
    { prop: "sizes / onSizesChange", type: "number[] (percent)", defaultValue: "controlled" },
    { prop: "defaultSizes", type: "number[]", defaultValue: "even split" },
    { prop: "direction", type: "horizontal | vertical", defaultValue: "horizontal" },
    { prop: "ResizablePanel.minSize/maxSize", type: "percent", defaultValue: "0 / 100" },
    { prop: "keyboardStep", type: "percent", defaultValue: "1" },
    { prop: "dir", type: "ltr | rtl", defaultValue: "from DirectionProvider" },
  ],
  accessibilityText:
    "Each handle is a focusable separator with orientation, aria-valuemin/max/now (% of the leading panel), arrow-key resize, and Home/End for pair extremes. Drag temporarily disables text selection and restores it afterward.",
});
