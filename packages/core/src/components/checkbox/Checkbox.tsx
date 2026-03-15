import { useLayoutEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type CheckboxCheckedState = boolean | "indeterminate";

export type CheckboxProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "type" | "checked" | "defaultChecked" | "onChange"
> & {
  checked?: CheckboxCheckedState;
  defaultChecked?: CheckboxCheckedState;
  onCheckedChange?: (checked: CheckboxCheckedState) => void;
  onChange?: (event: JSX.TargetedEvent<HTMLInputElement>) => void;
};

const CheckIcon = ({ class: className }: { class?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={cn("size-3.5", className)}
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const MinusIcon = ({ class: className }: { class?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class={cn("size-3.5", className)} aria-hidden="true">
    <path d="M5 12h14" stroke-linecap="round" />
  </svg>
);

export const Checkbox = ({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  onChange,
  class: className,
  disabled,
  ref: outerRef,
  id,
  ...rest
}: CheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = checkedProp !== undefined;
  const [inner, setInner] = useState<CheckboxCheckedState>(() => defaultChecked);
  const state: CheckboxCheckedState = isControlled ? checkedProp! : inner;

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.indeterminate = state === "indeterminate";
  }, [state]);

  const dataState = state === true ? "checked" : state === "indeterminate" ? "indeterminate" : "unchecked";

  return (
    <span
      data-slot="checkbox"
      data-state={dataState}
      class={cn("group relative inline-grid size-4 shrink-0 place-content-center align-middle", className)}
    >
      <input
        {...rest}
        id={id}
        ref={(node) => {
          inputRef.current = node;
          if (typeof outerRef === "function") {
            outerRef(node);
          } else if (outerRef && typeof outerRef === "object" && "current" in outerRef) {
            (outerRef as { current: HTMLInputElement | null }).current = node;
          }
        }}
        type="checkbox"
        disabled={disabled}
        checked={state === true}
        aria-checked={state === "indeterminate" ? "mixed" : state}
        class={peerInputClass}
        onChange={(event) => {
          const el = event.currentTarget as HTMLInputElement;
          const next: CheckboxCheckedState = el.indeterminate ? "indeterminate" : el.checked;
          if (!isControlled) {
            setInner(next);
          }
          onCheckedChange?.(next);
          onChange?.(event);
        }}
      />
      <span
        class={cn(
          "pointer-events-none col-start-1 row-start-1 flex size-4 items-center justify-center rounded-[4px] border border-input bg-background shadow-xs transition-[color,box-shadow,background-color,border-color]",
          "text-transparent dark:bg-input/30",
          "group-data-[state=checked]:border-foreground group-data-[state=checked]:bg-foreground group-data-[state=checked]:text-background",
          "group-data-[state=indeterminate]:border-foreground group-data-[state=indeterminate]:bg-foreground group-data-[state=indeterminate]:text-background",
          "peer-focus-visible:outline-none peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          "peer-aria-invalid:border-destructive peer-aria-invalid:ring-destructive/20 dark:peer-aria-invalid:ring-destructive/40"
        )}
        aria-hidden="true"
      >
        <CheckIcon
          class={cn(
            "transition-opacity",
            state === true ? "opacity-100" : "opacity-0",
            state === "indeterminate" && "hidden"
          )}
        />
        <MinusIcon class={cn("absolute transition-opacity", state === "indeterminate" ? "opacity-100" : "opacity-0")} />
      </span>
    </span>
  );
};

const peerInputClass = cn(
  "peer absolute inset-0 z-10 size-4 cursor-pointer appearance-none opacity-0",
  "disabled:cursor-not-allowed"
);
