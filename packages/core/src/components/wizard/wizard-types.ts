import type { ComponentChildren, JSX } from "preact";
import type { StepperOrientation, StepperStepDefinition } from "../stepper/stepper-types";

export type WizardStepValidation =
  | boolean
  | {
      valid: boolean;
      errorMessage?: ComponentChildren;
      /** DOM id of the control or heading to focus when validation fails. */
      focusTargetId?: string;
    };

export type WizardValidateStep = (
  stepId: string,
) => WizardStepValidation | Promise<WizardStepValidation>;

export type WizardLabels = {
  back: ComponentChildren;
  next: ComponentChildren;
  complete: ComponentChildren;
};

export type WizardProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "aria-label"> & {
  steps: readonly StepperStepDefinition[];
  activeStep: string;
  onStepChange: (stepId: string) => void;
  validateStep?: WizardValidateStep;
  onComplete?: () => void | Promise<void>;
  labels: WizardLabels;
  orientation?: StepperOrientation;
  /** When true, completed steps are navigable in the stepper header. */
  allowStepNavigation?: boolean;
  /**
   * When false (default), inactive step panels unmount.
   * When true, panels stay mounted and are hidden with the `hidden` attribute.
   */
  keepMounted?: boolean;
  /** Required accessible name for the wizard landmark. */
  "aria-label": string;
  formatPosition?: (current: number, total: number) => ComponentChildren;
  children?: ComponentChildren;
};
