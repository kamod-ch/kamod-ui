import { Tree } from "./Tree";
import { TreeItem } from "./TreeItem";
import {
  TreeProvider,
  treeItemVariants,
  treeVariants,
  useTreeItemContext,
  useTreeProvider,
} from "./TreeProvider";

export type { TreeProps } from "./Tree";
export type { TreeItemProps } from "./TreeItem";
export type {
  TreeItemContextValue,
  TreeProviderContextValue,
  TreeProviderProps,
  TreeSelectionMode,
} from "./TreeProvider";
export {
  Tree,
  TreeItem,
  TreeProvider,
  treeItemVariants,
  treeVariants,
  useTreeItemContext,
  useTreeProvider,
};

export default {
  Provider: TreeProvider,
  Root: Tree,
  Item: TreeItem,
};
