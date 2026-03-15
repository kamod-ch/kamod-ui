import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useEffect, useMemo, useRef } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { createIdFactory, createDismissableLayer } from "../../lib/interactive";

type SelectItemRecord = {
  id: string;
  value: string;
  ref: HTMLDivElement | null;
  disabled: boolean;
};

type SelectContextValue = {
  open: ReturnType<typeof signal<boolean>>;
  selectedValue: ReturnType<typeof signal<string | null>>;
  activeItemId: ReturnType<typeof signal<string | null>>;
  triggerId: string;
  contentId: string;
  setOpen: (next: boolean) => void;
  setSelected: (value: string) => void;
  openAndFocus: (target: "selected" | "first" | "last") => void;
  closeAndFocusTrigger: () => void;
  registerItem: (item: SelectItemRecord) => void;
  unregisterItem: (id: string) => void;
  setActiveItemId: (id: string | null) => void;
  moveActive: (direction: "next" | "prev" | "first" | "last") => void;
  focusActiveItem: () => void;
  setTriggerNode: (node: HTMLButtonElement | null) => void;
};

const SelectContext = createContext<SelectContextValue | null>(null);

export const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("Select subcomponents must be used within Select");
  return context;
};

export type SelectProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: ComponentChildren;
};

export const Select = ({
  defaultValue,
  value,
  onValueChange,
  children,
  class: className,
  ...rest
}: SelectProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemsRef = useRef<SelectItemRecord[]>([]);
  const idFactory = useMemo(() => createIdFactory("select"), []);
  const triggerId = useMemo(() => idFactory(), [idFactory]);
  const contentId = useMemo(() => idFactory(), [idFactory]);

  const open = useMemo(() => signal(false), []);
  const isControlled = typeof value === "string";
  const selectedValue = useMemo(() => signal<string | null>(value ?? defaultValue ?? null), []);
  const activeItemId = useMemo(() => signal<string | null>(null), []);

  useEffect(() => {
    if (isControlled) {
      selectedValue.value = value ?? null;
    }
  }, [isControlled, value]);

  useEffect(() => {
    const layer = createDismissableLayer({
      root: () => rootRef.current,
      open: () => open.value,
      onDismiss: () => {
        open.value = false;
        activeItemId.value = null;
      }
    });
    return () => layer.dispose();
  }, []);

  const getEnabledItems = () =>
    itemsRef.current.filter((item) => !item.disabled && item.ref && item.ref.isConnected);

  const focusActiveItem = () => {
    const active = itemsRef.current.find((item) => item.id === activeItemId.value && !item.disabled);
    active?.ref?.focus();
  };

  const setActiveFromTarget = (target: "selected" | "first" | "last") => {
    const enabledItems = getEnabledItems();
    if (enabledItems.length === 0) {
      activeItemId.value = null;
      return;
    }

    if (target === "first") {
      activeItemId.value = enabledItems[0]?.id ?? null;
      return;
    }

    if (target === "last") {
      activeItemId.value = enabledItems[enabledItems.length - 1]?.id ?? null;
      return;
    }

    const selected = enabledItems.find((item) => item.value === selectedValue.value);
    activeItemId.value = selected?.id ?? enabledItems[0]?.id ?? null;
  };

  const moveActive = (direction: "next" | "prev" | "first" | "last") => {
    const enabledItems = getEnabledItems();
    if (enabledItems.length === 0) {
      activeItemId.value = null;
      return;
    }

    if (direction === "first") {
      activeItemId.value = enabledItems[0]?.id ?? null;
      return;
    }

    if (direction === "last") {
      activeItemId.value = enabledItems[enabledItems.length - 1]?.id ?? null;
      return;
    }

    const currentIndex = enabledItems.findIndex((item) => item.id === activeItemId.value);
    if (currentIndex < 0) {
      activeItemId.value = enabledItems[0]?.id ?? null;
      return;
    }

    const offset = direction === "next" ? 1 : -1;
    const nextIndex = (currentIndex + offset + enabledItems.length) % enabledItems.length;
    activeItemId.value = enabledItems[nextIndex]?.id ?? null;
  };

  const setSelected = (value: string) => {
    if (!isControlled) {
      selectedValue.value = value;
    }
    onValueChange?.(value);
    open.value = false;
    activeItemId.value = null;
  };

  useEffect(() => {
    if (!open.value) return;
    setActiveFromTarget("selected");
  }, [open.value, selectedValue.value]);

  const openAndFocus = (target: "selected" | "first" | "last") => {
    open.value = true;
    setActiveFromTarget(target);
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => focusActiveItem());
    } else {
      focusActiveItem();
    }
  };

  const closeAndFocusTrigger = () => {
    open.value = false;
    activeItemId.value = null;
    triggerRef.current?.focus();
  };

  const registerItem = (item: SelectItemRecord) => {
    const index = itemsRef.current.findIndex((entry) => entry.id === item.id);
    if (index >= 0) {
      const next = [...itemsRef.current];
      next[index] = item;
      itemsRef.current = next;
      return;
    }
    itemsRef.current = [...itemsRef.current, item];
  };

  const unregisterItem = (id: string) => {
    itemsRef.current = itemsRef.current.filter((item) => item.id !== id);
    if (activeItemId.value === id) {
      activeItemId.value = null;
    }
  };

  return (
    <SelectContext.Provider
      value={{
        open,
        selectedValue,
        activeItemId,
        triggerId,
        contentId,
        setOpen: (next) => {
          open.value = next;
          if (!next) activeItemId.value = null;
        },
        setSelected,
        openAndFocus,
        closeAndFocusTrigger,
        registerItem,
        unregisterItem,
        setActiveItemId: (id) => {
          activeItemId.value = id;
        },
        moveActive,
        focusActiveItem,
        setTriggerNode: (node) => {
          triggerRef.current = node;
        }
      }}
    >
      <div
        ref={rootRef}
        class={cn("relative", className)}
        data-slot="select"
        data-state={open.value ? "open" : "closed"}
        {...rest}
      >
        {children}
      </div>
    </SelectContext.Provider>
  );
};
