import { type ButtonHTMLAttributes, type ComponentChildren, type TargetedMouseEvent } from "preact";
import { assignRef, Slot } from "../../lib/slot";
import { useDialog } from "./Dialog";

export type DialogCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
  "data-slot"?: string;
};

export const DialogClose = ({
  asChild = false,
  children,
  onClick,
  ref: outerRef,
  "data-slot": dataSlot = "dialog-close",
  ...rest
}: DialogCloseProps) => {
  const dialog = useDialog();

  const handleClick = (event: TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as TargetedMouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    dialog.setOpen(false);
  };

  const closeRef = (node: HTMLElement | null) => {
    assignRef(outerRef, node);
  };

  if (asChild) {
    return (
      <Slot {...rest} data-slot={dataSlot} onClick={handleClick} ref={closeRef}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={closeRef}
      type="button"
      data-slot={dataSlot}
      onClick={(event) => handleClick(event as unknown as TargetedMouseEvent<HTMLElement>)}
      {...rest}
    >
      {children}
    </button>
  );
};
