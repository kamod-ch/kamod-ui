import { ZapIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { CodeBlock } from "../docs/components/CodeBlock";
import { lazyShowcase } from "../docs/components/lazy-showcase";
import { ShowcaseLoading } from "../docs/components/ShowcaseLoading";
import type { BlockPromptMode } from "./block-prompts";
import { type PreviewAppearance, previewCodeStyle } from "./preview-appearance";

export type PromptDisplay = "text" | "code" | "markdown";
const Markdown = lazyShowcase(() => import("./PromptMarkdown"));

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
  const loading = (
    <ShowcaseLoading
      appearance={appearance}
      view={display === "markdown" ? "markdown" : "prompt"}
    />
  );
  return (
    <CodeBlock
      class="blocks-prompt-document"
      style={previewCodeStyle(appearance)}
      key={`${mode}-${display}`}
      code={prompt}
      language={display === "code" ? "markdown" : "text"}
      inferLanguage={display !== "text"}
      defaultWrapped
      showWrapControl={showWrapControl}
      loadingContent={display === "code" ? loading : undefined}
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
          <Markdown prompt={prompt} pendingContent={loading} fallback={loading} />
        ) : undefined
      }
    />
  );
}
