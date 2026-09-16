import type { ComponentChildren } from "preact";
import type { WizardStepValidation } from "./wizard-types";

export type NormalizedWizardValidation = {
  valid: boolean;
  errorMessage?: ComponentChildren;
  focusTargetId?: string;
};

export const normalizeWizardValidation = async (
  result: WizardStepValidation | Promise<WizardStepValidation>,
): Promise<NormalizedWizardValidation> => {
  const resolved = await result;
  if (typeof resolved === "boolean") {
    return { valid: resolved };
  }
  return {
    valid: resolved.valid,
    errorMessage: resolved.errorMessage,
    focusTargetId: resolved.focusTargetId,
  };
};

export const focusWizardTarget = (targetId?: string, fallback?: HTMLElement | null) => {
  if (typeof document === "undefined") {
    return;
  }

  const focusTarget = () => {
    if (targetId) {
      const target = document.getElementById(targetId);
      if (target) {
        if (!target.hasAttribute("tabindex")) {
          target.tabIndex = -1;
        }
        target.focus();
        return;
      }
    }
    fallback?.focus();
  };

  focusTarget();
};
