import { escapeCodeHtml, normalizeCodeLanguage } from "@kamod-ch/ui/code";
import { useMemo } from "preact/hooks";
import { highlightCode } from "../../docs/components/highlight-code";

/** The existing grammar escapes source; no source HTML, execution or token-level subscriptions. */
export default function HighlightedDeclaration({
  text,
  command,
  language,
}: {
  text: string;
  command?: boolean;
  language?: string;
}) {
  const grammar = normalizeCodeLanguage(language ?? (command ? "bash" : "typescript"));
  const html = useMemo(
    () => (grammar === "text" ? escapeCodeHtml(text) : highlightCode(text, grammar)),
    [text, grammar],
  );
  return (
    <code class="code-reference-help-syntax" dir="ltr" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
