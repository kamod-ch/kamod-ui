import { FilterBar } from "./FilterBar";
import { FilterBarChip } from "./FilterBarChip";
import { FilterBarChips } from "./FilterBarChips";
import { FilterBarControls } from "./FilterBarControls";
import { FilterBarMeta } from "./FilterBarMeta";
import { FilterBarReset } from "./FilterBarReset";
import { FilterBarResultCount } from "./FilterBarResultCount";
import { FilterBarSearch } from "./FilterBarSearch";
import {
  filterBar,
  filterBarChip,
  filterBarChipLabel,
  filterBarChipRemove,
  filterBarChips,
  filterBarControls,
  filterBarMeta,
  filterBarReset,
  filterBarResultCount,
  filterBarSearch,
} from "./filter-bar-variants";

const FilterBarVariants = {
  filterBar,
  filterBarSearch,
  filterBarControls,
  filterBarChips,
  filterBarChip,
  filterBarChipLabel,
  filterBarChipRemove,
  filterBarMeta,
  filterBarResultCount,
  filterBarReset,
};

export type { FilterBarProps } from "./FilterBar";

export type { FilterBarChipProps } from "./FilterBarChip";
export type { FilterBarChipsProps } from "./FilterBarChips";
export type { FilterBarControlsProps } from "./FilterBarControls";
export type { FilterBarMetaProps } from "./FilterBarMeta";
export type { FilterBarResetProps } from "./FilterBarReset";
export type { FilterBarResultCountProps } from "./FilterBarResultCount";
export type { FilterBarSearchProps } from "./FilterBarSearch";
export type {
  DemoFilters,
  DemoTask,
  FilterBarDemoLabels,
  FilterBarDemoProps,
} from "./filter-bar-demo";
export {
  DEFAULT_DEMO_FILTERS,
  DEMO_TASKS,
  EN_DEMO_LABELS,
  FilterBarDemo,
  filterDemoTasks,
} from "./filter-bar-demo";
export {
  FilterBar,
  FilterBarChip,
  FilterBarChips,
  FilterBarControls,
  FilterBarMeta,
  FilterBarReset,
  FilterBarResultCount,
  FilterBarSearch,
  FilterBarVariants,
  filterBar,
  filterBarChip,
  filterBarChipLabel,
  filterBarChipRemove,
  filterBarChips,
  filterBarControls,
  filterBarMeta,
  filterBarReset,
  filterBarResultCount,
  filterBarSearch,
};

export default {
  Root: FilterBar,
  Search: FilterBarSearch,
  Controls: FilterBarControls,
  Chips: FilterBarChips,
  Chip: FilterBarChip,
  Meta: FilterBarMeta,
  ResultCount: FilterBarResultCount,
  Reset: FilterBarReset,
};
