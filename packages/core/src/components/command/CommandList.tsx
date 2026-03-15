import { useLayoutEffect, useRef } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useCommand } from "./Command";

export type CommandListProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  /** Notified when the list root mounts (e.g. combobox inline input forwards keyboard to the list). */
  onMount?: (el: HTMLDivElement | null) => void;
};

export const CommandList = ({ class: className, children, onMount, ...rest }: CommandListProps) => {
  const { query, hasVisibleItems, autoHighlight, highlightedIndex, listRef } = useCommand();
  const prevQueryRef = useRef<string | null>(null);

  void query.value;
  void highlightedIndex.value;

  useLayoutEffect(() => {
    const root = listRef.current;
    if (!root) return;

    const nodes = [...root.querySelectorAll<HTMLElement>('[data-slot="command-item"][data-match="true"]')];
    hasVisibleItems.value = nodes.length > 0;

    if (!autoHighlight) {
      root.querySelectorAll('[data-slot="command-item"]').forEach((el) => el.removeAttribute("data-highlighted"));
      prevQueryRef.current = query.value;
      return;
    }

    const queryBumped = prevQueryRef.current !== query.value;
    prevQueryRef.current = query.value;

    let idx = highlightedIndex.value;
    if (queryBumped) {
      idx = nodes.length > 0 ? 0 : -1;
      highlightedIndex.value = idx;
    } else {
      if (nodes.length === 0) {
        highlightedIndex.value = -1;
        idx = -1;
      } else if (idx >= nodes.length) {
        idx = nodes.length - 1;
        highlightedIndex.value = idx;
      } else if (idx < 0) {
        idx = 0;
        highlightedIndex.value = idx;
      }
    }

    root.querySelectorAll('[data-slot="command-item"]').forEach((el) => el.removeAttribute("data-highlighted"));
    if (idx >= 0 && nodes[idx]) {
      nodes[idx].setAttribute("data-highlighted", "true");
      nodes[idx].scrollIntoView({ block: "nearest" });
    }
  }, [query.value, highlightedIndex.value, autoHighlight]);

  return (
    <div
      ref={(node) => {
        listRef.current = node;
        onMount?.(node);
      }}
      data-slot="command-list"
      class={cn("max-h-72 overflow-y-auto overflow-x-hidden p-1", className)}
      {...rest}
    >
      {children}
    </div>
  );
};
