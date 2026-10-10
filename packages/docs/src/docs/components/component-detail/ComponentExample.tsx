import { CodeIcon, EyeIcon, SparklesIcon } from "@kamod-ch/icons/lucide";
import { ArrowsMaximizeIcon, ArrowsMinimizeIcon } from "@kamod-ch/icons/tabler/outline";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from "@kamod-ch/ui";
import { lazy, Suspense } from "preact/compat";
import { useState } from "preact/hooks";
import { PreviewAppearanceControls } from "../../../blocks/PreviewAppearanceControls";
import { PreviewRefreshControl } from "../../../blocks/PreviewRefreshControl";
import { ShowcaseHeading } from "../../../blocks/ShowcaseHeading";
import { usePreviewRefresh } from "../../../blocks/usePreviewRefresh";
import type { DocPageModule } from "../../types";
import { BrandText } from "../brand/BrandText";
import { ShowcaseLoading } from "../ShowcaseLoading";
import { ComponentExampleLinks } from "./ComponentExampleLinks";
import { ComponentPreviewFrame } from "./ComponentPreviewFrame";
import { componentSourceUrl } from "./component-guidance";
import { useComponentPreview } from "./useComponentPreview";

const ComponentExampleCode = lazy(() =>
  import("./ComponentExampleCode").then(({ ComponentExampleCode }) => ({
    default: ComponentExampleCode,
  })),
);
const ComponentExamplePrompt = lazy(() =>
  import("./ComponentExamplePrompt").then(({ ComponentExamplePrompt }) => ({
    default: ComponentExamplePrompt,
  })),
);

/** Shared controls and isolated previews for every component and Formisch example. */
export function ComponentExample({
  doc,
  index,
  codeSnippet,
  filePath,
}: {
  doc: DocPageModule;
  index: number;
  codeSnippet: string;
  filePath: string;
}) {
  const { stage, canConstrain, appearance, setAppearance } = useComponentPreview();
  const showcaseId = `${doc.slug}-example-${index + 1}-showcase`;
  const [narrow, setNarrow] = useState(false);
  const { previewKey: revision, phase, refresh, complete, cancel } = usePreviewRefresh();
  return (
    <>
      <div
        id={index === 0 ? "component-preview" : undefined}
        class="component-preview-intro"
        tabIndex={index === 0 ? -1 : undefined}
      >
        <ShowcaseHeading href={`#${showcaseId}`} />
        <ComponentExampleLinks slug={doc.slug} title={doc.title} index={index} />
      </div>
      <div id={showcaseId} class="blocks-showcase component-example">
        <div ref={stage} class="component-example-size-probe" aria-hidden="true" />
        <Tabs defaultValue="preview" class="blocks-showcase-tabs">
          <div class="blocks-showcase-toolbar">
            <TabsList variant="line" class="blocks-showcase-segmented" aria-label="Example view">
              <TabsTrigger value="preview" aria-label="Preview" title="Preview">
                <EyeIcon aria-hidden="true" />
                <span class="blocks-showcase-control-label">Preview</span>
              </TabsTrigger>
              <TabsTrigger value="code" aria-label="Code" title="Code">
                <CodeIcon aria-hidden="true" />
                <span class="blocks-showcase-control-label">Code</span>
              </TabsTrigger>
              <TabsTrigger value="prompt" aria-label="Prompt" title="Prompt">
                <SparklesIcon aria-hidden="true" />
                <span class="blocks-showcase-control-label">Prompt</span>
              </TabsTrigger>
            </TabsList>
            <div class="blocks-showcase-segmented component-example-controls">
              <div
                class="blocks-showcase-segmented component-example-actions"
                role="group"
                aria-label="Example controls"
              >
                <ToggleGroup
                  type="single"
                  value={narrow && canConstrain ? "narrow" : "full"}
                  onValueChange={(value) => {
                    if (value) setNarrow(value === "narrow");
                  }}
                  class="component-example-width-controls blocks-preview-viewport-switcher"
                  aria-label="Example container width"
                  aria-orientation={undefined}
                >
                  <ToggleGroupItem
                    class="docs-icon-button"
                    value="narrow"
                    aria-label="Narrow container"
                    disabled={!canConstrain}
                    title={
                      canConstrain
                        ? "Constrain the example to a 360px container"
                        : "The available preview space is already 360px or narrower"
                    }
                  >
                    <ArrowsMinimizeIcon aria-hidden="true" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    class="docs-icon-button"
                    value="full"
                    aria-label="Full container width"
                    title="Use the available container width"
                  >
                    <ArrowsMaximizeIcon aria-hidden="true" />
                  </ToggleGroupItem>
                </ToggleGroup>
                <PreviewRefreshControl action="reset" phase={phase} onRefresh={refresh} />
              </div>
              <PreviewAppearanceControls value={appearance} onChange={setAppearance} />
            </div>
          </div>
          <TabsContent value="preview">
            <div class="component-example-stage" aria-busy={phase === "loading"}>
              <div
                class="component-example-frame-wrap"
                data-narrow={(narrow && canConstrain) || undefined}
              >
                <ComponentPreviewFrame
                  key={revision}
                  slug={doc.slug}
                  index={index}
                  title={doc.title}
                  appearance={appearance}
                  previewKey={revision}
                  onLoad={complete}
                  onCancel={cancel}
                />
              </div>
            </div>
            <div class="component-example-caption">
              <span class="component-example-caption-text">
                <BrandText>
                  Live Preact example <span aria-hidden="true">·</span> Local preview theme{" "}
                  <span class="component-example-width-note">
                    · Responsive styles follow the preview width
                  </span>
                </BrandText>
              </span>
            </div>
          </TabsContent>
          <TabsContent value="code" class="blocks-showcase-source component-example-source">
            <Suspense
              fallback={<ShowcaseLoading appearance={appearance} view="code" detail={filePath} />}
            >
              <ComponentExampleCode code={codeSnippet} filePath={filePath} />
            </Suspense>
          </TabsContent>
          <TabsContent value="prompt" class="blocks-showcase-prompt">
            <Suspense fallback={<ShowcaseLoading appearance={appearance} view="prompt" />}>
              <ComponentExamplePrompt
                appearance={appearance}
                context={{
                  title: doc.title,
                  description: doc.usageLabel,
                  command: doc.command,
                  documentationUrl: `https://ui.kamod.ch/docs/${doc.slug}/installation`,
                  sourceUrl: componentSourceUrl(doc.slug),
                  filePath,
                  codeSnippet,
                }}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
