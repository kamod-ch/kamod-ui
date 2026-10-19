import Prism from "prismjs";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-diff.js";
import "prismjs/components/prism-yaml.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-markdown.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-tsx.js";
import type { CodeLanguage } from "@kamod-ch/ui/code";

// Documentation owns the optional grammar engine. Code owns the DOM and wraps
// highlighted logical lines itself, so Prism must not scan the page later.
Prism.manual = true;

export function highlightCode(code: string, language: Exclude<CodeLanguage, "text">) {
  return Prism.highlight(code, Prism.languages[language], language);
}
