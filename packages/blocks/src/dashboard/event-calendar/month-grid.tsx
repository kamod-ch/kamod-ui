import { cn } from "@kamod-ch/ui";
import type { JSX, Ref } from "preact";
import { isDateKeyInRange, typeColor, weekdayLabels } from "./date";
import type {
  CalendarDateRange,
  CalendarEvent,
  DateKey,
  EventTypeConfig,
  MonthCell,
} from "./types";

export type MonthGridProps = {
  grid: MonthCell[][];
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale: string;
  todayKey: DateKey;
  focusedKey: DateKey;
  range: CalendarDateRange | null;
  eventsFor: (key: DateKey) => CalendarEvent[];
  types: EventTypeConfig[];
  onGridKeyDown: (event: JSX.TargetedKeyboardEvent<HTMLElement>) => void;
  onSelect: (key: DateKey, shift: boolean) => void;
  onCellPointerDown: (key: DateKey, event: JSX.TargetedPointerEvent<HTMLElement>) => void;
  onCellPointerEnter: (key: DateKey) => void;
  onCellPointerUp: () => void;
  gridRef?: Ref<HTMLDivElement>;
};

export const MonthGrid = ({
  grid,
  weekStartsOn,
  locale,
  todayKey,
  focusedKey,
  range,
  eventsFor,
  types,
  onGridKeyDown,
  onSelect,
  onCellPointerDown,
  onCellPointerEnter,
  onCellPointerUp,
  gridRef,
}: MonthGridProps) => {
  const labels = weekdayLabels(locale, weekStartsOn);

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label="Month"
      class="min-w-0 overflow-x-auto"
      onKeyDown={onGridKeyDown}
    >
      <div role="row" class="text-muted-foreground mb-1 grid grid-cols-7 gap-1 text-center text-xs">
        {labels.map((label) => (
          <div role="columnheader" key={label}>
            {label}
          </div>
        ))}
      </div>
      <div class="grid gap-1">
        {grid.map((row) => (
          <div role="row" class="grid grid-cols-7 gap-1" key={row[0]?.key}>
            {row.map((cell) => {
              const selected = range ? isDateKeyInRange(cell.key, range.start, range.end) : false;
              const focused = cell.key === focusedKey;
              const today = cell.key === todayKey;
              const dayEvents = eventsFor(cell.key);
              return (
                <div role="gridcell" key={cell.key} aria-selected={selected}>
                  <button
                    type="button"
                    data-date={cell.key}
                    tabIndex={focused ? 0 : -1}
                    aria-current={today ? "date" : undefined}
                    aria-label={cell.key}
                    class={cn(
                      "flex h-16 w-full flex-col items-start rounded-md border p-1 text-left text-xs outline-none",
                      "focus-visible:ring-ring focus-visible:ring-2",
                      cell.inMonth ? "bg-background" : "bg-muted/40 text-muted-foreground",
                      selected && "border-primary bg-primary/10",
                      today && "ring-ring/40 ring-1",
                    )}
                    onClick={(event) => onSelect(cell.key, event.shiftKey)}
                    onPointerDown={(event) => onCellPointerDown(cell.key, event)}
                    onPointerEnter={() => onCellPointerEnter(cell.key)}
                    onPointerUp={onCellPointerUp}
                  >
                    <span class="font-medium">{Number(cell.key.slice(8))}</span>
                    <span class="mt-auto flex w-full flex-wrap gap-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <span
                          key={event.id}
                          class="h-1.5 w-1.5 rounded-full"
                          style={{ background: typeColor(event.type, types) }}
                          title={event.title}
                        />
                      ))}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
