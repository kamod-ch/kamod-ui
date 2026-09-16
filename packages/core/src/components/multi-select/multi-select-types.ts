import type { ComponentChildren } from "preact";

export type MultiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

/**
 * Labels for selected values that may be absent from the current `options` list
 * (e.g. after async reload). Keys are stable option IDs (`value`).
 */
export type MultiSelectSelectedLabels = Record<string, string>;

export type MultiSelectLabels = {
  placeholder?: string;
  searchPlaceholder?: string;
  empty?: string;
  loading?: string;
  removeOption?: (label: string) => string;
  clearAll?: string;
  showMore?: (count: number) => string;
  showLess?: string;
};

export type MultiSelectProps = {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[]) => void;
  /** Notifies consumer to filter/reload `options` — MultiSelect does not fetch. */
  onSearchChange?: (query: string) => void;
  selectedLabels?: MultiSelectSelectedLabels;
  loading?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  maxVisible?: number;
  showClear?: boolean;
  labels?: MultiSelectLabels;
  id?: string;
  class?: string;
  triggerClass?: string;
  empty?: ComponentChildren;
};
