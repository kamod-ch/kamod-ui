import type { RefObject } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";

/** Measure existing tokens synchronously without changing their source or retaining duplicate DOM. */
function intrinsicWidth(node: HTMLElement, height?: string) {
  const previousHeight = node.style.getPropertyValue("min-height");
  const priority = node.style.getPropertyPriority("min-height");
  // Keep scrollable source panes from clamping their scroll position during sizing.
  if (height) node.style.setProperty("min-height", height, "important");
  node.setAttribute("data-code-measure", "");
  const width = node.scrollWidth;
  node.removeAttribute("data-code-measure");
  if (height) {
    if (previousHeight) node.style.setProperty("min-height", previousHeight, priority);
    else node.style.removeProperty("min-height");
  }
  return width;
}

/** Keep reading controls paired whenever the complete, unwrapped source would overflow. */
export function useCodeOverflow(
  element: RefObject<HTMLElement | null>,
  enabled: boolean,
  markup: string,
  wrapped: boolean,
  folded: boolean,
  syntaxTheme: string,
) {
  const [overflows, setOverflows] = useState(false);
  const measure = useRef<((force?: boolean) => void) | null>(null);
  const source = useRef({ markup, folded, syntaxTheme });
  source.current = { markup, folded, syntaxTheme };

  useLayoutEffect(() => {
    const node = element.current;
    const pre = node?.parentElement;
    if (!enabled || !node || !pre) {
      setOverflows(false);
      return;
    }
    let active = true;
    let cached:
      | { markup: string; theme: string; typography: string; width: number; complete: boolean }
      | undefined;
    const update = (force = false) => {
      if (!active) return;
      const style = getComputedStyle(pre);
      const available =
        pre.clientWidth -
        (parseFloat(style.paddingLeft) || 0) -
        (parseFloat(style.paddingRight) || 0);
      if (available <= 0) {
        setOverflows(false);
        return;
      }
      const codeStyle = getComputedStyle(node);
      const typography = `${codeStyle.font}|${codeStyle.letterSpacing}|${codeStyle.tabSize}|${codeStyle.fontVariationSettings}`;
      const current = source.current;
      if (
        !force &&
        cached?.markup === current.markup &&
        cached.theme === current.syntaxTheme &&
        cached.typography === typography &&
        (cached.complete || cached.width > available + 1)
      ) {
        setOverflows(cached.width > available + 1);
        return;
      }
      const isWrapped = node.closest('[data-slot="code"]')?.classList.contains("is-wrapped");
      let width = isWrapped ? intrinsicWidth(node, codeStyle.height) : node.scrollWidth;
      let complete = !current.folded && Boolean(isWrapped);
      if (current.folded && width <= available + 1) {
        // Usually the expanded width is cached. Initially folded, fitting bodies need one
        // temporary probe so long hidden imports remain reachable without replacing source nodes.
        const probe = node.cloneNode(false) as HTMLElement;
        probe.innerHTML = current.markup;
        probe.setAttribute("data-code-probe", "");
        probe.setAttribute("aria-hidden", "true");
        pre.append(probe);
        width = intrinsicWidth(probe);
        probe.remove();
        complete = true;
      }
      // A fitting unwrapped node includes min-width:100%; that is not its intrinsic width.
      cached =
        complete || width > available + 1
          ? {
              markup: current.markup,
              theme: current.syntaxTheme,
              typography,
              width,
              complete: complete || !current.folded,
            }
          : undefined;
      // DOM widths round to whole pixels; ignore subpixel clipping rather than flashing controls.
      setOverflows(width > available + 1);
    };
    measure.current = update;
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => update());
    observer?.observe(pre);
    observer?.observe(node);
    const fonts = node.ownerDocument.fonts;
    const fontsLoaded = () => update(true);
    fonts?.addEventListener("loadingdone", fontsLoaded);
    if (!observer) window.addEventListener("resize", fontsLoaded);
    return () => {
      active = false;
      measure.current = null;
      observer?.disconnect();
      fonts?.removeEventListener("loadingdone", fontsLoaded);
      if (!observer) window.removeEventListener("resize", fontsLoaded);
    };
  }, [element, enabled]);

  useLayoutEffect(() => {
    measure.current?.();
  }, [markup, wrapped, folded, syntaxTheme, enabled]);

  return enabled && overflows;
}
