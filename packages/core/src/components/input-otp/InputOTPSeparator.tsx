import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type InputOTPSeparatorProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  children?: ComponentChildren;
};

export const InputOTPSeparator = ({ class: className, children, ...rest }: InputOTPSeparatorProps) => (
  <span
    role="presentation"
    data-slot="input-otp-separator"
    class={cn("text-muted-foreground select-none", className)}
    {...rest}
  >
    {children ?? "-"}
  </span>
);
