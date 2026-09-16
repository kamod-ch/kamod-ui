import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { stepperDescription } from "./stepper-variants";

export type StepperDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const StepperDescription = ({
  class: className,
  children,
  ...rest
}: StepperDescriptionProps) => (
  <p data-slot="stepper-description" class={cn(stepperDescription(), className)} {...rest}>
    {children}
  </p>
);
