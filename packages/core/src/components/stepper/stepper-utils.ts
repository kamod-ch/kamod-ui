import type { StepperStepDefinition, StepperStepStatus } from "./stepper-types";

export function getStepIndex(steps: readonly Pick<StepperStepDefinition, "id">[], stepId: string) {
  return steps.findIndex((step) => step.id === stepId);
}

export function resolveStepStatuses(
  steps: readonly Pick<StepperStepDefinition, "id">[],
  activeStep: string,
  overrides?: Partial<Record<string, StepperStepStatus>>,
): Record<string, StepperStepStatus> {
  const activeIndex = getStepIndex(steps, activeStep);
  const statuses: Record<string, StepperStepStatus> = {};

  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index]!;
    const override = overrides?.[step.id];
    if (override) {
      statuses[step.id] = override;
      continue;
    }

    if (activeIndex === -1) {
      statuses[step.id] = index === 0 ? "current" : "upcoming";
      continue;
    }

    if (index < activeIndex) {
      statuses[step.id] = "completed";
    } else if (index === activeIndex) {
      statuses[step.id] = "current";
    } else {
      statuses[step.id] = "upcoming";
    }
  }

  return statuses;
}

export function isCompletedStepReachable(
  steps: readonly Pick<StepperStepDefinition, "id">[],
  activeStep: string,
  targetStepId: string,
) {
  const activeIndex = getStepIndex(steps, activeStep);
  const targetIndex = getStepIndex(steps, targetStepId);
  return targetIndex !== -1 && activeIndex !== -1 && targetIndex < activeIndex;
}

export function getNextStepId(
  steps: readonly Pick<StepperStepDefinition, "id">[],
  activeStep: string,
): string | null {
  const activeIndex = getStepIndex(steps, activeStep);
  if (activeIndex === -1 || activeIndex >= steps.length - 1) {
    return null;
  }
  return steps[activeIndex + 1]!.id;
}

export function getPreviousStepId(
  steps: readonly Pick<StepperStepDefinition, "id">[],
  activeStep: string,
): string | null {
  const activeIndex = getStepIndex(steps, activeStep);
  if (activeIndex <= 0) {
    return null;
  }
  return steps[activeIndex - 1]!.id;
}
