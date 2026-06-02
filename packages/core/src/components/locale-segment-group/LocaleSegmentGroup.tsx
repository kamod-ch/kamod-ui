import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type LocaleSegmentOption = { value: string; label: string };

const defaultOptions: LocaleSegmentOption[] = [
  { value: "de", label: "DE" },
  { value: "en", label: "EN" },
];

const btnBase = "rounded px-2 py-1 text-[13px] font-medium transition-colors";

const btnActive = "bg-black text-white dark:bg-white dark:text-black";

const btnInactive =
  "bg-[#f7f4ee] text-black/60 hover:bg-black/5 hover:text-black dark:bg-transparent dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-100";

export type LocaleSegmentGroupProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "class" | "role" | "value"
> & {
  value: string;
  onValueChange: (next: string) => void;
  options?: LocaleSegmentOption[];
  class?: string;
};

export const LocaleSegmentGroup = ({
  value,
  onValueChange,
  options = defaultOptions,
  class: className,
  "aria-label": ariaLabel = "Language",
  ...rest
}: LocaleSegmentGroupProps) => {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="locale-segment-group"
      class={cn("flex items-center gap-0.5", className)}
      {...rest}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            data-state={selected ? "on" : "off"}
            aria-pressed={selected}
            class={cn(btnBase, selected ? btnActive : btnInactive)}
            onClick={() => {
              if (selected) return;
              onValueChange(opt.value);
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
