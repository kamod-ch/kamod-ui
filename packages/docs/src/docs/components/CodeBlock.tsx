import type { CodeProps } from "@kamod-ch/ui/code";
import { ReferenceCode } from "../../references/ReferenceCode";
import { CodeLanguageLink } from "./CodeLanguageLink";
import { PathDisplay } from "./PathDisplay";

const renderFilePath = (path: string) => (
  <PathDisplay class="docs-code-file-path" path={path} file fileTypeTooltip />
);

/** Add documentation source links while the core component owns code rendering and controls. */
export function CodeBlock(props: CodeProps) {
  return (
    <ReferenceCode
      {...props}
      renderFilePath={props.renderFilePath ?? renderFilePath}
      renderLanguage={props.renderLanguage ?? CodeLanguageLink}
    />
  );
}
