import { signal, type Signal } from "@preact/signals";
import { createContext } from "preact";
import { useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Popover } from "../popover/Popover";
import {
  defaultComboboxItemKey,
  defaultComboboxItemString,
  flattenComboboxItems
} from "./combobox-utils";

export type ComboboxCommandNav = {
  moveHighlight: (delta: number) => void;
  activateHighlighted: () => void;
};

function normalizeInitialKeys(multiple: boolean, defaultValue: string | string[] | undefined): string[] {
  if (defaultValue === undefined || defaultValue === "") return [];
  if (multiple) return Array.isArray(defaultValue) ? [...defaultValue] : [defaultValue];
  return typeof defaultValue === "string" ? [defaultValue] : [];
}

function keysFromValueProp(multiple: boolean, valueProp: string | string[] | undefined): string[] {
  if (valueProp === undefined) return [];
  if (multiple) return Array.isArray(valueProp) ? [...valueProp] : [];
  return typeof valueProp === "string" && valueProp ? [valueProp] : [];
}

export type ComboboxContextValue = {
  items: readonly unknown[];
  leafItems: unknown[];
  itemToString: (item: unknown) => string;
  itemKey: (item: unknown) => string;
  selectedKeys: string[];
  /** First selected key; empty string if none (single-select ergonomics). */
  selectedKey: string;
  multiple: boolean;
  isSelected: (key: string) => boolean;
  selectByItem: (item: unknown) => void;
  toggleByItem: (item: unknown) => void;
  removeKey: (key: string) => void;
  clearSelection: () => void;
  placeholder: string;
  disabled: boolean;
  liftedFilter: boolean;
  filterQuery: Signal<string> | null;
  hasVisibleItems: Signal<boolean> | null;
  autoHighlight: boolean;
  showClear: boolean;
  closeOnSelect: boolean;
  comboboxListRef: { current: HTMLDivElement | null };
  commandNavRef: { current: ComboboxCommandNav | null };
};

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

export const useCombobox = () => {
  const ctx = useContext(ComboboxContext);
  if (!ctx) throw new Error("Combobox components must be used within Combobox");
  return ctx;
};

export function comboboxSelectionLabel(ctx: ComboboxContextValue): string {
  if (ctx.selectedKeys.length === 0) return "";
  const labels = ctx.selectedKeys.map((k) => {
    const it = ctx.leafItems.find((i) => ctx.itemKey(i) === k);
    return it !== undefined ? ctx.itemToString(it) : k;
  });
  return labels.join(", ");
}

export type ComboboxProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> & {
  items?: readonly unknown[];
  itemToStringValue?: (item: unknown) => string;
  itemKey?: (item: unknown) => string;
  value?: string | string[];
  defaultValue?: string | string[];
  /** Emits `string` when `multiple` is false, else `string[]`. */
  onValueChange?: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  multiple?: boolean;
  /** Share filter text between trigger input and `Command` (Base UI–style single input + list in popover). */
  liftedFilter?: boolean;
  /** Highlight first match and enable ArrowUp/Down + Enter in filter inputs (requires `ComboboxCommand autoHighlight` or preset). */
  autoHighlight?: boolean;
  showClear?: boolean;
  /** When `multiple`, defaults to `false`; when single, defaults to `true`. */
  closeOnSelect?: boolean;
  children?: ComponentChildren;
};

export const Combobox = ({
  items = [],
  itemToStringValue,
  itemKey: itemKeyProp,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  disabled = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  multiple: multipleProp = false,
  liftedFilter = false,
  autoHighlight = false,
  showClear = false,
  closeOnSelect: closeOnSelectProp,
  class: className,
  children,
  ...rest
}: ComboboxProps) => {
  const multiple = Boolean(multipleProp);
  const closeOnSelect = closeOnSelectProp ?? !multiple;

  const itemToString = useMemo(
    () => (item: unknown) => defaultComboboxItemString(item, itemToStringValue),
    [itemToStringValue]
  );
  const itemKey = useMemo(
    () => (item: unknown) => (itemKeyProp ? itemKeyProp(item) : defaultComboboxItemKey(item)),
    [itemKeyProp]
  );
  const leafItems = useMemo(() => flattenComboboxItems(items), [items]);

  const isValueControlled = valueProp !== undefined;
  const [internalKeys, setInternalKeys] = useState<string[]>(() => normalizeInitialKeys(multiple, defaultValue));

  const selectedKeys = isValueControlled ? keysFromValueProp(multiple, valueProp) : internalKeys;
  const selectedKey = selectedKeys[0] ?? "";

  const filterQuery = useMemo(() => (liftedFilter ? signal("") : null), [liftedFilter]);
  const hasVisibleItemsSig = useMemo(() => (liftedFilter ? signal(true) : null), [liftedFilter]);
  const comboboxListRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);
  const commandNavRef = useMemo(() => ({ current: null as ComboboxCommandNav | null }), []);

  const isOpenRef = useRef(false);
  const selectedKeysRef = useRef(selectedKeys);
  selectedKeysRef.current = selectedKeys;

  const emitKeys = useCallback(
    (next: string[]) => {
      if (!isValueControlled) setInternalKeys(next);
      if (multiple) onValueChange?.(next);
      else onValueChange?.(next[0] ?? "");
    },
    [isValueControlled, multiple, onValueChange]
  );

  const selectByItem = useCallback(
    (item: unknown) => {
      const key = itemKey(item);
      emitKeys(key ? [key] : []);
    },
    [itemKey, emitKeys]
  );

  const toggleByItem = useCallback(
    (item: unknown) => {
      const key = itemKey(item);
      const exists = selectedKeysRef.current.includes(key);
      const next = exists ? selectedKeysRef.current.filter((k) => k !== key) : [...selectedKeysRef.current, key];
      emitKeys(next);
    },
    [itemKey, emitKeys]
  );

  const removeKey = useCallback(
    (key: string) => {
      emitKeys(selectedKeysRef.current.filter((k) => k !== key));
    },
    [emitKeys]
  );

  const clearSelection = useCallback(() => {
    emitKeys([]);
  }, [emitKeys]);

  const isSelected = useCallback(
    (key: string) => {
      return selectedKeys.includes(key);
    },
    [selectedKeys]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      isOpenRef.current = open;
      onOpenChange?.(open);
      if (!liftedFilter || !filterQuery) return;
      if (open) {
        filterQuery.value = "";
      } else if (multiple) {
        filterQuery.value = "";
      } else {
        const k = selectedKeysRef.current[0];
        if (!k) filterQuery.value = "";
        else {
          const it = leafItems.find((i) => itemKey(i) === k);
          filterQuery.value = it !== undefined ? itemToString(it) : k;
        }
      }
    },
    [liftedFilter, filterQuery, onOpenChange, multiple, leafItems, itemKey, itemToString]
  );

  useLayoutEffect(() => {
    if (!liftedFilter || !filterQuery || multiple || isOpenRef.current) return;
    const k = selectedKeys[0];
    if (!k) {
      filterQuery.value = "";
      return;
    }
    const it = leafItems.find((i) => itemKey(i) === k);
    filterQuery.value = it !== undefined ? itemToString(it) : k;
  }, [liftedFilter, filterQuery, multiple, selectedKeys, leafItems, itemKey, itemToString]);

  const contextValue = useMemo<ComboboxContextValue>(
    () => ({
      items,
      leafItems,
      itemToString,
      itemKey,
      selectedKeys,
      selectedKey,
      multiple,
      isSelected,
      selectByItem,
      toggleByItem,
      removeKey,
      clearSelection,
      placeholder,
      disabled,
      liftedFilter,
      filterQuery,
      hasVisibleItems: hasVisibleItemsSig,
      autoHighlight,
      showClear,
      closeOnSelect,
      comboboxListRef,
      commandNavRef
    }),
    [
      items,
      leafItems,
      itemToString,
      itemKey,
      selectedKeys,
      selectedKey,
      multiple,
      isSelected,
      selectByItem,
      toggleByItem,
      removeKey,
      clearSelection,
      placeholder,
      disabled,
      liftedFilter,
      filterQuery,
      hasVisibleItemsSig,
      autoHighlight,
      showClear,
      closeOnSelect,
      comboboxListRef,
      commandNavRef
    ]
  );

  return (
    <ComboboxContext.Provider value={contextValue}>
      <div data-slot="combobox" class={cn("relative", className)} {...rest}>
        <Popover open={openProp} defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
          {children}
        </Popover>
      </div>
    </ComboboxContext.Provider>
  );
};
