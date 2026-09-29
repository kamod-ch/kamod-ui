import { useTimeout } from "@kamod-ch/hooks";
import { CopyIcon } from "@kamod-ch/icons/tabler/outline";
import type { ComponentChildren } from "preact";
import { useMemo, useState } from "preact/hooks";
import Prism from "prismjs";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-markdown.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-tsx.js";
import { CodeFilePath } from "./CodeFilePath";

type CodeLanguage = "tsx" | "bash" | "markdown" | "css" | "text";

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
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const rendersCode = renderedContent === undefined;
  const highlightedCode = useMemo(() => {
    if (!rendersCode) return "";
    const grammar = Prism.languages[language];
    if (!grammar) return escapeHtml(code);
    return Prism.highlight(code, grammar, language);
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
      class={`docs-copy-code-button ${isCopied ? "is-copied" : ""}`}
      aria-label={isCopied ? "Code copied" : "Copy code"}
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
      {filePath || toolbarContent ? (
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
