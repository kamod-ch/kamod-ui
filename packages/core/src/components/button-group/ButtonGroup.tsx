import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ButtonGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  children?: ComponentChildren;
};

export const ButtonGroup = ({ class: className, orientation = "horizontal", children, ...rest }: ButtonGroupProps) => {
  const isVertical = orientation === "vertical";

  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      class={cn(
        "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2",
        "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:min-w-0 [&>input]:flex-1",
        isVertical
          ? "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none"
          : "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
