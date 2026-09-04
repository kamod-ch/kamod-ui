import type { JSX } from "preact";
import type { TreeProviderContextValue } from "./TreeProvider";

const isMetaLike = (event: KeyboardEvent) => event.ctrlKey || event.metaKey;

export const handleTreeKeyDown = (
  event: JSX.TargetedKeyboardEvent<HTMLDivElement>,
  tree: TreeProviderContextValue,
) => {
  if (event.defaultPrevented) return;

  const target = event.target as HTMLElement | null;
  const itemEl = target?.closest('[role="treeitem"]') as HTMLElement | null;
  if (!itemEl) return;

  const nodeId = itemEl.getAttribute("data-node-id");
  if (!nodeId) return;

  const visible = tree.registry.getVisibleActivatableIds(tree.expandedIds.value);
  const index = visible.indexOf(nodeId);
  if (index === -1) return;

  const node = tree.registry.getNode(nodeId);
  if (!node) return;

  const moveFocus = (nextId: string) => {
    event.preventDefault();
    tree.focusNode(nextId);
  };

  switch (event.key) {
    case "ArrowDown": {
      if (index < visible.length - 1) moveFocus(visible[index + 1]);
      break;
    }
    case "ArrowUp": {
      if (index > 0) moveFocus(visible[index - 1]);
      break;
    }
    case "Home": {
      if (visible.length > 0) moveFocus(visible[0]);
      break;
    }
    case "End": {
      if (visible.length > 0) moveFocus(visible[visible.length - 1]);
      break;
    }
    case "ArrowRight": {
      event.preventDefault();
      if (node.hasChildren) {
        if (!tree.expandedIds.value.has(nodeId)) {
          tree.toggleExpanded(nodeId);
        } else {
          const children = tree.registry.getChildren(nodeId).filter((id) => {
            const child = tree.registry.getNode(id);
            return child && !child.disabled && tree.registry.isVisible(id, tree.expandedIds.value);
          });
          if (children[0]) tree.focusNode(children[0]);
        }
      }
      break;
    }
    case "ArrowLeft": {
      event.preventDefault();
      if (node.hasChildren && tree.expandedIds.value.has(nodeId)) {
        tree.toggleExpanded(nodeId);
      } else if (node.parentId) {
        tree.focusNode(node.parentId);
      }
      break;
    }
    case "Enter":
    case " ": {
      if (event.key === " " && isMetaLike(event)) {
        event.preventDefault();
        tree.selectNode(nodeId, { additive: true, toggle: true });
        break;
      }
      event.preventDefault();
      if (node.hasChildren && !tree.expandedIds.value.has(nodeId)) {
        tree.toggleExpanded(nodeId);
      }
      if (tree.selectionMode !== "none") {
        tree.selectNode(nodeId, {
          toggle: tree.selectionMode === "multiple",
        });
      }
      break;
    }
    case "a":
    case "A": {
      if (!isMetaLike(event) || tree.selectionMode !== "multiple") break;
      event.preventDefault();
      tree.setSelectedIds(visible);
      break;
    }
    default:
      break;
  }
};
