import type { ComponentChildren } from "preact";
import { cn } from "../../lib/utils";
import type { TreeIconProp, TreeIconState, TreeIcons } from "./tree-types";

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

const DefaultBranchIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M2 4.5h8a2 2 0 012 2V12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M12 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DefaultLeafIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" focusable="false">
    <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const renderIconProp = (
  icon: TreeIconProp | undefined,
  state: TreeIconState,
): ComponentChildren => {
  if (icon == null) return null;
  if (typeof icon === "function") return icon(state);
  return icon;
};

export type ResolveTreeIconOptions = {
  state: TreeIconState;
  icon?: TreeIconProp;
  expandedIcon?: ComponentChildren;
  selectedIcon?: ComponentChildren;
  disabledIcon?: ComponentChildren;
  providerIcons?: TreeIcons;
  showFallback?: boolean;
};

/** Priority: disabledIcon → selectedIcon → expandedIcon → node icon → provider default → internal fallback */
export const resolveTreeIcon = ({
  state,
  icon,
  expandedIcon,
  selectedIcon,
  disabledIcon,
  providerIcons,
  showFallback = true,
}: ResolveTreeIconOptions): ComponentChildren => {
  if (state.disabled && disabledIcon != null) return disabledIcon;
  if (state.selected && selectedIcon != null) return selectedIcon;
  if (state.branch && state.expanded && expandedIcon != null) return expandedIcon;

  const nodeIcon = renderIconProp(icon, state);
  if (nodeIcon != null) return nodeIcon;

  if (providerIcons) {
    if (state.branch) {
      if (state.expanded && providerIcons.branchExpanded != null)
        return providerIcons.branchExpanded;
      if (providerIcons.branch != null) return providerIcons.branch;
    } else if (providerIcons.leaf != null) {
      return providerIcons.leaf;
    }
  }

  if (!showFallback) return null;
  return state.branch ? <DefaultBranchIcon /> : <DefaultLeafIcon />;
};

export const resolveTreeExpanderIcon = (
  expanded: boolean,
  providerIcons?: TreeIcons,
): ComponentChildren => {
  if (expanded && providerIcons?.expanderExpanded != null) return providerIcons.expanderExpanded;
  if (!expanded && providerIcons?.expander != null) return providerIcons.expander;
  return <DefaultChevron expanded={expanded} />;
};
