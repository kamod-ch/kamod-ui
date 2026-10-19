import { Tooltip, TooltipContent } from "@kamod-ch/ui";
import { createPortal } from "preact/compat";
import { useId, useLayoutEffect, useState } from "preact/hooks";
import { connectInlineCode } from "../../references/connect-inline-references";
import { ReferenceTooltip } from "../../references/ReferenceTooltip";
import { connectTooltips, type TooltipHint } from "./connect-tooltips";
import { NavigationTooltipContent } from "./navigation-help";
import { ReferenceHelp } from "./ReferenceHelp";

/**
 * One lazy tooltip per page, including preview frames, without wrapping the actual controls.
 * Use data-tooltip="Short hint" for custom copy or data-tooltip="off" to opt out a subtree.
 * Authored core tooltips take precedence; accessible names label icon-only controls.
 * Visible control labels and ordinary links do not receive redundant hints.
 * Recognized inline code uses a non-modal explanation so its optional guide links remain reachable.
 */
export function ApplicationTooltips({ page }: { page: unknown }) {
  const [hint, setHint] = useState<TooltipHint | null>(null);
  // This observer already handles route insertions/removals. Keep persistent
  // navigation terms intact instead of restoring and rescanning them every route.
  useLayoutEffect(() => connectInlineCode(document), []);
  useLayoutEffect(() => {
    const stopHints = connectTooltips(document, setHint);
    return stopHints;
  }, [page]);
  return hint ? <ActiveTooltip hint={hint} /> : null;
}

function ActiveTooltip({
  hint: { target, text, explanation, navigation, source },
}: {
  hint: TooltipHint;
}) {
  const id = useId();
  // The visible viewport can be smaller than innerHeight (zoom or the phone keyboard).
  const [viewport, setViewport] = useState(() => ({
    top: window.visualViewport?.offsetTop ?? 0,
    height: window.visualViewport?.height ?? window.innerHeight,
  }));
  useLayoutEffect(() => {
    const update = () =>
      setViewport({
        top: window.visualViewport?.offsetTop ?? 0,
        height: window.visualViewport?.height ?? window.innerHeight,
      });
    const visual = window.visualViewport;
    visual?.addEventListener("resize", update);
    visual?.addEventListener("scroll", update);
    return () => {
      visual?.removeEventListener("resize", update);
      visual?.removeEventListener("scroll", update);
    };
  }, []);
  const rect = target.getBoundingClientRect();
  const viewportInset = 16;
  const sideOffset = 8;
  const spaceAbove = Math.max(0, rect.top - viewport.top - viewportInset - sideOffset);
  const spaceBelow = Math.max(
    0,
    viewport.top + viewport.height - rect.bottom - viewportInset - sideOffset,
  );
  const side = spaceAbove > spaceBelow ? "top" : "bottom";
  const availableHeight = Math.min(
    Math.max(spaceAbove, spaceBelow),
    Math.max(0, viewport.height - viewportInset * 2),
  );
  const interactive = !!(source || explanation || navigation?.group);
  const detailed = !!(source || explanation || navigation);
  const maxWidth = source ? 480 : 400;
  useLayoutEffect(() => {
    const ids = (target.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);
    target.setAttribute("aria-describedby", [...ids, id].join(" "));
    if ((explanation || source) && target.matches('code[role="button"]'))
      target.setAttribute("aria-expanded", "true");
    return () => {
      // Remove only our ID: validation messages or other descriptions may change while open.
      const remaining = (target.getAttribute("aria-describedby") ?? "")
        .split(/\s+/)
        .filter((value) => value && value !== id);
      if (remaining.length) target.setAttribute("aria-describedby", remaining.join(" "));
      else target.removeAttribute("aria-describedby");
      if ((explanation || source) && target.matches('code[role="button"]'))
        target.setAttribute("aria-expanded", "false");
    };
  }, [target, id, explanation, source]);
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
        key={`${rect.top}:${rect.left}:${rect.width}:${rect.height}:${text}`}
        id={id}
        role={interactive ? "dialog" : "tooltip"}
        aria-label={interactive ? `${text} ${source ? "reference" : "explained"}` : undefined}
        class={
          source
            ? "docs-code-explanation code-reference-help"
            : navigation
              ? "docs-code-explanation navigation-hint"
              : explanation
                ? "docs-code-explanation"
                : undefined
        }
        side={side}
        align={detailed ? "start" : "center"}
        alignOffset={
          detailed
            ? Math.max(
                16,
                Math.min(
                  rect.left,
                  window.innerWidth - Math.min(maxWidth, window.innerWidth - 32) - 16,
                ),
              ) - rect.left
            : 0
        }
        sideOffset={sideOffset}
        collisionPadding={viewportInset}
        style={{
          pointerEvents: "auto",
          width: "max-content",
          whiteSpace: "normal",
          overflowWrap: "anywhere",
          ...(detailed && { maxWidth: `min(${maxWidth}px, calc(100vw - 32px))` }),
          ...(source && { "--code-help-width": `${maxWidth}px` }),
          boxSizing: "border-box",
          maxHeight: `min(${availableHeight}px, calc(100dvh - ${viewportInset * 2}px))`,
          overflowY: "auto",
          ...(detailed && {
            // Reaching a long card's edge must not scroll the page and dismiss its reference.
            overscrollBehavior: "contain",
          }),
        }}
      >
        {source ? (
          <ReferenceTooltip request={source} />
        ) : navigation ? (
          <NavigationTooltipContent hint={navigation} />
        ) : explanation ? (
          <ReferenceHelp term={text} explanation={explanation} />
        ) : (
          text
        )}
      </TooltipContent>
    </Tooltip>,
    document.body,
  );
}
