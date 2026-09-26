import type { ComponentChildren, JSX } from "preact";
import { createContext } from "preact";
import { useCallback, useContext, useEffect, useId, useState } from "preact/hooks";
import { cn } from "../../lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (next: string) => void;
  orientation: "horizontal" | "vertical";
  baseId: string;
  triggerId: (tabValue: string) => string;
  contentId: (tabValue: string) => string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs subcomponents must be used within Tabs");
  return context;
};

export type TabsProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultValue: string;
  /** Share selection with mounted groups using this key; release it after the last unmount. */
  syncKey?: string;
  orientation?: "horizontal" | "vertical";
  children?: ComponentChildren;
};

type SyncSubscriber = (nextValue: string) => void;

type SyncRegistryEntry = {
  value: string;
  subscribers: Set<SyncSubscriber>;
};

// Entries exist only while mounted tab groups subscribe to their key.
const syncRegistry = new Map<string, SyncRegistryEntry>();

const getOrCreateSyncEntry = (key: string, initialValue: string): SyncRegistryEntry => {
  const existing = syncRegistry.get(key);
  if (existing) return existing;

  const created: SyncRegistryEntry = {
    value: initialValue,
    subscribers: new Set<SyncSubscriber>(),
  };
  syncRegistry.set(key, created);
  return created;
};

/** Coordinates selection, hydration-stable ARIA IDs, and optional selection sharing. */
export const Tabs = ({
  defaultValue,
  syncKey,
  orientation = "horizontal",
  class: className,
  children,
  ...rest
}: TabsProps) => {
  const [value, setLocalValue] = useState(defaultValue);
  // Preact preserves this ID across server rendering and hydration.
  const baseId = `tabs-${useId()}`;
  const triggerId = useCallback((tabValue: string) => `${baseId}-trigger-${tabValue}`, [baseId]);
  const contentId = useCallback((tabValue: string) => `${baseId}-content-${tabValue}`, [baseId]);
  const setValue = (next: string) => {
    if (!syncKey) {
      setLocalValue(next);
      return;
    }

    const syncEntry = getOrCreateSyncEntry(syncKey, value);
    if (syncEntry.value === next) return;

    syncEntry.value = next;
    setLocalValue(next);
    syncEntry.subscribers.forEach((subscriber) => subscriber(next));
  };

  useEffect(() => {
    if (!syncKey) return;

    const syncEntry = getOrCreateSyncEntry(syncKey, defaultValue);
    setLocalValue(syncEntry.value);

    syncEntry.subscribers.add(setLocalValue);

    return () => {
      syncEntry.subscribers.delete(setLocalValue);
      if (syncEntry.subscribers.size === 0) syncRegistry.delete(syncKey);
    };
  }, [defaultValue, syncKey]);

  return (
    <TabsContext.Provider value={{ value, setValue, orientation, baseId, triggerId, contentId }}>
      <div
        class={cn("group/tabs", className)}
        data-slot="tabs"
        data-orientation={orientation}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};
