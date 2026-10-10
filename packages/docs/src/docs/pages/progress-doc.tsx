import { Progress, Slider } from "@kamod-ch/ui";
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
  usageLabel:
    "Progress shows how far a task has advanced — aligned with Radix-style bars and shadcn/ui patterns.",
  installationText: "Import Progress from `@/components/kamod-ui/progress`.",
  usageText:
    "Pass value and optional max for determinate progress. Use value={null} or indeterminate for loading when completion is unknown — the indeterminate animation is injected once with the component (no extra Tailwind keyframes). Pair with labels, or drive value from a Slider for interactive demos.",
  exampleSections: [
    {
      id: "basic-progress",
      title: "Basic",
      text: "**Show a Measurable Amount of Completed Work.** Pass a known progress value to display completion along a themed track. The bar gives a quick visual measure, while the surrounding label should identify the operation whose progress is being reported.\n\nSupply an accessible name and a nearby explanation of what is progressing; use [Indeterminate](#progress-indeterminate) when the total cannot be known reliably.",
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
      ),
    },
    {
      id: "progress-with-label",
      title: "Label",
      text: "**Explain the Number as Well as the Fill.** Place a concise operation label and numeric readout beside the progress bar. Derive the number and bar from the same value so readers receive one consistent account of how much work is complete.\n\nDerive both from the same value and `max`, and communicate completion or failure explicitly rather than leaving a full bar as the only final message.",
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
      ),
    },
    {
      id: "controlled-progress",
      title: "Controlled",
      text: "**Explore How State Drives the Visual Result.** Use a `Slider` to change the progress value in this demonstration. Both controls read the same state, making it easy to inspect the visual response before replacing the slider with real task progress.\n\nTry the extremes and a mid-range value, then connect the same readout to a real task. Keep pending, completed and failed states distinguishable; a full bar should reflect completed work rather than merely the end of an animation.",
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
      renderPreview: () => <ControlledProgressPreview />,
    },
    {
      id: "progress-indeterminate",
      title: "Indeterminate",
      text: "**Communicate Activity without Inventing a Percentage.** Use a null value or `indeterminate` when the operation is active but completion cannot be measured. This signals ongoing work without presenting an invented percentage or implying a known time remaining.\n\nSwitch to determinate progress only when a meaningful total becomes available, and provide a final result so continuous movement does not leave users wondering whether the task finished.",
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
      ),
    },
    {
      id: "custom-max",
      title: "Custom Max",
      text: "**Use Units that Match the Work.** Set `max` to the total count when progress represents steps, files or other units rather than a percentage. The current `value` and its text explanation should use the same scale as that maximum.\n\nUpdate the total if more work is discovered and decide how that change should appear to the user. A label such as `3 of 8 files` communicates the scale more clearly than a bare number detached from its unit.",
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
      ),
    },
  ],
  apiRows: [
    {
      prop: "value",
      type: "number | null",
      defaultValue: "0",
      description:
        "Measured completion, clamped between zero and max. Pass null for an indeterminate bar when the total duration is unknown; your task remains responsible for updating this value.",
    },
    {
      prop: "max",
      type: "number",
      defaultValue: "100",
      description:
        "Positive total used to calculate the filled fraction and accessible maximum. Values at or below zero fall back to 100. Use the same unit for value and max, such as completed files and total files.",
    },
    {
      prop: "indeterminate",
      type: "boolean",
      defaultValue: "undefined",
      description:
        "Forces the animated unknown-duration state, regardless of value. The bar omits aria-valuenow in this mode; provide a label that explains the ongoing operation.",
    },
    {
      prop: "class",
      type: "string",
      defaultValue: "undefined",
      description:
        "Additional classes on the outer progress track. Use this for width or local sizing while keeping the surrounding label and status message in your composition.",
    },
    {
      prop: "indicatorClass",
      type: "string",
      defaultValue: "undefined",
      description:
        "Additional classes on the inner indicator in both determinate and indeterminate modes. Prefer semantic theme colors and preserve the animation and reduced-motion behavior.",
    },
  ],
  accessibilityText:
    "For determinate bars, pair with a visible label or aria-label. Indeterminate mode omits aria-valuenow and sets aria-valuetext (override via props). Prefer reduced-motion: animation stops when the user requests it.",
});
