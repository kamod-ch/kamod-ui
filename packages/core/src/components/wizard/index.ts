import { Wizard } from "./Wizard";
import { WizardError } from "./WizardError";
import { WizardFooter } from "./WizardFooter";
import { WizardStep } from "./WizardStep";


export type { WizardErrorProps } from "./WizardError";
export type { WizardFooterProps } from "./WizardFooter";
export type { WizardStepProps } from "./WizardStep";
export { useWizard } from "./wizard-context";
export type { WizardLabels, WizardProps, WizardStepValidation, WizardValidateStep } from "./wizard-types";
export { focusWizardTarget, normalizeWizardValidation } from "./wizard-utils";
export { Wizard, WizardError, WizardFooter, WizardStep };

export default {
  Root: Wizard,
  Step: WizardStep,
  Error: WizardError,
  Footer: WizardFooter,
};
