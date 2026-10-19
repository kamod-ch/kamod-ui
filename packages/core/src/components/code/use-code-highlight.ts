import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import type { CodeLanguage } from "./code-language";
import { escapeCodeHtml } from "./code-markup";
import type { CodeHighlighter } from "./code-types";

/** Plain escaped source is complete during SSR and before the optional grammar chunk arrives. */
export function useCodeHighlight(
  code: string,
  language: CodeLanguage,
  enabled: boolean,
  highlightSource = true,
  highlighter?: CodeHighlighter,
) {
  const element = useRef<HTMLElement>(null);
  const [highlight, setHighlight] = useState<{
    code: string;
    language: CodeLanguage;
    highlighter: CodeHighlighter;
    html?: string;
  } | null>(null);
  const highlightedHtml =
    highlight?.code === code &&
    highlight.language === language &&
    highlight.highlighter === highlighter
      ? highlight.html
      : undefined;
  const html = useMemo(
    () =>
      enabled ? ((highlightSource ? highlightedHtml : undefined) ?? escapeCodeHtml(code)) : "",
    [code, enabled, highlightSource, highlightedHtml],
  );
  useLayoutEffect(() => {
    // Release the previous file's source and token markup even if the next view stays plain/offscreen.
    setHighlight((current) =>
      highlightSource &&
      enabled &&
      current?.code === code &&
      current.language === language &&
      current.highlighter === highlighter
        ? current
        : null,
    );
    const node = element.current;
    if (!node || !highlighter || !highlightSource || !enabled || language === "text") return;
    let cancelled = false;
    let started = false;
    const load = () => {
      if (started || cancelled) return;
      started = true;
      setHighlight({ code, language, highlighter });
      observer?.disconnect();
      void Promise.resolve()
        .then(() => {
          if (cancelled) return undefined;
          return highlighter(code, language);
        })
        .then((html) => {
          if (!cancelled && html !== undefined) setHighlight({ code, language, highlighter, html });
        })
        .catch(() => {
          // Coloring is optional; release any placeholder and reveal the complete escaped source.
          if (!cancelled) setHighlight({ code, language, highlighter, html: escapeCodeHtml(code) });
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
  }, [code, language, enabled, highlightSource, highlighter]);
  return {
    element,
    html,
    loading:
      enabled &&
      Boolean(highlighter) &&
      highlightSource &&
      highlightedHtml === undefined &&
      highlight?.code === code &&
      highlight.language === language &&
      highlight.highlighter === highlighter,
    pending:
      enabled &&
      Boolean(highlighter) &&
      highlightSource &&
      language !== "text" &&
      highlightedHtml === undefined,
  };
}
