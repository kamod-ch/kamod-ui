import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useSelect } from "./Select";

export type SelectContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean;
  children?: ComponentChildren;
};

export const SelectContent = ({
  forceMount = false,
  children,
  onKeyDown,
  class: className,
  ...rest
}: SelectContentProps) => {
  const select = useSelect();

  if (!select.open.value && !forceMount) return null;
  return (
    <div
      id={select.contentId}
      role="listbox"
      aria-labelledby={select.triggerId}
      data-slot="select-content"
      data-state={select.open.value ? "open" : "closed"}
      aria-activedescendant={select.activeItemId.value ?? undefined}
      class={cn(
        "bg-popover text-popover-foreground absolute left-0 right-0 top-full z-50 mt-1 flex max-h-72 flex-col overflow-hidden rounded-md border border-border p-1 shadow-md",
        className
      )}
      onKeyDown={(event) => {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            select.moveActive("next");
            select.focusActiveItem();
            break;
          case "ArrowUp":
            event.preventDefault();
            select.moveActive("prev");
            select.focusActiveItem();
            break;
          case "Home":
            event.preventDefault();
            select.moveActive("first");
            select.focusActiveItem();
            break;
          case "End":
            event.preventDefault();
            select.moveActive("last");
            select.focusActiveItem();
            break;
          case "Enter":
          case " ":
            event.preventDefault();
            if (select.activeItemId.value) {
              const active = document.getElementById(select.activeItemId.value) as HTMLDivElement | null;
              active?.click();
            }
            break;
          case "Escape":
            event.preventDefault();
            select.closeAndFocusTrigger();
            break;
          case "Tab":
            select.setOpen(false);
            break;
          default:
            break;
        }
        onKeyDown?.(event);
      }}
      {...rest}
    >
      {/* Padding lives on the outer shell; scrolling on the inner viewport avoids asymmetric layout when a scrollbar is present (padding + gutter on one element skews highlights). */}
      <div
        data-slot="select-viewport"
        class={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col items-stretch overflow-x-hidden overflow-y-auto",
          /* Classic scrollbars steal inline-end width → uneven highlight vs. padding. Hide bar; list still scrolls (wheel, trackpad, touch, Arrow/Home/End). */
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {children}
      </div>
    </div>
  );
};
