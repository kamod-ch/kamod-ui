import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type WizardContextValue = {
  activeStep: string;
  keepMounted: boolean;
  validating: boolean;
  completing: boolean;
  registerStepHeading: (stepId: string, node: HTMLHeadingElement | null) => void;
};

export const WizardContext = createContext<WizardContextValue | null>(null);

export const useWizard = (): WizardContextValue => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("Wizard compound components must be used within Wizard");
  }
  return context;
};
