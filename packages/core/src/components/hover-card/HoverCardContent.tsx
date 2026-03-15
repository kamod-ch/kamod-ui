import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { useHoverCard } from "./HoverCard";

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

export const hoverCardContent = tv({
  base: [
    "bg-popover text-popover-foreground z-50 flex min-w-0 max-w-[calc(100vw-1.5rem)] flex-col gap-1 rounded-lg border p-3 text-sm shadow-md outline-none",
    "data-[state=open]:animate-in fade-in zoom-in-95",
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

export type HoverCardContentProps = JSX.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof hoverCardContent> & {
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    children?: ComponentChildren;
  };

export const HoverCardContent = ({
  side = "bottom",
  align = "center",
  sideOffset = 8,
  class: className,
  style,
  children,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: HoverCardContentProps) => {
  const { open, pinOpen, scheduleClose, setOpenImmediate } = useHoverCard();
  if (!open.value) return null;

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
      data-slot="hover-card-content"
      role="dialog"
      aria-modal="false"
      tabIndex={-1}
      data-side={side}
      data-align={align}
      data-state="open"
      class={`${positionBySide[side]} ${alignClass} ${hoverCardContent({ side, class: className as string | undefined })}`}
      style={inlineStyle ? { ...offsetStyle, ...inlineStyle } : offsetStyle}
      onMouseEnter={(event) => {
        pinOpen();
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        scheduleClose();
        onMouseLeave?.(event);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          setOpenImmediate(false);
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
