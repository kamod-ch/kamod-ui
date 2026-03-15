import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { usePopover } from "./Popover";

const positionBySide = {
  top: "bottom-full",
  bottom: "top-full",
  left: "right-full",
  right: "left-full"
} as const;

const alignByAxis = {
  vertical: {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0"
  },
  horizontal: {
    start: "top-0",
    center: "top-1/2 -translate-y-1/2",
    end: "bottom-0"
  }
} as const;

export const popoverContent = tv({
  base: [
    "bg-popover text-popover-foreground z-50 flex min-w-0 w-80 max-w-[calc(100vw-1.5rem)] max-h-[calc(100dvh-2rem)] flex-col gap-3 overflow-x-hidden overflow-y-auto rounded-lg border p-4 shadow-md outline-none",
    "data-[state=open]:animate-in fade-in zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards fade-out zoom-out-95",
    "absolute isolate"
  ],
  variants: {
    side: {
      bottom: "slide-in-from-top-2",
      top: "slide-in-from-bottom-2",
      right: "slide-in-from-left-2",
      left: "slide-in-from-right-2"
    }
  },
  defaultVariants: {
    side: "bottom"
  }
});

export type PopoverContentProps = JSX.HTMLAttributes<HTMLDivElement> &
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
  if (!popover.open.value && !forceMount) return null;

  const isVertical = side === "top" || side === "bottom";
  const alignClass = isVertical ? alignByAxis.vertical[align] : alignByAxis.horizontal[align];
  const inlineStyle = typeof style === "object" && style !== null ? style : undefined;
  const offsetStyle: JSX.CSSProperties =
    side === "bottom"
      ? { marginTop: `${sideOffset}px` }
      : side === "top"
        ? { marginBottom: `${sideOffset}px` }
        : side === "right"
          ? { marginLeft: `${sideOffset}px` }
          : { marginRight: `${sideOffset}px` };

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
      data-side={side}
      data-align={align}
      data-state={popover.open.value ? "open" : "closed"}
      class={`${positionBySide[side]} ${alignClass} ${popoverContent({ side, class: className as string | undefined })}`}
      style={inlineStyle ? { ...offsetStyle, ...inlineStyle } : offsetStyle}
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

