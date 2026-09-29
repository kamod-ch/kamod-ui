import { useMemo } from "preact/hooks";
import { renderPromptMarkdown } from "./prompt-markdown";

/** Loaded only for the rendered view, avoiding parser work in Plain text and Markdown code. */
export default function PromptMarkdown({ prompt }: { prompt: string }) {
  const html = useMemo(() => renderPromptMarkdown(prompt), [prompt]);
  return (
    <div
      class="blocks-prompt-rendered"
      role="region"
      aria-label="Rendered prompt"
      tabIndex={0}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
