import { CodeIcon, FileTextIcon } from "@kamod-ch/icons/lucide";
import { MarkdownIcon } from "@kamod-ch/icons/tabler/outline";
import { ToggleGroup, ToggleGroupItem } from "@kamod-ch/ui";

export type DocumentDisplay = "text" | "code" | "markdown";
const formats = [
  { value: "text", label: "Plain Text", Icon: FileTextIcon },
  { value: "code", label: "Code", Icon: CodeIcon },
  { value: "markdown", label: "Markdown", Icon: MarkdownIcon },
] as const;

/** A shared display switch; changing presentation never changes the source document. */
export function DocumentDisplayOptions({
  value,
  onChange,
  label = "Document display",
}: {
  value: DocumentDisplay;
  onChange: (value: DocumentDisplay) => void;
  label?: string;
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      size="sm"
      spacing="none"
      class="blocks-showcase-segmented document-display-options"
      aria-label={label}
      aria-orientation={undefined}
      onValueChange={(next) => {
        if (next === "text" || next === "code" || next === "markdown") onChange(next);
      }}
    >
      {formats.map(({ value: format, label: text, Icon }) => (
        <ToggleGroupItem
          class="docs-icon-button"
          key={format}
          value={format}
          aria-label={format === "code" ? "Code (Markdown)" : text}
          title={
            format === "markdown"
              ? "Read formatted Markdown"
              : format === "code"
                ? "View Markdown source"
                : "Read plain text"
          }
        >
          <Icon size={14} aria-hidden="true" />
          <span class="document-display-label" aria-hidden="true">
            {text}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
