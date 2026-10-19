import type { ComponentChildren } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";
import { observeViewportActivity } from "../../../layout/runtime/viewport-activity";

/** Small inline compositions follow the same motion budget as isolated examples. */
export function ComponentUsagePreview({
  children,
  className = "",
}: {
  children: ComponentChildren;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = root.current;
    if (node)
      return observeViewportActivity(node, (active) =>
        node.toggleAttribute("data-preview-paused", !active),
      );
  }, []);
  return (
    <div ref={root} class={`docs-usage-row ${className}`} data-preview-paused="">
      {children}
    </div>
  );
}
