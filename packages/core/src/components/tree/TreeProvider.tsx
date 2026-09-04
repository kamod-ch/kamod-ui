import { type Signal, signal } from "@preact/signals";
import type { ComponentChildren, JSX } from "preact";
import { createContext } from "preact";
import { useContext, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { TreeRegistry } from "./tree-registry";

export type TreeSelectionMode = "none" | "single" | "multiple";

export const treeVariants = tv({
  base: "w-full rounded-lg border border-border bg-background",
  variants: {
    variant: {
      default: "",
      outline: "border-2",
      ghost: "border-transparent bg-transparent",
    },
    size: {
      sm: "text-sm",
      default: "",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export const treeItemVariants = tv({
  base: [
    "group/tree-item relative flex min-w-0 cursor-default select-none items-center rounded-md outline-none transition-colors",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "motion-reduce:transition-none",
  ],
  variants: {
    variant: {
      default:
        "hover:bg-accent/60 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
      outline:
        "hover:bg-accent/40 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
      ghost:
        "hover:bg-accent/50 data-[selected=true]:bg-accent/70 data-[selected=true]:text-accent-foreground",
    },
    size: {
      sm: "min-h-7 gap-1.5 px-2 py-1 text-sm",
      default: "min-h-8 gap-2 px-2.5 py-1.5 text-sm",
      lg: "min-h-10 gap-2.5 px-3 py-2 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type TreeProviderContextValue = {
  registry: TreeRegistry;
  expandedIds: Signal<Set<string>>;
  selectedIds: Signal<Set<string>>;
  selectionMode: TreeSelectionMode;
  showLines: boolean;
  showIcons: boolean;
  animateExpand: boolean;
  indent: number | string;
  variant: NonNullable<VariantProps<typeof treeVariants>["variant"]>;
  size: NonNullable<VariantProps<typeof treeVariants>["size"]>;
  focusedId: Signal<string | null>;
  tabbableId: Signal<string | null>;
  isExpandedControlled: boolean;
  isSelectedControlled: boolean;
  setExpandedIds: (ids: string[]) => void;
  setSelectedIds: (ids: string[]) => void;
  toggleExpanded: (nodeId: string) => void;
  selectNode: (nodeId: string, options?: { additive?: boolean; toggle?: boolean }) => void;
  focusNode: (nodeId: string, options?: { moveDOMFocus?: boolean }) => void;
  getNodeData: (nodeId: string) => unknown;
};

const TreeProviderContext = createContext<TreeProviderContextValue | null>(null);

export const useTreeProvider = () => {
  const context = useContext(TreeProviderContext);
  if (!context) throw new Error("Tree components must be used within TreeProvider");
  return context;
};

export type TreeItemContextValue = {
  nodeId: string;
  level: number;
  parentPath: boolean[];
  isLast: boolean;
};

export const TreeItemContext = createContext<TreeItemContextValue | null>(null);

export const useTreeItemContext = () => useContext(TreeItemContext);

export type TreeProviderProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "class"> &
  VariantProps<typeof treeVariants> & {
    class?: string;
    expandedIds?: readonly string[];
    defaultExpandedIds?: readonly string[];
    onExpandedChange?: (ids: string[]) => void;
    selectedIds?: readonly string[];
    defaultSelectedIds?: readonly string[];
    onSelectionChange?: (ids: string[]) => void;
    selectionMode?: TreeSelectionMode;
    showLines?: boolean;
    showIcons?: boolean;
    animateExpand?: boolean;
    indent?: number | string;
    children?: ComponentChildren;
  };

export const TreeProvider = ({
  class: className,
  variant = "default",
  size = "default",
  expandedIds: expandedIdsProp,
  defaultExpandedIds = [],
  onExpandedChange,
  selectedIds: selectedIdsProp,
  defaultSelectedIds = [],
  onSelectionChange,
  selectionMode = "none",
  showLines = true,
  showIcons = true,
  animateExpand = true,
  indent = 20,
  children,
  ...rest
}: TreeProviderProps) => {
  const registryRef = useRef<TreeRegistry | null>(null);
  if (!registryRef.current) registryRef.current = new TreeRegistry();
  const registry = registryRef.current;

  const isExpandedControlled = expandedIdsProp !== undefined;
  const isSelectedControlled = selectedIdsProp !== undefined;

  const [internalExpanded, setInternalExpanded] = useState<string[]>(() => [...defaultExpandedIds]);
  const [internalSelected, setInternalSelected] = useState<string[]>(() => [...defaultSelectedIds]);

  const expandedArray = isExpandedControlled ? [...expandedIdsProp] : internalExpanded;
  const selectedArray = isSelectedControlled ? [...selectedIdsProp] : internalSelected;

  const expandedIds = useMemo(() => signal(new Set(expandedArray)), []);
  expandedIds.value = new Set(expandedArray);

  const selectedIds = useMemo(() => signal(new Set(selectedArray)), []);
  selectedIds.value = new Set(selectedArray);

  const focusedId = useMemo(() => signal<string | null>(null), []);
  const tabbableId = useMemo(() => signal<string | null>(null), []);

  const setExpandedIds = (ids: string[]) => {
    if (!isExpandedControlled) setInternalExpanded(ids);
    expandedIds.value = new Set(ids);
    onExpandedChange?.(ids);
  };

  const setSelectedIds = (ids: string[]) => {
    if (!isSelectedControlled) setInternalSelected(ids);
    selectedIds.value = new Set(ids);
    onSelectionChange?.(ids);
  };

  const focusNode = (nodeId: string, options?: { moveDOMFocus?: boolean }) => {
    const node = registry.getNode(nodeId);
    if (!node || node.disabled) return;
    focusedId.value = nodeId;
    tabbableId.value = nodeId;
    if (options?.moveDOMFocus !== false && node.element) {
      node.element.focus();
    }
  };

  const collapseFocusCorrection = (branchId: string) => {
    const focused = focusedId.value;
    if (!focused || focused === branchId) return;
    let current = registry.getNode(focused);
    while (current) {
      if (current.nodeId === branchId) {
        focusNode(branchId);
        return;
      }
      current = current.parentId ? registry.getNode(current.parentId) : undefined;
    }
  };

  const toggleExpanded = (nodeId: string) => {
    const next = new Set(expandedIds.value);
    if (next.has(nodeId)) {
      next.delete(nodeId);
      setExpandedIds([...next]);
      collapseFocusCorrection(nodeId);
    } else {
      next.add(nodeId);
      setExpandedIds([...next]);
    }
  };

  const selectNode = (nodeId: string, options?: { additive?: boolean; toggle?: boolean }) => {
    if (selectionMode === "none") return;
    const node = registry.getNode(nodeId);
    if (!node || node.disabled) return;

    const current = new Set(selectedIds.value);
    const isSelected = current.has(nodeId);

    if (selectionMode === "single") {
      if (options?.toggle && isSelected) {
        setSelectedIds([]);
        return;
      }
      setSelectedIds([nodeId]);
      return;
    }

    if (options?.additive) {
      const next = new Set(current);
      if (isSelected) next.delete(nodeId);
      else next.add(nodeId);
      setSelectedIds([...next]);
      return;
    }

    if (options?.toggle && isSelected) {
      current.delete(nodeId);
      setSelectedIds([...current]);
      return;
    }

    setSelectedIds([nodeId]);
  };

  const prevExpandedRef = useRef(expandedArray);
  useLayoutEffect(() => {
    const prev = new Set(prevExpandedRef.current);
    const next = new Set(expandedArray);
    for (const id of prev) {
      if (!next.has(id)) collapseFocusCorrection(id);
    }
    prevExpandedRef.current = expandedArray;
  });

  const contextValue: TreeProviderContextValue = {
    registry,
    expandedIds,
    selectedIds,
    selectionMode,
    showLines,
    showIcons,
    animateExpand,
    indent,
    variant: variant ?? "default",
    size: size ?? "default",
    focusedId,
    tabbableId,
    isExpandedControlled,
    isSelectedControlled,
    setExpandedIds,
    setSelectedIds,
    toggleExpanded,
    selectNode,
    focusNode,
    getNodeData: (nodeId) => registry.getNode(nodeId)?.data,
  };

  return (
    <TreeProviderContext.Provider value={contextValue}>
      <div
        data-slot="tree-provider"
        data-variant={variant ?? "default"}
        data-size={size ?? "default"}
        class={cn("w-full", className)}
        {...rest}
      >
        {children}
      </div>
    </TreeProviderContext.Provider>
  );
};

export type { VariantProps };
