import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useStepper } from "./stepper-context";
import { stepperList } from "./stepper-variants";

export type StepperListProps = JSX.HTMLAttributes<HTMLOListElement> & {
  children?: ComponentChildren;
};

export const StepperList = ({ class: className, children, ...rest }: StepperListProps) => {
  const { orientation } = useStepper();

  return (
    <ol data-slot="stepper-list" class={cn(stepperList({ orientation }), className)} {...rest}>
      {children}
    </ol>
  );
};
