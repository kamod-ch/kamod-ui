import { ChevronDownIcon } from "@kamod-ch/icons/lucide";
import { BrandTypescriptIcon } from "@kamod-ch/icons/tabler/outline";
import { Code } from "@kamod-ch/ui/code";
import { Table, TableBody, TableCell, TableRow } from "@kamod-ch/ui/table";
import { TypeDefinition } from "@kamod-ch/ui/type-definition";
import { lazy, Suspense } from "preact/compat";
import { useErrorBoundary, useId } from "preact/hooks";
import { BlockPropsTable } from "../../blocks/detail/BlockPropsTable";
import { RequiredIndicator } from "../../blocks/RequiredIndicator";
import { linkTitle } from "../../link-title";
import type {
  CodeReferenceHelpExcerpt,
  CodeReferenceHelpField,
  CodeReferenceHelpLink,
  CodeReferenceHelpSection,
} from "../types";
import { ReferenceSentence } from "./reference-sentence";

const HighlightedDeclaration = lazy(() => import("./reference-declaration"));

function ReferenceContinuation({
  source,
  children,
  label,
}: {
  source: CodeReferenceHelpLink;
  children: string;
  label: string;
}) {
  return (
    <a
      class="code-reference-help-truncation code-reference-help-continuation"
      href={source.href}
      target="_top"
      aria-label={label}
    >
      {children}
      <ChevronDownIcon size={9} strokeWidth={1.75} aria-hidden="true" />
    </a>
  );
}

/** A shared optional grammar colors the literal source; failed chunks preserve readable code. */
function DeclarationCode({ text, language = "typescript" }: { text: string; language?: string }) {
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
  source,
}: {
  code: NonNullable<CodeReferenceHelpSection["code"]>;
  source?: CodeReferenceHelpLink;
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
      {truncated &&
        (source ? (
          <ReferenceContinuation
            source={source}
            label={`Read the complete source: ${source.label}`}
          >
            Full source
          </ReferenceContinuation>
        ) : (
          <span class="code-reference-help-truncation">Source excerpt</span>
        ))}
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
  source,
}: {
  fields: CodeReferenceHelpField[];
  name: string;
  source?: CodeReferenceHelpLink;
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
          type: field.type,
          required: field.required,
          owner: field.owners?.length ? (
            <span class="component-api-owners">
              {field.owners.map((owner) => (
                <a
                  key={owner.href}
                  class="blocks-api-field-owner"
                  href={owner.href}
                  target="_top"
                  title={`Open the ${owner.label} source definition`}
                >
                  {linkTitle(owner.label)}
                </a>
              ))}
            </span>
          ) : undefined,
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
      {fields.length > 3 && source && (
        <ReferenceContinuation
          source={source}
          label={`Read the complete props and data table for ${name}`}
        >
          Full props and data
        </ReferenceContinuation>
      )}
    </div>
  );
}

type SourceDefinition = NonNullable<CodeReferenceHelpSection["definitions"]>[number];

/** Match the source page's declaration introduction and metadata using its actual disclosure. */
function ReferenceDefinition({ definition }: { definition: SourceDefinition }) {
  const fields = definition.fields;
  const required = fields?.filter((field) => field.required) ?? [];
  const title = definition.name.endsWith("Props")
    ? `${definition.name.slice(0, -5)} props`
    : definition.name;
  const fieldDocs = definition.code.includes("/**");
  const fileName = definition.filePath?.split("/").at(-1);
  return (
    <TypeDefinition
      title={
        definition.source ? (
          <a href={definition.source.href} target="_top">
            {title}
          </a>
        ) : (
          title
        )
      }
      typeName={definition.name}
      titleMetadata={
        fields?.length
          ? `${fields.length} declared ${fields.length === 1 ? "field" : "fields"}`
          : "Declaration"
      }
      description={
        <>
          {definition.description ? (
            <ReferenceSentence text={definition.description} />
          ) : (
            <>
              <strong>
                {definition.exported === undefined
                  ? "Source"
                  : definition.exported
                    ? "Exported Source"
                    : "Local Source"}{" "}
                Declaration
              </strong>
              {fileName && (
                <>
                  {" "}
                  from <code>{fileName}</code>
                </>
              )}
              . Referenced types retain their original names; inspect
              {fileName ? " that file" : " the source"} for imports and supporting definitions.
            </>
          )}
          {definition.source && (
            <>
              {" "}
              Inspect the{" "}
              <a href={definition.source.href} target="_top">
                <strong>Complete Definition</strong>
              </a>{" "}
              of <code>{definition.name}</code> before adapting it.
            </>
          )}
        </>
      }
      metadata={
        required.length ? (
          <div
            class="blocks-api-type-fields"
            role="group"
            aria-label={`Required fields of ${definition.name}`}
          >
            <span class="blocks-api-required-label">Required fields</span>
            <RequiredIndicator
              label={`Required ${required.length === 1 ? "Field" : "Fields"}: ${required.map(({ name }) => name).join(", ")}`}
              tooltip={required.length === 1 ? "Required Field" : "Required Fields"}
            />
            <span class="blocks-api-type-field-list">
              {required.map((field, index) => (
                <span key={field.name}>
                  <code>{field.name}</code>
                  {index < required.length - 1 && ", "}
                </span>
              ))}
            </span>
          </div>
        ) : undefined
      }
      headerAction={
        <div class="blocks-api-type-heading-aside">
          <BrandTypescriptIcon class="blocks-api-type-language" size={15} aria-hidden="true" />
        </div>
      }
      headingLevel={6}
      density="compact"
      expandLabel={`View Definition${fieldDocs ? " and Field Docs" : ""}`}
      collapseLabel={`Hide Definition${fieldDocs ? " and Field Docs" : ""}`}
      triggerHint="TypeScript Source"
      triggerClass="blocks-api-type-trigger"
      contentClass="blocks-api-type-content"
      class="blocks-api-type"
    >
      <ReferenceSnippet
        code={{ language: "tsx", value: definition.code, caption: fileName ?? definition.name }}
        source={definition.source}
      />
    </TypeDefinition>
  );
}

/** Closed source cards mount no reader or grammar work; opening reuses the ordinary source UI. */
export function ReferenceDefinitions({
  definitions,
  source,
}: {
  definitions: SourceDefinition[];
  source?: CodeReferenceHelpLink;
}) {
  return (
    <div class="code-reference-help-miniature code-reference-help-miniature-definitions">
      {definitions.slice(0, 3).map((definition) => (
        <ReferenceDefinition key={definition.name} definition={definition} />
      ))}
      {definitions.length > 3 && source && (
        <ReferenceContinuation source={source} label="Read the complete data type reference">
          Full data type reference
        </ReferenceContinuation>
      )}
    </div>
  );
}

/** Combined chapters retain each real section's heading, prose and distinct source snippet. */
export function ReferenceExcerpts({ excerpts }: { excerpts: CodeReferenceHelpExcerpt[] }) {
  return (
    <div class="code-reference-help-excerpts">
      {excerpts.map((excerpt, index) => (
        <div class="code-reference-help-excerpt" key={`${excerpt.title}-${index}`}>
          <h6 class="code-reference-help-excerpt-title">
            {excerpt.source ? (
              <a href={excerpt.source.href} target="_top">
                {excerpt.title}
              </a>
            ) : (
              excerpt.title
            )}
          </h6>
          {excerpt.description && (
            <p class="code-reference-help-section-copy">
              <ReferenceSentence text={excerpt.description} />
            </p>
          )}
          {excerpt.code && <ReferenceSnippet code={excerpt.code} source={excerpt.source} />}
        </div>
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
