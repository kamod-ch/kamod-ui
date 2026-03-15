import { useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import { Calendar } from "../calendar/Calendar";
import { Popover } from "../popover/Popover";
import { PopoverContent } from "../popover/PopoverContent";
import { PopoverTrigger } from "../popover/PopoverTrigger";

/** Long date label (~`date-fns` `PPP`) without extra dependencies. */
export const formatDatePickerDisplay = (date: Date, locale?: string) =>
  date.toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

const CalendarGlyph = ({ class: className }: { class?: string }) => (
  <svg
    class={cn("size-4 shrink-0 opacity-60", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ChevronDownGlyph = ({ class: className }: { class?: string }) => (
  <svg
    class={cn("size-4 shrink-0 opacity-60", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export type DatePickerProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (next: Date | undefined) => void;
  placeholder?: string;
  /** Close popover after a day is picked (single mode). @default true */
  closeOnSelect?: boolean;
  align?: "start" | "center" | "end";
  /** Trigger affordance aligned with shadcn demos. @default "chevron" */
  triggerIcon?: "chevron" | "calendar" | "none";
  format?: (date: Date) => string;
  children?: ComponentChildren;
};

export const DatePicker = ({
  class: className,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date",
  closeOnSelect = true,
  align = "start",
  triggerIcon = "chevron",
  format = formatDatePickerDisplay,
  children,
  ...rest
}: DatePickerProps) => {
  const [localValue, setLocalValue] = useState<Date | undefined>(defaultValue);
  const [open, setOpen] = useState(false);
  const selected = value !== undefined ? value : localValue;
  const isControlled = value !== undefined;

  const setSelected = (next: Date | undefined) => {
    if (!isControlled) setLocalValue(next);
    onValueChange?.(next);
  };

  const iconEl =
    triggerIcon === "calendar" ? (
      <CalendarGlyph />
    ) : triggerIcon === "chevron" ? (
      <ChevronDownGlyph />
    ) : null;

  return (
    <div data-slot="date-picker" class={cn("inline-flex", className)} {...rest}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {children ?? (
            <Button
              variant="outline"
              data-empty={selected ? undefined : "true"}
              class={cn(
                "data-[empty=true]:text-muted-foreground w-[min(100%,280px)] text-start font-normal",
                triggerIcon === "chevron" && "justify-between",
                (triggerIcon === "calendar" || triggerIcon === "none") && "justify-start gap-2"
              )}
            >
              {triggerIcon === "calendar" ? iconEl : null}
              <span class="min-w-0 flex-1 truncate">
                {selected ? format(selected) : <span>{placeholder}</span>}
              </span>
              {triggerIcon === "chevron" ? iconEl : null}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0" align={align} sideOffset={4}>
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(d) => {
              if (!(d instanceof Date)) return;
              setSelected(d);
              if (closeOnSelect) setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
