import { RemovableChip } from "../chip-field/RemovableChip";
import { useCombobox } from "../combobox";
import type {
  MultiSelectLabels,
  MultiSelectOption,
  MultiSelectSelectedLabels,
} from "./multi-select-types";
import { resolveMultiSelectLabel } from "./multi-select-utils";

export type MultiSelectChipsProps = {
  options: MultiSelectOption[];
  selectedLabels?: MultiSelectSelectedLabels;
  maxVisible: number;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  labels?: MultiSelectLabels;
  disabled?: boolean;
  placeholder: string;
};

export const MultiSelectChips = ({
  options,
  selectedLabels,
  maxVisible,
  expanded,
  onExpandedChange,
  labels,
  disabled = false,
  placeholder,
}: MultiSelectChipsProps) => {
  const ctx = useCombobox();
  const keys = ctx.selectedKeys;

  if (keys.length === 0) {
    return <span class="text-muted-foreground px-1 py-0.5 text-sm">{placeholder}</span>;
  }

  const visibleKeys = expanded ? keys : keys.slice(0, maxVisible);
  const hiddenCount = expanded ? 0 : Math.max(0, keys.length - maxVisible);

  return (
    <>
      {visibleKeys.map((key) => {
        const label = resolveMultiSelectLabel(key, options, selectedLabels);
        const removeLabel = labels?.removeOption?.(label) ?? `Remove ${label}`;
        return (
          <RemovableChip
            key={key}
            data-option-id={key}
            removeLabel={removeLabel}
            disabled={disabled}
            onRemove={() => ctx.removeKey(key)}
          >
            {label}
          </RemovableChip>
        );
      })}
      {hiddenCount > 0 ? (
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground rounded-md px-1.5 py-0.5 text-xs underline-offset-2 hover:underline"
          onClick={(event) => {
            event.stopPropagation();
            onExpandedChange(true);
          }}
        >
          {labels?.showMore?.(hiddenCount) ?? `+${hiddenCount} more`}
        </button>
      ) : null}
      {expanded && keys.length > maxVisible ? (
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground rounded-md px-1.5 py-0.5 text-xs underline-offset-2 hover:underline"
          onClick={(event) => {
            event.stopPropagation();
            onExpandedChange(false);
          }}
        >
          {labels?.showLess ?? "Show less"}
        </button>
      ) : null}
    </>
  );
};
