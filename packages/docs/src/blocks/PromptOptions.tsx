import { PackagePlusIcon, SlidersHorizontalIcon } from "@kamod-ch/icons/lucide";
import { ToggleGroup, ToggleGroupItem } from "@kamod-ch/ui";
import { DocumentDisplayOptions } from "../docs/components/DocumentDisplayOptions";
import type { BlockPromptMode } from "./block-prompts";
import type { PromptDisplay } from "./PromptDocument";

const modes = [
  {
    value: "setup",
    label: "Set Up",
    exampleLabel: "Add to Project",
    shortLabel: "Add",
    Icon: PackagePlusIcon,
  },
  {
    value: "adapt",
    label: "Adapt",
    exampleLabel: "Tailor Example",
    shortLabel: "Tailor",
    Icon: SlidersHorizontalIcon,
  },
] as const;

/** Keep purpose and format controls identical across block and component prompts. */
export function PromptOptions({
  mode,
  onModeChange,
  display,
  onDisplayChange,
  subject = "block",
}: {
  mode: BlockPromptMode;
  onModeChange: (mode: BlockPromptMode) => void;
  display: PromptDisplay;
  onDisplayChange: (display: PromptDisplay) => void;
  subject?: "block" | "example";
}) {
  return (
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
        {modes.map(({ value, label, exampleLabel, shortLabel, Icon }) => {
          const fullLabel = subject === "example" ? exampleLabel : `${label} ${subject}`;
          return (
            <ToggleGroupItem
              class="docs-icon-button"
              key={value}
              value={value}
              aria-label={fullLabel}
              title={
                value === "setup"
                  ? `Add this ${subject} to your project`
                  : `Adapt this ${subject} to your needs`
              }
            >
              <Icon size={14} aria-hidden="true" />
              <span class="blocks-prompt-mode-label" aria-hidden="true">
                {fullLabel}
              </span>
              <span class="blocks-prompt-mode-short" aria-hidden="true">
                {subject === "example" ? shortLabel : label}
              </span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      <DocumentDisplayOptions value={display} onChange={onDisplayChange} label="Prompt Display" />
    </div>
  );
}
