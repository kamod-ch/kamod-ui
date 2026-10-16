import { Code } from "@kamod-ch/ui/code";
import { Table, TableBody, TableCell, TableRow } from "@kamod-ch/ui/table";
import { TypeDefinition } from "@kamod-ch/ui/type-definition";
import { lazy, Suspense } from "preact/compat";
import { useErrorBoundary, useId } from "preact/hooks";
import { BlockPropsTable } from "../../blocks/detail/BlockPropsTable";
import type { CodeReferenceHelpField, CodeReferenceHelpSection } from "../types";
import { ReferenceSentence } from "./reference-sentence";

const HighlightedDeclaration = lazy(() => import("./reference-declaration"));

/** A shared optional grammar colors the literal source; failed chunks preserve readable code. */
export function DeclarationCode({
  text,
  language = "typescript",
}: {
  text: string;
  language?: string;
}) {
  const [error] = useErrorBoundary();
  const fallback = (
    <code class="code-reference-help-syntax" dir="ltr">
      {text}
    </code>
  );
  return error ? (
    fallback
  ) : (
    <Suspense fallback={fallback}>
      <HighlightedDeclaration text={text} language={language} />
    </Suspense>
  );
}

/** The real reader supplies its page styling without clipboard, references or layout observers. */
export function ReferenceSnippet({
  code,
}: {
  code: NonNullable<CodeReferenceHelpSection["code"]>;
}) {
  const lines = code.value.split("\n");
  const visible = lines.slice(0, 9).join("\n").slice(0, 1200);
  const truncated = visible.length < code.value.length;
  return (
    <div
      class="code-reference-help-miniature code-reference-help-miniature-code"
      data-reference-truncated={truncated || undefined}
    >
      <Code
        code={visible}
        language={code.language}
        inferLanguage={false}
        highlight={false}
        resolveReference={null}
        showCopy={false}
        showWrapControl={false}
        showImportControl={false}
        readingControls="always"
        toolbarContent={<span>{code.caption ?? code.language}</span>}
        renderedContent={
          <pre
            class="docs-code code-reference-help-signature"
            data-slot="code-content"
            data-language={code.language}
            tabIndex={0}
          >
            <DeclarationCode text={visible} language={code.language} />
          </pre>
        }
      />
      {truncated && (
        <span class="code-reference-help-truncation">Excerpt · complete source linked below</span>
      )}
    </div>
  );
}

/** Legacy guide requirements describe usage, rather than asserting a source-level default. */
function ReferenceDefault({ value }: { value: string }) {
  const required = value.trim().toLowerCase() === "required";
  return (
    <dl class="component-api-default">
      <dt>{required ? "Usage requirement" : "Default"}</dt>
      <dd>{required ? <span>Required</span> : <code>{value || "—"}</code>}</dd>
    </dl>
  );
}

/** The same table as the documentation page, with only its density reduced by scoped CSS. */
export function ReferenceFields({
  fields,
  name,
}: {
  fields: CodeReferenceHelpField[];
  name: string;
}) {
  const id = `reference-props-${useId()}`;
  return (
    <div class="code-reference-help-miniature code-reference-help-miniature-props component-detail">
      <span id={id} class="sr-only">
        {name} documented fields
      </span>
      <BlockPropsTable
        labelledBy={id}
        caption={`${name} props and data`}
        rows={fields.slice(0, 3).map((field) => ({
          key: field.name,
          name: field.name,
          type: <DeclarationCode text={field.type} />,
          required: field.required,
          description: (
            <>
              {field.description && (
                <p>
                  <ReferenceSentence text={field.description} />
                </p>
              )}
              {field.defaultValue !== undefined && <ReferenceDefault value={field.defaultValue} />}
              {!field.description && field.defaultValue === undefined && (
                <span class="code-reference-help-field-absence">
                  {field.required ? "Required by source" : "Optional in source"}
                </span>
              )}
            </>
          ),
        }))}
      />
      {fields.length > 3 && (
        <span class="code-reference-help-truncation">
          3 of {fields.length} documented fields · complete table linked below
        </span>
      )}
    </div>
  );
}

/** Source definitions use the actual disclosure primitive; closed definitions mount no reader. */
export function ReferenceDefinitions({
  definitions,
}: {
  definitions: NonNullable<CodeReferenceHelpSection["definitions"]>;
}) {
  return (
    <div class="code-reference-help-miniature code-reference-help-miniature-definitions">
      {definitions.slice(0, 3).map((definition) => (
        <TypeDefinition
          key={definition.name}
          title={
            definition.source ? (
              <a href={definition.source.href} target="_top">
                {definition.name}
              </a>
            ) : (
              definition.name
            )
          }
          typeName={definition.name}
          titleMetadata={`${definition.code.split("\n").length} source lines`}
          headingLevel={6}
          density="compact"
          triggerHint="TypeScript source"
          class="blocks-api-type"
        >
          <ReferenceSnippet
            code={{ language: "tsx", value: definition.code, caption: definition.name }}
          />
        </TypeDefinition>
      ))}
    </div>
  );
}

/** Technology and command facts reuse the ordinary core table rather than a second table design. */
export function ReferenceRows({ rows }: { rows: NonNullable<CodeReferenceHelpSection["rows"]> }) {
  return (
    <div class="code-reference-help-miniature code-reference-help-miniature-facts">
      <Table>
        <TableBody>
          {rows.slice(0, 4).map((row) => (
            <TableRow key={row.label}>
              <TableCell>
                <strong>{row.label}</strong>
              </TableCell>
              <TableCell>
                <ReferenceSentence text={row.value} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
