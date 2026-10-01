import { useId } from "preact/hooks";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";

type ApiReferenceRow = {
  prop: string;
  type: string;
  defaultValue: string;
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
