import type { ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import { FileIcon } from "./code-icons";
import { codeLanguageForFile } from "./code-language";

export interface CodeFileHeaderProps {
  /** Exact destination path; separators and casing remain unchanged. */
  path: string;
  class?: string;
  /** Complete source for automatic line counting, independent of folding and wrapping. */
  code?: string;
  /** Optional explicit line count, overriding the total derived from `code`. */
  lineCount?: number;
  /** Replace the path presentation while retaining the shared line-count metadata. */
  children?: ComponentChildren;
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
export function CodeFileHeader({
  path,
  class: className,
  code,
  lineCount,
  children,
}: CodeFileHeaderProps) {
  const total = useMemo(() => {
    if (lineCount !== undefined || code === undefined) return lineCount;
    const source = code.trimEnd();
    let count = source ? 1 : 0;
    for (let i = 0; i < source.length; i++) {
      if (source[i] === "\n") count++;
      else if (source[i] === "\r") {
        count++;
        if (source[i + 1] === "\n") i++;
      }
    }
    return count;
  }, [code, lineCount]);
  const separator = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  const directory = path.slice(0, separator + 1);
  const filename = path.slice(separator + 1);
  const extension = filename.match(/\.([^.]*)$/)?.[1];
  const type = `${fileTypes[codeLanguageForFile(path)]}${extension ? ` (.${extension})` : " file"}`;
  return (
    <span class={`docs-code-file-meta ${className ?? ""}`}>
      {children === undefined ? (
        <code class="path-display docs-code-file-path" dir="ltr" data-path-icon="true" title={path}>
          <span class="kamod-code-file-icon" tabIndex={0} role="img" aria-label={type} title={type}>
            <FileIcon class="path-display-icon" size={16} />
          </span>
          {directory && <span data-path-part="middle">{directory}</span>}
          <span data-path-part="end">{filename}</span>
        </code>
      ) : (
        children
      )}
      {total !== undefined && (
        <span class="docs-code-line-count">
          <span class="docs-code-label-dot" aria-hidden="true">
            ·
          </span>
          <span>
            <strong>{total}</strong> {total === 1 ? "line" : "lines"}
          </span>
        </span>
      )}
    </span>
  );
}
