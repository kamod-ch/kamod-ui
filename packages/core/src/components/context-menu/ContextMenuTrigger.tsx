import { useRef } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useContextMenu } from "./ContextMenu";

const LONG_PRESS_MS = 500;

export type ContextMenuTriggerProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ContextMenuTrigger = ({
  children,
  class: className,
  onContextMenu,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  ...rest
}: ContextMenuTriggerProps) => {
  const { setOpen, setPosition } = useContextMenu();
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPointer = useRef({ x: 0, y: 0 });

  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div
      data-slot="context-menu-trigger"
      class={cn(className)}
      onContextMenu={(event) => {
        event.preventDefault();
        setPosition({ x: event.clientX, y: event.clientY });
        setOpen(true);
        onContextMenu?.(event);
      }}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (e.defaultPrevented) return;
        if (e.pointerType === "touch") {
          lastPointer.current = { x: e.clientX, y: e.clientY };
          clearLongPress();
          longPressTimer.current = setTimeout(() => {
            longPressTimer.current = null;
            setPosition(lastPointer.current);
            setOpen(true);
          }, LONG_PRESS_MS);
        }
      }}
      onPointerUp={(e) => {
        onPointerUp?.(e);
        clearLongPress();
      }}
      onPointerCancel={(e) => {
        onPointerCancel?.(e);
        clearLongPress();
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        if (e.pointerType === "touch") clearLongPress();
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
