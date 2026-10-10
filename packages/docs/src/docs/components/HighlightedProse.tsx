import { useLayoutEffect, useRef } from "preact/hooks";
import { resolveCodeLanguage } from "./code-language";

/** Render already-sanitized Markdown HTML; load grammars only for nearby, nested code blocks. */
export function HighlightedProse({ html, className }: { html: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const blocks = root.current?.querySelectorAll<HTMLElement>("pre > code");
    if (!blocks?.length) return;
    let cancelled = false;
    const pending = new WeakSet<HTMLElement>();
    const highlight = (code: HTMLElement) => {
      if (pending.has(code)) return;
      pending.add(code);
      observer?.unobserve(code);
      const pre = code.parentElement!;
      const source = code.textContent ?? "";
      const declared = pre.dataset.language ?? code.className.match(/\blanguage-([^\s]+)/)?.[1];
      const language = resolveCodeLanguage(source, declared);
      if (language === "text") return;
      void import("./highlight-code")
        .then(({ highlightCode }) => {
          if (cancelled) return;
          pre.classList.add("docs-code");
          pre.dataset.language = language;
          pre.tabIndex = 0;
          const oldLanguages = code.className.match(/\blanguage-[^\s]+/g) ?? [];
          code.classList.remove(...oldLanguages);
          code.classList.add(`language-${language}`);
          code.innerHTML = highlightCode(source, language);
        })
        .catch(() => {
          // Source remains complete and readable when an optional grammar chunk cannot load.
        });
    };
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              for (const entry of entries)
                if (entry.isIntersecting) highlight(entry.target as HTMLElement);
            },
            { rootMargin: "200px" },
          );
    for (const code of blocks) {
      if (code.querySelector(".token")) continue;
      if (observer) observer.observe(code);
      else highlight(code);
    }
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [html]);

  return <div ref={root} class={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
