import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@kamod-ch/ui";
import { renderToString } from "preact-render-to-string";
import type { GuideTableRenderer } from "../../blocks/guides/guide-markdown";

/** Keep decisions in two readable columns, pairing an action with its supporting guidance. */
export const renderEcosystemReferenceTable: GuideTableRenderer = (table, inline) => {
  const isChecklist = table.header[0]?.text === "Check";
  return renderToString(
    <Table
      class="blocks-doc-table ecosystem-reference-table"
      role="region"
      aria-label={isChecklist ? "Integration checks" : "Choose a starting point"}
    >
      <TableHeader>
        <TableRow>
          <TableHead scope="col">{table.header[0].text}</TableHead>
          <TableHead scope="col">
            {isChecklist ? "What to verify" : "Recommended starting point"}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {table.rows.map(([label, action, detail], index) => (
          <TableRow key={index}>
            <TableHead scope="row" dangerouslySetInnerHTML={{ __html: inline(label.tokens) }} />
            <TableCell>
              <div
                class="ecosystem-reference-action"
                dangerouslySetInnerHTML={{ __html: inline(action.tokens) }}
              />
              <div class="ecosystem-reference-detail">
                <span class="ecosystem-reference-label">
                  {isChecklist ? "Look for" : "When needed"}
                  <span aria-hidden="true"> · </span>
                </span>
                <span dangerouslySetInnerHTML={{ __html: inline(detail.tokens) }} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>,
  );
};
