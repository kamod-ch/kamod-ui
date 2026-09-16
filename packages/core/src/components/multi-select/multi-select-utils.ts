import type { MultiSelectOption, MultiSelectSelectedLabels } from "./multi-select-types";

export const resolveMultiSelectLabel = (
  value: string,
  options: MultiSelectOption[],
  selectedLabels?: MultiSelectSelectedLabels,
): string => {
  if (selectedLabels?.[value]) {
    return selectedLabels[value]!;
  }
  const match = options.find((option) => option.value === value);
  if (match) {
    return match.label;
  }
  return value;
};
