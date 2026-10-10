import type { InlineCodeExplanation } from "./inline-code-glossary";
import { inlineCodeHelp } from "./inline-code-targets";
import { type NavigationHint, navigationHelp } from "./navigation-help";
import { tooltipLabel, tooltipTarget } from "./tooltip-label";

export type TooltipHint = {
  target: HTMLElement;
  text: string;
  explanation?: InlineCodeExplanation;
  navigation?: NavigationHint;
};
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
  let contentObserver: MutationObserver | undefined;
  let opened = false;
  let pointerPosition: { x: number; y: number } | undefined;

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
    contentObserver?.disconnect();
    contentObserver = undefined;
    if (target && savedTitle !== null && !target.hasAttribute("title"))
      target.setAttribute("title", savedTitle);
    savedTitle = null;
    target = null;
    opened = false;
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
    savedTitle = next.getAttribute("title");
    // Avoid displaying both a native title and the styled hint.
    if (savedTitle !== null) next.removeAttribute("title");
    const open = () => {
      opening = undefined;
      if (!next.isConnected) {
        clear();
        return;
      }
      // Responsive labels require style/layout reads. Defer them until the
      // intentional hover delay so passing over controls never blocks hover paint.
      const explanation = inlineCodeHelp(next);
      const navigation = navigationHelp(next);
      const text =
        navigation?.title ??
        next.dataset.referenceTitle ??
        (explanation ? (next.textContent?.trim() ?? "Code") : tooltipLabel(next, savedTitle));
      if (!text) return;
      opened = true;
      onChange({ target: next, text, explanation, navigation });
      observer = new ResizeObserver(() => {
        if (!next.isConnected || next.getClientRects().length === 0) clear();
      });
      observer.observe(next);
      if (explanation) {
        contentObserver = new MutationObserver(clear);
        contentObserver.observe(next, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ["data-inline-code-help"],
        });
      }
    };
    if (immediate) open();
    else opening = setTimeout(open, 450);
  };
  const leave = () => {
    if (!target) return;
    if (opening !== undefined) {
      clear();
      return;
    }
    if (keyboard && (doc.activeElement === target || insideOverlay(doc.activeElement))) return;
    clearTimeout(closing);
    closing = setTimeout(clear, 120);
  };
  const over = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const moved = pointerPosition?.x !== event.clientX || pointerPosition?.y !== event.clientY;
    pointerPosition = { x: event.clientX, y: event.clientY };
    // Focusing a scrolled sidebar item can move other rows under a stationary pointer.
    // Those synthetic hover changes must not replace the keyboard user's active hint.
    if (!moved && keyboard && target && doc.activeElement === target) return;
    if (moved) keyboard = false;
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
    if (insideOverlay(event.target)) {
      clearTimeout(closing);
      return;
    }
    if (!keyboard) return;
    const next = tooltipTarget(event.target);
    if (next) show(next, true);
  };
  const keydown = (event: KeyboardEvent) => {
    keyboard = true;
    if (event.key === "Escape") {
      // Dismiss group help before its surrounding mobile menu.
      if (opened && target && navigationHelp(target)?.group) event.stopPropagation();
      const restore = insideOverlay(doc.activeElement) ? target : null;
      restore?.focus();
      clear();
      return;
    }
    const code = tooltipTarget(event.target);
    if (code?.matches("code[data-inline-code-help]") && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      show(code, true);
      return;
    }
    if (target && (inlineCodeHelp(target) || navigationHelp(target)?.group)) {
      if (event.key === "Tab" && opened) {
        const links = doc.querySelectorAll<HTMLAnchorElement>(`${overlaySelector} a[href]`);
        if (!event.shiftKey && event.target === target && links.length) {
          event.preventDefault();
          event.stopPropagation();
          links[0].focus();
        } else if (
          insideOverlay(event.target) &&
          ((event.shiftKey && event.target === links[0]) ||
            (!event.shiftKey && event.target === links[links.length - 1]))
        ) {
          // Resume the document's natural tab order from the original term, not the portal.
          target.focus();
          clear();
          if (event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      }
    }
  };
  const pointerdown = (event: PointerEvent) => {
    keyboard = false;
    if (
      insideOverlay(event.target) ||
      (event.target instanceof Element && event.target.closest("code[data-inline-code-help]"))
    )
      return;
    clear();
  };
  const click = (event: MouseEvent) => {
    if (insideOverlay(event.target)) return;
    const next = tooltipTarget(event.target);
    if (next?.matches("code[data-inline-code-help]")) {
      if (next === target && opened) clear();
      else show(next, true);
    } else clear();
  };
  const blur = (event: FocusEvent) => {
    if (event.relatedTarget === target || insideOverlay(event.relatedTarget)) return;
    clear();
  };
  const scroll = (event: Event) => {
    if (insideOverlay(event.target)) return;
    const explanation = target && inlineCodeHelp(target);
    const navigation = target && navigationHelp(target);
    // Browser focus can scroll a term into view after opening its help. Keep that help usable.
    if (
      target &&
      (explanation || navigation) &&
      opened &&
      keyboard &&
      doc.activeElement === target
    ) {
      const rect = target.getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= (doc.defaultView?.innerHeight ?? 0)) {
        onChange({
          target,
          text: navigation?.title ?? target.textContent?.trim() ?? "Code",
          explanation: explanation ?? undefined,
          navigation: navigation ?? undefined,
        });
        return;
      }
    }
    clear();
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
  listen("click", click);
  listen("focusin", focus);
  listen("focusout", blur);
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
