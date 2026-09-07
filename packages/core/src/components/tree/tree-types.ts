import type { ComponentChildren } from "preact";

export type TreeIconState = {
  nodeId: string;
  branch: boolean;
  expanded: boolean;
  selected: boolean;
  disabled: boolean;
  level: number;
};

export type TreeIconRender = (state: TreeIconState) => ComponentChildren;

export type TreeIconProp = ComponentChildren | TreeIconRender;

export type TreeIcons = {
  branch?: ComponentChildren;
  branchExpanded?: ComponentChildren;
  leaf?: ComponentChildren;
  expander?: ComponentChildren;
  expanderExpanded?: ComponentChildren;
};
