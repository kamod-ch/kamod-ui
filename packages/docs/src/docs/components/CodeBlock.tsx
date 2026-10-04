import { useTimeout } from "@kamod-ch/hooks";
import { CopyIcon } from "@kamod-ch/icons/tabler/outline";
import type { ComponentChildren } from "preact";
import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import { CodeFilePath } from "./CodeFilePath";

export type CodeLanguage = "tsx" | "bash" | "markdown" | "css" | "text";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const CodeBlock = ({
  code,
  language,
  className,
  toolbarContent,
  filePath,
  renderedContent,
  renderToolbar,
}: {
  code: string;
  language: CodeLanguage;
  className?: string;
  /** Content beside Copy above the code; excluded from highlighting and copied text. */
  toolbarContent?: ComponentChildren;
  /** Source or installation path shown separately from the copied code. */
  filePath?: string;
  /** Optional document view; Copy still uses the original, unmodified code string. */
  renderedContent?: ComponentChildren;
  /** Custom toolbar layout that reuses this block's copy action and feedback. */
  renderToolbar?: (copyButton: ComponentChildren) => ComponentChildren;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const rendersCode = renderedContent === undefined;
  const codeElement = useRef<HTMLElement>(null);
  const [highlight, setHighlight] = useState<{
    code: string;
    language: CodeLanguage;
    html: string;
  } | null>(null);
  const highlightedCode = useMemo(
    () =>
      highlight?.code === code && highlight.language === language
        ? highlight.html
        : escapeHtml(code),
    [code, language, highlight],
  );
  useLayoutEffect(() => {
    const node = codeElement.current;
    if (!node || !rendersCode || language === "text") return;
    let cancelled = false;
    const load = () => {
      observer?.disconnect();
      void import("./highlight-code")
        .then(({ highlightCode }) => {
          if (!cancelled) setHighlight({ code, language, html: highlightCode(code, language) });
        })
        .catch(() => {
          // The complete plain-text example stays readable if the optional highlighter fails.
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
  }, [code, language, rendersCode]);

  useTimeout(() => setIsCopied(false), isCopied ? 1500 : undefined);

  const copyCode = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  const copyButton = (
    <button
      type="button"
      class={`docs-icon-button docs-copy-code-button ${isCopied ? "is-copied" : ""}`}
      aria-label={isCopied ? "Code copied" : "Copy code"}
      title={isCopied ? "Code copied" : "Copy code"}
      onClick={() => void copyCode()}
    >
      <CopyIcon
        size={16}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      />
      <span>{isCopied ? "Copied" : "Copy"}</span>
    </button>
  );

  return (
    <div class="docs-code-wrap">
      {renderToolbar ? (
        renderToolbar(copyButton)
      ) : filePath || toolbarContent ? (
        <div class="docs-code-toolbar">
          {filePath && <CodeFilePath path={filePath} />}
          {toolbarContent}
          {copyButton}
        </div>
      ) : (
        copyButton
      )}
      {/* Keep horizontally overflowing examples keyboard-scrollable in every browser. */}
      {rendersCode ? (
        <pre class={`docs-code ${className ?? ""}`.trim()} data-language={language} tabIndex={0}>
          <code
            ref={codeElement}
            class={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      ) : (
        renderedContent
      )}
    </div>
  );
};
