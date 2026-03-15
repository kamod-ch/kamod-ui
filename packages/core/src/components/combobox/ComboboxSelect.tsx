import { cn } from "../../lib/utils";
import { Combobox, type ComboboxProps } from "./combobox-context";
import { ComboboxChip } from "./ComboboxChip";
import { ComboboxChips } from "./ComboboxChips";
import { ComboboxChipsInput } from "./ComboboxChipsInput";
import { ComboboxClear } from "./ComboboxClear";
import { ComboboxCommand } from "./ComboboxCommand";
import { ComboboxContent } from "./ComboboxContent";
import { ComboboxEmpty } from "./ComboboxEmpty";
import { ComboboxInlineInput } from "./ComboboxInlineInput";
import { ComboboxInput } from "./ComboboxInput";
import { ComboboxItem } from "./ComboboxItem";
import { ComboboxList } from "./ComboboxList";
import { ComboboxTrigger } from "./ComboboxTrigger";
import { ComboboxValue } from "./ComboboxValue";

export type ComboboxOption = { label: string; value: string };

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden
    class="shrink-0 opacity-50"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export type ComboboxSelectProps = Omit<ComboboxProps, "items" | "children" | "itemKey" | "itemToStringValue"> & {
  options: ComboboxOption[];
  searchPlaceholder?: string;
  emptyText?: string;
  triggerClass?: string;
};

/** Preset around `{ label, value }[]`: button trigger, inline input trigger, multi chips, clear, and auto-highlight. */
export const ComboboxSelect = ({
  options,
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  triggerClass,
  showClear = false,
  autoHighlight = false,
  liftedFilter = false,
  multiple = false,
  class: className,
  placeholder,
  ...rest
}: ComboboxSelectProps) => {
  const useLifted = Boolean(liftedFilter || multiple);

  if (multiple) {
    return (
      <Combobox
        class={className}
        items={options}
        itemKey={(o) => (o as ComboboxOption).value}
        itemToStringValue={(o) => (o as ComboboxOption).label}
        multiple
        liftedFilter
        autoHighlight={autoHighlight}
        showClear={showClear}
        placeholder={placeholder}
        {...rest}
      >
        <ComboboxChips class={triggerClass}>
          <ComboboxValue placeholder={placeholder ?? "Select…"}>
            {({ keys, empty }) => (
              <>
                {keys.map((k) => {
                  const o = options.find((x) => x.value === k);
                  if (!o) return null;
                  return (
                    <ComboboxChip key={k} itemKey={k}>
                      {o.label}
                    </ComboboxChip>
                  );
                })}
                {empty ? (
                  <span class="text-muted-foreground px-1 py-0.5 text-sm">{placeholder ?? "Select…"}</span>
                ) : null}
              </>
            )}
          </ComboboxValue>
          {showClear ? <ComboboxClear class="shrink-0" /> : null}
          <ComboboxChipsInput placeholder={searchPlaceholder} />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxCommand>
            <ComboboxEmpty>{emptyText}</ComboboxEmpty>
            <ComboboxList>
              {(opt) => {
                const o = opt as ComboboxOption;
                return (
                  <ComboboxItem key={o.value} item={o}>
                    {o.label}
                  </ComboboxItem>
                );
              }}
            </ComboboxList>
          </ComboboxCommand>
        </ComboboxContent>
      </Combobox>
    );
  }

  if (useLifted) {
    return (
      <Combobox
        class={className}
        items={options}
        itemKey={(o) => (o as ComboboxOption).value}
        itemToStringValue={(o) => (o as ComboboxOption).label}
        liftedFilter
        autoHighlight={autoHighlight}
        showClear={showClear}
        placeholder={placeholder}
        {...rest}
      >
        <ComboboxTrigger asChild>
          <div class={cn("relative flex w-full min-w-44 items-center", triggerClass)}>
            <ComboboxInlineInput placeholder={searchPlaceholder} class="pe-16" />
            {showClear ? <ComboboxClear class="absolute end-9 top-1/2 z-10 -translate-y-1/2" /> : null}
            <span class="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2">
              <ChevronDownIcon />
            </span>
          </div>
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxCommand>
            <ComboboxEmpty>{emptyText}</ComboboxEmpty>
            <ComboboxList>
              {(opt) => {
                const o = opt as ComboboxOption;
                return (
                  <ComboboxItem key={o.value} item={o}>
                    {o.label}
                  </ComboboxItem>
                );
              }}
            </ComboboxList>
          </ComboboxCommand>
        </ComboboxContent>
      </Combobox>
    );
  }

  return (
    <Combobox
      class={className}
      items={options}
      itemKey={(o) => (o as ComboboxOption).value}
      itemToStringValue={(o) => (o as ComboboxOption).label}
      autoHighlight={autoHighlight}
      showClear={showClear}
      placeholder={placeholder}
      {...rest}
    >
      <ComboboxTrigger class={cn(triggerClass)}>
        <ComboboxValue />
        <span class="ms-auto flex shrink-0 items-center gap-0.5">
          {showClear ? <ComboboxClear /> : null}
          <ChevronDownIcon />
        </span>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxCommand>
          <ComboboxInput placeholder={searchPlaceholder} />
          <ComboboxEmpty>{emptyText}</ComboboxEmpty>
          <ComboboxList>
            {(opt) => {
              const o = opt as ComboboxOption;
              return (
                <ComboboxItem key={o.value} item={o}>
                  {o.label}
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxCommand>
      </ComboboxContent>
    </Combobox>
  );
};
