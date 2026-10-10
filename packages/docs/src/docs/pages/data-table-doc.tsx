import { DataTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";
import { type Payment, PaymentsDataTableDemo, paymentRows } from "./data-table-payments-demo";

const BasicPaymentsTablePreview = () => (
  <DataTable chrome>
    <TableHeader>
      <TableRow>
        <TableHead>Status</TableHead>
        <TableHead>Email</TableHead>
        <TableHead class="text-end">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {paymentRows.map((p: Payment) => (
        <TableRow key={p.id}>
          <TableCell class="capitalize">{p.status}</TableCell>
          <TableCell class="lowercase">{p.email}</TableCell>
          <TableCell class="text-end font-medium tabular-nums">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
              p.amount,
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </DataTable>
);

const EmptyTablePreview = () => (
  <DataTable chrome>
    <TableHeader>
      <TableRow>
        <TableHead>Status</TableHead>
        <TableHead>Email</TableHead>
        <TableHead class="text-end">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell colSpan={3} class="h-24 text-center text-muted-foreground">
          No results.
        </TableCell>
      </TableRow>
    </TableBody>
  </DataTable>
);

export const dataTableDocPage = createGenericDocPage({
  slug: "data-table",
  title: "Data Table",
  previewCode: `import { PaymentsDataTableDemo } from "./data-table-payments-demo";

export const Example = () => <PaymentsDataTableDemo />;`,
  usageLabel:
    "Data tables pair `Table` primitives with app state (sorting, filters, pagination). `DataTable` adds the bordered shell from shadcn; full grids are composed in your app or demo.",
  installationText:
    "Use `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` from `@/components/kamod-ui/data-table`. Optional: `DataTable` wraps the table in `overflow-hidden rounded-md border`. The official shadcn guide uses `@tanstack/react-table` (React); this Preact demo implements the same UX with local state — you can adopt TanStack in a React app following https://ui.shadcn.com/docs/components/radix/data-table",
  usageText:
    "`PaymentsDataTableDemo` (below) matches the documented flow: column toolbar (email filter + column visibility), sortable email header, currency amount, row actions `Dropdown`, checkboxes with header indeterminate state, selected count, and prev/next pagination. Set `chrome={false}` on `DataTable` if you provide your own border.",
  exampleSections: [
    {
      id: "full-demo",
      title: "Payments Demo",
      text: "**Follow How the Table Features Interact.** The payments example combines filtering, sorting, column visibility, row selection and pagination around the same records. Read `data-table-payments-demo.tsx` to see how those states work together before copying only the visible table markup.\n\nUse stable record identifiers, define the scope of bulk actions, and replace demonstration handlers with your own data-loading and mutation logic before shipping.",
      code: `import { PaymentsDataTableDemo } from "./data-table-payments-demo";

export const Example = () => <PaymentsDataTableDemo />;`,
      renderPreview: () => <PaymentsDataTableDemo />,
    },
    {
      id: "basic-table",
      title: "Basic Table",
      text: "**Build the Readable Structure First.** Start with static column headings and mapped rows when the task only needs a readable record list. This establishes the relationship between each header and cell before adding stateful sorting, filtering or pagination.\n\nKeep actions in clearly named controls, provide stable row keys, and compare [Table](/docs/table/installation) when a static dataset does not need a larger table-state abstraction.",
      code: `import { DataTable } from "@/components/kamod-ui/data-table"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/kamod-ui/table";
import { paymentRows } from "./data-table-payments-demo";

export const Example = () => (
  <DataTable chrome>
    <TableHeader>
      <TableRow>
        <TableHead>Status</TableHead>
        <TableHead>Email</TableHead>
        <TableHead class="text-end">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {paymentRows.map((p) => (
        <TableRow key={p.id}>
          <TableCell class="capitalize">{p.status}</TableCell>
          <TableCell class="lowercase">{p.email}</TableCell>
          <TableCell class="text-end font-medium tabular-nums">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p.amount)}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </DataTable>
);`,
      renderPreview: () => <BasicPaymentsTablePreview />,
    },
    {
      id: "empty-state",
      title: "Empty State",
      text: "**Explain Why There Are No Rows.** Render one body row with a spanning `colSpan` cell when there are no records to display. The table headers remain visible, while the message explains whether the collection is empty or the current filter found nothing.\n\nSpan the full set of visible columns, offer an appropriate next step, and keep the table's surrounding controls useful for recovering results.",
      code: `import { DataTable } from "@/components/kamod-ui/data-table"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/kamod-ui/table";

export const Example = () => (
  <DataTable chrome>
    <TableHeader>...</TableHeader>
    <TableBody>
      <TableRow>
        <TableCell colSpan={3} class="h-24 text-center text-muted-foreground">
          No results.
        </TableCell>
      </TableRow>
    </TableBody>
  </DataTable>
);`,
      renderPreview: () => <EmptyTablePreview />,
    },
  ],
  apiRows: [
    { prop: "chrome", type: "boolean", defaultValue: "true" },
    { prop: "class", type: "string", defaultValue: "undefined" },
    { prop: "children", type: "Table sections", defaultValue: "required" },
    { prop: "data-slot", type: '"data-table"', defaultValue: '"data-table"' },
  ],
  accessibilityText:
    'Use `<th scope="col">` via `TableHead` for headers, keep row actions reachable by keyboard (Dropdown trigger), and expose selection with `aria-label` on checkboxes. Announce filter/pagination changes when wiring live regions in product code.',
});
