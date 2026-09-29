import { useEffect, useMemo, useState } from "preact/hooks";
import type { DateRange } from "../calendar/Calendar";
import {
  createDateRangePresets,
  DateRangePicker,
  formatDateRangeDisplay,
} from "../date-range-picker";
import { atNoon, isSameCalendarDay } from "../date-range-picker/date-range-utils";
import { Label } from "../label/Label";
import { NativeSelect, NativeSelectOption } from "../native-select";
import { FilterBar } from "./FilterBar";
import { FilterBarChip } from "./FilterBarChip";
import { FilterBarChips } from "./FilterBarChips";
import { FilterBarControls } from "./FilterBarControls";
import { FilterBarMeta } from "./FilterBarMeta";
import { FilterBarReset } from "./FilterBarReset";
import { FilterBarResultCount } from "./FilterBarResultCount";
import { FilterBarSearch } from "./FilterBarSearch";

export type DemoTask = {
  id: string;
  title: string;
  status: "open" | "done" | "blocked";
  assignee: "Ada" | "Grace" | "Alan";
  created: Date;
};

export const DEMO_TASKS: DemoTask[] = [
  {
    id: "t1",
    title: "Wire dashboard filters",
    status: "open",
    assignee: "Ada",
    created: atNoon(new Date(2024, 5, 3)),
  },
  {
    id: "t2",
    title: "Review accessibility notes",
    status: "done",
    assignee: "Grace",
    created: atNoon(new Date(2024, 5, 8)),
  },
  {
    id: "t3",
    title: "Ship KPI cards",
    status: "blocked",
    assignee: "Alan",
    created: atNoon(new Date(2024, 5, 12)),
  },
  {
    id: "t4",
    title: "Document date range picker",
    status: "open",
    assignee: "Grace",
    created: atNoon(new Date(2024, 5, 14)),
  },
];

export type DemoFilters = {
  search: string;
  status: "all" | DemoTask["status"];
  assignee: "all" | DemoTask["assignee"];
  dateRange?: DateRange;
};

export const DEFAULT_DEMO_FILTERS: DemoFilters = {
  search: "",
  status: "all",
  assignee: "all",
  dateRange: undefined,
};

const isInRange = (day: Date, range: DateRange) => {
  if (!range.from || !range.to) return true;
  const value = atNoon(day).getTime();
  const from = atNoon(range.from).getTime();
  const to = atNoon(range.to).getTime();
  return value >= from && value <= to;
};

export const filterDemoTasks = (tasks: DemoTask[], filters: DemoFilters) =>
  tasks.filter((task) => {
    const query = filters.search.trim().toLowerCase();
    if (query && !task.title.toLowerCase().includes(query)) return false;
    if (filters.status !== "all" && task.status !== filters.status) return false;
    if (filters.assignee !== "all" && task.assignee !== filters.assignee) return false;
    if (
      filters.dateRange?.from &&
      filters.dateRange?.to &&
      !isInRange(task.created, filters.dateRange)
    ) {
      return false;
    }
    return true;
  });

export type FilterBarDemoLabels = {
  search: string;
  searchPlaceholder: string;
  status: string;
  assignee: string;
  dateRangePlaceholder: string;
  apply: string;
  cancel: string;
  incompleteRange: string;
  presetsGroup: string;
  presetToday: string;
  presetLast7: string;
  presetLast30: string;
  presetMonthToDate: string;
  presetPreviousMonth: string;
  chipSearch: (query: string) => string;
  chipStatus: (status: string) => string;
  chipAssignee: (assignee: string) => string;
  chipDateRange: (range: DateRange) => string;
  removeSearch: (query: string) => string;
  removeStatus: (status: string) => string;
  removeAssignee: (assignee: string) => string;
  removeDateRange: (range: DateRange) => string;
  results: (count: number) => string;
  reset: string;
  allStatuses: string;
  allAssignees: string;
  statusOpen: string;
  statusDone: string;
  statusBlocked: string;
  emptyTitle: string;
  emptyDescription: string;
};

export const EN_DEMO_LABELS: FilterBarDemoLabels = {
  search: "Search tasks",
  searchPlaceholder: "Search by title",
  status: "Status",
  assignee: "Assignee",
  dateRangePlaceholder: "Created date range",
  apply: "Apply",
  cancel: "Cancel",
  incompleteRange: "Select a start and end date.",
  presetsGroup: "Quick ranges",
  presetToday: "Today",
  presetLast7: "Last 7 days",
  presetLast30: "Last 30 days",
  presetMonthToDate: "Month to date",
  presetPreviousMonth: "Previous month",
  chipSearch: (query) => `Search: ${query}`,
  chipStatus: (status) => `Status: ${status}`,
  chipAssignee: (assignee) => `Assignee: ${assignee}`,
  chipDateRange: (range) =>
    `Created: ${formatDateRangeDisplay(range, "en-US", { month: "short", day: "numeric", year: "numeric" })}`,
  removeSearch: (query) => `Remove search filter ${query}`,
  removeStatus: (status) => `Remove status filter ${status}`,
  removeAssignee: (assignee) => `Remove assignee filter ${assignee}`,
  removeDateRange: (range) =>
    `Remove created date filter ${formatDateRangeDisplay(range, "en-US", { month: "short", day: "numeric", year: "numeric" })}`,
  results: (count) => `${count} result${count === 1 ? "" : "s"}`,
  reset: "Reset filters",
  allStatuses: "All statuses",
  allAssignees: "All assignees",
  statusOpen: "Open",
  statusDone: "Done",
  statusBlocked: "Blocked",
  emptyTitle: "No tasks match your filters",
  emptyDescription: "Try clearing a filter or broadening the date range.",
};

export type FilterBarDemoProps = {
  tasks?: DemoTask[];
  labels?: FilterBarDemoLabels;
  filters?: DemoFilters;
  onFiltersChange?: (next: DemoFilters) => void;
  debounceMs?: number;
  referenceDate?: Date;
};

export const FilterBarDemo = ({
  tasks = DEMO_TASKS,
  labels = EN_DEMO_LABELS,
  filters: filtersProp,
  onFiltersChange,
  debounceMs = 0,
  referenceDate = atNoon(new Date(2024, 5, 15)),
}: FilterBarDemoProps) => {
  const [localFilters, setLocalFilters] = useState<DemoFilters>(DEFAULT_DEMO_FILTERS);
  const filters = filtersProp ?? localFilters;
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  const setFilters = (next: DemoFilters) => {
    if (filtersProp === undefined) {
      setLocalFilters(next);
    }
    onFiltersChange?.(next);
  };

  useEffect(() => {
    if (debounceMs <= 0) return;
    const timer = window.setTimeout(() => setDebouncedSearch(filters.search), debounceMs);
    return () => window.clearTimeout(timer);
  }, [filters.search, debounceMs]);

  const effectiveFilters = useMemo(
    () => ({
      ...filters,
      search: debounceMs <= 0 ? filters.search : debouncedSearch,
    }),
    [filters, debouncedSearch, debounceMs],
  );

  const results = useMemo(
    () => filterDemoTasks(tasks, effectiveFilters),
    [tasks, effectiveFilters],
  );

  const presets = useMemo(
    () =>
      createDateRangePresets({
        today: labels.presetToday,
        last7Days: labels.presetLast7,
        last30Days: labels.presetLast30,
        monthToDate: labels.presetMonthToDate,
        previousMonth: labels.presetPreviousMonth,
      }),
    [labels],
  );

  const activeChips = useMemo(() => {
    const chips: Array<{ id: string; label: string; removeLabel: string; onRemove: () => void }> =
      [];
    const query = filters.search.trim();
    if (query) {
      chips.push({
        id: "search",
        label: labels.chipSearch(query),
        removeLabel: labels.removeSearch(query),
        onRemove: () => setFilters({ ...filters, search: "" }),
      });
    }
    if (filters.status !== "all") {
      chips.push({
        id: "status",
        label: labels.chipStatus(filters.status),
        removeLabel: labels.removeStatus(filters.status),
        onRemove: () => setFilters({ ...filters, status: "all" }),
      });
    }
    if (filters.assignee !== "all") {
      chips.push({
        id: "assignee",
        label: labels.chipAssignee(filters.assignee),
        removeLabel: labels.removeAssignee(filters.assignee),
        onRemove: () => setFilters({ ...filters, assignee: "all" }),
      });
    }
    if (filters.dateRange?.from && filters.dateRange?.to) {
      chips.push({
        id: "date-range",
        label: labels.chipDateRange(filters.dateRange),
        removeLabel: labels.removeDateRange(filters.dateRange),
        onRemove: () => setFilters({ ...filters, dateRange: undefined }),
      });
    }
    return chips;
  }, [filters, labels]);

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.status !== "all" ||
    filters.assignee !== "all" ||
    Boolean(filters.dateRange?.from && filters.dateRange?.to);

  const resetAll = () => setFilters(DEFAULT_DEMO_FILTERS);

  return (
    <div class="flex w-full min-w-0 flex-col gap-4" data-testid="filter-bar-demo">
      <FilterBar>
        <div class="flex min-w-0 flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
          <FilterBarSearch
            label={labels.search}
            placeholder={labels.searchPlaceholder}
            value={filters.search}
            onValueChange={(search) => setFilters({ ...filters, search })}
          />
          <FilterBarControls>
            <div class="flex min-w-[10rem] flex-col gap-1.5">
              <Label htmlFor="filter-bar-demo-status">{labels.status}</Label>
              <NativeSelect
                id="filter-bar-demo-status"
                size="sm"
                value={filters.status}
                onChange={(event) =>
                  setFilters({
                    ...filters,
                    status: event.currentTarget.value as DemoFilters["status"],
                  })
                }
              >
                <NativeSelectOption value="all">{labels.allStatuses}</NativeSelectOption>
                <NativeSelectOption value="open">{labels.statusOpen}</NativeSelectOption>
                <NativeSelectOption value="done">{labels.statusDone}</NativeSelectOption>
                <NativeSelectOption value="blocked">{labels.statusBlocked}</NativeSelectOption>
              </NativeSelect>
            </div>
            <div class="flex min-w-[10rem] flex-col gap-1.5">
              <Label htmlFor="filter-bar-demo-assignee">{labels.assignee}</Label>
              <NativeSelect
                id="filter-bar-demo-assignee"
                size="sm"
                value={filters.assignee}
                onChange={(event) =>
                  setFilters({
                    ...filters,
                    assignee: event.currentTarget.value as DemoFilters["assignee"],
                  })
                }
              >
                <NativeSelectOption value="all">{labels.allAssignees}</NativeSelectOption>
                <NativeSelectOption value="Ada">Ada</NativeSelectOption>
                <NativeSelectOption value="Grace">Grace</NativeSelectOption>
                <NativeSelectOption value="Alan">Alan</NativeSelectOption>
              </NativeSelect>
            </div>
            <DateRangePicker
              value={filters.dateRange}
              onValueChange={(dateRange) => setFilters({ ...filters, dateRange })}
              placeholder={labels.dateRangePlaceholder}
              labels={{ apply: labels.apply, cancel: labels.cancel }}
              validationMessages={{ incomplete: labels.incompleteRange }}
              presets={presets}
              presetsGroupLabel={labels.presetsGroup}
              referenceDate={referenceDate}
              format={(range) => formatDateRangeDisplay(range, "en-US")}
            />
          </FilterBarControls>
        </div>
        <div class="flex min-w-0 flex-wrap items-center gap-2">
          {activeChips.length ? (
            <FilterBarChips>
              {activeChips.map((chip) => (
                <FilterBarChip
                  key={chip.id}
                  label={chip.label}
                  removeLabel={chip.removeLabel}
                  onRemove={chip.onRemove}
                />
              ))}
            </FilterBarChips>
          ) : null}
          <FilterBarMeta>
            <FilterBarResultCount>{labels.results(results.length)}</FilterBarResultCount>
            <FilterBarReset disabled={!hasActiveFilters} onReset={resetAll}>
              {labels.reset}
            </FilterBarReset>
          </FilterBarMeta>
        </div>
      </FilterBar>

      {results.length ? (
        <ul class="divide-border divide-y rounded-md border" data-testid="filter-bar-demo-results">
          {results.map((task) => (
            <li key={task.id} class="px-3 py-2 text-sm" data-task-id={task.id}>
              {task.title}
            </li>
          ))}
        </ul>
      ) : (
        <div
          class="rounded-md border border-dashed px-4 py-6 text-center"
          data-testid="filter-bar-demo-empty"
        >
          <p class="font-medium">{labels.emptyTitle}</p>
          <p class="text-muted-foreground mt-1 text-sm">{labels.emptyDescription}</p>
        </div>
      )}
    </div>
  );
};

export const formatDemoDateRange = (range: DateRange) =>
  `${range.from?.getDate()}.${(range.from?.getMonth() ?? 0) + 1}.-${range.to?.getDate()}.${(range.to?.getMonth() ?? 0) + 1}.`;

export const isDemoDateRangeEqual = (a?: DateRange, b?: DateRange) => {
  if (!a?.from || !a?.to || !b?.from || !b?.to) return false;
  return isSameCalendarDay(a.from, b.from) && isSameCalendarDay(a.to, b.to);
};
