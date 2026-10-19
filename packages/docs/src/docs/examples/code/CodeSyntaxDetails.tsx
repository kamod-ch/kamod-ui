import prismSource from "virtual:kamod-guide-content/code-prism-explained";
import themeSource from "virtual:kamod-guide-content/code-theme-tokens";
import { parseGuide } from "../../../blocks/guides/guide-markdown";
import { GuideParts } from "../../components/GuideParts";
import { CodeGuideTopic } from "./CodeGuideTopic";
import { CodeThemeTokenLab } from "./CodeThemeTokenLab";

const prismSections = parseGuide(prismSource);
const themeSections = parseGuide(themeSource);

/** Detailed syntax prose uses the same Markdown, code and lazy-reference path as full guides. */
export function PrismSyntaxGuide() {
  return (
    <>
      {prismSections.map((section) => (
        <CodeGuideTopic key={section.id} id={section.id} title={section.title}>
          <div class="code-syntax-prose">
            <GuideParts parts={section.parts} headingOffset={1} />
          </div>
        </CodeGuideTopic>
      ))}
    </>
  );
}

export function CodeThemeTokenGuide() {
  return (
    <>
      {themeSections.map((section) => (
        <CodeGuideTopic key={section.id} id={section.id} title={section.title}>
          {section.id === "code-theme-tokens" && <CodeThemeTokenLab />}
          <div class="code-syntax-prose">
            <GuideParts parts={section.parts} headingOffset={1} />
          </div>
        </CodeGuideTopic>
      ))}
    </>
  );
}
