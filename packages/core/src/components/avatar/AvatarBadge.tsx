import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useAvatarContext } from "./context";

export type AvatarBadgeProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  children?: ComponentChildren;
};

export const AvatarBadge = ({ class: className, children, ...rest }: AvatarBadgeProps) => {
  useAvatarContext();

  return (
    <span
      data-slot="avatar-badge"
      class={cn(
        "absolute z-20 box-border inline-flex items-center justify-center rounded-full bg-primary",
        /* Bottom-inline-end overlap (~¼ avatar width) with a thick white ring so the dot reads clearly on the photo. */
        "bottom-0.5 end-0.5 ring-[3px] ring-white dark:ring-background",
        "group-data-[size=sm]/avatar:bottom-px group-data-[size=sm]/avatar:end-px group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:ring-2",
        "group-data-[size=sm]/avatar:[&_svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&_svg]:size-2",
        "group-data-[size=lg]/avatar:bottom-1 group-data-[size=lg]/avatar:end-1 group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&_svg]:size-2",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};
