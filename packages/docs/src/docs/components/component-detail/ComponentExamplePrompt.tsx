import { useMemo, useState } from "preact/hooks";
import type { BlockPromptMode } from "../../../blocks/block-prompts";
import { type PromptDisplay, PromptDocument } from "../../../blocks/PromptDocument";
import { PromptOptions } from "../../../blocks/PromptOptions";
import type { PreviewAppearance } from "../../../blocks/preview-appearance";
import { ComponentExampleIntro } from "./ComponentExampleIntro";
import {
  type ComponentPromptContext,
  createComponentExamplePrompt,
} from "./component-example-prompt";

/** Component briefs share the block prompt workspace while identifying their source as an example. */
export function ComponentExamplePrompt({
  context,
  appearance,
}: {
  context: ComponentPromptContext;
  appearance: PreviewAppearance;
}) {
  const [mode, setMode] = useState<BlockPromptMode>("setup");
  const [display, setDisplay] = useState<PromptDisplay>("code");
  const prompt = useMemo(() => createComponentExamplePrompt(context, mode), [context, mode]);
  return (
    <>
      <ComponentExampleIntro view="prompt" />
      <section class="blocks-prompt-workspace" aria-label="Component example prompt">
        <div class="blocks-prompt-options">
          <PromptOptions
            mode={mode}
            onModeChange={setMode}
            display={display}
            onDisplayChange={setDisplay}
            subject="example"
          />
        </div>
        <div class="blocks-prompt-hint">
          <p>
            {mode === "setup" ? (
              <>
                Paste the prompt into a coding assistant{" "}
                <strong>With Access to Your Project</strong>. It asks the assistant to inspect{" "}
                <code>package.json</code>, existing components and styles before making changes.{" "}
                <strong>Keep Your Project’s Conventions</strong> and use the{" "}
                <a href="#installation">Setup Guide</a> to confirm dependencies.
              </>
            ) : (
              <>
                Replace the <code>[bracketed fields]</code> with your goals, data and callbacks.
                Describe <strong>What Should Change and What Should Stay</strong>, then review the
                result with real content and keyboard navigation.
              </>
            )}
          </p>
        </div>
        <PromptDocument appearance={appearance} prompt={prompt} mode={mode} display={display} />
        <div class="blocks-prompt-footer">
          <span>
            <strong>Your Project, Your Conventions.</strong> Reuse existing tooling and keep
            unrelated files intact.
          </span>
          <span>Review the result before shipping.</span>
        </div>
      </section>
    </>
  );
}
