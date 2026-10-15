import { ZapIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { CodeBlock } from "../docs/components/CodeBlock";
import { lazyShowcase } from "../docs/components/lazy-showcase";
import { MarkdownDownloadButton } from "../docs/components/markdown-download/MarkdownDownloadButton";
import { ShowcaseLoading } from "../docs/components/ShowcaseLoading";
import type { BlockPromptMode } from "./block-prompts";
import type { PreviewAppearance } from "./preview-appearance";

export type PromptDisplay = "text" | "code" | "markdown";
const Markdown = lazyShowcase(() => import("./PromptMarkdown"));

/** Copy and download always use the complete source-backed Markdown, regardless of display. */
export function PromptDocument({
  appearance,
  prompt,
  mode,
  display,
  sourceLabel = "Source Included",
  showWrapControl = true,
  downloadFileName = `${mode}-prompt.md`,
}: {
  appearance: PreviewAppearance;
  prompt: string;
  mode: BlockPromptMode;
  display: PromptDisplay;
  /** Optional source metadata or source-browser link beside the prompt title. */
  sourceLabel?: ComponentChildren;
  /** Compact embedded prompts can keep wrapping enabled without exposing a switch. */
  showWrapControl?: boolean;
  /** A descriptive Markdown filename, independent of the selected reading format. */
  downloadFileName?: string;
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
      key={`${mode}-${display}`}
      code={prompt}
      language={display === "code" ? "markdown" : "text"}
      inferLanguage={display !== "text"}
      defaultWrapped
      showWrapControl={showWrapControl}
      loadingContent={display === "code" ? loading : undefined}
      renderCopyAction={({ defaultControl }) => (
        <div class="blocks-prompt-actions">
          <MarkdownDownloadButton markdown={prompt} fileName={downloadFileName} />
          {defaultControl}
        </div>
      )}
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
