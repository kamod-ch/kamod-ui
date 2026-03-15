import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useRadioGroup } from "../radio-group/RadioGroup";

/** Filled radio appearance: black ring, white field, black dot (reference: selection cards). */
function SelectableCardSelectedIndicator() {
  return (
    <span
      data-slot="selectable-card-indicator"
      class="pointer-events-none flex size-[22px] shrink-0 items-center justify-center rounded-full border-[2.5px] border-black bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)] dark:border-white dark:bg-neutral-950 dark:shadow-[0_1px_5px_rgba(0,0,0,0.45)]"
      aria-hidden
    >
      <span class="size-[9px] rounded-full bg-black dark:bg-white" />
    </span>
  );
}

export type SelectableCardProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "type" | "name" | "class" | "children"
> & {
  value: string;
  children?: ComponentChildren;
  class?: string;
};

/** Card-style radio option for use inside `RadioGroup`. */
export const SelectableCard = ({
  value,
  children,
  class: className,
  onChange,
  disabled,
  ...rest
}: SelectableCardProps) => {
  const group = useRadioGroup();
  const selected =
    group.controlledValue !== undefined ? group.controlledValue : group.value.value;
  const checked = selected === value;

  return (
    <label
      data-slot="selectable-card"
      data-state={checked ? "checked" : "unchecked"}
      class={cn(
        "block cursor-pointer rounded-lg outline-none focus-within:outline-none focus-within:ring-0",
        "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
        className
      )}
    >
      <input
        type="radio"
        data-slot="selectable-card-input"
        class="peer sr-only outline-none focus:outline-none focus-visible:outline-none focus:ring-0"
        name={group.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          group.setValue(value);
          onChange?.(event);
          const el = event.currentTarget as HTMLInputElement;
          const nextSelected =
            group.controlledValue !== undefined ? group.controlledValue : group.value.value;
          el.checked = nextSelected === value;
        }}
        {...rest}
      />
      <div
        class={cn(
          "relative rounded-lg border-2 p-3 text-left transition-[border-color,background-color]",
          checked
            ? "border-neutral-300 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800/70"
            : "border-border/35 bg-background hover:border-border/60"
        )}
      >
        {checked ? (
          <span class="pointer-events-none absolute end-2.5 top-2.5">
            <SelectableCardSelectedIndicator />
          </span>
        ) : null}
        <div class={cn("min-w-0", checked && "pe-9")}>{children}</div>
      </div>
    </label>
  );
};
