import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type AlertActionProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

/** Top-end action slot; Alert reserves horizontal padding when this is present. */
export const AlertAction = ({ class: className, children, ...rest }: AlertActionProps) => (
  <div
    data-slot="alert-action"
    class={cn("absolute end-3 top-3 flex items-center gap-2", className)}
    {...rest}
  >
    {children}
  </div>
);
