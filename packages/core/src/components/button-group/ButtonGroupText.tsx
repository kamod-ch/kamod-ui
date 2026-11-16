import type { ComponentChildren, HTMLAttributes } from "preact";
import { Slot } from "../../lib/slot";
import { cn } from "../../lib/utils";

export type ButtonGroupTextProps = Omit<HTMLAttributes<HTMLDivElement>, "size"> & {
  children?: ComponentChildren;
  asChild?: boolean;
};

const textClass =
  "text-muted-foreground flex items-center text-sm font-normal [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

export const ButtonGroupText = ({
  class: className,
  children,
  asChild = false,
  ...rest
}: ButtonGroupTextProps) => {
  if (asChild) {
    return (
      <Slot {...rest} class={cn(textClass, className)} data-slot="button-group-text">
        {children}
      </Slot>
    );
  }

  return (
    <div data-slot="button-group-text" class={cn(textClass, className)} {...rest}>
      {children}
    </div>
  );
};
