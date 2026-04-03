import { Button, Spinner } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const spinnerDocPage = createGenericDocPage({
  slug: "spinner",
  title: "Spinner",
  usageLabel: "Spinner communicates async progress without blocking context.",
  installationText: "Import Spinner from `@/components/kamod-ui/spinner`.",
  usageText: "Use Spinner for loading buttons, surfaces, and inline status updates with short descriptive copy.",
  exampleSections: [
    {
      id: "basic-spinner",
      title: "Default",
      text: "A compact circular spinner for lightweight loading states.",
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
      )
    },
    {
      id: "spinner-sizes",
      title: "Sizes",
      text: "Choose a size that matches surrounding typography and controls.",
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
      )
    },
    {
      id: "spinner-tones",
      title: "Tones",
      text: "Adjust tone to blend with subtle UI or emphasize active work.",
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
      )
    },
    {
      id: "spinner-in-buttons",
      title: "Buttons",
      text: "Combine spinner and disabled button state for async actions.",
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
      )
    },
    {
      id: "spinner-loading-surface",
      title: "Loading Surface",
      text: "Use a modern status surface for longer network or processing work.",
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
            <p class="text-sm font-medium">Deploy in progress</p>
            <p class="text-xs text-muted-foreground">Packaging assets and publishing your latest release.</p>
          </div>
        </div>
      )
    },
    {
      id: "spinner-overlay",
      title: "Loading Overlay",
      text: "For blocking transitions, combine spinner with a subtle backdrop.",
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
              Refreshing data
            </div>
          </div>
        </div>
      )
    }
  ],
  apiRows: [
    { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"sm"' },
    { prop: "tone", type: '"default" | "muted" | "primary"', defaultValue: '"default"' },
    { prop: "aria-label", type: "string", defaultValue: '"Loading"' },
    { prop: "class", type: "string", defaultValue: "undefined" }
  ],
  accessibilityText:
    "Pair spinner visuals with meaningful status text, announce longer async updates in aria-live regions, and always provide recovery paths for stalled operations."
});
