import { Progress, Slider } from "@kamod-ui/core";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const ControlledProgressPreview = () => {
  const [value, setValue] = useState(66);

  return (
    <div class="docs-slider-demo w-full max-w-md">
      <div class="docs-slider-demo-head">
        <span class="docs-slider-demo-label">Upload progress</span>
        <span class="docs-slider-demo-value tabular-nums">{value}%</span>
      </div>
      <Progress value={value} class="w-full" />
      <Slider
        min={0}
        max={100}
        step={1}
        value={value}
        class="w-full"
        aria-label="Adjust upload progress"
        onInput={(event) => setValue(Number(event.currentTarget.value))}
      />
      <div class="docs-slider-demo-scale" aria-hidden="true">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export const progressDocPage = createGenericDocPage({
  slug: "progress",
  title: "Progress",
  usageLabel: "Progress shows how far a task has advanced — aligned with Radix-style bars and shadcn/ui patterns.",
  installationText: "Import Progress from `@/components/kamod-ui/progress`.",
  usageText:
    "Pass value and optional max for determinate progress. Use value={null} or indeterminate for loading when completion is unknown — the indeterminate animation is injected once with the component (no extra Tailwind keyframes). Pair with labels, or drive value from a Slider for interactive demos.",
  exampleSections: [
    {
      id: "basic-progress",
      title: "Basic",
      text: "Minimal bar with theme tokens and smooth motion, similar to the default on the shadcn/ui Progress docs.",
      code: `import { Progress } from "@/components/kamod-ui/progress";

export const Example = () => <Progress value={33} class="w-full max-w-md" />;`,
      renderPreview: () => (
        <div class="docs-slider-demo w-full max-w-md">
          <Progress value={33} class="w-full" />
          <div class="docs-slider-demo-scale" aria-hidden="true">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      )
    },
    {
      id: "progress-with-label",
      title: "Label",
      text: "Pair the bar with a title and numeric readout so status stays clear at a glance.",
      code: `import { Progress } from "@/components/kamod-ui/progress";

export const Example = () => (
  <div class="docs-slider-demo w-full max-w-md">
    <div class="docs-slider-demo-head">
      <span class="docs-slider-demo-label">Upload progress</span>
      <span class="docs-slider-demo-value tabular-nums">66%</span>
    </div>
    <Progress value={66} class="w-full" />
  </div>
);`,
      renderPreview: () => (
        <div class="docs-slider-demo w-full max-w-md">
          <div class="docs-slider-demo-head">
            <span class="docs-slider-demo-label">Upload progress</span>
            <span class="docs-slider-demo-value tabular-nums">66%</span>
          </div>
          <Progress value={66} class="w-full" />
        </div>
      )
    },
    {
      id: "controlled-progress",
      title: "Controlled",
      text: "Bind progress to a Slider so users can scrub the value — the same interaction model as the shadcn/ui controlled example.",
      code: `import { Progress } from "@/components/kamod-ui/progress"
import { Slider } from "@/components/kamod-ui/slider";
import { useState } from "preact/hooks";

export const Example = () => {
  const [value, setValue] = useState(66);

  return (
    <div class="docs-slider-demo w-full max-w-md">
      <div class="docs-slider-demo-head">
        <span class="docs-slider-demo-label">Upload progress</span>
        <span class="docs-slider-demo-value tabular-nums">{value}%</span>
      </div>
      <Progress value={value} class="w-full" />
      <Slider
        min={0}
        max={100}
        step={1}
        value={value}
        class="w-full"
        aria-label="Adjust upload progress"
        onInput={(event) => setValue(Number(event.currentTarget.value))}
      />
    </div>
  );
};`,
      renderPreview: () => <ControlledProgressPreview />
    },
    {
      id: "progress-indeterminate",
      title: "Indeterminate",
      text: "When completion cannot be measured, use null or the indeterminate flag — same idea as Radix Progress with an unknown value.",
      code: `import { Progress } from "@/components/kamod-ui/progress";

export const Example = () => (
  <div class="docs-slider-demo w-full max-w-md">
    <div class="docs-slider-demo-head">
      <span class="docs-slider-demo-label">Preparing workspace</span>
      <span class="docs-slider-demo-value">…</span>
    </div>
    <Progress value={null} class="w-full" aria-label="Loading workspace" />
  </div>
);`,
      renderPreview: () => (
        <div class="docs-slider-demo w-full max-w-md">
          <div class="docs-slider-demo-head">
            <span class="docs-slider-demo-label">Preparing workspace</span>
            <span class="docs-slider-demo-value">…</span>
          </div>
          <Progress value={null} class="w-full" aria-label="Loading workspace" />
        </div>
      )
    },
    {
      id: "custom-max",
      title: "Custom max",
      text: "Use max when progress is not a percentage — steps, file counts, or queue length.",
      code: `import { Progress } from "@/components/kamod-ui/progress";

export const Example = () => (
  <div class="docs-slider-demo w-full max-w-md">
    <div class="docs-slider-demo-head">
      <span class="docs-slider-demo-label">Steps</span>
      <span class="docs-slider-demo-value tabular-nums">3 / 5</span>
    </div>
    <Progress value={3} max={5} class="w-full" />
  </div>
);`,
      renderPreview: () => (
        <div class="docs-slider-demo w-full max-w-md">
          <div class="docs-slider-demo-head">
            <span class="docs-slider-demo-label">Steps</span>
            <span class="docs-slider-demo-value tabular-nums">3 / 5</span>
          </div>
          <Progress value={3} max={5} class="w-full" />
        </div>
      )
    }
  ],
  apiRows: [
    { prop: "value", type: "number | null", defaultValue: "0" },
    { prop: "max", type: "number", defaultValue: "100" },
    { prop: "indeterminate", type: "boolean", defaultValue: "undefined" },
    { prop: "class", type: "string", defaultValue: "undefined" },
    { prop: "indicatorClass", type: "string", defaultValue: "undefined" }
  ],
  accessibilityText:
    "For determinate bars, pair with a visible label or aria-label. Indeterminate mode omits aria-valuenow and sets aria-valuetext (override via props). Prefer reduced-motion: animation stops when the user requests it."
});
