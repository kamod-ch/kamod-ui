import type { ComponentChildren, HTMLAttributes } from "preact";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { createPortal } from "../../lib/createPortal";
import {
  createDismissableLayer,
  focusInitialMenuItem,
  handleMenuContentKeyDown,
} from "../../lib/interactive";
import { cn } from "../../lib/utils";
import { useContextMenu } from "./ContextMenu";

export type ContextMenuContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export const ContextMenuContent = ({
  class: className,
  children,
  style,
  onKeyDown,
  ...rest
}: ContextMenuContentProps) => {
  const { open, setOpen, position, contentWrapperRef, triggerRef } = useContextMenu();
  const innerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
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
      top: clamp(py, margin, Math.max(margin, maxY)),
    });
  }, [isOpen, px, py]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const menu = menuRef.current;
    if (menu) focusInitialMenuItem(menu);
  }, [isOpen]);

  useEffect(() => {
    const setOpenRef = { current: setOpen };
    setOpenRef.current = setOpen;
    const layer = createDismissableLayer({
      root: () => contentWrapperRef.current,
      open: () => Boolean(open.value),
      onDismiss: () => setOpenRef.current(false),
      onEscapeDismiss: () => {
        setOpenRef.current(false);
        triggerRef.current?.focus();
      },
    });
    return () => layer.dispose();
  }, [open, setOpen, contentWrapperRef, triggerRef]);

  if (!isOpen) return null;

  const inlineStyle =
    typeof style === "object" && style !== null
      ? { position: "fixed" as const, left: fixedPos.left, top: fixedPos.top, zIndex: 50, ...style }
      : ({
          position: "fixed" as const,
          left: fixedPos.left,
          top: fixedPos.top,
          zIndex: 50,
        } as const);

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
        ref={menuRef}
        role="menu"
        tabIndex={-1}
        class="text-popover-foreground max-h-[min(24rem,calc(100dvh-2rem))] overflow-y-auto rounded-md border bg-popover p-1 shadow-md outline-none"
        onKeyDown={(event) => {
          handleMenuContentKeyDown(event, event.currentTarget, {
            onEscape: () => {
              setOpen(false);
              triggerRef.current?.focus();
            },
          });
          onKeyDown?.(event);
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};
