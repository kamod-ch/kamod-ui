import { signal } from "@preact/signals";
import { useEffect, useMemo } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ContextMenuCheckboxItemProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ComponentChildren;
};

export const ContextMenuCheckboxItem = ({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  class: className,
  children,
  onClick,
  ...rest
}: ContextMenuCheckboxItemProps) => {
  const internal = useMemo(() => signal(defaultChecked), []);
  const isControlled = checkedProp !== undefined;

  useEffect(() => {
    if (checkedProp !== undefined) {
      internal.value = checkedProp;
    }
  }, [checkedProp, internal]);

  const checked = isControlled ? Boolean(checkedProp) : internal.value;

  return (
    <button
      type="button"
      role="menuitemcheckbox"
      data-slot="context-menu-checkbox-item"
      aria-checked={checked}
      class={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const next = !checked;
        if (!isControlled) {
          internal.value = next;
        }
        onCheckedChange?.(next);
      }}
      {...rest}
    >
      <span class="pointer-events-none absolute start-2 flex size-3.5 items-center justify-center" aria-hidden>
        {checked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : null}
      </span>
      {children}
    </button>
  );
};
