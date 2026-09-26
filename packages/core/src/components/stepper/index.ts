import { Stepper } from "./Stepper";
import { StepperContent } from "./StepperContent";
import { StepperDescription } from "./StepperDescription";
import { StepperIndicator } from "./StepperIndicator";
import { StepperItem } from "./StepperItem";
import { StepperList } from "./StepperList";
import { StepperPosition } from "./StepperPosition";
import { StepperSeparator } from "./StepperSeparator";
import { StepperTitle } from "./StepperTitle";
import { StepperTrigger } from "./StepperTrigger";
import {
  stepper,
  stepperContent,
  stepperDescription,
  stepperIndicator,
  stepperItem,
  stepperList,
  stepperPosition,
  stepperSeparator,
  stepperTitle,
  stepperTrigger,
} from "./stepper-variants";

const StepperVariants = {
  stepper,
  stepperList,
  stepperItem,
  stepperTrigger,
  stepperIndicator,
  stepperTitle,
  stepperDescription,
  stepperSeparator,
  stepperPosition,
  stepperContent,
};

export type { StepperProps } from "./Stepper";

export type { StepperContentProps } from "./StepperContent";
export type { StepperDescriptionProps } from "./StepperDescription";
export type { StepperIndicatorProps } from "./StepperIndicator";
export type { StepperItemProps } from "./StepperItem";
export type { StepperListProps } from "./StepperList";
export type { StepperPositionProps } from "./StepperPosition";
export type { StepperSeparatorProps } from "./StepperSeparator";
export type { StepperTitleProps } from "./StepperTitle";
export type { StepperTriggerProps } from "./StepperTrigger";
export { useStepper } from "./stepper-context";
export type {
  StepperOrientation,
  StepperSize,
  StepperStepDefinition,
  StepperStepStatus,
} from "./stepper-types";
export {
  getNextStepId,
  getPreviousStepId,
  getStepIndex,
  isCompletedStepReachable,
  resolveStepStatuses,
} from "./stepper-utils";
export {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperPosition,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  StepperVariants,
  stepper,
  stepperContent,
  stepperDescription,
  stepperIndicator,
  stepperItem,
  stepperList,
  stepperPosition,
  stepperSeparator,
  stepperTitle,
  stepperTrigger,
};

export default {
  Root: Stepper,
  List: StepperList,
  Item: StepperItem,
  Trigger: StepperTrigger,
  Indicator: StepperIndicator,
  Title: StepperTitle,
  Description: StepperDescription,
  Separator: StepperSeparator,
  Position: StepperPosition,
  Content: StepperContent,
};
