import {
  ArrowUpRightIcon,
  BookOpenIcon,
  CodeIcon,
  EyeIcon,
  FileCodeIcon,
  PackagePlusIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TextAlignStartIcon,
} from "@kamod-ch/icons/lucide";
import { Button, ToggleGroup, ToggleGroupItem } from "@kamod-ch/ui";
import { useMemo } from "preact/hooks";
import type { ShowcaseBlock } from "./BlockShowcase";
import type { BlockSourceLoader } from "./BlockSourceFiles";
import { getBlockDisplayName } from "./block-overview-details";
import { type BlockPromptMode, createBlockPrompt } from "./block-prompts";
import { type PromptDisplay, PromptDocument } from "./PromptDocument";
import { ShowcaseCodeLink } from "./ShowcaseCodeLink";
import { usePromptSources } from "./usePromptSources";

const modes = [
  { value: "setup", label: "Set up block", Icon: PackagePlusIcon },
  { value: "adapt", label: "Adapt block", Icon: SlidersHorizontalIcon },
] as const;

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
        <nav class="blocks-prompt-links" aria-label="Prompt references">
          <ShowcaseCodeLink blockId={block.id}>
            <FileCodeIcon size={15} aria-hidden="true" /> Source files
          </ShowcaseCodeLink>
          <a href={`#${setupId}-installation`}>
            <BookOpenIcon size={15} aria-hidden="true" /> Setup guide{" "}
            <ArrowUpRightIcon size={12} aria-hidden="true" />
          </a>
        </nav>
        <p>
          Bring <strong>{getBlockDisplayName(block.title)}</strong> into your app with a
          ready-to-copy brief. Start with <strong>setup and integration</strong>, or describe a
          focused change to an existing block. Both prompts include the actual <code>Preact</code>{" "}
          source, destination paths and checks to keep the result consistent with your project’s{" "}
          <code>TypeScript</code> setup and existing conventions.
        </p>
      </div>
      <section class="blocks-prompt-workspace" aria-label="Block prompt">
        <div class="blocks-prompt-options">
          <div class="blocks-prompt-selectors">
            <ToggleGroup
              type="single"
              value={mode}
              size="sm"
              spacing="none"
              class="blocks-showcase-segmented"
              aria-label="Prompt purpose"
              aria-orientation={undefined}
              onValueChange={(next) => {
                if (next === "setup" || next === "adapt") onModeChange(next);
              }}
            >
              {modes.map(({ value, label, Icon }) => (
                <ToggleGroupItem key={value} value={value}>
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <span class="blocks-prompt-control-dot" aria-hidden="true">
              ·
            </span>
            <ToggleGroup
              type="single"
              value={display}
              size="sm"
              spacing="none"
              class="blocks-showcase-segmented"
              aria-label="Prompt display"
              aria-orientation={undefined}
              onValueChange={(next) => {
                if (next === "text" || next === "code" || next === "markdown")
                  onDisplayChange(next);
              }}
            >
              <ToggleGroupItem value="text">
                <TextAlignStartIcon size={14} aria-hidden="true" />
                Plain text
              </ToggleGroupItem>
              <ToggleGroupItem value="code">
                <CodeIcon size={14} aria-hidden="true" />
                Code<span class="sr-only"> (Markdown)</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="markdown">
                <EyeIcon size={14} aria-hidden="true" />
                Markdown
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <span class="blocks-prompt-source-count">
            <FileCodeIcon size={13} aria-hidden="true" />
            {block.files.length} source files included
          </span>
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
          <span>No assistant-specific setup required</span>
        </div>
        {result?.error ? (
          <div class="blocks-prompt-state" role="alert">
            <p>The source could not be loaded. Retry to build a complete prompt.</p>
            <Button size="sm" variant="outline" onClick={retry}>
              Try again
            </Button>
          </div>
        ) : result?.sources ? (
          <PromptDocument prompt={prompt} mode={mode} display={display} />
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
