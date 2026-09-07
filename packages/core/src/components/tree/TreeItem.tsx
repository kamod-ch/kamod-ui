import type { ComponentChildren, JSX } from "preact";
import { toChildArray } from "preact";
import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeActions,
  TreeNodeContent,
  TreeNodeTrigger,
} from "./TreeNode";
import type { TreeIconProp } from "./tree-types";

export type TreeItemProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "class"> & {
  nodeId: string;
  label: ComponentChildren;
  icon?: TreeIconProp;
  expandedIcon?: ComponentChildren;
  selectedIcon?: ComponentChildren;
  disabledIcon?: ComponentChildren;
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
  selectedIcon,
  disabledIcon,
  endContent,
  data,
  disabled = false,
  class: className,
  children,
  ...rest
}: TreeItemProps) => {
  const childArray = toChildArray(children);
  const hasChildren = childArray.length > 0;

  return (
    <TreeNode
      nodeId={nodeId}
      disabled={disabled}
      data={data}
      icon={icon}
      expandedIcon={expandedIcon}
      selectedIcon={selectedIcon}
      disabledIcon={disabledIcon}
    >
      <TreeNodeTrigger class={className} {...rest}>
        <TreeExpander />
        <TreeIcon />
        <TreeLabel>{label}</TreeLabel>
        {endContent ? <TreeNodeActions>{endContent}</TreeNodeActions> : null}
      </TreeNodeTrigger>
      {hasChildren ? <TreeNodeContent>{children}</TreeNodeContent> : null}
    </TreeNode>
  );
};
