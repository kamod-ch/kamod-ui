import { signal } from "@preact/signals";
import type { ComponentChildren, JSX } from "preact";
import { useMemo, useRef } from "preact/hooks";
import { cn } from "../../lib/utils";
import { InputOTPContext } from "./input-otp-context";
import { filterOtpValue, REGEXP_ONLY_DIGITS } from "./patterns";

export type InputOTPProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "onInput" | "onChange"> & {
  maxLength?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  pattern?: RegExp;
  disabled?: boolean;
  id?: string;
  name?: string;
  autoComplete?: string;
  children?: ComponentChildren;
};

const activeSlotIndex = (focused: boolean, caret: number, len: number, max: number): number => {
  if (!focused) return -1;
  if (len >= max) return max - 1;
  return Math.min(Math.max(caret, 0), len, max - 1);
};

export const InputOTP = ({
  maxLength = 6,
  value: controlledValue,
  defaultValue = "",
  onChange,
  onValueChange,
  pattern,
  disabled = false,
  id,
  name,
  autoComplete = "one-time-code",
  class: className,
  children,
  dir,
  "aria-label": ariaLabel,
  ...rest
}: InputOTPProps) => {
  const isControlled = controlledValue !== undefined;
  const internal = useMemo(() => signal(defaultValue), []);
  const focused = useMemo(() => signal(false), []);
  const caretStart = useMemo(() => signal(0), []);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayValue = isControlled ? (controlledValue ?? "") : internal.value;

  const bumpCaret = () => {
    requestAnimationFrame(() => {
      const el = inputRef.current;
      const len = displayValue.length;
      caretStart.value = el != null && typeof el.selectionStart === "number" ? el.selectionStart : len;
    });
  };

  const emit = (next: string) => {
    if (!isControlled) internal.value = next;
    onChange?.(next);
    onValueChange?.(next);
  };

  const handleInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    let next = filterOtpValue(event.currentTarget.value, pattern);
    if (next.length > maxLength) next = next.slice(0, maxLength);
    emit(next);
    bumpCaret();
  };

  const activeIndex = activeSlotIndex(focused.value, caretStart.value, displayValue.length, maxLength);

  return (
    <InputOTPContext.Provider
      value={{
        value: displayValue,
        maxLength,
        disabled,
        focused: focused.value,
        activeIndex,
        inputRef
      }}
    >
      <div data-slot="input-otp" dir={dir} class={cn("relative inline-flex", className)} {...rest}>
        <div class="relative inline-flex items-center">
          <div class="pointer-events-none flex items-center gap-1">{children}</div>
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="text"
            autoComplete={autoComplete}
            inputMode={pattern === REGEXP_ONLY_DIGITS ? "numeric" : "text"}
            disabled={disabled}
            value={displayValue}
            maxLength={maxLength}
            aria-label={ariaLabel ?? "One-time password"}
            class={cn(
              "absolute inset-0 z-20 h-full w-full cursor-default border-0 bg-transparent p-0 opacity-0 outline-none",
              "focus-visible:outline-none"
            )}
            style={{ caretColor: "transparent" }}
            onInput={handleInput}
            onKeyDown={() => bumpCaret()}
            onKeyUp={() => bumpCaret()}
            onSelect={() => bumpCaret()}
            onFocus={() => {
              focused.value = true;
              bumpCaret();
            }}
            onBlur={() => {
              focused.value = false;
            }}
            onClick={() => bumpCaret()}
          />
        </div>
      </div>
    </InputOTPContext.Provider>
  );
};
