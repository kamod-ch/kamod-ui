import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { useDropdown } from "./Dropdown";

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

export const dropdownContent = tv({
  base: [
    // overflow-x visible so DropdownSubContent (absolute start-full) is not clipped; keep vertical scroll for long menus
    "bg-white text-popover-foreground z-50 flex min-w-[7rem] flex-col gap-0 overflow-x-visible overflow-y-auto rounded-lg p-px shadow-md outline-none ring-1 ring-foreground/10 dark:bg-popover",
    "dark:ring-foreground/15",
    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-100",
    "data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100",
    "absolute isolate max-h-96"
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

export type DropdownContentProps = JSX.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dropdownContent> & {
    forceMount?: boolean;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    children?: ComponentChildren;
  };

export const DropdownContent = ({
  forceMount = false,
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
  if (!dropdown.open.value && !forceMount) return null;

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
        dropdown.contentRef.current = node;
      }}
      id={dropdown.contentId}
      role="menu"
      tabIndex={-1}
      aria-labelledby={dropdown.triggerId}
      data-slot="dropdown-content"
      data-side={side}
      data-align={align}
      data-state={dropdown.open.value ? "open" : "closed"}
      class={`${positionBySide[side]} ${alignClass} ${dropdownContent({ side, class: className as string | undefined })}`}
      style={inlineStyle ? { ...offsetStyle, ...inlineStyle } : offsetStyle}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
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
};
