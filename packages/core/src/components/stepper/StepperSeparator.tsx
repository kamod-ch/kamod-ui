import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { useStepper } from "./stepper-context";
import { stepperSeparator } from "./stepper-variants";

export type StepperSeparatorProps = JSX.HTMLAttributes<HTMLDivElement>;

export const StepperSeparator = ({ class: className, ...rest }: StepperSeparatorProps) => {
  const { orientation } = useStepper();

  return (
    <div
      aria-hidden="true"
      data-slot="stepper-separator"
      class={cn(stepperSeparator({ orientation }), className)}
      {...rest}
    />
  );
};
