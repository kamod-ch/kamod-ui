import type { ComponentChildren, JSX } from "preact";
import { useRef } from "preact/hooks";
import { cn } from "../../lib/utils";
import { treeVariants, useTreeProvider } from "./TreeProvider";
import { handleTreeKeyDown } from "./tree-keyboard";

export type TreeProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "class"> & {
  class?: string;
  children?: ComponentChildren;
};

export const Tree = ({
  class: className,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: TreeProps) => {
  const tree = useTreeProvider();
  const rootRef = useRef<HTMLDivElement>(null);

  if (!ariaLabel && !ariaLabelledBy) {
    const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
      ?.NODE_ENV;
    if (env !== "production") {
      console.warn(
        "[kamod-ui] <Tree> requires an accessible name via aria-label or aria-labelledby.",
      );
    }
  }

  const multiselectable = tree.selectionMode === "multiple";

  return (
    <div
      ref={rootRef}
      role="tree"
      aria-multiselectable={multiselectable ? true : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      data-slot="tree"
      data-variant={tree.variant}
      data-size={tree.size}
      class={cn(treeVariants({ variant: tree.variant, size: tree.size }), className)}
      onKeyDown={(event) => {
        handleTreeKeyDown(event, tree);
      }}
      onFocus={(event) => {
        if (event.target !== event.currentTarget) return;
        const visible = tree.registry.getVisibleActivatableIds(tree.expandedIds.value);
        if (visible.length === 0) return;
        const current = tree.tabbableId.value;
        const target = current && visible.includes(current) ? current : visible[0];
        tree.focusNode(target);
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
