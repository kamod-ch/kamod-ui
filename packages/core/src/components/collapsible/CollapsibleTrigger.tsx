import { type ButtonHTMLAttributes, type ComponentChildren, type TargetedMouseEvent } from "preact";
import { assignRef, Slot } from "../../lib/slot";
import { useCollapsible } from "./Collapsible";

export type CollapsibleTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
  "data-slot"?: string;
};

export const CollapsibleTrigger = ({
  asChild = false,
  children,
  onClick,
  ref: outerRef,
  "data-slot": dataSlot = "collapsible-trigger",
  ...rest
}: CollapsibleTriggerProps) => {
  const { open, setOpen } = useCollapsible();

  const toggle = () => setOpen(!open);

  const handleClick = (event: TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as TargetedMouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    toggle();
  };

  const triggerRef = (node: HTMLElement | null) => {
    assignRef(outerRef, node);
  };

  if (asChild) {
    return (
      <Slot
        {...rest}
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
        data-slot={dataSlot}
        onClick={handleClick}
        ref={triggerRef}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      type="button"
      data-slot={dataSlot}
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      onClick={(event) => {
        handleClick(event);
      }}
      ref={triggerRef}
      {...rest}
    >
      {children}
    </button>
  );
};
