import type { ComponentChildren, HTMLAttributes } from "preact";
import { createPortal } from "../../lib/createPortal";
import { cn } from "../../lib/utils";
import { useDropdownPlacement } from "../dropdown/useDropdownPlacement";
import { useSelect } from "./Select";

export type SelectContentProps = HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean;
  /** Render in document.body and align to the trigger (default: inline under trigger). */
  portal?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  children?: ComponentChildren;
};

const isPrintableTypeaheadKey = (key: string, event: KeyboardEvent) =>
  key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

export const SelectContent = ({
  forceMount = false,
  portal = false,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  children,
  onKeyDown,
  class: className,
  style,
  ...rest
}: SelectContentProps) => {
  const select = useSelect();
  const isOpen = select.open.value;

  const placement = useDropdownPlacement({
    enabled: portal && (isOpen || forceMount),
    triggerRef: select.triggerRef,
    contentRef: select.contentRef,
    side,
    align,
    sideOffset,
  });

  if ((!isOpen && !forceMount) || (portal && typeof document === "undefined")) return null;

  const inlineStyle = typeof style === "object" && style !== null ? style : undefined;

  const handleKeyDown: HTMLAttributes<HTMLDivElement>["onKeyDown"] = (event) => {
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
          const active = document.getElementById(
            select.activeItemId.value,
          ) as HTMLDivElement | null;
          active?.click();
        }
        break;
      case "Escape":
        event.preventDefault();
        if (portal) event.stopPropagation();
        select.closeAndFocusTrigger();
        break;
      case "Tab":
        select.setOpen(false);
        break;
      default:
        if (isPrintableTypeaheadKey(event.key, event)) {
          event.preventDefault();
          select.handleTypeahead(event.key);
        }
        break;
    }
    onKeyDown?.(event);
  };

  const content = (
    <div
      ref={(node) => {
        select.contentRef.current = node;
      }}
      id={select.contentId}
      role="listbox"
      aria-labelledby={select.triggerId}
      tabIndex={-1}
      data-slot="select-content"
      data-state={select.open.value ? "open" : "closed"}
      data-side={portal ? placement.side : side}
      data-align={align}
      aria-activedescendant={select.activeItemId.value ?? undefined}
      class={cn(
        "bg-popover text-popover-foreground z-50 flex max-h-72 flex-col overflow-hidden rounded-md border border-border p-1 shadow-md",
        !portal && "absolute left-0 right-0 top-full mt-1",
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
              transitionProperty: "none",
              maxWidth: "calc(100vw - 16px)",
              maxHeight: "min(24rem, calc(100dvh - 16px))",
            }
          : inlineStyle
      }
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <div
        data-slot="select-viewport"
        class={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col items-stretch overflow-x-hidden overflow-y-auto",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {children}
      </div>
    </div>
  );

  return portal ? createPortal(content, document.body) : content;
};
