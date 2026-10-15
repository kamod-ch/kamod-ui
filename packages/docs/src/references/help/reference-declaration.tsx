import { highlightCode } from "@kamod-ch/ui/code/highlight";
import { useMemo } from "preact/hooks";

/** The existing grammar escapes source; no source HTML, execution or token-level subscriptions. */
export default function HighlightedDeclaration({
  text,
  command,
}: {
  text: string;
  command: boolean;
}) {
  const html = useMemo(() => highlightCode(text, command ? "bash" : "typescript"), [text, command]);
  return (
    <code class="code-reference-help-syntax" dir="ltr" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
