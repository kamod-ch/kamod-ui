import { CodeIcon, EyeIcon, RefreshCwIcon } from "@kamod-ch/icons/lucide";
import { ArrowsMaximizeIcon, ArrowsMinimizeIcon } from "@kamod-ch/icons/tabler/outline";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ThemeToggle,
  ToggleGroup,
  ToggleGroupItem,
} from "@kamod-ch/ui";
import { useTabs } from "@kamod-ch/ui/tabs";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { CodeBlock } from "../CodeBlock";

function ResetExample({ onReset }: { onReset: () => void }) {
  const { setValue } = useTabs();
  return (
    <Button
      type="button"
      variant="ghost"
      class="blocks-showcase-control"
      aria-label="Reset example"
      title="Reset this example to its initial state"
      onClick={() => {
        onReset();
        setValue("preview");
      }}
    >
      <RefreshCwIcon aria-hidden="true" />
      <span class="blocks-showcase-control-label component-example-reset-label">Reset</span>
    </Button>
  );
}

/** A container-size preview, not an iframe: overlays and responsive utilities retain the page viewport. */
export function ComponentExample({
  preview,
  codeSnippet,
  previewClass,
  filePath,
}: {
  preview: ComponentChildren;
  codeSnippet: string;
  previewClass?: string;
  filePath: string;
}) {
  const [narrow, setNarrow] = useState(false);
  const [revision, setRevision] = useState(0);
  return (
    <div class="blocks-showcase component-example">
      <Tabs defaultValue="preview" class="blocks-showcase-tabs">
        <div class="blocks-showcase-toolbar">
          <div class="blocks-showcase-views">
            <TabsList class="blocks-showcase-segmented" aria-label="Example view">
              <TabsTrigger value="preview" aria-label="Preview" title="Preview">
                <EyeIcon aria-hidden="true" />
                <span class="blocks-showcase-control-label">Preview</span>
              </TabsTrigger>
              <TabsTrigger value="code" aria-label="Code" title="Code">
                <CodeIcon aria-hidden="true" />
                <span class="blocks-showcase-control-label">Code</span>
              </TabsTrigger>
            </TabsList>
            <ResetExample onReset={() => setRevision((value) => value + 1)} />
          </div>
          <div class="blocks-showcase-settings">
            <ToggleGroup
              type="single"
              value={narrow ? "narrow" : "full"}
              onValueChange={(value) => {
                if (value) setNarrow(value === "narrow");
              }}
              class="blocks-showcase-segmented"
              aria-label="Example container width"
            >
              <ToggleGroupItem
                value="narrow"
                aria-label="Narrow container"
                title="Constrain the example to a 360px container"
              >
                <ArrowsMinimizeIcon aria-hidden="true" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="full"
                aria-label="Full container width"
                title="Use the available container width"
              >
                <ArrowsMaximizeIcon aria-hidden="true" />
              </ToggleGroupItem>
            </ToggleGroup>
            <ThemeToggle
              class="blocks-showcase-control"
              aria-label="Toggle page color scheme"
              title="Switch the page and its examples between light and dark"
            />
          </div>
        </div>
        <TabsContent value="preview">
          <div class="component-example-stage">
            <div
              key={revision}
              class={`preview component-example-canvas ${previewClass ?? ""}`}
              data-narrow={narrow || undefined}
            >
              {preview}
            </div>
          </div>
          <p class="component-example-caption">
            Live Preact example <span aria-hidden="true">·</span> Uses the page theme{" "}
            <span class="component-example-width-note">
              · Container width; viewport breakpoints are unchanged
            </span>
          </p>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock code={codeSnippet} language="tsx" filePath={filePath} />
        </TabsContent>
      </Tabs>
      <span class="sr-only" role="status">
        {revision ? `Example reset ${revision} ${revision === 1 ? "time" : "times"}.` : ""}
      </span>
    </div>
  );
}
