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
        "bg-primary absolute bottom-0 end-0 z-20 inline-flex items-center justify-center rounded-full shadow-sm",
        /* shadcn-style bottom-inline-end anchor: pull toward center so the dot sits on the visible circle (raw corner is clipped by overflow-hidden). */
        "-translate-x-1/3 -translate-y-1/3 rtl:translate-x-1/3",
        /* Crisp white halo (light); theme background ring in dark for contrast — matches shadcn AvatarBadge + user request. */
        "ring-[3px] ring-white dark:ring-background",
        "group-data-[size=sm]/avatar:size-2.5 group-data-[size=sm]/avatar:[&_svg]:hidden",
        "group-data-[size=default]/avatar:size-3 group-data-[size=default]/avatar:[&_svg]:size-2",
        "group-data-[size=lg]/avatar:size-3.5 group-data-[size=lg]/avatar:[&_svg]:size-2",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};
