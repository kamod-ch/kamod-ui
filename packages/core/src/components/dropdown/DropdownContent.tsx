import type { ComponentChildren, JSX } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";
import { tv, type VariantProps } from "tailwind-variants";
import { createPortal } from "../../lib/createPortal";
import { cn } from "../../lib/utils";
import { useDropdown } from "./Dropdown";

const positionBySide = {
  top: "bottom-full",
  bottom: "top-full",
  left: "right-full",
  right: "left-full",
} as const;

const alignByAxis = {
  vertical: {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  },
  horizontal: {
    start: "top-0",
    center: "top-1/2 -translate-y-1/2",
    end: "bottom-0",
  },
} as const;

export const dropdownContent = tv({
  base: [
    // overflow-x visible so DropdownSubContent (absolute start-full) is not clipped; keep vertical scroll for long menus
    "bg-white text-popover-foreground z-50 flex min-w-[7rem] flex-col gap-0 overflow-x-visible overflow-y-auto rounded-lg p-px shadow-md outline-none ring-1 ring-foreground/10 dark:bg-popover",
    "dark:ring-foreground/15",
    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-100",
    "data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100",
    "absolute isolate max-h-96",
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

export type DropdownContentProps = JSX.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dropdownContent> & {
    forceMount?: boolean;
    /** Render in document.body and keep the menu inside the viewport, escaping scroll clipping. */
    portal?: boolean;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    children?: ComponentChildren;
  };

export const DropdownContent = ({
  forceMount = false,
  portal = false,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  class: className,
  style,
  children,
  onKeyDown,
  ...rest
}: DropdownContentProps) => {
  const dropdown = useDropdown();
  const isOpen = dropdown.open.value;
  const [placement, setPlacement] = useState({ left: 0, top: 0, side });

  useLayoutEffect(() => {
    if (!portal || (!isOpen && !forceMount)) return;
    const content = dropdown.contentRef.current;
    const trigger = dropdown.triggerRef.current;
    if (!content || !trigger) return;
    const view = trigger.ownerDocument.defaultView;
    if (!view) return;

    const update = () => {
      const rect = trigger.getBoundingClientRect();
      const padding = 8;
      const viewportWidth = trigger.ownerDocument.documentElement.clientWidth || view.innerWidth;
      const viewportHeight = view.innerHeight;
      // Layout dimensions avoid the opening animation's temporary scale affecting placement.
      const width = content.offsetWidth;
      const height = content.offsetHeight;
      const space = {
        top: rect.top - sideOffset - padding,
        bottom: viewportHeight - rect.bottom - sideOffset - padding,
        left: rect.left - sideOffset - padding,
        right: viewportWidth - rect.right - sideOffset - padding,
      };
      const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
      const extent = side === "top" || side === "bottom" ? height : width;
      const resolvedSide =
        space[side] < extent && space[opposite[side]] > space[side] ? opposite[side] : side;
      const vertical = resolvedSide === "top" || resolvedSide === "bottom";
      const aligned = (start: number, end: number, size: number) =>
        align === "start" ? start : align === "end" ? end - size : (start + end - size) / 2;
      const left = vertical
        ? aligned(rect.left, rect.right, width)
        : resolvedSide === "right"
          ? rect.right + sideOffset
          : rect.left - width - sideOffset;
      const top = vertical
        ? resolvedSide === "bottom"
          ? rect.bottom + sideOffset
          : rect.top - height - sideOffset
        : aligned(rect.top, rect.bottom, height);
      const clamp = (value: number, limit: number) =>
        Math.max(padding, Math.min(value, limit - padding));
      const next = {
        left: clamp(left, viewportWidth - width),
        top: clamp(top, viewportHeight - height),
        side: resolvedSide,
      };
      setPlacement((previous) =>
        previous.left === next.left && previous.top === next.top && previous.side === next.side
          ? previous
          : next,
      );
    };

    update();
    // Capture scrolling in nested sidebar/content regions, not just the document.
    view.addEventListener("scroll", update, true);
    view.addEventListener("resize", update);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(content);
    observer?.observe(trigger);
    return () => {
      view.removeEventListener("scroll", update, true);
      view.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [
    portal,
    isOpen,
    forceMount,
    side,
    align,
    sideOffset,
    dropdown.contentRef,
    dropdown.triggerRef,
  ]);

  if ((!isOpen && !forceMount) || (portal && typeof document === "undefined")) return null;

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

  const content = (
    <div
      ref={(node) => {
        dropdown.contentRef.current = node;
      }}
      id={dropdown.contentId}
      role="menu"
      tabIndex={-1}
      aria-labelledby={dropdown.triggerId}
      data-slot="dropdown-content"
      data-side={portal ? placement.side : side}
      data-align={align}
      data-state={dropdown.open.value ? "open" : "closed"}
      class={cn(
        dropdownContent({ side: portal ? placement.side : side }),
        !portal && positionBySide[side],
        !portal && alignClass,
        className,
      )}
      style={
        portal
          ? {
              ...inlineStyle,
              position: "fixed",
              left: placement.left,
              top: placement.top,
              right: "auto",
              bottom: "auto",
              margin: 0,
              // Reposition instantly; state duration utilities must not animate left/top.
              transitionProperty: "none",
              maxWidth: "calc(100vw - 16px)",
              maxHeight: "min(24rem, calc(100dvh - 16px))",
            }
          : inlineStyle
            ? { ...offsetStyle, ...inlineStyle }
            : offsetStyle
      }
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          // A portaled menu has no enclosing Dropdown DOM node to stop a parent Sheet dismissal.
          if (portal) event.stopPropagation();
          dropdown.setOpen(false);
          dropdown.triggerRef.current?.focus();
          return;
        }
        onKeyDown?.(event);
      }}
      {...rest}
    >
      {children}
    </div>
  );
  return portal ? createPortal(content, document.body) : content;
};
