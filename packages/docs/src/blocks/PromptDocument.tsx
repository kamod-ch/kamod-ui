import { ZapIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { lazy, Suspense } from "preact/compat";
import { CodeBlock } from "../docs/components/CodeBlock";
import { ShowcaseLoading } from "../docs/components/ShowcaseLoading";
import type { BlockPromptMode } from "./block-prompts";
import type { PreviewAppearance } from "./preview-appearance";

export type PromptDisplay = "text" | "code" | "markdown";
const Markdown = lazy(() => import("./PromptMarkdown"));

/** Display changes never change the complete source-backed text sent to the clipboard. */
export function PromptDocument({
  appearance,
  prompt,
  mode,
  display,
  sourceLabel = "Source Included",
  showWrapControl = true,
}: {
  appearance: PreviewAppearance;
  prompt: string;
  mode: BlockPromptMode;
  display: PromptDisplay;
  /** Optional source metadata or source-browser link beside the prompt title. */
  sourceLabel?: ComponentChildren;
  /** Compact embedded prompts can keep wrapping enabled without exposing a switch. */
  showWrapControl?: boolean;
}) {
  return (
    <CodeBlock
      key={`${mode}-${display}`}
      code={prompt}
      language={display === "code" ? "markdown" : "text"}
      inferLanguage={display !== "text"}
      defaultWrapped
      showWrapControl={showWrapControl}
      toolbarContent={
        <div class="blocks-prompt-document-heading">
          <h4 class="showcase-metadata-label">
            <ZapIcon size={16} strokeWidth={2.25} aria-hidden="true" />
            {mode === "setup" ? "Setup Prompt" : "Adaptation Prompt"}
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
              <ShowcaseLoading
                appearance={appearance}
                view="prompt"
                detail="Formatting the reading view"
              />
            }
          >
            <Markdown prompt={prompt} />
          </Suspense>
        ) : undefined
      }
    />
  );
}
