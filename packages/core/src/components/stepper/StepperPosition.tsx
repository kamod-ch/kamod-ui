import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useStepper } from "./stepper-context";
import { stepperPosition } from "./stepper-variants";

export type StepperPositionProps = Omit<JSX.HTMLAttributes<HTMLParagraphElement>, "children"> & {
  formatPosition?: (current: number, total: number) => ComponentChildren;
};

export const StepperPosition = ({
  formatPosition,
  class: className,
  ...rest
}: StepperPositionProps) => {
  const { activeIndex, steps } = useStepper();
  const current = activeIndex >= 0 ? activeIndex + 1 : 1;
  const total = steps.length;
  const content = formatPosition ? formatPosition(current, total) : `${current} / ${total}`;

  return (
    <p
      data-slot="stepper-position"
      aria-live="polite"
      class={cn(stepperPosition(), className)}
      {...rest}
    >
      {content}
    </p>
  );
};
