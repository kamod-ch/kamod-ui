import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { useInputOTP } from "./input-otp-context";

export type InputOTPSlotProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  index: number;
};

export const InputOTPSlot = ({ index, class: className, ...rest }: InputOTPSlotProps) => {
  const ctx = useInputOTP();
  const char = ctx.value[index] ?? "";
  const active = !ctx.disabled && ctx.focused && index === ctx.activeIndex;

  return (
    <span
      data-slot="input-otp-slot"
      data-active={active ? "true" : "false"}
      class={cn(
        "relative flex size-10 items-center justify-center rounded-md border border-input bg-background font-mono text-sm tabular-nums shadow-xs transition-[box-shadow,border-color]",
        "data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50",
        ctx.disabled && "opacity-50",
        className
      )}
      {...rest}
    >
      {char}
    </span>
  );
};
