import { FileIcon } from "./code-icons";
import { codeLanguageForFile } from "./code-language";

export interface CodeFileHeaderProps {
  /** Exact destination path; separators and casing remain unchanged. */
  path: string;
  class?: string;
  /** Optional source line count for file-browser headers. */
  lineCount?: number;
}

const fileTypes: Record<string, string> = {
  tsx: "TypeScript JSX",
  typescript: "TypeScript",
  jsx: "JavaScript JSX",
  javascript: "JavaScript",
  bash: "Shell script",
  css: "CSS stylesheet",
  json: "JSON data",
  yaml: "YAML configuration",
  diff: "Diff",
  markup: "Markup",
  markdown: "Markdown",
  text: "Plain text",
};

/** Neutral source metadata, independent of documentation routes or repository links. */
export function CodeFileHeader({ path, class: className, lineCount }: CodeFileHeaderProps) {
  const separator = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  const directory = path.slice(0, separator + 1);
  const filename = path.slice(separator + 1);
  const extension = filename.match(/\.([^.]*)$/)?.[1];
  const type = `${fileTypes[codeLanguageForFile(path)]}${extension ? ` (.${extension})` : " file"}`;
  return (
    <span class={`docs-code-file-meta ${className ?? ""}`}>
      <code class="path-display docs-code-file-path" dir="ltr" data-path-icon="true" title={path}>
        <span class="kamod-code-file-icon" tabIndex={0} role="img" aria-label={type} title={type}>
          <FileIcon class="path-display-icon" size={16} />
        </span>
        {directory && <span data-path-part="middle">{directory}</span>}
        <span data-path-part="end">{filename}</span>
      </code>
      {lineCount !== undefined && (
        <span class="docs-code-line-count">
          <strong>{lineCount}</strong> {lineCount === 1 ? "line" : "lines"}
        </span>
      )}
    </span>
  );
}
