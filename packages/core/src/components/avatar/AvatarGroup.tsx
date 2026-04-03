import type { ComponentChildren, JSX } from "preact";
import { Fragment, isValidElement, toChildArray } from "preact";
import { cn } from "../../lib/utils";
import { Avatar } from "./Avatar";
import { AvatarGroupCount } from "./AvatarGroupCount";

export type AvatarGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const AvatarGroup = ({ class: className, children, ...rest }: AvatarGroupProps) => {
  const items = toChildArray(children);
  let stackIndex = 0;

  return (
    <div
      data-slot="avatar-group"
      class={cn(
        "isolate flex flex-row flex-wrap items-center -space-x-2 rtl:space-x-reverse",
        className
      )}
      {...rest}
    >
      {items.map((child, i) => {
        if (isValidElement(child) && child.type === Avatar) {
          const z = stackIndex;
          stackIndex += 1;
          const key =
            typeof child.key === "string" || typeof child.key === "number" ? child.key : `avatar-group-${i}`;
          return (
            <span
              key={key}
              class="relative inline-flex shrink-0 rounded-full ring-2 ring-background"
              style={{ zIndex: z }}
            >
              {child}
            </span>
          );
        }
        if (isValidElement(child) && child.type === AvatarGroupCount) {
          const key =
            typeof child.key === "string" || typeof child.key === "number" ? child.key : `avatar-group-count-${i}`;
          return (
            <span key={key} class="relative z-[100] inline-flex shrink-0">
              {child}
            </span>
          );
        }
        return <Fragment key={i}>{child}</Fragment>;
      })}
    </div>
  );
};
