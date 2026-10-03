import { CodeIcon, EyeIcon, TextAlignStartIcon } from "@kamod-ch/icons/lucide";
import { ToggleGroup, ToggleGroupItem } from "@kamod-ch/ui";

export type DocumentDisplay = "text" | "code" | "markdown";
const formats = [
  { value: "text", label: "Plain text", Icon: TextAlignStartIcon },
  { value: "code", label: "Code", Icon: CodeIcon },
  { value: "markdown", label: "Markdown", Icon: EyeIcon },
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
      class="blocks-showcase-segmented"
      aria-label={label}
      aria-orientation={undefined}
      onValueChange={(next) => {
        if (next === "text" || next === "code" || next === "markdown") onChange(next);
      }}
    >
      {formats.map(({ value: format, label: text, Icon }) => (
        <ToggleGroupItem key={format} value={format}>
          <Icon size={14} aria-hidden="true" />
          {text}
          {format === "code" && <span class="sr-only"> (Markdown)</span>}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
