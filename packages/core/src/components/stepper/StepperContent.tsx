import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { stepperContent } from "./stepper-variants";

export type StepperContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const StepperContent = ({ class: className, children, ...rest }: StepperContentProps) => (
  <div data-slot="stepper-content" class={cn(stepperContent(), className)} {...rest}>
    {children}
  </div>
);
