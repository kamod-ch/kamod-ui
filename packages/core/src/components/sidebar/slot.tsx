import { type ComponentChildren, cloneElement, isValidElement, type VNode } from "preact";
import { cn } from "../../lib/utils";

/** Merge props onto a single element child (shadcn Slot / asChild). */
export const Slot = (props: Record<string, unknown> & { children?: ComponentChildren }) => {
  const { children, class: className, ...rest } = props;
  if (!isValidElement(children)) return null;
  const child = children as VNode<Record<string, unknown>>;
  const childProps = (child.props ?? {}) as Record<string, unknown>;
  return cloneElement(child, {
    ...rest,
    ...childProps,
    class: cn(
      className as string | undefined,
      childProps.class as string | undefined,
      childProps.className as string | undefined,
    ),
  });
};
