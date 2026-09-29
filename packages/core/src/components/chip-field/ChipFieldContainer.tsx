import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { chipFieldContainer } from "./chip-field-variants";

export type ChipFieldContainerProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  invalid?: boolean;
};

export const ChipFieldContainer = ({
  class: className,
  children,
  invalid = false,
  ...rest
}: ChipFieldContainerProps) => (
  <div
    data-slot="chip-field-container"
    aria-invalid={invalid || undefined}
    class={cn(
      chipFieldContainer(),
      invalid && "border-destructive focus-within:ring-destructive/30",
      className,
    )}
    {...rest}
  >
    {children}
  </div>
);
