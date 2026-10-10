import {
  ArrowUpRightIcon,
  CodeIcon,
  ComponentIcon,
  ExpandIcon,
  EyeIcon,
  LayersIcon,
  SparklesIcon,
} from "@kamod-ch/icons/lucide";
import { BlocksIcon } from "@kamod-ch/icons/tabler/outline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import { lazy, Suspense } from "preact/compat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { PreviewAppearanceControls } from "../blocks/PreviewAppearanceControls";
import { PreviewRefreshControl } from "../blocks/PreviewRefreshControl";
import { usePreviewRefresh } from "../blocks/usePreviewRefresh";
import { ComponentPreviewFrame } from "../docs/components/component-detail/ComponentPreviewFrame";
import { useComponentPreview } from "../docs/components/component-detail/useComponentPreview";
import { InlineCode } from "../docs/components/PathDisplay";
import { WorkspaceLoading } from "./WorkspaceLoading";

const WorkspaceSource = lazy(() => import("./WorkspaceSource"));
const WorkspacePrompt = lazy(() => import("./WorkspacePrompt"));

/** Shared showcase controls around an isolated, resettable workspace composition. */
export function WorkspaceExample() {
  const { appearance, setAppearance } = useComponentPreview();
  const { previewKey, phase, refresh, complete, cancel } = usePreviewRefresh();
  const [readyKey, setReadyKey] = useState<number | null>(null);
  const previewReady = readyKey === previewKey;
  const onPreviewLoad = useCallback(
    (key: number) => {
      setReadyKey(key);
      complete(key);
    },
    [complete],
  );
  const previewUrl = withBasePath(
    `/component-preview-frame.htm?component=home-workspace&example=0&previewTheme=${appearance.preset}&previewScheme=${appearance.scheme}`,
  );
  return (
    <section
      class="home-workspace blocks-showcase component-example"
      aria-label="Interactive workspace example"
    >
      <div class="home-demo-caption">
        <span>
          <ComponentIcon size={17} strokeWidth={2} aria-hidden="true" /> Component Composition
        </span>
        <span class="home-live-label">
          <i aria-hidden="true" /> Live Preview
        </span>
      </div>
      <Tabs defaultValue="preview" class="blocks-showcase-tabs">
        <div class="blocks-showcase-toolbar">
          <TabsList
            variant="line"
            class="blocks-showcase-segmented"
            aria-label="Workspace example view"
          >
            <TabsTrigger value="preview" aria-label="Preview">
              <EyeIcon aria-hidden="true" />
              <span class="blocks-showcase-control-label">Preview</span>
            </TabsTrigger>
            <TabsTrigger value="code" aria-label="Code">
              <CodeIcon aria-hidden="true" />
              <span class="blocks-showcase-control-label">Code</span>
            </TabsTrigger>
            <TabsTrigger value="prompt" aria-label="Prompt">
              <SparklesIcon aria-hidden="true" />
              <span class="blocks-showcase-control-label">Prompt</span>
            </TabsTrigger>
          </TabsList>
          <div
            class="blocks-showcase-segmented home-workspace-actions"
            role="group"
            aria-label="Example controls"
          >
            <PreviewRefreshControl phase={phase} onRefresh={refresh} />
            <a
              class="docs-icon-button blocks-showcase-control"
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Preview in a New Tab"
            >
              <ExpandIcon aria-hidden="true" />
              <span class="blocks-showcase-control-label">Open</span>
            </a>
          </div>
          <PreviewAppearanceControls value={appearance} onChange={setAppearance} />
        </div>
        <TabsContent value="preview" forceMount>
          <div
            class="home-workspace-preview"
            aria-busy={!previewReady}
            data-loading={!previewReady || undefined}
          >
            <ComponentPreviewFrame
              key={previewKey}
              slug="home-workspace"
              index={0}
              title="Workspace preferences"
              appearance={appearance}
              previewKey={previewKey}
              onLoad={onPreviewLoad}
              onCancel={cancel}
              showLoading={false}
            />
            {!previewReady && <WorkspaceLoading appearance={appearance} view="preview" />}
          </div>
          <div class="home-demo-parts">
            <span class="home-demo-parts-label">
              <BlocksIcon size={16} strokeWidth={2} aria-hidden="true" /> Built With
            </span>
            <nav class="home-demo-parts-links" aria-label="Components used in this preview">
              <InlineCode>Input</InlineCode>
              <span class="home-demo-parts-comma" aria-hidden="true">
                ,
              </span>
              <InlineCode>Switch</InlineCode>
              <span class="home-demo-parts-comma" aria-hidden="true">
                ,
              </span>
              <InlineCode>Button</InlineCode>
            </nav>
          </div>
        </TabsContent>
        <TabsContent value="code" class="home-workspace-source">
          <Suspense fallback={<WorkspaceLoading appearance={appearance} view="code" />}>
            <WorkspaceSource />
          </Suspense>
        </TabsContent>
        <TabsContent value="prompt" class="home-workspace-prompt">
          <Suspense fallback={<WorkspaceLoading appearance={appearance} view="prompt" />}>
            <WorkspacePrompt appearance={appearance} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </section>
  );
}

const ShellShowcase = lazy(() => import("./HomeShellShowcase"));

/** Load the full block tools only as this lower-page section approaches the viewport. */
function HomeShellPreview() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!container.current) return;
    if (
      window.location.hash.startsWith("#application-shell-1") ||
      typeof IntersectionObserver === "undefined"
    ) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const loading = (
    <p class="home-shell-loading" role="status">
      Loading the application shell playground…
    </p>
  );
  return (
    <div ref={container} class="home-shell-showcase">
      {visible ? (
        <Suspense fallback={loading}>
          <ShellShowcase />
        </Suspense>
      ) : (
        loading
      )}
    </div>
  );
}

export function HomeBlockExamples() {
  return (
    <section class="home-block-examples" aria-label="Application shell playground">
      <div class="home-block-toolbar">
        <div class="home-block-heading">
          <strong>
            <LayersIcon size={17} strokeWidth={1.9} aria-hidden="true" />
            Application Shell
          </strong>
          <span class="home-block-heading-context">
            <span aria-hidden="true">·</span>Navigation &amp; Layout
          </span>
        </div>
        <span class="home-live-label">
          <i aria-hidden="true" /> Live Preview
        </span>
      </div>
      <HomeShellPreview />
      <div class="home-block-caption">
        <p>
          A responsive application frame with navigation, account controls and room for your
          feature.
        </p>
        <a href={withBasePath("/blocks/application-shell/application-shell-1")}>
          Explore This Block <ArrowUpRightIcon size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
