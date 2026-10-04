import Prism from "prismjs";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-markdown.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-tsx.js";
import type { CodeLanguage } from "./CodeBlock";

/** Loaded only for visible code; previews and collapsed/off-screen examples need no parser. */
export function highlightCode(code: string, language: Exclude<CodeLanguage, "text">) {
  return Prism.highlight(code, Prism.languages[language], language);
}
