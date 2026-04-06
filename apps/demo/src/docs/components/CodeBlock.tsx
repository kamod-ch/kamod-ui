import { Copy } from "lucide-preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";

type CodeLanguage = "tsx" | "bash" | "markdown" | "css";

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
}: {
  code: string;
  language: CodeLanguage;
  className?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const highlightedCode = useMemo(() => {
    const grammar = Prism.languages[language];
    if (!grammar) return escapeHtml(code);
    return Prism.highlight(code, grammar, language);
  }, [code, language]);

  useEffect(() => {
    if (!isCopied) return;
    const timeoutId = window.setTimeout(() => setIsCopied(false), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [isCopied]);

  const copyCode = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <div class="docs-code-wrap">
      <button
        type="button"
        class={`docs-copy-code-button ${isCopied ? "is-copied" : ""}`}
        aria-label={isCopied ? "Code copied" : "Copy code"}
        onClick={() => void copyCode()}
      >
        <Copy size={16} />
        <span>{isCopied ? "Copied" : "Copy"}</span>
      </button>
      <pre class={`docs-code ${className ?? ""}`.trim()} data-language={language}>
        <code
          class={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
};
