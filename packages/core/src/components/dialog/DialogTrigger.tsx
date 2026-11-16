import { useComputed } from "@preact/signals";
import {
  type ButtonHTMLAttributes,
  type ComponentChildren,
  type TargetedMouseEvent,
  type TargetedPointerEvent,
} from "preact";
import { assignRef, Slot } from "../../lib/slot";
import { useDialog } from "./Dialog";

export type DialogTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
  "data-slot"?: string;
};

export const DialogTrigger = ({
  asChild = false,
  children,
  onClick,
  onPointerDown,
  ref: outerRef,
  "data-slot": dataSlot = "dialog-trigger",
  ...rest
}: DialogTriggerProps) => {
  const dialog = useDialog();
  const expanded = useComputed(() => dialog.open.value);

  const openDialog = () => {
    dialog.setOpen(true);
  };

  const handlePointerDown = (event: TargetedPointerEvent<HTMLElement>) => {
    onPointerDown?.(event as TargetedPointerEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    if (event.button === 0) {
      openDialog();
    }
  };

  const handleClick = (event: TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as TargetedMouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    openDialog();
  };

  const triggerRef = (node: HTMLElement | null) => {
    dialog.triggerRef.current = node;
    assignRef(outerRef, node);
  };

  if (asChild) {
    return (
      <Slot
        {...rest}
        aria-expanded={expanded}
        data-slot={dataSlot}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        ref={triggerRef}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={triggerRef}
      {...rest}
      type="button"
      data-slot={dataSlot}
      aria-expanded={expanded}
      onPointerDown={(event) => {
        if (event.button === 0) {
          openDialog();
        }
        onPointerDown?.(event);
      }}
      onClick={(event) => {
        openDialog();
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
};
