import type { CodeHighlighter } from "@kamod-ch/ui/code";

/** Load the documentation-only Prism adapter when a source panel approaches the viewport. */
export const docsCodeHighlighter: CodeHighlighter = async (code, language) => {
  const { highlightCode } = await import("./highlight-code");
  return highlightCode(code, language);
};
