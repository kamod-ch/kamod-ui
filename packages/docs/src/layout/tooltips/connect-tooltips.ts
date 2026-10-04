import { tooltipLabel, tooltipTarget } from "./tooltip-label";

export type TooltipHint = { target: HTMLElement; text: string };
const overlaySelector = "[data-application-tooltip]";
const insideOverlay = (node: EventTarget | null) =>
  node instanceof Element && !!node.closest(overlaySelector);

/** Delegate once per document; only the currently hovered/focused control owns timers and observation. */
export function connectTooltips(doc: Document, onChange: (hint: TooltipHint | null) => void) {
  let target: HTMLElement | null = null;
  let opening: ReturnType<typeof setTimeout> | undefined;
  let closing: ReturnType<typeof setTimeout> | undefined;
  let savedTitle: string | null = null;
  let keyboard = true;
  let observer: ResizeObserver | undefined;

  const cancelTimers = () => {
    clearTimeout(opening);
    clearTimeout(closing);
    opening = closing = undefined;
  };
  const clear = () => {
    if (!target && opening === undefined && closing === undefined) return;
    cancelTimers();
    observer?.disconnect();
    observer = undefined;
    if (target && savedTitle !== null && !target.hasAttribute("title"))
      target.setAttribute("title", savedTitle);
    savedTitle = null;
    target = null;
    onChange(null);
  };
  const show = (next: HTMLElement, immediate: boolean) => {
    if (target === next && (!immediate || opening === undefined)) {
      clearTimeout(closing);
      closing = undefined;
      return;
    }
    clear();
    target = next;
    const text = tooltipLabel(next);
    savedTitle = next.getAttribute("title");
    // Avoid displaying both a native title and the styled hint.
    if (savedTitle !== null) next.removeAttribute("title");
    const open = () => {
      opening = undefined;
      if (!next.isConnected) {
        clear();
        return;
      }
      onChange({ target: next, text });
      observer = new ResizeObserver(() => {
        if (!next.isConnected || next.getClientRects().length === 0) clear();
      });
      observer.observe(next);
    };
    if (immediate) open();
    else opening = setTimeout(open, 450);
  };
  const leave = () => {
    if (opening !== undefined) {
      clear();
      return;
    }
    if (keyboard && doc.activeElement === target) return;
    clearTimeout(closing);
    closing = setTimeout(clear, 120);
  };
  const over = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    if (insideOverlay(event.target)) {
      clearTimeout(closing);
      return;
    }
    const next = tooltipTarget(event.target);
    if (next) show(next, false);
  };
  const out = (event: PointerEvent) => {
    if (event.relatedTarget instanceof Node && target?.contains(event.relatedTarget)) return;
    if (insideOverlay(event.relatedTarget)) return;
    leave();
  };
  const focus = (event: FocusEvent) => {
    if (!keyboard) return;
    const next = tooltipTarget(event.target);
    if (next) show(next, true);
  };
  const keydown = (event: KeyboardEvent) => {
    keyboard = true;
    if (event.key === "Escape") clear();
  };
  const pointerdown = () => {
    keyboard = false;
    clear();
  };
  const scroll = (event: Event) => {
    if (!insideOverlay(event.target)) clear();
  };
  const registrations: Array<() => void> = [];
  const listen = <K extends keyof DocumentEventMap>(
    name: K,
    handler: (event: DocumentEventMap[K]) => void,
  ) => {
    doc.addEventListener(name, handler, true);
    registrations.push(() => doc.removeEventListener(name, handler, true));
  };
  listen("pointerover", over);
  listen("pointerout", out);
  listen("pointerdown", pointerdown);
  listen("click", clear);
  listen("focusin", focus);
  listen("focusout", clear);
  listen("keydown", keydown);
  listen("scroll", scroll);
  doc.defaultView?.addEventListener("resize", clear);
  doc.defaultView?.addEventListener("blur", clear);
  doc.defaultView?.addEventListener("pagehide", clear);
  return () => {
    registrations.forEach((remove) => remove());
    doc.defaultView?.removeEventListener("resize", clear);
    doc.defaultView?.removeEventListener("blur", clear);
    doc.defaultView?.removeEventListener("pagehide", clear);
    clear();
  };
}
