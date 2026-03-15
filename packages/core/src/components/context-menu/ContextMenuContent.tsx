import { createPortal } from "preact/compat";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { createDismissableLayer } from "../../lib/interactive";
import { useContextMenu } from "./ContextMenu";

export type ContextMenuContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export const ContextMenuContent = ({ class: className, children, style, ...rest }: ContextMenuContentProps) => {
  const { open, setOpen, position, contentWrapperRef } = useContextMenu();
  const innerRef = useRef<HTMLDivElement | null>(null);
  const pt = position.value ?? { x: 0, y: 0 };
  const [fixedPos, setFixedPos] = useState(() => ({ left: pt.x, top: pt.y }));

  const isOpen = Boolean(open.value);
  const px = pt.x;
  const py = pt.y;

  const assignRef = (node: HTMLDivElement | null) => {
    innerRef.current = node;
    contentWrapperRef.current = node;
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    const el = innerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 8;
    const maxX = window.innerWidth - rect.width - margin;
    const maxY = window.innerHeight - rect.height - margin;
    setFixedPos({
      left: clamp(px, margin, Math.max(margin, maxX)),
      top: clamp(py, margin, Math.max(margin, maxY))
    });
  }, [isOpen, px, py]);

  useEffect(() => {
    const setOpenRef = { current: setOpen };
    setOpenRef.current = setOpen;
    const layer = createDismissableLayer({
      root: () => contentWrapperRef.current,
      open: () => Boolean(open.value),
      onDismiss: () => setOpenRef.current(false)
    });
    return () => layer.dispose();
  }, [open, setOpen, contentWrapperRef]);

  if (!isOpen) return null;

  const inlineStyle =
    typeof style === "object" && style !== null
      ? { position: "fixed" as const, left: fixedPos.left, top: fixedPos.top, zIndex: 50, ...style }
      : ({ position: "fixed" as const, left: fixedPos.left, top: fixedPos.top, zIndex: 50 } as const);

  return createPortal(
    <div
      ref={assignRef}
      data-slot="context-menu-content"
      role="presentation"
      class={cn("min-w-40 outline-none", className)}
      style={inlineStyle}
      {...rest}
    >
      <div
        role="menu"
        class="text-popover-foreground max-h-[min(24rem,calc(100dvh-2rem))] overflow-y-auto rounded-md border bg-popover p-1 shadow-md"
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
