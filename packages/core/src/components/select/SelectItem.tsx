import type { ComponentChildren, JSX } from "preact";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { createIdFactory } from "../../lib/interactive";
import { cn } from "../../lib/utils";
import { useSelect } from "./Select";

export type SelectItemProps = JSX.HTMLAttributes<HTMLDivElement> & {
  value: string;
  disabled?: boolean;
  children?: ComponentChildren;
};

export const SelectItem = ({
  value,
  disabled = false,
  children,
  id,
  onClick,
  onFocus,
  onKeyDown,
  onMouseMove,
  class: className,
  ...rest
}: SelectItemProps) => {
  const select = useSelect();
  const itemRef = useRef<HTMLDivElement | null>(null);
  const autoIdFactory = useMemo(() => createIdFactory("select-item"), []);
  const explicitId = typeof id === "string" ? id : undefined;
  const itemId = useMemo(() => autoIdFactory(explicitId), [autoIdFactory, explicitId]);
  const selected = select.selectedValue.value === value;
  const active = select.activeItemId.value === itemId;

  useEffect(() => {
    select.registerItem({
      id: itemId,
      value,
      ref: itemRef.current,
      disabled
    });
    return () => {
      select.unregisterItem(itemId);
    };
  }, [itemId, value, disabled]);

  return (
    <div
      ref={itemRef}
      id={itemId}
      role="option"
      data-slot="select-item"
      data-highlighted={active ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-state={selected ? "checked" : "unchecked"}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : active ? 0 : -1}
      class={cn(
        "relative flex w-full min-w-0 shrink-0 cursor-default select-none items-center rounded-none px-2 py-1.5 text-sm outline-none transition-colors [-webkit-tap-highlight-color:transparent]",
        /* Solid full-row fill (no rounded corners that read as “gaps” against the popover) */
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-foreground",
        selected && "font-medium",
        className
      )}
      onFocus={(event) => {
        if (!disabled) select.setActiveItemId(itemId);
        onFocus?.(event);
      }}
      onMouseMove={(event) => {
        if (!disabled) select.setActiveItemId(itemId);
        onMouseMove?.(event);
      }}
      onKeyDown={(event) => {
        if (disabled) {
          onKeyDown?.(event);
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select.setSelected(value);
          select.closeAndFocusTrigger();
        }
        onKeyDown?.(event);
      }}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        select.setSelected(value);
        onClick?.(event as unknown as JSX.TargetedMouseEvent<HTMLDivElement>);
        select.closeAndFocusTrigger();
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
