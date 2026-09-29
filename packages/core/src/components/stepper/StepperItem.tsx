import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useStepper } from "./stepper-context";
import { stepperItem } from "./stepper-variants";

export type StepperItemProps = JSX.HTMLAttributes<HTMLLIElement> & {
  stepId: string;
  children?: ComponentChildren;
};

export const StepperItem = ({ stepId, class: className, children, ...rest }: StepperItemProps) => {
  const { orientation, getStatus } = useStepper();

  return (
    <li
      data-slot="stepper-item"
      data-step-id={stepId}
      data-status={getStatus(stepId)}
      class={cn(stepperItem({ orientation }), className)}
      {...rest}
    >
      {children}
    </li>
  );
};
