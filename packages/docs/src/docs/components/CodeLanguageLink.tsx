import { ArrowUpRightIcon, FileCodeIcon, FileTextIcon } from "@kamod-ch/icons/lucide";
import type { CodeLanguage } from "@kamod-ch/ui/code";
import { withBasePath } from "../../base-path";
import { BrandLink } from "./brand/BrandText";

/** Link source languages to their reference; command snippets use a plain terminal label. */
export function CodeLanguageLink(language: CodeLanguage, label: string) {
  if (language === "bash") return <span class="docs-code-terminal-label">{label}</span>;
  if (["tsx", "typescript", "jsx", "javascript"].includes(language)) {
    return (
      <code>
        <BrandLink>{label}</BrandLink>
      </code>
    );
  }
  const Icon = language === "text" || language === "markdown" ? FileTextIcon : FileCodeIcon;
  return (
    <a
      class="docs-inline-code-link"
      href={withBasePath(
        `/docs/code/installation#${language === "text" ? "code-literal-mode" : "code-language-list"}`,
      )}
    >
      <code class="docs-reference-code">
        <Icon class="docs-reference-icon" size="1em" aria-hidden="true" />
        <span>{label}</span>
        <ArrowUpRightIcon class="docs-reference-arrow" size="1em" aria-hidden="true" />
      </code>
    </a>
  );
}
