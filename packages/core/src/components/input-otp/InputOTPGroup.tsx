import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type InputOTPGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const InputOTPGroup = ({ class: className, children, ...rest }: InputOTPGroupProps) => (
  <div role="group" data-slot="input-otp-group" class={cn("inline-flex items-center gap-1", className)} {...rest}>
    {children}
  </div>
);

