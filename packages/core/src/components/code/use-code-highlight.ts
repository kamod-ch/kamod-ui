import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import type { CodeLanguage } from "./code-language";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

/** Plain escaped source is complete during SSR and before the optional grammar chunk arrives. */
export function useCodeHighlight(
  code: string,
  language: CodeLanguage,
  enabled: boolean,
  highlightSource = true,
) {
  const element = useRef<HTMLElement>(null);
  const [highlight, setHighlight] = useState<{
    code: string;
    language: CodeLanguage;
    html: string;
  } | null>(null);
  const highlightedHtml =
    highlight?.code === code && highlight.language === language ? highlight.html : undefined;
  const html = useMemo(
    () => (enabled ? ((highlightSource ? highlightedHtml : undefined) ?? escapeHtml(code)) : ""),
    [code, enabled, highlightSource, highlightedHtml],
  );
  useLayoutEffect(() => {
    // Release the previous file's source and token markup even if the next view stays plain/offscreen.
    setHighlight((current) =>
      highlightSource && enabled && current?.code === code && current.language === language
        ? current
        : null,
    );
    const node = element.current;
    if (!node || !highlightSource || !enabled || language === "text") return;
    let cancelled = false;
    let started = false;
    const load = () => {
      if (started || cancelled) return;
      started = true;
      observer?.disconnect();
      void import("./highlight-code")
        .then(({ highlightCode }) => {
          if (!cancelled) setHighlight({ code, language, html: highlightCode(code, language) });
        })
        .catch(() => {
          // Loading/coloring is optional: the original source remains selectable and copyable.
        });
    };
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) load();
            },
            { rootMargin: "200px" },
          );
    if (observer) observer.observe(node);
    else load();
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [code, language, enabled, highlightSource]);
  return { element, html };
}
