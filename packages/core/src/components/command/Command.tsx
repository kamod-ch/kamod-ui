import { signal, type Signal } from "@preact/signals";
import { createContext } from "preact";
import { useCallback, useContext, useMemo } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type CommandContextValue = {
  query: Signal<string>;
  hasVisibleItems: Signal<boolean>;
  autoHighlight: boolean;
  highlightedIndex: Signal<number>;
  listRef: { current: HTMLDivElement | null };
  moveHighlight: (delta: number) => void;
  activateHighlighted: () => void;
};

const CommandContext = createContext<CommandContextValue | null>(null);

export const useCommand = () => {
  const context = useContext(CommandContext);
  if (!context) throw new Error("Command subcomponents must be used within Command");
  return context;
};

export type CommandProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  /** First visible item gets `data-highlighted`; enables ArrowUp/Down + Enter in `CommandInput`. */
  autoHighlight?: boolean;
  /** External filter signal (e.g. combobox inline input shares query with the list). */
  query?: Signal<string>;
  /** External visibility signal; updated by `CommandList` when provided. */
  hasVisibleItems?: Signal<boolean>;
};

export const Command = ({
  class: className,
  children,
  autoHighlight = false,
  query: queryProp,
  hasVisibleItems: hasVisibleProp,
  ...rest
}: CommandProps) => {
  const internalQuery = useMemo(() => signal(""), []);
  const query = queryProp ?? internalQuery;
  const internalHas = useMemo(() => signal(true), []);
  const hasVisibleItems = hasVisibleProp ?? internalHas;
  const highlightedIndex = useMemo(() => signal(-1), []);
  const listRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);

  const moveHighlight = useCallback(
    (delta: number) => {
      const root = listRef.current;
      if (!root || !autoHighlight) return;
      const nodes = [...root.querySelectorAll<HTMLElement>('[data-slot="command-item"][data-match="true"]')];
      if (nodes.length === 0) return;
      let idx = highlightedIndex.value;
      if (idx < 0) idx = delta > 0 ? 0 : nodes.length - 1;
      else idx = (idx + delta + nodes.length) % nodes.length;
      highlightedIndex.value = idx;
    },
    [autoHighlight, highlightedIndex, listRef]
  );

  const activateHighlighted = useCallback(() => {
    if (!autoHighlight) return;
    const root = listRef.current;
    if (!root) return;
    const nodes = [...root.querySelectorAll<HTMLElement>('[data-slot="command-item"][data-match="true"]')];
    if (nodes.length === 0) return;
    let idx = highlightedIndex.value;
    if (idx < 0 || idx >= nodes.length) idx = 0;
    nodes[idx]?.click();
  }, [autoHighlight, highlightedIndex, listRef]);

  const contextValue = useMemo<CommandContextValue>(
    () => ({
      query,
      hasVisibleItems,
      autoHighlight,
      highlightedIndex,
      listRef,
      moveHighlight,
      activateHighlighted
    }),
    [query, hasVisibleItems, autoHighlight, highlightedIndex, listRef, moveHighlight, activateHighlighted]
  );

  return (
    <CommandContext.Provider value={contextValue}>
      <div data-slot="command" class={cn("w-full rounded-md border bg-popover text-popover-foreground", className)} {...rest}>
        {children}
      </div>
    </CommandContext.Provider>
  );
};
