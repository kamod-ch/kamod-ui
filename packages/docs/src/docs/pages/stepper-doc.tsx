import { Stepper } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const STEPS = [
  { id: "organization", title: "Organization", description: "Name your workspace" },
  { id: "team", title: "Team", description: "Invite teammates" },
  { id: "review", title: "Review", description: "Confirm details" },
];

const HorizontalPreview = () => {
  const [activeStep, setActiveStep] = useState("organization");

  return (
    <Stepper
      steps={STEPS}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      allowStepNavigation
      aria-label="Organization setup"
    />
  );
};

const VerticalPreview = () => (
  <Stepper
    steps={STEPS}
    activeStep="team"
    orientation="vertical"
    stepStatus={{ team: "error" }}
    aria-label="Organization setup"
    showPosition={false}
  />
);

export const stepperDocPage = createGenericDocPage({
  title: "Stepper",
  slug: "stepper",
  usageLabel: "Stepper",
  previewCode: `import { Stepper } from "@/components/kamod-ui/stepper";

export const Example = ({ activeStep, onStepChange, steps }) => (
  <Stepper
    steps={steps}
    activeStep={activeStep}
    onStepChange={onStepChange}
    allowStepNavigation
    aria-label={t("stepper.label")}
  />
);`,
  installationText:
    "Import from `@kamod-ch/ui/stepper`. Stepper is presentational — it renders step status and optional navigation but does not validate or store form data.",
  usageText:
    "Pass stable step ids, controlled `activeStep`, and optional `stepStatus` overrides for error states. Use `allowStepNavigation` to let users return to completed steps. Pair with `Wizard` when you need validated next/back/complete flow.",
  installationExample: {
    code: `import { Stepper } from "@/components/kamod-ui/stepper";`,
    renderPreview: HorizontalPreview,
  },
  exampleSections: [
    {
      id: "horizontal",
      title: "Horizontal with completed-step navigation",
      text: "Completed steps are clickable when `allowStepNavigation` is true. Upcoming steps stay disabled.",
      code: `import { useState } from "preact/hooks";
import { Stepper } from "@/components/kamod-ui/stepper";

export const Example = () => {
  const [activeStep, setActiveStep] = useState("organization");
  return (
    <Stepper
      steps={steps}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      allowStepNavigation
      aria-label="Organization setup"
    />
  );
};`,
      renderPreview: HorizontalPreview,
    },
    {
      id: "vertical-error",
      title: "Vertical layout with error status",
      text: "Set `stepStatus` overrides when a validated step fails without changing the active step id.",
      code: `<Stepper
  steps={steps}
  activeStep="team"
  orientation="vertical"
  stepStatus={{ team: "error" }}
  aria-label="Organization setup"
/>`,
      renderPreview: VerticalPreview,
    },
  ],
  apiRows: [
    { prop: "steps", type: "{ id, title, description? }[]", defaultValue: "required stable ids" },
    { prop: "activeStep", type: "string", defaultValue: "controlled step id" },
    {
      prop: "onStepChange",
      type: "(stepId) => void",
      defaultValue: "optional navigation callback",
    },
    {
      prop: "stepStatus",
      type: "Partial<Record<id, status>>",
      defaultValue: "auto from activeStep",
    },
    { prop: "allowStepNavigation", type: "boolean", defaultValue: "false" },
    { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
    { prop: "aria-label", type: "string", defaultValue: "required nav label" },
  ],
  accessibilityText:
    'Stepper renders an ordered list inside `<nav>` — not a tablist. The current step uses `aria-current="step"`. Completed-step triggers are buttons; upcoming steps are disabled. `StepperPosition` exposes compact mobile progress text.',
});
