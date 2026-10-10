import { Switch } from "../switch";
import { ChevronIcon, FoldIcon, ImportIcon, WrapIcon } from "./code-icons";

export function CodeImportControl({
  hidden,
  count,
  codeId,
  onToggle,
}: {
  hidden: boolean;
  count: number;
  codeId: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      class="docs-import-toggle"
      data-slot="code-import-toggle"
      aria-expanded={!hidden}
      aria-controls={codeId}
      aria-label={`${hidden ? "Show" : "Hide"} imports`}
      title="Copy always includes the complete source, even when imports are hidden."
      onClick={onToggle}
    >
      <ChevronIcon class="docs-import-chevron" size={14} />
      <code class="docs-import-label docs-code-control-detail">
        <span class="docs-import-keyword">import</span> {"{ … }"}
      </code>
      <span class="docs-code-control-dot" aria-hidden="true" />
      <span class="docs-import-summary">
        <span class="docs-code-control-detail">
          <strong>{count}</strong> {count === 1 ? "statement" : "statements"}{" "}
        </span>
        <span class="docs-code-control-state" data-alternate={hidden ? "shown" : "hidden"}>
          <span>{hidden ? "hidden" : "shown"}</span>
        </span>
      </span>
      <ImportIcon class="docs-code-control-end-icon" size={12} />
    </button>
  );
}

/** Native label activation gives the whole control one switch target without duplicate clicks. */
export function CodeWrapControl({
  wrapped,
  codeId,
  onChange,
}: {
  wrapped: boolean;
  codeId: string;
  onChange: (wrapped: boolean) => void;
}) {
  return (
    <label class="docs-code-wrap-control" data-slot="code-wrap-control" htmlFor={`${codeId}-wrap`}>
      <WrapIcon class="docs-code-wrap-icon" size={14} />
      <Switch
        id={`${codeId}-wrap`}
        class="docs-code-wrap-toggle"
        size="sm"
        checked={wrapped}
        onCheckedChange={onChange}
        aria-label="Wrap code lines"
        aria-controls={codeId}
        aria-describedby={`${codeId}-wrap-state`}
        title={wrapped ? "Turn off line wrapping" : "Wrap lines with readable indentation"}
      />
      <span class="docs-code-wrap-state" id={`${codeId}-wrap-state`}>
        <span class="docs-code-control-detail">wrap </span>
        <span class="docs-code-control-state" data-alternate={wrapped ? "disabled" : "enabled"}>
          <span>{wrapped ? "enabled" : "disabled"}</span>
        </span>
      </span>
      <FoldIcon class="docs-code-control-end-icon" size={12} />
    </label>
  );
}
