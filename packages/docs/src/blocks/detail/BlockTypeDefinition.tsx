/** Shared source-backed API disclosure; callers own selection and deep-link state. */
import { TypeDefinition } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { CodeBlock } from "../../docs/components/CodeBlock";
import { BlockHeadingLink } from "../BlockHeadingLink";
import { RequiredIndicator } from "../RequiredIndicator";

/** Required fields stay beside the summary; the source toolbar identifies their file. */
const RequiredTypeFields = ({
  typeName,
  fields,
}: {
  typeName: string;
  fields: readonly string[];
}) => {
  const requiredLabel = fields.length === 1 ? "Required Field" : "Required Fields";
  return (
    <div class="blocks-api-type-fields" role="group" aria-label={`Required fields of ${typeName}`}>
      <span class="blocks-api-required-label">Required fields</span>
      <RequiredIndicator label={`${requiredLabel}: ${fields.join(", ")}`} tooltip={requiredLabel} />
      <span class="blocks-api-type-field-list">
        {fields.map((field, index, fields) => (
          <span key={field}>
            <code>{field}</code>
            {index < fields.length - 1 && ", "}
          </span>
        ))}
      </span>
    </div>
  );
};

/** Docs adapter: core owns layout/state; this layer supplies permalinks, source and field markers. */
export function BlockTypeDefinition({
  id,
  entry,
  source,
  filePath,
  requiredFields = [],
  requiredProp,
  showFieldDocs = true,
  open,
  onOpenChange,
  onReveal,
}: {
  id: string;
  entry: { name: string; title: string; description: ComponentChildren; note?: ComponentChildren };
  source: string;
  filePath: string;
  requiredFields?: readonly string[];
  requiredProp?: { name: string };
  showFieldDocs?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Open the card even when its fragment is already the current URL. */
  onReveal: () => void;
}) {
  return (
    <TypeDefinition
      class="blocks-api-type"
      headingId={id}
      headingLevel={4}
      title={
        <BlockHeadingLink id={id} onClick={onReveal}>
          {entry.title}
        </BlockHeadingLink>
      }
      typeName={entry.name}
      description={entry.description}
      metadata={
        requiredFields.length > 0 ? (
          <RequiredTypeFields typeName={entry.name} fields={requiredFields} />
        ) : undefined
      }
      headerAction={
        requiredProp && (
          <div class="blocks-api-type-required">
            <span class="blocks-api-required-label">Required type</span>
            <RequiredIndicator
              label={`Required type: ${entry.name}`}
              tooltip={`Used by required prop: ${requiredProp.name}`}
              align="end"
            />
          </div>
        )
      }
      open={open}
      onOpenChange={onOpenChange}
      expandLabel={`View definition${showFieldDocs ? " and field docs" : ""}`}
      collapseLabel={`Hide definition${showFieldDocs ? " and field docs" : ""}`}
      triggerClass="blocks-api-type-trigger"
      contentClass="blocks-api-type-content"
    >
      <CodeBlock code={source} language="tsx" filePath={filePath} />
      {entry.note && <p class="blocks-api-type-note">{entry.note}</p>}
    </TypeDefinition>
  );
}
