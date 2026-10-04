import { Tooltip, TooltipContent } from "@kamod-ch/ui";
import { createPortal } from "preact/compat";
import { useId, useLayoutEffect, useState } from "preact/hooks";
import { connectTooltips, type TooltipHint } from "./connect-tooltips";

/**
 * One lazy tooltip per page, including preview frames, without wrapping the actual controls.
 * Use data-tooltip="Short hint" for custom copy or data-tooltip="off" to opt out a subtree.
 * Authored core tooltips take precedence; accessible names supply the default hints.
 */
export function ApplicationTooltips({ page }: { page: unknown }) {
  const [hint, setHint] = useState<TooltipHint | null>(null);
  useLayoutEffect(() => connectTooltips(document, setHint), [page]);
  return hint ? <ActiveTooltip hint={hint} /> : null;
}

function ActiveTooltip({ hint: { target, text } }: { hint: TooltipHint }) {
  const id = useId();
  const rect = target.getBoundingClientRect();
  useLayoutEffect(() => {
    const ids = (target.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);
    target.setAttribute("aria-describedby", [...ids, id].join(" "));
    return () => {
      // Remove only our ID: validation messages or other descriptions may change while open.
      const remaining = (target.getAttribute("aria-describedby") ?? "")
        .split(/\s+/)
        .filter((value) => value && value !== id);
      if (remaining.length) target.setAttribute("aria-describedby", remaining.join(" "));
      else target.removeAttribute("aria-describedby");
    };
  }, [target, id]);
  return createPortal(
    <Tooltip
      open
      defaultOpen
      data-application-tooltip=""
      style={{
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        pointerEvents: "none",
        zIndex: 10000,
      }}
    >
      <TooltipContent
        id={id}
        side="bottom"
        sideOffset={8}
        style={{
          pointerEvents: "auto",
          width: "max-content",
          whiteSpace: "normal",
          overflowWrap: "anywhere",
        }}
      >
        {text}
      </TooltipContent>
    </Tooltip>,
    document.body,
  );
}
