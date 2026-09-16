import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kamod-ch/ui/resizable";
import { useState } from "preact/hooks";

const panelClass = "bg-muted/40 text-muted-foreground flex items-start p-3 text-sm leading-relaxed";

export const WorkbenchResizableDemo = () => {
  const [sizes, setSizes] = useState([20, 48, 32]);

  return (
    <div class="border-border h-[420px] w-full max-w-5xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup
        sizes={sizes}
        onSizesChange={setSizes}
        class="h-full w-full"
        aria-label="Workbench layout"
      >
        <ResizablePanel id="files" minSize={15} maxSize={35} class={panelClass}>
          <div class="space-y-1">
            <p class="text-foreground font-medium">Dateibaum</p>
            <ul class="space-y-0.5 text-xs">
              <li>src/App.tsx</li>
              <li>src/components/ResizablePanelGroup.tsx</li>
              <li>src/styles/theme.css</li>
            </ul>
          </div>
        </ResizablePanel>
        <ResizableHandle label="Resize file tree and editor" />
        <ResizablePanel id="editor" minSize={35} class={panelClass}>
          <div class="space-y-2">
            <p class="text-foreground font-medium">Editor</p>
            <pre class="bg-background/80 overflow-auto rounded-md p-2 text-xs">
              {`export const Example = () => (
  <ResizablePanelGroup defaultSizes={[20, 50, 30]}>
    ...
  </ResizablePanelGroup>
);`}
            </pre>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel id="detail" minSize={18} maxSize={40} class={panelClass}>
          <div class="space-y-1">
            <p class="text-foreground font-medium">Detailansicht</p>
            <p>
              Stable panel ids, percent-based sizes (sum = 100), and keyboard-resizable separators.
            </p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export const VerticalResizableDemo = () => (
  <div class="border-border h-[360px] w-full max-w-md overflow-hidden rounded-lg border">
    <ResizablePanelGroup direction="vertical" defaultSizes={[68, 32]} class="h-full w-full">
      <ResizablePanel id="preview" minSize={40} class={panelClass}>
        <p class="text-foreground font-medium">Preview</p>
        <p class="text-xs">Main canvas area with a vertical split below.</p>
      </ResizablePanel>
      <ResizableHandle label="Resize preview and console" />
      <ResizablePanel id="console" minSize={20} class={panelClass}>
        <p class="text-foreground font-medium">Console</p>
        <p class="text-xs">Build output and runtime logs.</p>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);

/** Consumer-owned persistence — not built into the primitive. */
export const PersistedLayoutExample = () => {
  const storageKey = "demo-workbench-sizes";
  const readSizes = (): number[] => {
    if (typeof window === "undefined") return [20, 48, 32];
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (!raw) return [20, 48, 32];
      const parsed = JSON.parse(raw) as number[];
      return Array.isArray(parsed) && parsed.length === 3 ? parsed : [20, 48, 32];
    } catch {
      return [20, 48, 32];
    }
  };

  const [sizes, setSizes] = useState<number[]>(readSizes);

  return (
    <div class="space-y-2">
      <p class="text-muted-foreground text-xs">
        Sizes restore from <code class="text-foreground">sessionStorage</code> after refresh —
        demo-only consumer pattern; the component never writes storage itself.
      </p>
      <div class="border-border h-[320px] overflow-hidden rounded-lg border">
        <ResizablePanelGroup
          sizes={sizes}
          onSizesChange={(next) => {
            setSizes(next);
            window.sessionStorage.setItem(storageKey, JSON.stringify(next));
          }}
          class="h-full w-full"
        >
          <ResizablePanel id="nav" minSize={15} class={panelClass}>
            Navigation
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel id="content" class={panelClass}>
            Content
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel id="meta" minSize={15} class={panelClass}>
            Meta
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
