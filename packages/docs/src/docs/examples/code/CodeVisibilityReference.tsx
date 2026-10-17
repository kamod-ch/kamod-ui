import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kamod-ch/ui/table";
import { InlineCodeLink } from "../../components/InlineCodeLink";

const options = [
  {
    option: "showToolbar={false}",
    purpose: "A source-only, headerless panel",
    href: "#code-toolbar-composition",
    description: (
      <>
        <strong>Reading controls stay above the source.</strong> The file label and Copy action
        disappear with the header.
      </>
    ),
  },
  {
    option: "showCopy={false}",
    purpose: "Remove the clipboard action",
    href: "#copy-and-content",
    description: (
      <>
        <strong>The header and reading controls stay.</strong> Readers can still select the source
        themselves.
      </>
    ),
  },
  {
    option: "showImportControl={false}",
    purpose: "Keep every import visible",
    href: "#code-folding-rules",
    description: (
      <>
        <strong>The complete source stays visible.</strong> This also disables import folding; Copy
        continues to include every declaration.
      </>
    ),
  },
  {
    option: "showWrapControl={false}",
    purpose: "Keep the wrapping choice fixed",
    href: "#code-wrapping-rules",
    description: (
      <>
        <strong>Your wrapping choice still applies.</strong> Choose the layout with{" "}
        <InlineCodeLink href="#code-controlled-preferences" size="compact">
          defaultWrapped
        </InlineCodeLink>{" "}
        or controlled{" "}
        <InlineCodeLink href="#code-controlled-preferences" size="compact">
          wrapped
        </InlineCodeLink>
        .
      </>
    ),
  },
  {
    option: "highlight={false}",
    purpose: "Read the source without syntax colors",
    href: "#code-lazy-highlighting",
    description: (
      <>
        <strong>Only the syntax colors change.</strong> Language metadata, reading controls, source
        selection and exact copying remain available.
      </>
    ),
  },
] as const;

/** Reuse the API-table surface and native table semantics for visibility choices. */
export function CodeVisibilityReference() {
  return (
    <Table
      class="blocks-doc-table code-parts-reference-table"
      role="region"
      aria-label="Code visibility reference"
      tabIndex={0}
    >
      <TableCaption class="sr-only">
        Code visibility options and what remains available
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Option / purpose</TableHead>
          <TableHead scope="col">What stays</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {options.map(({ option, purpose, href, description }) => (
          <TableRow key={option}>
            <TableHead scope="row">
              <InlineCodeLink href={href} size="compact">
                {option}
              </InlineCodeLink>
              <span class="code-parts-reference-purpose">{purpose}</span>
            </TableHead>
            <TableCell>{description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
