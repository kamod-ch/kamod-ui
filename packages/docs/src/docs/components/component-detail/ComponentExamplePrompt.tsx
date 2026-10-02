import { ArrowUpRightIcon, BookOpenIcon, FileCodeIcon, SparklesIcon } from "@kamod-ch/icons/lucide";
import { useMemo, useState } from "preact/hooks";
import type { BlockPromptMode } from "../../../blocks/block-prompts";
import { type PromptDisplay, PromptDocument } from "../../../blocks/PromptDocument";
import { PromptOptions } from "../../../blocks/PromptOptions";
import {
  type ComponentPromptContext,
  createComponentExamplePrompt,
} from "./component-example-prompt";

/** Component briefs share the block prompt workspace while identifying their source as an example. */
export function ComponentExamplePrompt({ context }: { context: ComponentPromptContext }) {
  const [mode, setMode] = useState<BlockPromptMode>("setup");
  const [display, setDisplay] = useState<PromptDisplay>("code");
  const prompt = useMemo(() => createComponentExamplePrompt(context, mode), [context, mode]);
  return (
    <>
      <div class="blocks-prompt-intro">
        <div class="blocks-prompt-title-row">
          <h3>
            <SparklesIcon size={21} aria-hidden="true" />
            From preview to your project
          </h3>
          <span class="blocks-prompt-eyebrow">
            <span aria-hidden="true">·</span>Build with your assistant
          </span>
        </div>
        <nav class="blocks-prompt-links" aria-label="Prompt references">
          <a href={context.sourceUrl} target="_blank" rel="noreferrer">
            <FileCodeIcon size={15} aria-hidden="true" />
            Source reference
            <ArrowUpRightIcon size={12} aria-hidden="true" />
          </a>
          <a href="#installation">
            <BookOpenIcon size={15} aria-hidden="true" />
            Setup guide
            <ArrowUpRightIcon size={12} aria-hidden="true" />
          </a>
        </nav>
        <p>
          Bring <strong>{context.title}</strong> into your app with a ready-to-copy brief. Start
          with <strong>setup and integration</strong>, or describe a focused change to an existing
          example. Both prompts include this example’s <code>Preact</code> snippet, a suggested file
          path and checks for your project’s <code>TypeScript</code> setup.
        </p>
      </div>
      <section class="blocks-prompt-workspace" aria-label="Component example prompt">
        <div class="blocks-prompt-options">
          <PromptOptions
            mode={mode}
            onModeChange={setMode}
            display={display}
            onDisplayChange={setDisplay}
            subject="example"
          />
          <span class="blocks-prompt-source-count">
            <FileCodeIcon size={13} aria-hidden="true" />
            Example snippet included
          </span>
        </div>
        <div class="blocks-prompt-hint">
          <p>
            {mode === "setup" ? (
              <>
                Paste the prompt into a coding assistant{" "}
                <strong>with access to your project</strong>. It asks the assistant to inspect{" "}
                <code>package.json</code>, existing components and styles before making changes.{" "}
                <strong>Keep your project’s conventions</strong> and use the{" "}
                <a href="#installation">setup guide</a> to confirm dependencies.
              </>
            ) : (
              <>
                Replace the <code>[bracketed fields]</code> with your goals, data and callbacks.
                Describe <strong>what should change and what should stay</strong>, then review the
                result with real content and keyboard navigation.
              </>
            )}
          </p>
          <span>
            Examples can contain abbreviated code; the prompt links to the source for missing
            details.
          </span>
        </div>
        <PromptDocument
          prompt={prompt}
          mode={mode}
          display={display}
          sourceLabel="Example included"
        />
        <div class="blocks-prompt-footer">
          <span>
            <strong>Your project, your conventions.</strong> Reuse existing tooling and keep
            unrelated files intact.
          </span>
          <span>Review the result before shipping.</span>
        </div>
      </section>
    </>
  );
}
