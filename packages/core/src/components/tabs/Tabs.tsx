import { type Signal, useSignal } from "@preact/signals";
import { createContext } from "preact";
import { useEffect } from "preact/hooks";
import { useContext } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

type TabsContextValue = {
  value: Signal<string>;
  setValue: (next: string) => void;
  orientation: "horizontal" | "vertical";
};

const TabsContext = createContext<TabsContextValue | null>(null);

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs subcomponents must be used within Tabs");
  return context;
};

export type TabsProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultValue: string;
  syncKey?: string;
  orientation?: "horizontal" | "vertical";
  children?: ComponentChildren;
};

type SyncSubscriber = (nextValue: string) => void;

type SyncRegistryEntry = {
  value: string;
  subscribers: Set<SyncSubscriber>;
  instancesCount: number;
};

const syncRegistry = new Map<string, SyncRegistryEntry>();

const getOrCreateSyncEntry = (key: string, initialValue: string): SyncRegistryEntry => {
  const existing = syncRegistry.get(key);
  if (existing) return existing;

  const created: SyncRegistryEntry = {
    value: initialValue,
    subscribers: new Set<SyncSubscriber>(),
    instancesCount: 0
  };
  syncRegistry.set(key, created);
  return created;
};

export const Tabs = ({ defaultValue, syncKey, orientation = "horizontal", class: className, children, ...rest }: TabsProps) => {
  const value = useSignal(defaultValue);
  const setValue = (next: string) => {
    if (!syncKey) {
      value.value = next;
      return;
    }

    const syncEntry = getOrCreateSyncEntry(syncKey, value.value);
    if (syncEntry.value === next) return;

    syncEntry.value = next;
    value.value = next;
    syncEntry.subscribers.forEach((subscriber) => subscriber(next));
  };

  useEffect(() => {
    if (!syncKey) return;

    const syncEntry = getOrCreateSyncEntry(syncKey, defaultValue);
    syncEntry.instancesCount += 1;
    value.value = syncEntry.value;

    const subscriber: SyncSubscriber = (nextValue) => {
      if (value.value === nextValue) return;
      value.value = nextValue;
    };
    syncEntry.subscribers.add(subscriber);

    return () => {
      syncEntry.subscribers.delete(subscriber);
      syncEntry.instancesCount -= 1;
      if (syncEntry.instancesCount <= 0) {
        syncRegistry.delete(syncKey);
      }
    };
  }, [defaultValue, syncKey, value]);

  return (
    <TabsContext.Provider value={{ value, setValue, orientation }}>
      <div class={cn("group/tabs", className)} data-slot="tabs" data-orientation={orientation} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

