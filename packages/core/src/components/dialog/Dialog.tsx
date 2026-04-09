import { createContext } from "preact";
import { useCallback, useContext, useEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { createDismissableLayer } from "../../lib/interactive";

const SCROLL_LOCK_COUNT_ATTR = "data-kamod-scroll-lock-count";
const SCROLL_LOCK_BODY_OVERFLOW_ATTR = "data-kamod-scroll-lock-body-overflow";
const SCROLL_LOCK_HTML_OVERFLOW_ATTR = "data-kamod-scroll-lock-html-overflow";
const SCROLL_LOCK_BODY_PADDING_RIGHT_ATTR = "data-kamod-scroll-lock-body-padding-right";
const SCROLL_LOCK_HTML_SCROLLBAR_GUTTER_ATTR = "data-kamod-scroll-lock-html-scrollbar-gutter";

const lockDocumentScroll = () => {
  const body = document.body;
  const html = document.documentElement;
  const lockCount = Number.parseInt(body.getAttribute(SCROLL_LOCK_COUNT_ATTR) ?? "0", 10);

  if (lockCount === 0) {
    body.setAttribute(SCROLL_LOCK_BODY_OVERFLOW_ATTR, body.style.overflow);
    body.setAttribute(SCROLL_LOCK_BODY_PADDING_RIGHT_ATTR, body.style.paddingRight);
    html.setAttribute(SCROLL_LOCK_HTML_OVERFLOW_ATTR, html.style.overflow);
    html.setAttribute(SCROLL_LOCK_HTML_SCROLLBAR_GUTTER_ATTR, html.style.scrollbarGutter);

    html.style.scrollbarGutter = "auto";
    void html.offsetHeight;

    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.setAttribute("data-kamod-scroll-lock", "");
    html.style.setProperty("--kamod-scroll-lock-gutter", `${scrollbarWidth}px`);

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  body.setAttribute(SCROLL_LOCK_COUNT_ATTR, String(lockCount + 1));

  return () => {
    const currentCount = Number.parseInt(body.getAttribute(SCROLL_LOCK_COUNT_ATTR) ?? "0", 10);
    const nextCount = Math.max(0, currentCount - 1);

    if (nextCount > 0) {
      body.setAttribute(SCROLL_LOCK_COUNT_ATTR, String(nextCount));
      return;
    }

    const previousBodyOverflow = body.getAttribute(SCROLL_LOCK_BODY_OVERFLOW_ATTR) ?? "";
    const previousHtmlOverflow = html.getAttribute(SCROLL_LOCK_HTML_OVERFLOW_ATTR) ?? "";
    const previousBodyPaddingRight = body.getAttribute(SCROLL_LOCK_BODY_PADDING_RIGHT_ATTR) ?? "";
    const previousHtmlScrollbarGutter = html.getAttribute(SCROLL_LOCK_HTML_SCROLLBAR_GUTTER_ATTR) ?? "";

    body.style.overflow = previousBodyOverflow;
    body.style.paddingRight = previousBodyPaddingRight;
    html.style.overflow = previousHtmlOverflow;
    if (previousHtmlScrollbarGutter === "") {
      html.style.removeProperty("scrollbar-gutter");
    } else {
      html.style.scrollbarGutter = previousHtmlScrollbarGutter;
    }
    html.style.removeProperty("--kamod-scroll-lock-gutter");
    html.removeAttribute("data-kamod-scroll-lock");
    body.removeAttribute(SCROLL_LOCK_COUNT_ATTR);
    body.removeAttribute(SCROLL_LOCK_BODY_OVERFLOW_ATTR);
    body.removeAttribute(SCROLL_LOCK_BODY_PADDING_RIGHT_ATTR);
    html.removeAttribute(SCROLL_LOCK_HTML_OVERFLOW_ATTR);
    html.removeAttribute(SCROLL_LOCK_HTML_SCROLLBAR_GUTTER_ATTR);
  };
};

export type DialogContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: { current: HTMLElement | null };
};

const DialogContext = createContext<DialogContextValue | null>(null);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error("Dialog subcomponents must be used within Dialog");
  return context;
};

export type DialogProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When true, locks document scroll while open (shadcn default). */
  lockBodyScroll?: boolean;
  children?: ComponentChildren;
};

export const Dialog = ({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  lockBodyScroll = true,
  children,
  ...rest
}: DialogProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const openPropRef = useRef(openProp);
  openPropRef.current = openProp;
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const open = openProp !== undefined ? openProp : internalOpen;

  const openRef = useRef(open);
  openRef.current = open;

  const setOpen = useCallback((next: boolean) => {
    if (openPropRef.current === undefined) {
      setInternalOpen(next);
    }
    onOpenChangeRef.current?.(next);
  }, []);

  const triggerRef = useRef<HTMLElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = createDismissableLayer({
      root: () => rootRef.current,
      open: () => openRef.current,
      onDismiss: () => {
        setOpen(false);
      }
    });
    return () => layer.dispose();
  }, [setOpen]);

  useEffect(() => {
    if (!lockBodyScroll || typeof document === "undefined") return;
    if (!open) return;
    return lockDocumentScroll();
  }, [lockBodyScroll, open]);

  return (
    <DialogContext.Provider value={{ open, setOpen, triggerRef }}>
      <div ref={rootRef} data-slot="dialog" data-state={open ? "open" : "closed"} {...rest}>
        {children}
      </div>
    </DialogContext.Provider>
  );
};
