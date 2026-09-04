import { type Signal, signal } from "@preact/signals";

export type TreeNodeRecord = {
  nodeId: string;
  parentId: string | null;
  disabled: boolean;
  hasChildren: boolean;
  data: unknown;
  element: HTMLElement | null;
  order: number;
  isLast: boolean;
  level: number;
};

export class TreeRegistry {
  private nodes = new Map<string, TreeNodeRecord>();
  private childrenByParent = new Map<string | null, string[]>();
  private orderCounter = 0;
  readonly version: Signal<number> = signal(0);

  private bump() {
    this.version.value += 1;
  }

  register(node: Omit<TreeNodeRecord, "order" | "isLast" | "level"> & { level: number }) {
    const existing = this.nodes.get(node.nodeId);
    if (existing) {
      existing.parentId = node.parentId;
      existing.disabled = node.disabled;
      existing.hasChildren = node.hasChildren;
      existing.data = node.data;
      existing.element = node.element;
      existing.level = node.level;
      this.rebuildChildren(node.parentId);
      this.bump();
      return;
    }

    this.nodes.set(node.nodeId, {
      ...node,
      order: this.orderCounter++,
      isLast: false,
    });
    this.rebuildChildren(node.parentId);
    this.bump();
  }

  unregister(nodeId: string) {
    const node = this.nodes.get(nodeId);
    if (!node) return;
    const parentId = node.parentId;
    this.nodes.delete(nodeId);
    this.rebuildChildren(parentId);
    this.bump();
  }

  setElement(nodeId: string, element: HTMLElement | null) {
    const node = this.nodes.get(nodeId);
    if (!node || node.element === element) return;
    node.element = element;
    this.bump();
  }

  getNode(nodeId: string) {
    return this.nodes.get(nodeId);
  }

  getChildren(parentId: string | null) {
    return this.childrenByParent.get(parentId) ?? [];
  }

  getParent(nodeId: string) {
    const node = this.nodes.get(nodeId);
    if (!node?.parentId) return null;
    return this.nodes.get(node.parentId) ?? null;
  }

  isVisible(nodeId: string, expandedIds: ReadonlySet<string>) {
    let current = this.nodes.get(nodeId);
    if (!current) return false;
    while (current.parentId) {
      if (!expandedIds.has(current.parentId)) return false;
      current = this.nodes.get(current.parentId);
      if (!current) return false;
    }
    return true;
  }

  getVisibleActivatableIds(expandedIds: ReadonlySet<string>) {
    const rootIds = this.getChildren(null);
    const result: string[] = [];

    const walk = (ids: string[]) => {
      for (const id of ids) {
        const node = this.nodes.get(id);
        if (!node) continue;
        if (!this.isVisible(id, expandedIds)) continue;
        if (!node.disabled) result.push(id);
        if (node.hasChildren && expandedIds.has(id)) {
          walk(this.getChildren(id));
        }
      }
    };

    walk(rootIds);
    return result;
  }

  private rebuildChildren(parentId: string | null) {
    const childIds = [...this.nodes.values()]
      .filter((node) => node.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map((node) => node.nodeId);

    this.childrenByParent.set(parentId, childIds);

    childIds.forEach((childId, index) => {
      const node = this.nodes.get(childId);
      if (node) node.isLast = index === childIds.length - 1;
    });
  }
}
