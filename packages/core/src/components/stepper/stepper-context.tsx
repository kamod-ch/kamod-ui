import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type {
  StepperOrientation,
  StepperSize,
  StepperStepDefinition,
  StepperStepStatus,
} from "./stepper-types";
import { getStepIndex, isCompletedStepReachable } from "./stepper-utils";

export type StepperContextValue = {
  steps: readonly StepperStepDefinition[];
  activeStep: string;
  activeIndex: number;
  orientation: StepperOrientation;
  size: StepperSize;
  allowStepNavigation: boolean;
  stepStatus: Record<string, StepperStepStatus>;
  onStepChange?: (stepId: string) => void;
  isStepReachable: (stepId: string) => boolean;
  getStatus: (stepId: string) => StepperStepStatus;
};

export const StepperContext = createContext<StepperContextValue | null>(null);

export const useStepper = (): StepperContextValue => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("Stepper compound components must be used within Stepper");
  }
  return context;
};

export const createStepperContextValue = ({
  steps,
  activeStep,
  orientation,
  size,
  allowStepNavigation,
  stepStatus,
  onStepChange,
  isStepReachable,
}: {
  steps: readonly StepperStepDefinition[];
  activeStep: string;
  orientation: StepperOrientation;
  size: StepperSize;
  allowStepNavigation: boolean;
  stepStatus: Record<string, StepperStepStatus>;
  onStepChange?: (stepId: string) => void;
  isStepReachable?: (stepId: string) => boolean;
}): StepperContextValue => {
  const activeIndex = getStepIndex(steps, activeStep);

  const defaultReachable = (stepId: string) =>
    allowStepNavigation && isCompletedStepReachable(steps, activeStep, stepId);

  return {
    steps,
    activeStep,
    activeIndex,
    orientation,
    size,
    allowStepNavigation,
    stepStatus,
    onStepChange,
    isStepReachable: isStepReachable ?? defaultReachable,
    getStatus: (stepId: string) => stepStatus[stepId] ?? "upcoming",
  };
};
