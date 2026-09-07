import type { ComponentChildren, JSX, RefObject } from "preact";
import { createContext, toChildArray } from "preact";
import { useContext, useLayoutEffect, useRef } from "preact/hooks";
import { useHeightDisclosureContent } from "../../lib/disclosure/use-height-disclosure-content";
import { cn } from "../../lib/utils";
import { indentCSSValue, TreeLines } from "./TreeLines";
import {
  TreeItemContext,
  treeItemVariants,
  useTreeItemContext,
  useTreeProvider,
} from "./TreeProvider";
import { resolveTreeExpanderIcon, resolveTreeIcon } from "./tree-icons";
import type { TreeIconProp } from "./tree-types";

export type TreeNodeContextValue = {
  nodeId: string;
  disabled: boolean;
  hasChildren: boolean;
  data?: unknown;
  icon?: TreeIconProp;
  expandedIcon?: ComponentChildren;
  selectedIcon?: ComponentChildren;
  disabledIcon?: ComponentChildren;
  level: number;
  parentPath: boolean[];
  isLast: boolean;
  itemRef: RefObject<HTMLDivElement>;
};

const TreeNodeContext = createContext<TreeNodeContextValue | null>(null);

export const useTreeNodeContext = () => {
  const context = useContext(TreeNodeContext);
  if (!context) throw new Error("Tree node subcomponents must be used within TreeNode");
  return context;
};

export type TreeNodeProps = {
  nodeId: string;
  disabled?: boolean;
  data?: unknown;
  icon?: TreeIconProp;
  expandedIcon?: ComponentChildren;
  selectedIcon?: ComponentChildren;
  disabledIcon?: ComponentChildren;
  children?: ComponentChildren;
};

export const TreeNode = ({
  nodeId,
  disabled = false,
  data,
  icon,
  expandedIcon,
  selectedIcon,
  disabledIcon,
  children,
}: TreeNodeProps) => {
  const tree = useTreeProvider();
  const parentItem = useTreeItemContext();
  const itemRef = useRef<HTMLDivElement>(null);

  const childArray = toChildArray(children);
  const hasChildren = childArray.some(
    (child) =>
      child != null &&
      typeof child === "object" &&
      "type" in child &&
      typeof child.type === "function" &&
      (child.type as { __kamodTreeContent?: boolean }).__kamodTreeContent === true,
  );

  const level = parentItem ? parentItem.level + 1 : 1;
  const parentPath = parentItem ? [...parentItem.parentPath, parentItem.isLast] : [];

  const registryVersion = tree.registry.version.value;
  const nodeRecord = tree.registry.getNode(nodeId);
  const isLast = nodeRecord?.isLast ?? false;
  void registryVersion;

  useLayoutEffect(() => {
    const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
      ?.NODE_ENV;
    const existing = tree.registry.getNode(nodeId);
    if (
      env !== "production" &&
      existing &&
      existing.element &&
      existing.element !== itemRef.current
    ) {
      console.warn(`[kamod-ui] Duplicate Tree nodeId "${nodeId}" detected.`);
    }

    tree.registry.register({
      nodeId,
      parentId: parentItem?.nodeId ?? null,
      disabled,
      hasChildren,
      data,
      element: itemRef.current,
      level,
    });

    return () => {
      tree.registry.unregister(nodeId);
    };
  }, [nodeId, parentItem?.nodeId, disabled, hasChildren, data, level, tree.registry]);

  useLayoutEffect(() => {
    const visible = tree.registry.getVisibleActivatableIds(tree.expandedIds.value);
    if (visible.length === 0) {
      tree.tabbableId.value = null;
      return;
    }
    if (!tree.tabbableId.value || !visible.includes(tree.tabbableId.value)) {
      tree.tabbableId.value = visible[0];
    }
  }, [tree.registry.version.value, tree.expandedIds.value, tree]);

  const contextValue: TreeNodeContextValue = {
    nodeId,
    disabled,
    hasChildren,
    data,
    icon,
    expandedIcon,
    selectedIcon,
    disabledIcon,
    level,
    parentPath,
    isLast,
    itemRef,
  };

  return (
    <TreeNodeContext.Provider value={contextValue}>
      <div data-slot="tree-node" data-node-id={nodeId} class="relative min-w-0">
        {children}
      </div>
    </TreeNodeContext.Provider>
  );
};

export type TreeNodeTriggerProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "class"> & {
  class?: string;
  children?: ComponentChildren;
};

export const TreeNodeTrigger = ({
  class: className,
  children,
  onClick,
  onFocus,
  ...rest
}: TreeNodeTriggerProps) => {
  const tree = useTreeProvider();
  const node = useTreeNodeContext();

  useLayoutEffect(() => {
    tree.registry.setElement(node.nodeId, node.itemRef.current);
  });

  const isExpanded = tree.expandedIds.value.has(node.nodeId);
  const isSelected = tree.selectedIds.value.has(node.nodeId);
  const isTabbable = tree.tabbableId.value === node.nodeId;

  const handleItemClick = (event: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    if (node.disabled) return;
    tree.focusNode(node.nodeId);
    if (tree.selectionMode !== "none") {
      tree.selectNode(node.nodeId, {
        toggle: tree.selectionMode === "multiple" && (event.metaKey || event.ctrlKey),
        additive: tree.selectionMode === "multiple" && (event.metaKey || event.ctrlKey),
      });
    }
    onClick?.(event);
  };

  return (
    <div
      ref={node.itemRef}
      role="treeitem"
      data-node-id={node.nodeId}
      data-slot="tree-node-trigger"
      data-state={node.hasChildren ? (isExpanded ? "open" : "closed") : "leaf"}
      data-selected={isSelected ? "true" : undefined}
      data-disabled={node.disabled ? "" : undefined}
      data-level={node.level}
      aria-level={node.level}
      aria-expanded={node.hasChildren ? isExpanded : undefined}
      aria-selected={tree.selectionMode !== "none" ? isSelected : undefined}
      aria-disabled={node.disabled || undefined}
      tabIndex={node.disabled ? -1 : isTabbable ? 0 : -1}
      class={cn(
        treeItemVariants({ variant: tree.variant, size: tree.size }),
        "relative",
        node.disabled && "pointer-events-none opacity-50",
        className,
      )}
      style={{ paddingInlineStart: `calc(${node.level} * ${indentCSSValue(tree.indent)})` }}
      onClick={handleItemClick}
      onFocus={(event) => {
        tree.focusedId.value = node.nodeId;
        tree.tabbableId.value = node.nodeId;
        onFocus?.(event);
      }}
      {...rest}
    >
      {tree.showLines ? (
        <TreeLines
          level={node.level}
          parentPath={node.parentPath}
          isLast={node.isLast}
          indent={tree.indent}
        />
      ) : null}
      {children}
    </div>
  );
};

export type TreeExpanderProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "class"> & {
  class?: string;
};

export const TreeExpander = ({ class: className, ...rest }: TreeExpanderProps) => {
  const tree = useTreeProvider();
  const node = useTreeNodeContext();
  const isExpanded = tree.expandedIds.value.has(node.nodeId);

  const handleExpandToggle = (event: Event) => {
    event.stopPropagation();
    if (node.disabled || !node.hasChildren) return;
    tree.toggleExpanded(node.nodeId);
  };

  if (!node.hasChildren) {
    return <span class={cn("inline-flex size-4 shrink-0", className)} aria-hidden="true" />;
  }

  return (
    <span
      data-slot="tree-expander"
      data-expanded={isExpanded ? "true" : "false"}
      data-disabled={node.disabled ? "" : undefined}
      class={cn(
        "relative z-[1] inline-flex size-4 shrink-0 cursor-pointer items-center justify-center",
        className,
      )}
      aria-hidden="true"
      onClick={handleExpandToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          handleExpandToggle(event);
        }
        rest.onKeyDown?.(event);
      }}
      {...rest}
    >
      {resolveTreeExpanderIcon(isExpanded, tree.icons)}
    </span>
  );
};

export type TreeIconProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "class"> & {
  class?: string;
  icon?: TreeIconProp;
  expandedIcon?: ComponentChildren;
  selectedIcon?: ComponentChildren;
  disabledIcon?: ComponentChildren;
};

export const TreeIcon = ({
  class: className,
  icon: iconProp,
  expandedIcon: expandedIconProp,
  selectedIcon: selectedIconProp,
  disabledIcon: disabledIconProp,
  ...rest
}: TreeIconProps) => {
  const tree = useTreeProvider();
  const node = useTreeNodeContext();

  if (!tree.showIcons) return null;

  const isExpanded = tree.expandedIds.value.has(node.nodeId);
  const isSelected = tree.selectedIds.value.has(node.nodeId);

  const iconState = {
    nodeId: node.nodeId,
    branch: node.hasChildren,
    expanded: isExpanded,
    selected: isSelected,
    disabled: node.disabled,
    level: node.level,
  };

  const hasIconSlot =
    iconProp != null ||
    node.icon != null ||
    node.expandedIcon != null ||
    node.selectedIcon != null ||
    node.disabledIcon != null ||
    expandedIconProp != null ||
    selectedIconProp != null ||
    disabledIconProp != null ||
    tree.icons != null;

  if (!hasIconSlot) return null;

  const content = resolveTreeIcon({
    state: iconState,
    icon: iconProp ?? node.icon,
    expandedIcon: expandedIconProp ?? node.expandedIcon,
    selectedIcon: selectedIconProp ?? node.selectedIcon,
    disabledIcon: disabledIconProp ?? node.disabledIcon,
    providerIcons: tree.icons,
    showFallback: tree.icons != null,
  });

  return (
    <span
      data-slot="tree-icon"
      data-expanded={isExpanded ? "true" : "false"}
      data-selected={isSelected ? "true" : undefined}
      data-disabled={node.disabled ? "" : undefined}
      class={cn(
        "relative z-[1] inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4",
        className,
      )}
      aria-hidden="true"
      {...rest}
    >
      {content}
    </span>
  );
};

export type TreeLabelProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "class"> & {
  class?: string;
  children?: ComponentChildren;
};

export const TreeLabel = ({ class: className, children, ...rest }: TreeLabelProps) => (
  <span
    data-slot="tree-label"
    class={cn("relative z-[1] min-w-0 flex-1 truncate text-start", className)}
    {...rest}
  >
    {children}
  </span>
);

export type TreeNodeActionsProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "class"> & {
  class?: string;
  children?: ComponentChildren;
};

export const TreeNodeActions = ({
  class: className,
  children,
  onClick,
  onKeyDown,
  ...rest
}: TreeNodeActionsProps) => (
  <span
    data-slot="tree-node-actions"
    class={cn("relative z-[1] ms-auto inline-flex shrink-0 items-center gap-1", className)}
    onClick={(event) => {
      event.stopPropagation();
      onClick?.(event);
    }}
    onKeyDown={(event) => {
      event.stopPropagation();
      onKeyDown?.(event);
    }}
    {...rest}
  >
    {children}
  </span>
);

export type TreeNodeContentProps = {
  children?: ComponentChildren;
  class?: string;
};

export const TreeNodeContent = ({ children, class: className }: TreeNodeContentProps) => {
  const tree = useTreeProvider();
  const node = useTreeNodeContext();
  const isExpanded = tree.expandedIds.value.has(node.nodeId);

  const {
    allowRender,
    isAnimatingClose,
    isAnimatingOpen,
    outerRef,
    innerRef,
    handleTransitionEnd,
  } = useHeightDisclosureContent({
    open: isExpanded,
    forceMount: !tree.animateExpand,
  });

  const showBranch = node.hasChildren && (tree.animateExpand ? allowRender : isExpanded);

  if (!node.hasChildren) return null;

  const itemContextValue = {
    nodeId: node.nodeId,
    level: node.level,
    parentPath: node.parentPath,
    isLast: node.isLast,
  };

  return (
    <div
      role="group"
      data-slot="tree-node-content"
      class={className}
      hidden={!showBranch && !isAnimatingClose}
      aria-hidden={!isExpanded && !isAnimatingClose}
    >
      {tree.animateExpand ? (
        <div
          ref={outerRef}
          data-slot="tree-node-content-outer"
          data-state={isExpanded ? "open" : "closed"}
          onTransitionEnd={handleTransitionEnd}
          class={cn(
            "min-h-0 overflow-hidden",
            (isAnimatingOpen || isAnimatingClose) && "will-change-[height]",
          )}
          inert={!isExpanded || undefined}
        >
          <div ref={innerRef} data-slot="tree-node-content-inner">
            <TreeItemContext.Provider value={itemContextValue}>{children}</TreeItemContext.Provider>
          </div>
        </div>
      ) : isExpanded ? (
        <TreeItemContext.Provider value={itemContextValue}>{children}</TreeItemContext.Provider>
      ) : null}
    </div>
  );
};

TreeNodeContent.__kamodTreeContent = true;
