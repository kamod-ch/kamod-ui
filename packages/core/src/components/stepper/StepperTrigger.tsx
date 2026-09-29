import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useStepper } from "./stepper-context";
import { stepperTrigger } from "./stepper-variants";

export type StepperTriggerProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  stepId: string;
  children?: ComponentChildren;
};

export const StepperTrigger = ({
  stepId,
  class: className,
  children,
  disabled,
  onClick,
  ...rest
}: StepperTriggerProps) => {
  const { getStatus, isStepReachable, onStepChange, activeStep } = useStepper();
  const status = getStatus(stepId);
  const reachable = isStepReachable(stepId);
  const interactive = reachable && stepId !== activeStep;

  return (
    <button
      type="button"
      data-slot="stepper-trigger"
      data-step-id={stepId}
      data-status={status}
      aria-current={status === "current" ? "step" : undefined}
      aria-disabled={!interactive && status !== "current" ? true : undefined}
      disabled={disabled ?? (!interactive && status !== "current")}
      class={cn(stepperTrigger({ interactive }), className)}
      onClick={(event) => {
        if (interactive) {
          onStepChange?.(stepId);
        }
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
