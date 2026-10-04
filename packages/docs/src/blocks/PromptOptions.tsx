import { PackagePlusIcon, SlidersHorizontalIcon } from "@kamod-ch/icons/lucide";
import { ToggleGroup, ToggleGroupItem } from "@kamod-ch/ui";
import { DocumentDisplayOptions } from "../docs/components/DocumentDisplayOptions";
import type { BlockPromptMode } from "./block-prompts";
import type { PromptDisplay } from "./PromptDocument";

const modes = [
  { value: "setup", label: "Set up", Icon: PackagePlusIcon },
  { value: "adapt", label: "Adapt", Icon: SlidersHorizontalIcon },
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
        {modes.map(({ value, label, Icon }) => (
          <ToggleGroupItem class="docs-icon-button" key={value} value={value}>
            <Icon size={14} aria-hidden="true" />
            {label} {subject}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <DocumentDisplayOptions value={display} onChange={onDisplayChange} label="Prompt display" />
    </div>
  );
}
