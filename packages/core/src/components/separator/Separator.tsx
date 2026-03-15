import type { JSX } from "preact";
import { tv } from "tailwind-variants";

export const separator = tv({
  base: "bg-border shrink-0",
  variants: {
    orientation: {
      horizontal: "h-[1px] w-full",
      vertical: "h-full w-[1px]"
    }
  },
  defaultVariants: {
    orientation: "horizontal"
  }
});

export type SeparatorProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "role" | "aria-orientation"> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

export const Separator = ({
  class: className,
  orientation = "horizontal",
  decorative = false,
  ...rest
}: SeparatorProps) => (
  <div
    role={decorative ? undefined : "separator"}
    aria-orientation={decorative ? undefined : orientation}
    data-orientation={orientation}
    class={separator({ orientation, class: className as string | undefined })}
    data-slot="separator"
    {...rest}
  />
);

