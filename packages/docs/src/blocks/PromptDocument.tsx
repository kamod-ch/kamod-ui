import { FileTextIcon } from "@kamod-ch/icons/lucide";
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
}: {
  prompt: string;
  mode: BlockPromptMode;
  display: PromptDisplay;
}) {
  return (
    <CodeBlock
      key={`${mode}-${display}`}
      code={prompt}
      language={display === "code" ? "markdown" : "text"}
      toolbarContent={
        <>
          <FileTextIcon size={16} strokeWidth={2} aria-hidden="true" />
          <h4>{mode === "setup" ? "Setup prompt" : "Adaptation prompt"}</h4>
          <span class="blocks-prompt-format">Source included</span>
        </>
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
