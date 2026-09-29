import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useStepper } from "./stepper-context";
import type { StepperStepStatus } from "./stepper-types";
import { stepperTitle } from "./stepper-variants";

export type StepperTitleProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  children?: ComponentChildren;
  stepId?: string;
  status?: StepperStepStatus;
};

export const StepperTitle = ({
  stepId,
  status: statusProp,
  class: className,
  children,
  ...rest
}: StepperTitleProps) => {
  const { getStatus } = useStepper();
  const status = statusProp ?? (stepId ? getStatus(stepId) : "upcoming");

  return (
    <span
      data-slot="stepper-title"
      data-status={status}
      class={cn(stepperTitle({ status }), className)}
      {...rest}
    >
      {children}
    </span>
  );
};
