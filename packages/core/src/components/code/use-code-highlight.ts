import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import type { CodeLanguage } from "./code-language";
import { escapeCodeHtml } from "./code-markup";

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
    html?: string;
  } | null>(null);
  const highlightedHtml =
    highlight?.code === code && highlight.language === language ? highlight.html : undefined;
  const html = useMemo(
    () =>
      enabled ? ((highlightSource ? highlightedHtml : undefined) ?? escapeCodeHtml(code)) : "",
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
      setHighlight({ code, language });
      observer?.disconnect();
      void import("./highlight-code")
        .then(({ highlightCode }) => {
          if (!cancelled) setHighlight({ code, language, html: highlightCode(code, language) });
        })
        .catch(() => {
          // Coloring is optional; release any placeholder and reveal the complete escaped source.
          if (!cancelled) setHighlight({ code, language, html: escapeCodeHtml(code) });
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
  return {
    element,
    html,
    loading:
      enabled &&
      highlightSource &&
      highlightedHtml === undefined &&
      highlight?.code === code &&
      highlight.language === language,
    pending: enabled && highlightSource && language !== "text" && highlightedHtml === undefined,
  };
}
