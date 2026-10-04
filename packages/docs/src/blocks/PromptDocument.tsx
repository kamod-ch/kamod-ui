import { SquareTerminalIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { lazy, Suspense } from "preact/compat";
import { CodeBlock } from "../docs/components/CodeBlock";
import type { BlockPromptMode } from "./block-prompts";

export type PromptDisplay = "text" | "code" | "markdown";
const Markdown = lazy(() => import("./PromptMarkdown"));

/** Display changes never change the complete source-backed text sent to the clipboard. */
export function PromptDocument({
  prompt,
  mode,
  display,
  sourceLabel = "Source included",
}: {
  prompt: string;
  mode: BlockPromptMode;
  display: PromptDisplay;
  /** Optional source metadata or source-browser link beside the prompt title. */
  sourceLabel?: ComponentChildren;
}) {
  return (
    <CodeBlock
      key={`${mode}-${display}`}
      code={prompt}
      language={display === "code" ? "markdown" : "text"}
      toolbarContent={
        <div class="blocks-prompt-document-heading">
          <h4 class="showcase-metadata-label">
            <SquareTerminalIcon size={16} strokeWidth={1.75} aria-hidden="true" />
            {mode === "setup" ? "Setup prompt" : "Adaptation prompt"}
          </h4>
          {sourceLabel && (
            <span class="blocks-prompt-format">
              <span aria-hidden="true">·</span>
              {sourceLabel}
            </span>
          )}
        </div>
      }
      className="blocks-showcase-prompt-code"
      renderedContent={
        display === "markdown" ? (
          <Suspense
            fallback={
              <p class="blocks-prompt-state" role="status">
                Formatting prompt…
              </p>
            }
          >
            <Markdown prompt={prompt} />
          </Suspense>
        ) : undefined
      }
    />
  );
}
