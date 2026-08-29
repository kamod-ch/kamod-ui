import type { JSX } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { toDateKey, useControllableState } from "../../shared";
import {
  addMonthsToDateKey,
  buildMonthGrid,
  compareDateKeys,
  eventDateKeys,
  eventsOnDate,
  startOfMonthKey,
  upcomingEvents,
} from "./date";
import { isSelectKey, moveFocusedDateKey } from "./keyboard";
import { applyDateSelection } from "./selection";
import type {
  CalendarDateRange,
  CalendarEvent,
  CalendarEventAction,
  DateKey,
  WeekStartsOn,
} from "./types";

export type UseEventCalendarOptions = {
  events?: CalendarEvent[];
  onEventsChange?: (events: CalendarEvent[]) => void;
  selectedRange?: CalendarDateRange | null;
  defaultSelectedRange?: CalendarDateRange | null;
  onSelectedRangeChange?: (range: CalendarDateRange | null) => void;
  visibleMonth?: DateKey;
  defaultVisibleMonth?: DateKey;
  onVisibleMonthChange?: (month: DateKey) => void;
  weekStartsOn?: WeekStartsOn;
  locale?: string;
  timeZone?: string;
  now?: Date;
  readOnly?: boolean;
  onEventAction?: (action: CalendarEventAction, event: CalendarEvent) => void;
};

export const useEventCalendar = ({
  events = [],
  onEventsChange,
  selectedRange,
  defaultSelectedRange = null,
  onSelectedRangeChange,
  visibleMonth,
  defaultVisibleMonth,
  onVisibleMonthChange,
  weekStartsOn = 0,
  locale = "en",
  timeZone,
  now,
  readOnly = false,
  onEventAction,
}: UseEventCalendarOptions) => {
  const reference = now ?? new Date();
  const todayKey = toDateKey(reference, timeZone);
  const [range, setRange] = useControllableState<CalendarDateRange | null>({
    value: selectedRange,
    defaultValue: defaultSelectedRange,
    onChange: onSelectedRangeChange,
  });
  const [monthKey, setMonthKey] = useControllableState<DateKey>({
    value: visibleMonth,
    defaultValue: defaultVisibleMonth ?? startOfMonthKey(todayKey),
    onChange: onVisibleMonthChange,
  });
  const [focusedKey, setFocusedKey] = useState<DateKey>(range?.end ?? todayKey);
  const anchorRef = useRef<DateKey | null>(range?.start ?? null);
  const draggingRef = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (range) setFocusedKey(range.end);
  }, [range]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const active = typeof document === "undefined" ? null : document.activeElement;
    if (active && !grid.contains(active)) return;
    const next = grid.querySelector<HTMLElement>(`[data-date="${focusedKey}"]`);
    next?.focus();
  }, [focusedKey, monthKey]);

  const grid = useMemo(() => buildMonthGrid(monthKey, weekStartsOn), [monthKey, weekStartsOn]);

  const reveal = (key: DateKey) => {
    const nextMonth = startOfMonthKey(key);
    if (nextMonth !== startOfMonthKey(monthKey)) setMonthKey(nextMonth);
    setFocusedKey(key);
  };

  const selectKey = (key: DateKey, shift: boolean) => {
    const next = applyDateSelection(key, shift, anchorRef.current);
    anchorRef.current = next.anchor;
    setRange(next.range);
    reveal(key);
  };

  const goByMonths = (delta: number) => {
    const next = addMonthsToDateKey(monthKey, delta);
    setMonthKey(startOfMonthKey(next));
    setFocusedKey(addMonthsToDateKey(focusedKey, delta));
  };

  const goToday = () => {
    setMonthKey(startOfMonthKey(todayKey));
    setFocusedKey(todayKey);
    selectKey(todayKey, false);
  };

  const onGridKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLElement>) => {
    const next = moveFocusedDateKey(focusedKey, event.key, weekStartsOn);
    if (next) {
      event.preventDefault();
      reveal(next);
      return;
    }
    if (isSelectKey(event.key)) {
      event.preventDefault();
      selectKey(focusedKey, event.shiftKey);
    }
  };

  const onCellPointerDown = (key: DateKey, event: JSX.TargetedPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    draggingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    selectKey(key, event.shiftKey);
  };

  const onCellPointerEnter = (key: DateKey) => {
    if (!draggingRef.current) return;
    selectKey(key, true);
  };

  const onCellPointerUp = () => {
    draggingRef.current = false;
  };

  const selectedEvents = useMemo(() => {
    if (!range) return [];
    const seen = new Set<string>();
    const list: CalendarEvent[] = [];
    for (const event of events) {
      const keys = eventDateKeys(event, timeZone);
      if (
        keys.some(
          (key) => compareDateKeys(key, range.start) >= 0 && compareDateKeys(key, range.end) <= 0,
        )
      ) {
        if (!seen.has(event.id)) {
          seen.add(event.id);
          list.push(event);
        }
      }
    }
    return list;
  }, [events, range, timeZone]);

  const upcoming = useMemo(
    () => upcomingEvents(events, todayKey, timeZone),
    [events, timeZone, todayKey],
  );

  const emitEvents = (next: CalendarEvent[]) => onEventsChange?.(next);

  const runAction = (action: CalendarEventAction, event: CalendarEvent) => {
    onEventAction?.(action, event);
    if (readOnly) return;
    if (action === "delete") {
      emitEvents(events.filter((item) => item.id !== event.id));
      return;
    }
    if (action === "duplicate") {
      const copyId = `${event.id}-copy`;
      const taken = new Set(events.map((item) => item.id));
      let id = copyId;
      let n = 2;
      while (taken.has(id)) {
        id = `${copyId}-${n}`;
        n += 1;
      }
      emitEvents([...events, { ...event, id, title: `${event.title} (copy)` }]);
    }
  };

  return {
    events,
    todayKey,
    monthKey,
    focusedKey,
    range,
    grid,
    weekStartsOn,
    locale,
    timeZone,
    readOnly,
    selectedEvents,
    upcoming,
    eventsOnDate: (key: DateKey) => eventsOnDate(events, key, timeZone),
    selectKey,
    goPrev: () => goByMonths(-1),
    goNext: () => goByMonths(1),
    goToday,
    reveal,
    onGridKeyDown,
    onCellPointerDown,
    onCellPointerEnter,
    onCellPointerUp,
    runAction,
    gridRef,
  };
};
