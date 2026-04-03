import {
  DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";
import { PaymentsDataTableDemo, paymentRows, type Payment } from "./data-table-payments-demo";

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
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p.amount)}
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
      title: "Payments demo",
      text: "End-to-end example aligned with the shadcn data-table guide (filter, columns menu, sorting, actions, selection, pagination). Source: `data-table-payments-demo.tsx`.",
      code: `import { PaymentsDataTableDemo } from "./data-table-payments-demo";

export const Example = () => <PaymentsDataTableDemo />;`,
      renderPreview: () => <PaymentsDataTableDemo />
    },
    {
      id: "basic-table",
      title: "Basic table",
      text: "Static headers and mapped rows — starting point before adding sorting and filters.",
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
      renderPreview: () => <BasicPaymentsTablePreview />
    },
    {
      id: "empty-state",
      title: "Empty state",
      text: "Single body row with `colSpan` when there are no records.",
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
      renderPreview: () => <EmptyTablePreview />
    }
  ],
  apiRows: [
    { prop: "chrome", type: "boolean", defaultValue: "true" },
    { prop: "class", type: "string", defaultValue: "undefined" },
    { prop: "children", type: "Table sections", defaultValue: "required" },
    { prop: "data-slot", type: '"data-table"', defaultValue: '"data-table"' }
  ],
  accessibilityText:
    "Use `<th scope=\"col\">` via `TableHead` for headers, keep row actions reachable by keyboard (Dropdown trigger), and expose selection with `aria-label` on checkboxes. Announce filter/pagination changes when wiring live regions in product code."
});
