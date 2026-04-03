import type { JSX } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import { useScrollAreaContext } from "./scroll-area-context";

export type ScrollAreaCornerProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ScrollAreaCorner = ({ class: className, ...rest }: ScrollAreaCornerProps) => {
  const { viewportRef } = useScrollAreaContext();
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const check = () => {
      const eps = 0.5;
      const hasX = el.scrollWidth > el.clientWidth + eps;
      const hasY = el.scrollHeight > el.clientHeight + eps;
      setVisible(hasX && hasY);
    };

    check();
    el.addEventListener("scroll", check, { passive: true });
    const resizeObserver = new ResizeObserver(check);
    resizeObserver.observe(el);
    const mutationObserver = new MutationObserver(check);
    mutationObserver.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      el.removeEventListener("scroll", check);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [viewportRef]);

  if (!visible) return null;

  return (
    <div
      data-slot="scroll-area-corner"
      aria-hidden="true"
      class={cn(
        "pointer-events-none absolute bottom-1 right-1 z-[1] size-2.5 rounded-sm bg-border/45",
        className
      )}
      {...rest}
    />
  );
};
