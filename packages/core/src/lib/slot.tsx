import {
  type ComponentChildren,
  cloneElement,
  Fragment,
  type HTMLAttributes,
  isValidElement,
  type Ref,
  type RefCallback,
  toChildArray,
  type VNode,
} from "preact";
import { type ClassValue, cn } from "./utils";

/**
 * Host props merge onto the first element child.
 * Host `class` wins conflicting utilities. Handlers and refs run the child, then the host.
 * Host `aria-*` and `data-*` values win when both sides set the same name.
 */
/** Props for any element. `any` keeps callback refs bivariant across element types. */
export type SlotProps = HTMLAttributes<any> & {
  children?: ComponentChildren;
};

type Props = Record<string, unknown>;
type AnyRef = Ref<any> | null | undefined;
type RefValue = RefCallback<any> | { current: any };

const EVENT_PROP = /^on[A-Z]/;

const isDev = () => {
  const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
  return env !== "production";
};

const isStyleRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  !("peek" in value && "subscribe" in value);

const isRefValue = (value: unknown): value is RefValue => {
  if (typeof value === "function") return true;
  return typeof value === "object" && value !== null && "current" in value;
};

/** Assign a callback ref or an object ref. Callbacks may return a cleanup. */
export const assignRef = (ref: AnyRef, node: HTMLElement | null): void | (() => void) => {
  if (typeof ref === "function") return ref(node) || undefined;
  if (isRefValue(ref)) ref.current = node;
};

/** Call every ref. A single ref is returned unchanged so Preact keeps its cleanup. */
export const composeRefs = (...refs: AnyRef[]): Ref<HTMLElement> | undefined => {
  const present: RefValue[] = [];
  const seen = new Set<unknown>();
  for (const ref of refs) {
    if (ref == null || seen.has(ref) || !isRefValue(ref)) continue;
    seen.add(ref);
    present.push(ref);
  }
  if (present.length === 0) return undefined;
  if (present.length === 1) return present[0];

  return (node) => {
    const cleanups = present.map((ref) => {
      if (typeof ref === "function") return ref(node);
      ref.current = node;
      return undefined;
    });
    if (node == null || !cleanups.some((cleanup) => typeof cleanup === "function")) return;
    return () => {
      for (let index = 0; index < present.length; index += 1) {
        const cleanup = cleanups[index];
        const ref = present[index];
        if (typeof cleanup === "function") cleanup();
        else if (typeof ref === "function") ref(null);
        else ref.current = null;
      }
    };
  };
};

export const composeEventHandlers = <E,>(
  childHandler: ((event: E) => void) | undefined,
  slotHandler: ((event: E) => void) | undefined,
): ((event: E) => void) | undefined => {
  if (typeof childHandler === "function" && typeof slotHandler === "function") {
    return (event) => {
      childHandler(event);
      slotHandler(event);
    };
  }
  if (typeof childHandler === "function") return childHandler;
  if (typeof slotHandler === "function") return slotHandler;
  return undefined;
};

const styleText = (value: unknown): string => {
  if (typeof value === "string") return value.replace(/;\s*$/, "");
  if (!isStyleRecord(value)) return "";
  return Object.entries(value)
    .filter(([, entry]) => entry != null && entry !== false)
    .map(([key, entry]) => {
      const property = key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
      return `${property}: ${String(entry)}`;
    })
    .join("; ");
};

const mergeStyle = (childStyle: unknown, slotStyle: unknown): unknown => {
  if (childStyle == null) return slotStyle;
  if (slotStyle == null) return childStyle;
  if (isStyleRecord(childStyle) && isStyleRecord(slotStyle)) {
    return { ...childStyle, ...slotStyle };
  }
  const text = [styleText(childStyle), styleText(slotStyle)].filter(Boolean).join("; ");
  return text || undefined;
};

const slottableChildren = (children: ComponentChildren): VNode<Props>[] => {
  const found: VNode<Props>[] = [];
  const visit = (nodes: ComponentChildren) => {
    for (const node of toChildArray(nodes)) {
      if (!isValidElement(node)) continue;
      if (node.type === Fragment) {
        visit((node.props as { children?: ComponentChildren }).children);
        continue;
      }
      found.push(node as VNode<Props>);
    }
  };
  visit(children);
  return found;
};

/** Props for `cloneElement`, with class, style, events, and refs composed. */
export const mergeSlotProps = (slotProps: Props, child: VNode<Props>): Props => {
  const childProps = (child.props ?? {}) as Props;
  const merged: Props = { ...childProps };
  const eventNames = new Set<string>();

  for (const key of Object.keys(childProps)) {
    if (EVENT_PROP.test(key)) eventNames.add(key);
  }
  for (const key of Object.keys(slotProps)) {
    if (
      key === "children" ||
      key === "ref" ||
      key === "class" ||
      key === "className" ||
      key === "style"
    ) {
      continue;
    }
    if (EVENT_PROP.test(key)) {
      eventNames.add(key);
      continue;
    }
    if (slotProps[key] !== undefined) merged[key] = slotProps[key];
  }

  for (const key of eventNames) {
    const handler = composeEventHandlers(
      childProps[key] as ((event: unknown) => void) | undefined,
      slotProps[key] as ((event: unknown) => void) | undefined,
    );
    if (handler) merged[key] = handler;
  }

  const className = cn(
    childProps.class as ClassValue,
    childProps.className as ClassValue,
    slotProps.class as ClassValue,
    slotProps.className as ClassValue,
  );
  // Preact writes `className` through the DOM property, which replaces `class`.
  // Keep both keys equal so the child's original className cannot win afterward.
  merged.class = className || undefined;
  merged.className = className || undefined;

  const style = mergeStyle(childProps.style, slotProps.style);
  if (style !== undefined) merged.style = style;
  else delete merged.style;

  const ref = composeRefs(child.ref as AnyRef, childProps.ref as AnyRef, slotProps.ref as AnyRef);
  if (ref) merged.ref = ref;
  else delete merged.ref;

  return merged;
};

export const Slot = ({ children, ...slotProps }: SlotProps) => {
  const elements = slottableChildren(children);
  const child = elements[0];
  if (!child) {
    if (isDev() && toChildArray(children).some((node) => node != null && node !== "")) {
      console.warn("[kamod-ui] Slot expects an element child.");
    }
    return null;
  }
  if (isDev() && elements.length > 1) {
    console.warn("[kamod-ui] Slot uses only the first element child.");
  }
  return cloneElement(child, mergeSlotProps(slotProps as Props, child));
};
