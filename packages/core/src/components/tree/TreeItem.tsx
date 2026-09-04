import type { ComponentChildren, JSX } from "preact";
import { toChildArray } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";
import { useHeightDisclosureContent } from "../../lib/disclosure/use-height-disclosure-content";
import { cn } from "../../lib/utils";
import {
  TreeItemContext,
  treeItemVariants,
  useTreeItemContext,
  useTreeProvider,
} from "./TreeProvider";

const DefaultChevron = ({ expanded }: { expanded: boolean }) => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    class={cn(
      "size-4 shrink-0 origin-center text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
      expanded && "rotate-90 rtl:-rotate-90",
    )}
  >
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const indentCSSValue = (indent: number | string) =>
  typeof indent === "number" ? `${indent}px` : indent;

type TreeLinesProps = {
  level: number;
  parentPath: boolean[];
  isLast: boolean;
  indent: number | string;
};

const TreeLines = ({ level, parentPath, isLast, indent }: TreeLinesProps) => {
  if (level <= 0) return null;
  const indentPx = indentCSSValue(indent);

  return (
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 start-0"
      data-slot="tree-lines"
    >
      {parentPath.map((pathIsLast, pathIndex) => {
        if (pathIsLast) return null;
        return (
          <span
            key={`line-${pathIndex}`}
            class="absolute top-0 bottom-0 w-px bg-border"
            style={{ insetInlineStart: `calc(${pathIndex + 1} * ${indentPx})` }}
          />
        );
      })}
      <span
        class="absolute top-1/2 h-px bg-border"
        style={{
          insetInlineStart: `calc(${level - 1} * ${indentPx} + ${indentPx} / 2)`,
          width: `calc(${indentPx} / 2)`,
        }}
      />
      {!isLast ? (
        <span
          class="absolute top-0 bottom-0 w-px bg-border"
          style={{ insetInlineStart: `calc(${level} * ${indentPx})` }}
        />
      ) : null}
    </div>
  );
};

export type TreeItemProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "class"> & {
  nodeId: string;
  label: ComponentChildren;
  icon?: ComponentChildren;
  expandedIcon?: ComponentChildren;
  endContent?: ComponentChildren;
  data?: unknown;
  disabled?: boolean;
  class?: string;
  children?: ComponentChildren;
};

export const TreeItem = ({
  nodeId,
  label,
  icon,
  expandedIcon,
  endContent,
  data,
  disabled = false,
  class: className,
  children,
  onClick,
  onFocus,
  ...rest
}: TreeItemProps) => {
  const tree = useTreeProvider();
  const parentItem = useTreeItemContext();
  const itemRef = useRef<HTMLDivElement>(null);

  const childArray = toChildArray(children);
  const hasChildren = childArray.length > 0;
  const level = parentItem ? parentItem.level + 1 : 1;
  const parentPath = parentItem ? [...parentItem.parentPath, parentItem.isLast] : [];

  const registryVersion = tree.registry.version.value;
  const isExpanded = tree.expandedIds.value.has(nodeId);
  const isSelected = tree.selectedIds.value.has(nodeId);
  const isTabbable = tree.tabbableId.value === nodeId;
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
      console.warn(`[kamod-ui] Duplicate TreeItem nodeId "${nodeId}" detected.`);
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
    tree.registry.setElement(nodeId, itemRef.current);
  });

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

  const showBranch = hasChildren && (tree.animateExpand ? allowRender : isExpanded);

  const handleExpandToggle = (event: Event) => {
    event.stopPropagation();
    if (disabled) return;
    tree.toggleExpanded(nodeId);
  };

  const handleItemClick = (event: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    tree.focusNode(nodeId);
    if (tree.selectionMode !== "none") {
      tree.selectNode(nodeId, {
        toggle: tree.selectionMode === "multiple" && (event.metaKey || event.ctrlKey),
        additive: tree.selectionMode === "multiple" && (event.metaKey || event.ctrlKey),
      });
    }
    onClick?.(event);
  };

  const showExpandedIcon = Boolean(hasChildren && isExpanded && expandedIcon);
  const showIconSlot = tree.showIcons && (icon != null || expandedIcon != null);

  const itemContextValue = {
    nodeId,
    level,
    parentPath,
    isLast,
  };

  return (
    <div data-slot="tree-item" data-node-id={nodeId} class="relative min-w-0">
      <div
        ref={itemRef}
        role="treeitem"
        data-node-id={nodeId}
        data-slot="tree-item-trigger"
        data-state={hasChildren ? (isExpanded ? "open" : "closed") : "leaf"}
        data-selected={isSelected ? "true" : undefined}
        data-disabled={disabled ? "" : undefined}
        data-level={level}
        aria-level={level}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={tree.selectionMode !== "none" ? isSelected : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : isTabbable ? 0 : -1}
        class={cn(
          treeItemVariants({ variant: tree.variant, size: tree.size }),
          "relative",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        style={{ paddingInlineStart: `calc(${level} * ${indentCSSValue(tree.indent)})` }}
        onClick={handleItemClick}
        onFocus={(event) => {
          tree.focusedId.value = nodeId;
          tree.tabbableId.value = nodeId;
          onFocus?.(event);
        }}
        {...rest}
      >
        {tree.showLines ? (
          <TreeLines level={level} parentPath={parentPath} isLast={isLast} indent={tree.indent} />
        ) : null}

        {hasChildren ? (
          <span
            data-slot="tree-item-chevron"
            class="relative z-[1] inline-flex size-4 shrink-0 items-center justify-center"
            aria-hidden="true"
            onClick={handleExpandToggle}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                handleExpandToggle(event);
              }
            }}
          >
            <DefaultChevron expanded={isExpanded} />
          </span>
        ) : (
          <span class="inline-flex size-4 shrink-0" aria-hidden="true" />
        )}

        {showIconSlot ? (
          <span
            data-slot="tree-item-icon"
            class="relative z-[1] inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
            aria-hidden="true"
          >
            {expandedIcon ? (
              <>
                {icon ? (
                  <span
                    class={cn(
                      "inline-flex size-4 items-center justify-center transition-opacity duration-200 motion-reduce:transition-none",
                      showExpandedIcon ? "pointer-events-none absolute opacity-0" : "opacity-100",
                    )}
                  >
                    {icon}
                  </span>
                ) : null}
                <span
                  class={cn(
                    "inline-flex size-4 items-center justify-center transition-opacity duration-200 motion-reduce:transition-none",
                    showExpandedIcon
                      ? "opacity-100"
                      : icon
                        ? "pointer-events-none absolute opacity-0"
                        : "opacity-100",
                  )}
                >
                  {expandedIcon}
                </span>
              </>
            ) : (
              icon
            )}
          </span>
        ) : null}

        <span data-slot="tree-item-label" class="relative z-[1] min-w-0 flex-1 truncate text-start">
          {label}
        </span>

        {endContent ? (
          <span
            data-slot="tree-item-end"
            class="relative z-[1] ms-auto inline-flex shrink-0 items-center"
          >
            {endContent}
          </span>
        ) : null}
      </div>

      {hasChildren ? (
        <div
          role="group"
          data-slot="tree-item-group"
          hidden={!showBranch && !isAnimatingClose}
          aria-hidden={!isExpanded && !isAnimatingClose}
        >
          {tree.animateExpand ? (
            <div
              ref={outerRef}
              data-slot="tree-item-group-outer"
              data-state={isExpanded ? "open" : "closed"}
              onTransitionEnd={handleTransitionEnd}
              class={cn(
                "min-h-0 overflow-hidden",
                (isAnimatingOpen || isAnimatingClose) && "will-change-[height]",
              )}
              inert={!isExpanded || undefined}
            >
              <div ref={innerRef} data-slot="tree-item-group-inner">
                <TreeItemContext.Provider value={itemContextValue}>
                  {children}
                </TreeItemContext.Provider>
              </div>
            </div>
          ) : isExpanded ? (
            <TreeItemContext.Provider value={itemContextValue}>{children}</TreeItemContext.Provider>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
