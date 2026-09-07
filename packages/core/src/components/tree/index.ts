import { Tree } from "./Tree";
import { TreeItem } from "./TreeItem";
import { TreeLines } from "./TreeLines";
import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeActions,
  TreeNodeContent,
  TreeNodeTrigger,
  useTreeNodeContext,
} from "./TreeNode";
import {
  TreeProvider,
  treeItemVariants,
  treeVariants,
  useTreeItemContext,
  useTreeProvider,
} from "./TreeProvider";

export type { TreeProps } from "./Tree";
export type { TreeItemProps } from "./TreeItem";
export type { TreeLinesProps } from "./TreeLines";
export type {
  TreeExpanderProps,
  TreeIconProps,
  TreeLabelProps,
  TreeNodeActionsProps,
  TreeNodeContentProps,
  TreeNodeContextValue,
  TreeNodeProps,
  TreeNodeTriggerProps,
} from "./TreeNode";
export type {
  TreeItemContextValue,
  TreeProviderContextValue,
  TreeProviderProps,
  TreeSelectionMode,
} from "./TreeProvider";
export type { TreeIconProp, TreeIconRender, TreeIconState, TreeIcons } from "./tree-types";
export {
  Tree,
  TreeExpander,
  TreeIcon,
  TreeItem,
  TreeLabel,
  TreeLines,
  TreeNode,
  TreeNodeActions,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  treeItemVariants,
  treeVariants,
  useTreeItemContext,
  useTreeNodeContext,
  useTreeProvider,
};

export default {
  Provider: TreeProvider,
  Root: Tree,
  Item: TreeItem,
  Node: TreeNode,
  NodeTrigger: TreeNodeTrigger,
  Expander: TreeExpander,
  Icon: TreeIcon,
  Label: TreeLabel,
  NodeActions: TreeNodeActions,
  NodeContent: TreeNodeContent,
  Lines: TreeLines,
};
