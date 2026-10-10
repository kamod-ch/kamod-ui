import { Button } from "@kamod-ch/ui";
import { useMemo } from "preact/hooks";
import { ShowcaseLoading } from "../docs/components/ShowcaseLoading";
import type { ShowcaseBlock } from "./BlockShowcase";
import { BlockShowcaseIntro } from "./BlockShowcaseIntro";
import type { BlockSourceLoader } from "./BlockSourceFiles";
import { type BlockPromptMode, createBlockPrompt } from "./block-prompts";
import { type PromptDisplay, PromptDocument } from "./PromptDocument";
import { PromptOptions } from "./PromptOptions";
import { PromptSourceSummary } from "./PromptSourceSummary";
import type { PreviewAppearance } from "./preview-appearance";
import { usePromptSources } from "./usePromptSources";

/** Both briefs include the same real source, with no provider-specific commands or integrations. */
export function BlockShowcasePrompt({
  appearance,
  block,
  loadSource,
  setupHref,
  mode,
  onModeChange,
  display,
  onDisplayChange,
}: {
  appearance: PreviewAppearance;
  block: ShowcaseBlock;
  loadSource: BlockSourceLoader;
  setupHref?: string;
  mode: BlockPromptMode;
  display: PromptDisplay;
  onDisplayChange: (display: PromptDisplay) => void;
  onModeChange: (mode: BlockPromptMode) => void;
}) {
  const { result, retry } = usePromptSources(block, loadSource);
  const prompt = useMemo(
    () => (result?.sources ? createBlockPrompt(block, mode, result.sources) : ""),
    [block, mode, result],
  );
  const setupId = block.category === "application-shell" ? "application-shell" : block.id;
  const isSetup = mode === "setup";
  return (
    <>
      <BlockShowcaseIntro block={block} view="prompt" setupHref={setupHref} />
      <section class="blocks-prompt-workspace" aria-label="Block prompt">
        <div class="blocks-prompt-options">
          <PromptOptions
            mode={mode}
            onModeChange={onModeChange}
            display={display}
            onDisplayChange={onDisplayChange}
          />
        </div>
        <div class="blocks-prompt-hint">
          <p>
            {isSetup ? (
              <>
                Paste the complete prompt into a coding assistant{" "}
                <strong>With Access to Your Project</strong>. It asks the assistant to inspect{" "}
                <code>package.json</code>, routes and styles, add the source, and install only
                missing dependencies. Follow the{" "}
                <a href={setupHref ?? `#${setupId}-installation`}>Setup Guide</a> for file paths and
                theme configuration. <strong>Keep Your Project’s Conventions</strong>, check the
                first render and replace demo data with your own navigation and callbacks.
              </>
            ) : (
              <>
                Replace the <code>[bracketed fields]</code> with your goals, routes and data before
                sending. Describe <strong>What Should Change and What Should Stay</strong>,
                including any layout or interaction requirements. The assistant is asked to preserve
                your existing changes and use the included source as a reference. Review the result
                with real content and keyboard navigation.
              </>
            )}
          </p>
        </div>
        {result?.error ? (
          <div class="blocks-prompt-state" role="alert">
            <p>The source could not be loaded. Retry to build a complete prompt.</p>
            <Button size="sm" variant="outline" onClick={retry}>
              Try Again
            </Button>
          </div>
        ) : result?.sources ? (
          <PromptDocument
            appearance={appearance}
            prompt={prompt}
            mode={mode}
            display={display}
            sourceLabel={<PromptSourceSummary blockId={block.id} count={block.files.length} />}
          />
        ) : (
          <ShowcaseLoading
            appearance={appearance}
            view="prompt"
            detail={`${block.files.length} source ${block.files.length === 1 ? "file" : "files"} · ${block.title}`}
          />
        )}
        <div class="blocks-prompt-footer">
          <span>
            <strong>Your Project, Your Conventions.</strong> The assistant should reuse your tooling
            and keep unrelated files intact.
          </span>
          <span>Review the result before shipping.</span>
        </div>
      </section>
    </>
  );
}
