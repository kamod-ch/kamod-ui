import type { ComponentChild, ComponentChildren, JSX } from "preact";
import { isValidElement, toChildArray } from "preact";
import { useLayoutEffect, useRef, useMemo } from "preact/hooks";
import { cn } from "../../lib/utils";
import { ScrollAreaContext } from "./scroll-area-context";
import { ScrollAreaCorner } from "./ScrollAreaCorner";
import { ScrollBar } from "./ScrollBar";

const hideNativeScrollbar =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

function partitionScrollAreaChildren(children: ComponentChildren): {
  content: ComponentChild[];
  chrome: ComponentChild[];
} {
  const content: ComponentChild[] = [];
  const chrome: ComponentChild[] = [];
  for (const node of toChildArray(children)) {
    if (isValidElement(node) && (node.type === ScrollBar || node.type === ScrollAreaCorner)) {
      chrome.push(node);
    } else {
      content.push(node);
    }
  }
  return { content, chrome };
}

function syncViewportOverflowState(el: HTMLDivElement) {
  const { scrollLeft, scrollTop, clientWidth, clientHeight, scrollWidth, scrollHeight } = el;
  const maxX = scrollWidth - clientWidth;
  const maxY = scrollHeight - clientHeight;
  const eps = 0.5;
  const hasX = maxX > eps;
  const hasY = maxY > eps;

  const setEdge = (name: string, on: boolean) => {
    if (on) el.setAttribute(name, "");
    else el.removeAttribute(name);
  };

  if (hasX) {
    setEdge("data-has-overflow-x", true);
    setEdge("data-overflow-x-start", scrollLeft > eps);
    setEdge("data-overflow-x-end", scrollLeft < maxX - eps);
  } else {
    el.removeAttribute("data-has-overflow-x");
    el.removeAttribute("data-overflow-x-start");
    el.removeAttribute("data-overflow-x-end");
  }

  if (hasY) {
    setEdge("data-has-overflow-y", true);
    setEdge("data-overflow-y-start", scrollTop > eps);
    setEdge("data-overflow-y-end", scrollTop < maxY - eps);
  } else {
    el.removeAttribute("data-has-overflow-y");
    el.removeAttribute("data-overflow-y-start");
    el.removeAttribute("data-overflow-y-end");
  }

  el.style.setProperty("--scroll-area-overflow-x-start", `${scrollLeft}px`);
  el.style.setProperty("--scroll-area-overflow-x-end", `${Math.max(0, maxX - scrollLeft)}px`);
  el.style.setProperty("--scroll-area-overflow-y-start", `${scrollTop}px`);
  el.style.setProperty("--scroll-area-overflow-y-end", `${Math.max(0, maxY - scrollTop)}px`);
}

export type ScrollAreaProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ScrollArea = ({ class: className, children, ...rest }: ScrollAreaProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { content, chrome } = partitionScrollAreaChildren(children);

  const contextValue = useMemo(() => ({ viewportRef }), []);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      syncViewportOverflowState(el);
    };

    const onScroll = () => {
      syncViewportOverflowState(el);
      el.setAttribute("data-scrolling", "");
      if (scrollEndTimerRef.current !== undefined) {
        clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = setTimeout(() => {
        el.removeAttribute("data-scrolling");
        scrollEndTimerRef.current = undefined;
      }, 150);
    };

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (scrollEndTimerRef.current !== undefined) {
        clearTimeout(scrollEndTimerRef.current);
      }
      el.removeAttribute("data-scrolling");
    };
  }, []);

  return (
    <ScrollAreaContext.Provider value={contextValue}>
      <div
        data-slot="scroll-area"
        class={cn("relative min-h-0 min-w-0 overflow-hidden", className)}
        {...rest}
      >
        <div
          ref={viewportRef}
          data-slot="scroll-area-viewport"
          class={cn("size-full overflow-auto", hideNativeScrollbar)}
        >
          <div data-slot="scroll-area-content" class="min-w-0">
            {content}
          </div>
        </div>
        {chrome}
      </div>
    </ScrollAreaContext.Provider>
  );
};
