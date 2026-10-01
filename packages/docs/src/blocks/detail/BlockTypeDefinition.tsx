/** Shared source-backed API disclosure; callers own selection and deep-link state. */
import { ChevronDownIcon, CodeIcon } from "@kamod-ch/icons/lucide";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@kamod-ch/ui";
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

/** Expandable type card using core Collapsible, code copying and contextual required-field markers. */
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
    <Collapsible class="blocks-api-type" open={open} onOpenChange={onOpenChange}>
      <div class="blocks-api-type-intro">
        <div class="blocks-api-type-heading">
          <h4 id={id} tabIndex={-1}>
            <BlockHeadingLink id={id} onClick={onReveal}>
              {entry.title}
            </BlockHeadingLink>
          </h4>
          {requiredProp && (
            <div class="blocks-api-type-required">
              <span class="blocks-api-required-label">Required type</span>
              <RequiredIndicator
                label={`Required type: ${entry.name}`}
                tooltip={`Used by required prop: ${requiredProp.name}`}
                align="end"
              />
            </div>
          )}
        </div>
        <code class="blocks-api-type-name">{entry.name}</code>
        <p>{entry.description}</p>
        {requiredFields.length > 0 && (
          <RequiredTypeFields typeName={entry.name} fields={requiredFields} />
        )}
      </div>
      <CollapsibleTrigger
        id={`${id}-trigger`}
        class="blocks-api-type-trigger"
        aria-controls={`${id}-content`}
        aria-label={`${open ? "Hide" : "Show"} ${entry.name} definition${showFieldDocs ? " and field documentation" : ""}`}
      >
        <span>
          <CodeIcon
            size={16}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          />
          {open ? "Hide" : "View"} definition{showFieldDocs && " and field docs"}
        </span>
        <ChevronDownIcon
          size={16}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent id={`${id}-content`} duration="0ms" class="blocks-api-type-content">
        <CodeBlock code={source} language="tsx" filePath={filePath} />
        {entry.note && <p class="blocks-api-type-note">{entry.note}</p>}
      </CollapsibleContent>
    </Collapsible>
  );
}
