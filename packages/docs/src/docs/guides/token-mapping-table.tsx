import type { Tokens } from "marked";
import { renderToString } from "preact-render-to-string";
import type { GuideTableRenderer } from "../../blocks/guides/guide-markdown";

const headers = ["Repository path", "Design variable", "Type", "Brand", "Mode"];

/** Name the handoff table. Other tables in the same guide keep the default renderer. */
export const renderTokenMappingTable: GuideTableRenderer = (table, inline) => {
  if (table.header.length !== headers.length) return;
  if (table.header.some((cell, index) => cell.text !== headers[index])) return;
  const cell = (source: Tokens.TableCell, index: number) => (
    <td key={index} dangerouslySetInnerHTML={{ __html: inline(source.tokens) }} />
  );
  return renderToString(
    <div class="block-guide-table">
      <table>
        <caption>Zuordnung</caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.map((entry) => entry.text).join("\u0000")}>
              {row.map((entry, index) => cell(entry, index))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
  );
};
