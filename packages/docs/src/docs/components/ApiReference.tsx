import type { ComponentChildren } from "preact";
import { useContext, useId } from "preact/hooks";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { BlockPropsTable } from "../../blocks/detail/BlockPropsTable";
import { linkTitle } from "../../link-title";
import { ComponentTypeRevealContext } from "./component-detail/ComponentApiSection";
import { componentApiRowOwners, componentTypeId } from "./component-detail/component-api";
import { ComponentExamplesContext } from "./component-detail/component-examples";

type ApiReferenceRow = {
  prop: string;
  type: string;
  defaultValue: string;
  description?: ComponentChildren;
};

type ApiReferenceSection = {
  title: string;
  description?: string;
  rows: readonly ApiReferenceRow[];
};

type ApiReferenceProps = {
  sections: readonly ApiReferenceSection[];
};

function ApiReferenceTable({ section }: { section: ApiReferenceSection }) {
  const id = `api-${useId()}`;
  const collection = useContext(ComponentExamplesContext);
  const reveal = useContext(ComponentTypeRevealContext);
  if (collection) {
    return (
      <div class="docs-api-reference">
        <h4 id={id} tabIndex={-1}>
          <BlockHeadingLink id={id}>{section.title}</BlockHeadingLink>
        </h4>
        {section.description && <p class="docs-copy">{section.description}</p>}
        <BlockPropsTable
          labelledBy={id}
          caption={`${section.title} documented props`}
          rows={section.rows.map((row) => {
            const owners = componentApiRowOwners(collection.doc.slug, section.title, row.prop);
            const propName = row.prop.split(/\s+/).at(-1)!.replace(/\?$/, "");
            const field = owners[0]?.fields.find(({ name }) => name === propName);
            // Older guide rows store usage requirements in the default-value column.
            const isRequirement = row.defaultValue.trim().toLowerCase() === "required";
            return {
              key: row.prop,
              name: row.prop,
              type: row.type,
              required: field?.required ?? false,
              owner: owners.length ? (
                <span class="component-api-owners">
                  {owners.map((owner) => (
                    <a
                      key={owner.name}
                      class="blocks-api-field-owner"
                      data-tooltip={`Open the ${owner.name} source definition`}
                      href={`#${componentTypeId(owner)}`}
                      onClick={() => reveal?.(componentTypeId(owner))}
                    >
                      {linkTitle(owner.name)}
                    </a>
                  ))}
                </span>
              ) : undefined,
              description: (
                <>
                  <p>
                    {row.description || field?.description || (
                      <>
                        Configure <code>{row.prop}</code> for <strong>{section.title}</strong>.
                        Compare its accepted type with the <a href="#usage">Usage Guidance</a>{" "}
                        before supplying a value.
                      </>
                    )}
                  </p>
                  <dl class="component-api-default">
                    <dt
                      data-tooltip={
                        isRequirement
                          ? "Required by this example; check the source type for required props."
                          : "Documented value or built-in behavior; confirm against your installed version."
                      }
                    >
                      {isRequirement ? "Usage requirement" : "Default"}
                    </dt>
                    <dd>
                      {isRequirement ? <span>Required</span> : <code>{row.defaultValue}</code>}
                    </dd>
                  </dl>
                </>
              ),
            };
          })}
        />
      </div>
    );
  }
  return (
    <div class="docs-api-reference" key={section.title}>
      <h3 id={id} tabIndex={-1}>
        <BlockHeadingLink id={id}>{section.title}</BlockHeadingLink>
      </h3>
      {section.description ? <p class="docs-copy">{section.description}</p> : null}
      <div class="docs-api-table-wrap">
        <table class="docs-api-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => (
              <tr key={`${section.title}-${row.prop}`}>
                <td data-label="Prop">
                  <code>{row.prop}</code>
                </td>
                <td data-label="Type">
                  <code>{row.type}</code>
                </td>
                <td data-label="Default">
                  <code>{row.defaultValue}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const ApiReference = ({ sections }: ApiReferenceProps) => (
  <div class="docs-api-reference-group">
    {sections.map((section) => (
      <ApiReferenceTable key={section.title} section={section} />
    ))}
  </div>
);

export type { ApiReferenceRow, ApiReferenceSection };
