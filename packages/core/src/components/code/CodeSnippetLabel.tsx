import { FileIcon, SourceIcon, TerminalIcon } from "./code-icons";
import type { CodeLanguage } from "./code-language";
import type { CodeProps } from "./code-types";

const languages: Record<CodeLanguage, string> = {
  tsx: "TypeScript",
  typescript: "TypeScript",
  jsx: "JavaScript",
  javascript: "JavaScript",
  bash: "Terminal",
  css: "CSS",
  json: "JSON",
  yaml: "YAML",
  diff: "Diff",
  markup: "Markup",
  markdown: "Markdown",
  text: "Plain Text",
};

const purposes: Record<CodeLanguage, string> = {
  tsx: "Usage Pattern",
  typescript: "Usage Pattern",
  jsx: "Usage Pattern",
  javascript: "Usage Pattern",
  bash: "Run Command",
  css: "Style Rules",
  json: "Structured Data",
  yaml: "Structured Data",
  diff: "Change Preview",
  markup: "Markup Structure",
  markdown: "Document Source",
  text: "Text Reference",
};

/** A purpose label for unnamed snippets; never invents a filename or changes copied source. */
export function CodeSnippetLabel({
  code,
  language,
  importsOnly,
  renderLanguage,
}: {
  code: string;
  language: CodeLanguage;
  importsOnly: boolean;
  renderLanguage?: CodeProps["renderLanguage"];
}) {
  const command = language === "bash";
  const document = language === "text" || language === "markdown";
  const label = command
    ? /^(?:pnpm|npm|yarn|bun)\s+(?:add|install|i)(?:\s|$)/.test(code.trimStart())
      ? "Install Packages"
      : "Run Command"
    : importsOnly
      ? "Import Setup"
      : purposes[language];
  const Icon = command ? TerminalIcon : document ? FileIcon : SourceIcon;
  return (
    <span class="docs-code-label">
      <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
      <strong>{label}</strong>
      {(renderLanguage || label !== languages[language]) && (
        <>
          <span class="docs-code-label-dot" aria-hidden="true">
            ·
          </span>
          <span class="docs-code-label-detail">
            {renderLanguage ? renderLanguage(language, languages[language]) : languages[language]}
          </span>
        </>
      )}
    </span>
  );
}
