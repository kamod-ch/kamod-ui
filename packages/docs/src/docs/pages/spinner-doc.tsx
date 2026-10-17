import { Button, Spinner } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const spinnerDocPage = createGenericDocPage({
  slug: "spinner",
  title: "Spinner",
  usageLabel: "Spinner communicates async progress without blocking context.",
  installationText: "Import Spinner from `@/components/kamod-ui/spinner`.",
  usageText:
    "Use Spinner for loading buttons, surfaces, and inline status updates with short descriptive copy.",
  exampleSections: [
    {
      id: "basic-spinner",
      title: "Default",
      text: "**Communicate Activity Alongside Readable Context.** Place `Spinner` beside a concise loading message for work that is in progress but has no useful percentage. The rotating indicator supplies visual feedback while the text identifies what the application is doing.\n\nPair it with a useful status label, remove it when the task completes and provide a clear failure state instead of leaving motion running indefinitely.",
      code: `import { Spinner } from "@/components/kamod-ui/spinner";

export const Example = () => (
  <div class="docs-spinner-center">
    <Spinner />
  </div>
);`,
      renderPreview: () => (
        <div class="docs-spinner-center">
          <Spinner />
        </div>
      ),
    },
    {
      id: "spinner-sizes",
      title: "Sizes",
      text: "**Match the Indicator to the Surrounding Control.** Choose a spinner size that aligns with the adjacent text or control rather than the overall page heading. Comparing sizes in context keeps the loading indicator recognizable without allowing it to overpower a small action label.\n\nKeep the accompanying text readable and avoid enlarging the graphic so much that it becomes more prominent than the task explanation.",
      code: `import { Spinner } from "@/components/kamod-ui/spinner";

export const Example = () => (
  <div class="docs-spinner-row">
    <div class="docs-spinner-chip"><Spinner size="xs" />xs</div>
    <div class="docs-spinner-chip"><Spinner size="sm" />sm</div>
    <div class="docs-spinner-chip"><Spinner size="md" />md</div>
    <div class="docs-spinner-chip"><Spinner size="lg" />lg</div>
    <div class="docs-spinner-chip"><Spinner size="xl" />xl</div>
  </div>
);`,
      renderPreview: () => (
        <div class="docs-spinner-row">
          <div class="docs-spinner-chip">
            <Spinner size="xs" />
            xs
          </div>
          <div class="docs-spinner-chip">
            <Spinner size="sm" />
            sm
          </div>
          <div class="docs-spinner-chip">
            <Spinner size="md" />
            md
          </div>
          <div class="docs-spinner-chip">
            <Spinner size="lg" />
            lg
          </div>
          <div class="docs-spinner-chip">
            <Spinner size="xl" />
            xl
          </div>
        </div>
      ),
    },
    {
      id: "spinner-tones",
      title: "Tones",
      text: "**Choose Emphasis According to the Loading Context.** Use the spinner's tone options to match a quiet inline status or a more prominent loading region. Its color should complement the surrounding surface while the message still explains the operation independently of that visual emphasis.\n\nCheck contrast against the actual surface and keep a text status available; changing color does not explain the operation or its result.",
      code: `import { Spinner } from "@/components/kamod-ui/spinner";

export const Example = () => (
  <div class="docs-spinner-row">
    <div class="docs-spinner-chip"><Spinner tone="default" />default</div>
    <div class="docs-spinner-chip"><Spinner tone="muted" />muted</div>
    <div class="docs-spinner-chip"><Spinner tone="primary" />primary</div>
  </div>
);`,
      renderPreview: () => (
        <div class="docs-spinner-row">
          <div class="docs-spinner-chip">
            <Spinner tone="default" />
            default
          </div>
          <div class="docs-spinner-chip">
            <Spinner tone="muted" />
            muted
          </div>
          <div class="docs-spinner-chip">
            <Spinner tone="primary" />
            primary
          </div>
        </div>
      ),
    },
    {
      id: "spinner-in-buttons",
      title: "Buttons",
      text: "**Keep the Action Recognizable While It Runs.** Combine `Spinner` with a pending button label and disabled state during an asynchronous action. Drive all three from the same operation so the visual feedback and protection against repeated activation begin and end together.\n\nRestore a usable action after failure and communicate the result separately; the spinner should not be the only evidence that anything happened.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Spinner } from "@/components/kamod-ui/spinner";

export const Example = () => (
  <div class="flex flex-wrap items-center gap-3">
    <Button disabled>
      <Spinner size="sm" data-icon="inline-start" />
      Loading...
    </Button>
    <Button disabled variant="outline">
      Please wait
      <Spinner size="sm" data-icon="inline-end" />
    </Button>
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-wrap items-center gap-3">
          <Button disabled>
            <Spinner size="sm" data-icon="inline-start" />
            Loading...
          </Button>
          <Button disabled variant="outline">
            Please wait
            <Spinner size="sm" data-icon="inline-end" />
          </Button>
        </div>
      ),
    },
    {
      id: "spinner-loading-surface",
      title: "Loading Surface",
      text: "**Explain Longer Waits without Overwhelming the Page.** Place a spinner in a dedicated status region when work lasts long enough to need an explanation. Include what is happening and any useful next step, rather than filling the larger surface with an indicator alone.\n\nKeep unrelated controls available when safe, cancel application-owned work on cleanup where appropriate and replace the loading surface with a clear result.",
      code: `import { Spinner } from "@/components/kamod-ui/spinner";

export const Example = () => (
  <div class="flex min-h-28 w-full max-w-md items-start gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
    <Spinner size="md" tone="primary" class="mt-0.5" />
    <div class="space-y-1">
      <p class="text-sm font-medium">Deploy in progress</p>
      <p class="text-xs text-muted-foreground">Packaging assets and publishing your latest release.</p>
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="flex min-h-28 w-full max-w-md items-start gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
          <Spinner size="md" tone="primary" class="mt-0.5" />
          <div class="space-y-1">
            <p class="text-sm font-medium">Deploy in Progress</p>
            <p class="text-xs text-muted-foreground">
              Packaging assets and publishing your latest release.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "spinner-overlay",
      title: "Loading Overlay",
      text: "**Block Interaction Only When the Task Requires It.** Use a spinner with a subtle backdrop only when the pending transition genuinely blocks the covered region. The surrounding state should explain why controls are unavailable and restore their use when the operation resolves.\n\nKeep focus behavior deliberate, avoid hiding the only cancellation route and remove the blocking state on failure as well as success.",
      code: `import { Spinner } from "@/components/kamod-ui/spinner";

export const Example = () => (
  <div class="docs-spinner-overlay relative grid min-h-36 w-full max-w-md place-items-center overflow-hidden rounded-xl border border-border">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.14),_transparent_58%)]" />
    <div class="text-sm text-muted-foreground">Dashboard preview</div>
    <div class="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-[1.5px]">
      <div class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
        <Spinner size="xs" tone="primary" />
        Refreshing data
      </div>
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="docs-spinner-overlay relative grid min-h-36 w-full max-w-md place-items-center overflow-hidden rounded-xl border border-border">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.14),_transparent_58%)]" />
          <div class="text-sm text-muted-foreground">Dashboard preview</div>
          <div class="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-[1.5px]">
            <div class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
              <Spinner size="xs" tone="primary" />
              Refreshing Data
            </div>
          </div>
        </div>
      ),
    },
  ],
  apiRows: [
    { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"sm"' },
    { prop: "tone", type: '"default" | "muted" | "primary"', defaultValue: '"default"' },
    { prop: "aria-label", type: "string", defaultValue: '"Loading"' },
    { prop: "class", type: "string", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Pair spinner visuals with meaningful status text, announce longer async updates in aria-live regions, and always provide recovery paths for stalled operations.",
});
