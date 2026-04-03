import { signal } from "@preact/signals";
import type { ComponentChildren, JSX } from "preact";
import { useEffect, useMemo } from "preact/hooks";
import { cn } from "../../lib/utils";

export type DropdownCheckboxItemProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ComponentChildren;
};

export const DropdownCheckboxItem = ({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  class: className,
  children,
  onClick,
  ...rest
}: DropdownCheckboxItemProps) => {
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
      data-slot="dropdown-checkbox-item"
      aria-checked={checked}
      class={cn(
        "relative flex w-full cursor-default select-none items-center gap-1 rounded-sm py-0.5 ps-7 pe-1.5 text-sm outline-none transition-colors duration-100",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
      <span class="pointer-events-none absolute start-1.5 flex size-3 items-center justify-center" aria-hidden>
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
            class="size-3.5"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : null}
      </span>
      {children}
    </button>
  );
};
