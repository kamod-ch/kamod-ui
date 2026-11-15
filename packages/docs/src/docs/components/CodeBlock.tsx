import { ReferenceCode, type ReferenceCodeProps } from "../../references/ReferenceCode";
import { CodeLanguageLink } from "./CodeLanguageLink";
import { ConsumerImportSwitch, useConsumerImportCode } from "./consumer-import-code";
import { PathDisplay } from "./PathDisplay";

const renderFilePath = (path: string) => (
  <PathDisplay class="docs-code-file-path" path={path} file fileTypeTooltip />
);

const localKamodImport = /from\s+["']@\/components\/kamod-ui\//;

export type CodeBlockProps = ReferenceCodeProps & {
  /**
   * Rewrite Kamod imports for copy-paste.
   * The default rewrites only the docs-local `@/components/kamod-ui/*` alias.
   * Pass false when the caller already chose barrel or subpath form.
   */
  consumerImports?: boolean;
};

/** Add documentation source links while the core component owns code rendering and controls. */
export function CodeBlock({ consumerImports, ...props }: CodeBlockProps) {
  const source = props.code ?? "";
  const enabled = consumerImports ?? localKamodImport.test(source);
  const presentation = useConsumerImportCode(enabled ? source : "");
  const code = enabled && presentation.applicable ? presentation.code : props.code;
  return (
    <>
      {enabled && presentation.applicable ? (
        <ConsumerImportSwitch value={presentation.style} onChange={presentation.setStyle} />
      ) : null}
      <ReferenceCode
        {...props}
        code={code}
        renderFilePath={props.renderFilePath ?? renderFilePath}
        renderLanguage={props.renderLanguage ?? CodeLanguageLink}
      />
    </>
  );
}
