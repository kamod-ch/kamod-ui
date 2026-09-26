import { useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCommand,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "../combobox";
import { Skeleton } from "../skeleton/Skeleton";
import { MultiSelectChips } from "./MultiSelectChips";
import type { MultiSelectOption, MultiSelectProps } from "./multi-select-types";

export const MultiSelect = ({
  options,
  value,
  defaultValue,
  onValueChange,
  onSearchChange,
  selectedLabels,
  loading = false,
  disabled = false,
  invalid = false,
  maxVisible = 3,
  showClear = false,
  labels,
  id,
  class: className,
  triggerClass,
  empty,
}: MultiSelectProps) => {
  const [expanded, setExpanded] = useState(false);

  const placeholder = labels?.placeholder ?? "Select options…";
  const searchPlaceholder = labels?.searchPlaceholder ?? "Search…";
  const emptyText = labels?.empty ?? "No options found.";
  const loadingText = labels?.loading ?? "Loading options…";

  return (
    <Combobox
      id={id}
      class={className}
      data-slot="multi-select"
      items={options}
      itemKey={(option) => (option as MultiSelectOption).value}
      itemToStringValue={(option) => (option as MultiSelectOption).label}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (Array.isArray(next)) {
          onValueChange?.(next);
        }
      }}
      multiple
      liftedFilter
      autoHighlight
      showClear={showClear}
      disabled={disabled}
      placeholder={placeholder}
    >
      <ComboboxChips
        class={cn(invalid && "border-destructive focus-within:ring-destructive/30", triggerClass)}
        aria-invalid={invalid || undefined}
      >
        <MultiSelectChips
          options={options}
          selectedLabels={selectedLabels}
          maxVisible={maxVisible}
          expanded={expanded}
          onExpandedChange={setExpanded}
          labels={labels}
          disabled={disabled}
          placeholder={placeholder}
        />
        {showClear ? (
          <ComboboxClear class="shrink-0" aria-label={labels?.clearAll ?? "Clear all selections"} />
        ) : null}
        <ComboboxChipsInput
          placeholder={searchPlaceholder}
          onInput={(event) => {
            onSearchChange?.(event.currentTarget.value);
          }}
        />
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxCommand>
          {loading ? (
            <div class="space-y-2 p-2" data-slot="multi-select-loading" aria-busy="true">
              <span class="sr-only">{loadingText}</span>
              <Skeleton class="h-8 w-full" />
              <Skeleton class="h-8 w-full" />
            </div>
          ) : null}
          {!loading && empty ? (
            <div data-slot="multi-select-empty">{empty}</div>
          ) : (
            <ComboboxEmpty>{emptyText}</ComboboxEmpty>
          )}
          <ComboboxList>
            {(item) => {
              const option = item as MultiSelectOption;
              return (
                <ComboboxItem key={option.value} item={option} disabled={option.disabled}>
                  {option.label}
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxCommand>
      </ComboboxContent>
    </Combobox>
  );
};

export type { MultiSelectProps };
