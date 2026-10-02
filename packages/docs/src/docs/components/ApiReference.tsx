import { useContext, useId } from "preact/hooks";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";

import { BlockPropsTable } from "../../blocks/detail/BlockPropsTable";
import { ComponentTypeRevealContext } from "./component-detail/ComponentApiSection";
import { componentApiOwner, componentTypeId } from "./component-detail/component-api";
import { ComponentExamplesContext } from "./component-detail/component-examples";

type ApiReferenceRow = {
  prop: string;
  type: string;
  defaultValue: string;
  description?: string;
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
    const owner = componentApiOwner(collection.doc.slug, section.title);
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
            const field = owner?.fields.find(({ name }) => name === row.prop.replace(/\?$/, ""));
            return {
              key: row.prop,
              name: row.prop,
              type: row.type,
              required: field?.required ?? false,
              owner: owner ? (
                <a
                  class="blocks-api-field-owner"
                  href={`#${componentTypeId(owner)}`}
                  onClick={() => reveal?.(componentTypeId(owner))}
                >
                  {owner.name}
                </a>
              ) : undefined,
              description: (
                <>
                  <p>
                    {row.description ||
                      field?.description ||
                      `Documented ${row.prop} option for ${section.title}. Check its type alongside the usage examples before supplying a value.`}
                  </p>
                  <p class="component-api-default">
                    <span>Documented default</span>
                    <code>{row.defaultValue}</code>
                    {row.defaultValue === "undefined" && <span>No default value is listed.</span>}
                  </p>
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
