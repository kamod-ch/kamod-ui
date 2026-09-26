import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type WizardFooterProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const WizardFooter = ({ class: className, children, ...rest }: WizardFooterProps) => (
  <div
    data-slot="wizard-footer"
    class={cn("mt-6 flex flex-wrap items-center gap-2", className)}
    {...rest}
  >
    {children}
  </div>
);
