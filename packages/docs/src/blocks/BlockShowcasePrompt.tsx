import { SparklesIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { useMemo } from "preact/hooks";
import { BlockPromptLinks } from "./BlockPromptLinks";
import type { ShowcaseBlock } from "./BlockShowcase";
import type { BlockSourceLoader } from "./BlockSourceFiles";
import { getBlockDisplayName } from "./block-overview-details";
import { type BlockPromptMode, createBlockPrompt } from "./block-prompts";
import { type PromptDisplay, PromptDocument } from "./PromptDocument";
import { PromptOptions } from "./PromptOptions";
import { ShowcaseCodeLink } from "./ShowcaseCodeLink";
import { usePromptSources } from "./usePromptSources";

/** Both briefs include the same real source, with no provider-specific commands or integrations. */
export function BlockShowcasePrompt({
  block,
  loadSource,
  mode,
  onModeChange,
  display,
  onDisplayChange,
}: {
  block: ShowcaseBlock;
  loadSource: BlockSourceLoader;
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
      <div class="blocks-prompt-intro">
        <div class="blocks-prompt-title-row">
          <h3>
            <SparklesIcon size={21} strokeWidth={2} aria-hidden="true" />
            From preview to your project
          </h3>
          <span class="blocks-prompt-eyebrow">
            <span aria-hidden="true">·</span>Build with your assistant
          </span>
        </div>
        <BlockPromptLinks block={block} />
        <p>
          Bring <strong>{getBlockDisplayName(block.title)}</strong> into your app with a
          ready-to-copy brief. Start with{" "}
          <a href={`#${setupId}-installation`}>
            <strong>setup and integration</strong>
          </a>
          , or describe a focused change to an existing block. Both prompts include the actual{" "}
          <code>Preact</code> source, destination paths and checks to keep the result consistent
          with your project’s <code>TypeScript</code> setup and existing conventions.
        </p>
      </div>
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
                <strong>with access to your project</strong>. It asks the assistant to inspect{" "}
                <code>package.json</code>, routes and styles, add the source, and install only
                missing dependencies. Follow the{" "}
                <a href={`#${setupId}-installation`}>setup guide</a> for file paths and theme
                configuration. <strong>Keep your project’s conventions</strong>, check the first
                render and replace demo data with your own navigation and callbacks.
              </>
            ) : (
              <>
                Replace the <code>[bracketed fields]</code> with your goals, routes and data before
                sending. Describe <strong>what should change and what should stay</strong>,
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
              Try again
            </Button>
          </div>
        ) : result?.sources ? (
          <PromptDocument
            prompt={prompt}
            mode={mode}
            display={display}
            sourceLabel={
              <ShowcaseCodeLink blockId={block.id}>
                {block.files.length} source {block.files.length === 1 ? "file" : "files"} included
              </ShowcaseCodeLink>
            }
          />
        ) : (
          <p class="blocks-prompt-state" role="status">
            Preparing prompt and source files…
          </p>
        )}
        <div class="blocks-prompt-footer">
          <span>
            <strong>Your project, your conventions.</strong> The assistant should reuse your tooling
            and keep unrelated files intact.
          </span>
          <span>Review the result before shipping.</span>
        </div>
      </section>
    </>
  );
}
