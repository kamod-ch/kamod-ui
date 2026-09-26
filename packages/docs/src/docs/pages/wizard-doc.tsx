import { createGenericDocPage } from "./create-generic-doc-page";
import { OrganizationWizardDemo } from "./organization-wizard-demo";

const WIZARD_SNIPPET = `import { Field, FieldLabel, Input, Wizard, WizardStep } from "@/components/kamod-ui/wizard";

export const Example = ({ activeStep, onStepChange, draft, setDraft, validateStep, onComplete }) => (
  <Wizard
    steps={steps}
    activeStep={activeStep}
    onStepChange={onStepChange}
    validateStep={validateStep}
    onComplete={onComplete}
    allowStepNavigation
    labels={{ back: t("back"), next: t("next"), complete: t("complete") }}
    aria-label={t("wizard.label")}
  >
    <WizardStep stepId="organization" title={t("steps.organization")}>
      <Field>
        <FieldLabel htmlFor="org-name">{t("fields.organization")}</FieldLabel>
        <Input id="org-name" value={draft.name} onInput={…} />
      </Field>
    </WizardStep>
  </Wizard>
);`;

export const wizardDocPage = createGenericDocPage({
  title: "Wizard",
  slug: "wizard",
  usageLabel: "Wizard",
  previewCode: WIZARD_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/wizard`. Wizard composes Stepper with validated next/back/complete controls. It does not depend on Formisch or any other form library.",
  usageText:
    "Keep draft state in the consumer. `validateStep` may be sync or async; stale results are ignored via an internal sequence guard. `onComplete` is separate from step validation and supports its own pending/error UI. By default inactive `WizardStep` panels unmount — set `keepMounted` to preserve DOM state across steps (document trade-offs for heavy forms). Pair with Valibot, Formisch, or manual checks inside `validateStep`.",
  installationExample: {
    code: `import { OrganizationWizardDemo } from "./organization-wizard-demo";

export const Example = () => <OrganizationWizardDemo />;`,
    renderPreview: () => <OrganizationWizardDemo />,
  },
  exampleSections: [
    {
      id: "organization-wizard",
      title: "Create organization → invite team → review → complete",
      text: "Valibot validates organization and optional invite email. Completion errors surface in WizardError without leaving the review step. Form data survives Back navigation because the consumer owns state.",
      code: `import { OrganizationWizardDemo } from "./organization-wizard-demo";

export const Example = () => <OrganizationWizardDemo />;`,
      renderPreview: () => <OrganizationWizardDemo />,
    },
    {
      id: "mount-behavior",
      title: "Mount and unmount behavior",
      text: "Default: inactive steps unmount (lighter DOM, state must live in the consumer). `keepMounted` hides inactive panels with the `hidden` attribute so internal form widgets can preserve transient UI state at the cost of memory.",
      code: `<Wizard keepMounted steps={steps} activeStep={activeStep} onStepChange={setActiveStep} labels={labels} aria-label="Setup">
  <WizardStep stepId="organization" title="Organization">…</WizardStep>
</Wizard>`,
      renderPreview: () => (
        <p class="text-muted-foreground text-sm">
          See the organization wizard demo — step fields unmount when you continue, while draft
          state remains in React/Preact state above the wizard.
        </p>
      ),
    },
    {
      id: "formisch-integration",
      title: "Formisch integration (docs app)",
      text: "Call Formisch `validate(form)` inside `validateStep` or map Valibot/`field.errors` to Wizard validation results. Kamod UI Field/Input primitives render the controls; Wizard only orchestrates navigation.",
      code: `const validateStep = async (stepId) => {
  if (stepId === "organization") {
    const valid = await validate(orgForm, { shouldFocus: true });
    if (!valid) {
      return { valid: false, errorMessage: "Fix organization details.", focusTargetId: "org-name" };
    }
  }
  return true;
};`,
      renderPreview: () => (
        <p class="text-muted-foreground text-sm">
          Formisch lives in the docs app (`@formisch/preact`). Import it in your consumer — not from
          `@kamod-ch/ui`.
        </p>
      ),
    },
  ],
  apiRows: [
    { prop: "activeStep / onStepChange", type: "string / fn", defaultValue: "controlled flow" },
    {
      prop: "validateStep",
      type: "(stepId) => boolean | result | Promise",
      defaultValue: "optional",
    },
    { prop: "onComplete", type: "() => void | Promise<void>", defaultValue: "final action only" },
    { prop: "keepMounted", type: "boolean", defaultValue: "false" },
    { prop: "allowStepNavigation", type: "boolean", defaultValue: "true" },
    {
      prop: "labels",
      type: "{ back, next, complete }",
      defaultValue: "required localized strings",
    },
    { prop: "WizardStep.stepId", type: "string", defaultValue: "must match steps[].id" },
  ],
  accessibilityText:
    'Wizard reuses Stepper semantics (`aria-current="step"`). Validation errors render in `role="alert"` and receive focus when no `focusTargetId` is supplied. After a successful transition, focus moves to the new step heading (`tabIndex={-1}`). Footer buttons are type="button" — they never submit surrounding forms.',
});
