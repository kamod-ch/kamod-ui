import type { ComponentChildren, HTMLAttributes } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { useDropdownPlacement } from "../dropdown/useDropdownPlacement";
import { usePopover } from "./Popover";

export const popoverContent = tv({
  base: [
    "bg-popover text-popover-foreground z-50 flex min-w-0 w-80 max-w-[calc(100vw-1.5rem)] max-h-[calc(100dvh-2rem)] flex-col gap-3 overflow-x-hidden overflow-y-auto rounded-lg border p-4 shadow-md outline-none",
    "data-[state=open]:animate-in fade-in zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards fade-out zoom-out-95",
    "absolute isolate",
  ],
  variants: {
    side: {
      bottom: "slide-in-from-top-2",
      top: "slide-in-from-bottom-2",
      right: "slide-in-from-left-2",
      left: "slide-in-from-right-2",
    },
  },
  defaultVariants: {
    side: "bottom",
  },
});

export type PopoverContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof popoverContent> & {
    forceMount?: boolean;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    children?: ComponentChildren;
  };

export const PopoverContent = ({
  forceMount = false,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  class: className,
  style,
  children,
  onKeyDown,
  ...rest
}: PopoverContentProps) => {
  const popover = usePopover();
  const open = popover.open.value || forceMount;
  const placement = useDropdownPlacement({
    enabled: open,
    triggerRef: popover.triggerRef,
    contentRef: popover.contentRef,
    side,
    align,
    sideOffset,
  });
  if (!popover.open.value && !forceMount) return null;

  const inlineStyle = typeof style === "object" && style !== null ? style : undefined;

  return (
    <div
      ref={(node) => {
        popover.contentRef.current = node;
      }}
      id={popover.contentId}
      role="dialog"
      tabIndex={-1}
      aria-labelledby={popover.triggerId}
      data-slot="popover-content"
      data-side={placement.side}
      data-align={align}
      data-state={popover.open.value ? "open" : "closed"}
      class={cn(popoverContent({ side: placement.side }), className)}
      style={{
        position: "fixed",
        left: placement.left,
        top: placement.top,
        right: "auto",
        bottom: "auto",
        margin: 0,
        maxWidth: placement.maxWidth > 0 ? `${placement.maxWidth}px` : "calc(100vw - 16px)",
        maxHeight: placement.maxHeight > 0 ? `${placement.maxHeight}px` : "calc(100dvh - 16px)",
        ...inlineStyle,
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          popover.setOpen(false);
          popover.triggerRef.current?.focus();
          return;
        }
        onKeyDown?.(event);
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
