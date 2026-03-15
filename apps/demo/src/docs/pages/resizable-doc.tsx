import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const resizableDocPage = createGenericDocPage({
  slug: "resizable",
  title: "Resizable",
  usageLabel: "shadcn-style resizable panel primitives for modern split layouts.",
  installationText:
    "Resizable is part of `@kamod-ui/core` (no extra install step beyond the package). Import `ResizablePanelGroup`, `ResizablePanel`, and `ResizableHandle` from `@kamod-ui/core`.",
  usageText:
    "Use `direction` on `ResizablePanelGroup` to switch between horizontal and vertical layouts. Place `ResizableHandle` between adjacent panels. For a more visible grab affordance, pass `withHandle` on the handle.",
  exampleSections: [
    {
      id: "horizontal-panels",
      title: "Horizontal Panels",
      text: "Default setup for editor/sidebar layouts.",
      code: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kamod-ui/core";

export const Example = () => (
  <ResizablePanelGroup direction="horizontal" class="min-h-56">
    <ResizablePanel defaultSize={25} class="docs-resizable-panel">
      <div class="docs-resizable-panel__inner">One</div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={75} class="docs-resizable-panel">
      <div class="docs-resizable-panel__inner">Two</div>
    </ResizablePanel>
  </ResizablePanelGroup>
);`,
      renderPreview: () => (
        <ResizablePanelGroup direction="horizontal" class="min-h-56 w-full">
          <ResizablePanel defaultSize={25} class="docs-resizable-panel">
            <div class="docs-resizable-panel__inner">One</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75} class="docs-resizable-panel">
            <div class="docs-resizable-panel__inner">Two</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
    },
    {
      id: "vertical-panels",
      title: "Vertical Panels",
      text: "Stacked split view for logs or inspector layouts.",
      code: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kamod-ui/core";

export const Example = () => (
  <ResizablePanelGroup direction="vertical" class="min-h-64">
    <ResizablePanel defaultSize={60} class="docs-resizable-panel">
      <div class="docs-resizable-panel__inner">Header</div>
    </ResizablePanel>
    <ResizableHandle orientation="horizontal" />
    <ResizablePanel defaultSize={40} class="docs-resizable-panel">
      <div class="docs-resizable-panel__inner">Content</div>
    </ResizablePanel>
  </ResizablePanelGroup>
);`,
      renderPreview: () => (
        <ResizablePanelGroup direction="vertical" class="min-h-64 w-full">
          <ResizablePanel defaultSize={60} class="docs-resizable-panel">
            <div class="docs-resizable-panel__inner">Header</div>
          </ResizablePanel>
          <ResizableHandle orientation="horizontal" />
          <ResizablePanel defaultSize={40} class="docs-resizable-panel">
            <div class="docs-resizable-panel__inner">Content</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
    },
    {
      id: "three-column",
      title: "Three Columns",
      text: "A common pattern for navigation + sidebar + main content.",
      code: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kamod-ui/core";

export const Example = () => (
  <ResizablePanelGroup direction="horizontal" class="min-h-56">
    <ResizablePanel defaultSize={20} minSize={15} class="docs-resizable-panel">
      <div class="docs-resizable-panel__inner">One</div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={30} minSize={20} class="docs-resizable-panel">
      <div class="docs-resizable-panel__inner">Two</div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={50} minSize={30} class="docs-resizable-panel">
      <div class="docs-resizable-panel__inner">Three</div>
    </ResizablePanel>
  </ResizablePanelGroup>
);`,
      renderPreview: () => (
        <ResizablePanelGroup direction="horizontal" class="min-h-56 w-full">
          <ResizablePanel defaultSize={20} minSize={15} class="docs-resizable-panel">
            <div class="docs-resizable-panel__inner">One</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30} minSize={20} class="docs-resizable-panel">
            <div class="docs-resizable-panel__inner">Two</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={30} class="docs-resizable-panel">
            <div class="docs-resizable-panel__inner">Three</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
    },
    {
      id: "handle-with-handle",
      title: "Handle",
      text: "Use `withHandle` to render a visible grab affordance.",
      code: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kamod-ui/core";

export const Example = () => (
  <ResizablePanelGroup direction="horizontal" class="min-h-56">
    <ResizablePanel defaultSize={25} class="docs-resizable-panel">
      <div class="docs-resizable-panel__inner">Sidebar</div>
    </ResizablePanel>
    <ResizableHandle withHandle />
    <ResizablePanel defaultSize={75} class="docs-resizable-panel">
      <div class="docs-resizable-panel__inner">Content</div>
    </ResizablePanel>
  </ResizablePanelGroup>
);`,
      renderPreview: () => (
        <ResizablePanelGroup direction="horizontal" class="min-h-56 w-full">
          <ResizablePanel defaultSize={25} class="docs-resizable-panel">
            <div class="docs-resizable-panel__inner">Sidebar</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75} class="docs-resizable-panel">
            <div class="docs-resizable-panel__inner">Content</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
    }
  ],
  apiRows: [
    { prop: "direction", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
    { prop: "defaultSize", type: "number | string", defaultValue: "undefined" },
    { prop: "minSize / maxSize", type: "number | string", defaultValue: "undefined" },
    { prop: "withHandle", type: "boolean", defaultValue: "false" },
    { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"vertical"' }
  ],
  accessibilityText:
    "Resize handles are focusable separators and show a visible focus ring. For full keyboard resizing support, pair with a library like `react-resizable-panels` (shadcn-style) or implement pointer handlers for production use."
});
