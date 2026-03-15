import { useMemo } from "preact/hooks";
import { signal } from "@preact/signals";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type MenubarCheckboxItemProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-4"
    aria-hidden
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const MenubarCheckboxItem = ({
  class: className,
  children,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  onClick,
  ...rest
}: MenubarCheckboxItemProps) => {
  const internal = useMemo(() => signal(defaultChecked), []);
  const checked = controlledChecked !== undefined ? controlledChecked : internal.value;

  const setChecked = (next: boolean) => {
    if (controlledChecked === undefined) internal.value = next;
    onCheckedChange?.(next);
  };

  return (
    <button
      type="button"
      role="menuitemcheckbox"
      data-slot="menubar-checkbox-item"
      aria-checked={checked}
      disabled={disabled}
      class={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-start text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        setChecked(!checked);
      }}
      {...rest}
    >
      <span class="absolute start-2 flex size-3.5 items-center justify-center">
        {checked ? <CheckIcon /> : null}
      </span>
      {children}
    </button>
  );
};
