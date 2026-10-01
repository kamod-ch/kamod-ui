/** Shared two-column API table, with scroll containment and contextual requirement markers. */
import type { ComponentChildren } from "preact";
import { RequiredIndicator } from "../RequiredIndicator";

/** Rich cells keep source-specific links and explanations in the owning guide. */
export type BlockPropRow = {
  key: string;
  name: string;
  type: ComponentChildren;
  required: boolean;
  description: ComponentChildren;
  owner?: ComponentChildren;
};

export function BlockPropsTable({
  labelledBy,
  caption,
  rows,
  requiredKind = "prop",
}: {
  labelledBy: string;
  caption: string;
  rows: readonly BlockPropRow[];
  requiredKind?: "prop" | "field";
}) {
  return (
    <div
      class="blocks-doc-table blocks-api-props-table"
      role="region"
      aria-labelledby={labelledBy}
      tabIndex={0}
    >
      <table>
        <caption class="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Prop / type</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row">
                <div class="blocks-api-prop-label">
                  <code>{row.name}</code>
                  {row.required && (
                    <RequiredIndicator
                      label={`Required ${requiredKind}: ${row.name}`}
                      tooltip={requiredKind === "field" ? "Required field" : undefined}
                    />
                  )}
                </div>
                <span class="blocks-api-prop-type">{row.type}</span>
                {row.owner}
              </th>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
