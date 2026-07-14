import { type ComponentChildren, createElement, render, type VNode } from "preact";

/**
 * Minimal DOM parent used by Preact's renderer to mount portal children into `document.body`
 * while preserving context and hooks from the calling tree.
 *
 * @see preact/compat/src/portals.js (inlined to avoid a preact/compat dependency)
 */
type PortalMountParent = {
  nodeType: 1;
  parentNode: HTMLElement;
  childNodes: ChildNode[];
  _children: { _mask?: unknown };
  contains: () => true;
  namespaceURI: string | null;
  insertBefore: (child: Node, before: Node | null) => void;
  removeChild: (child: Node) => void;
};

type PortalProps = {
  _vnode: any;
  _container: HTMLElement;
};

type PortalInstance = {
  _vnode?: any;
  _temp: PortalMountParent | null;
  _container: HTMLElement | null;
  context: Record<string, unknown>;
  props: PortalProps;
  componentWillUnmount: () => void;
};

function ContextProvider(this: {
  getChildContext: () => unknown;
  props: { context: unknown; children: ComponentChildren };
}) {
  this.getChildContext = () => this.props.context;
  return this.props.children;
}

function Portal(this: PortalInstance, props: PortalProps) {
  const container = props._container;

  this.componentWillUnmount = () => {
    if (this._temp) {
      render(null, this._temp as unknown as Element);
      this._temp = null;
      this._container = null;
    }
  };

  if (this._container && this._container !== container) {
    this.componentWillUnmount();
  }

  if (!this._temp) {
    let root: any = this._vnode;
    while (root != null && !root._mask && root._parent != null) {
      root = root._parent;
    }

    this._container = container;

    this._temp = {
      nodeType: 1,
      parentNode: container,
      childNodes: [],
      _children: { _mask: root?._mask },
      contains: () => true,
      namespaceURI: container.namespaceURI,
      insertBefore: (child, before) => {
        this._temp!.childNodes.push(child as ChildNode);
        this._container!.insertBefore(child, before);
      },
      removeChild: (child) => {
        this._temp!.childNodes.splice(this._temp!.childNodes.indexOf(child as ChildNode) >>> 1, 1);
        this._container!.removeChild(child);
      },
    };
  }

  render(
    createElement(ContextProvider as any, { context: this.context }, props._vnode),
    this._temp as unknown as Element,
  );
}

export function createPortal(vnode: ComponentChildren, container: HTMLElement): VNode {
  const el = createElement(Portal as any, {
    _vnode: vnode,
    _container: container,
  }) as VNode;
  (el as VNode & { containerInfo?: HTMLElement }).containerInfo = container;
  return el;
}
