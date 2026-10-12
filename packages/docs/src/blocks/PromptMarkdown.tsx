import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { renderPromptMarkdown } from "./prompt-markdown";

type PreparedPrompt = { prompt: string; html: string };
// One retained result makes format switches instant without keeping every source bundle in memory.
let lastPrepared: PreparedPrompt | undefined;

/** Paint pending feedback before parsing; only the rendered view performs Markdown work. */
export default function PromptMarkdown({
  prompt,
  pendingContent,
  label = "Rendered prompt",
}: {
  prompt: string;
  pendingContent: ComponentChildren;
  label?: string;
}) {
  const [prepared, setPrepared] = useState(() =>
    lastPrepared?.prompt === prompt ? lastPrepared : undefined,
  );
  useEffect(() => {
    const next =
      lastPrepared?.prompt === prompt
        ? lastPrepared
        : { prompt, html: renderPromptMarkdown(prompt) };
    lastPrepared = next;
    setPrepared(next);
  }, [prompt]);
  const current = prepared?.prompt === prompt ? prepared : undefined;
  if (!current) return <>{pendingContent}</>;
  return (
    <div
      class="blocks-prompt-rendered"
      role="region"
      aria-label={label}
      tabIndex={0}
      dangerouslySetInnerHTML={{ __html: current.html }}
    />
  );
}
