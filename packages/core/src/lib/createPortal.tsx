import { type ComponentChildren, createPortal as createPreactPortal, type VNode } from "preact";

/** Render children into another DOM container while preserving Preact context and hooks. */
export function createPortal(vnode: ComponentChildren, container: HTMLElement): VNode {
  const portal = createPreactPortal(vnode, container);
  (portal as VNode & { containerInfo?: HTMLElement }).containerInfo = container;
  return portal;
}
