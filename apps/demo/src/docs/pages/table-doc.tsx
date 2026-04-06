import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const tableDocPage = createGenericDocPage({
  slug: "table",
  title: "Table",
  usageLabel: "A responsive, modern table primitive for structured data with semantic markup.",
  installationText: "Import Table primitives from `@/components/kamod-ui/table`.",
  usageText:
    "Use TableHeader/TableBody/TableFooter and align numeric data to the right for better scanability.",
  exampleSections: [
    {
      id: "invoice-table",
      title: "Invoice Table",
      text: "A modern invoice table with status, payment method, and right-aligned amounts.",
      code: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/kamod-ui/table";

export const Example = () => (
  <Table class="w-full max-w-2xl">
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[100px]">Invoice</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Method</TableHead>
        <TableHead class="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow><TableCell class="font-medium">INV001</TableCell><TableCell>Paid</TableCell><TableCell>Credit Card</TableCell><TableCell class="text-right">$250.00</TableCell></TableRow>
      <TableRow><TableCell class="font-medium">INV002</TableCell><TableCell>Pending</TableCell><TableCell>PayPal</TableCell><TableCell class="text-right">$150.00</TableCell></TableRow>
      <TableRow><TableCell class="font-medium">INV003</TableCell><TableCell>Unpaid</TableCell><TableCell>Bank Transfer</TableCell><TableCell class="text-right">$350.00</TableCell></TableRow>
    </TableBody>
  </Table>
);`,
      renderPreview: () => (
        <Table class="w-full max-w-2xl">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead class="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell class="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell class="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">INV002</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>PayPal</TableCell>
              <TableCell class="text-right">$150.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">INV003</TableCell>
              <TableCell>Unpaid</TableCell>
              <TableCell>Bank Transfer</TableCell>
              <TableCell class="text-right">$350.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
    },
    {
      id: "table-footer",
      title: "Table Footer",
      text: "Use a footer row for totals and quick financial summaries.",
      code: `import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHeader, TableHead, TableRow } from "@/components/kamod-ui/table";

export const Example = () => (
  <Table class="w-full max-w-2xl">
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Method</TableHead>
        <TableHead class="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow><TableCell class="font-medium">INV001</TableCell><TableCell>Paid</TableCell><TableCell>Credit Card</TableCell><TableCell class="text-right">$250.00</TableCell></TableRow>
      <TableRow><TableCell class="font-medium">INV002</TableCell><TableCell>Pending</TableCell><TableCell>PayPal</TableCell><TableCell class="text-right">$150.00</TableCell></TableRow>
      <TableRow><TableCell class="font-medium">INV003</TableCell><TableCell>Unpaid</TableCell><TableCell>Bank Transfer</TableCell><TableCell class="text-right">$350.00</TableCell></TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell class="font-medium">Total</TableCell>
        <TableCell />
        <TableCell />
        <TableCell class="text-right">$750.00</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
);`,
      renderPreview: () => (
        <Table class="w-full max-w-2xl">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead class="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell class="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell class="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">INV002</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>PayPal</TableCell>
              <TableCell class="text-right">$150.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">INV003</TableCell>
              <TableCell>Unpaid</TableCell>
              <TableCell>Bank Transfer</TableCell>
              <TableCell class="text-right">$350.00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell class="font-medium">Total</TableCell>
              <TableCell />
              <TableCell />
              <TableCell class="text-right">$750.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ),
    },
    {
      id: "table-actions",
      title: "Table Actions",
      text: "Add contextual row actions with a compact dropdown menu.",
      code: `import { Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownSeparator, DropdownTrigger } from "@/components/kamod-ui/dropdown"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/kamod-ui/table";

export const Example = () => (
  <Table class="w-full max-w-2xl">
    <TableHeader>
      <TableRow>
        <TableHead>Product</TableHead>
        <TableHead class="text-right">Price</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell class="font-medium">Wireless Mouse</TableCell>
        <TableCell class="text-right">$29.99</TableCell>
        <TableCell class="text-right">
          <Dropdown>
            <DropdownTrigger class="inline-flex h-7 items-center justify-center rounded-md border border-input bg-background px-2 text-xs font-medium hover:bg-muted">
              Open menu
            </DropdownTrigger>
            <DropdownContent class="min-w-40">
              <DropdownLabel>Actions</DropdownLabel>
              <DropdownItem>View details</DropdownItem>
              <DropdownItem>Edit product</DropdownItem>
              <DropdownSeparator />
              <DropdownItem>Archive</DropdownItem>
            </DropdownContent>
          </Dropdown>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);`,
      renderPreview: () => (
        <Table class="w-full max-w-2xl">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead class="text-right">Price</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell class="font-medium">Wireless Mouse</TableCell>
              <TableCell class="text-right">$29.99</TableCell>
              <TableCell class="text-right">
                <Dropdown>
                  <DropdownTrigger class="inline-flex h-7 items-center justify-center rounded-md border border-input bg-background px-2 text-xs font-medium hover:bg-muted">
                    Open menu
                  </DropdownTrigger>
                  <DropdownContent class="min-w-40">
                    <DropdownLabel>Actions</DropdownLabel>
                    <DropdownItem>View details</DropdownItem>
                    <DropdownItem>Edit product</DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem>Archive</DropdownItem>
                  </DropdownContent>
                </Dropdown>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Mechanical Keyboard</TableCell>
              <TableCell class="text-right">$129.99</TableCell>
              <TableCell class="text-right">
                <Dropdown>
                  <DropdownTrigger class="inline-flex h-7 items-center justify-center rounded-md border border-input bg-background px-2 text-xs font-medium hover:bg-muted">
                    Open menu
                  </DropdownTrigger>
                  <DropdownContent class="min-w-40">
                    <DropdownLabel>Actions</DropdownLabel>
                    <DropdownItem>View details</DropdownItem>
                    <DropdownItem>Edit product</DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem>Archive</DropdownItem>
                  </DropdownContent>
                </Dropdown>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">USB-C Hub</TableCell>
              <TableCell class="text-right">$49.99</TableCell>
              <TableCell class="text-right">
                <Dropdown>
                  <DropdownTrigger class="inline-flex h-7 items-center justify-center rounded-md border border-input bg-background px-2 text-xs font-medium hover:bg-muted">
                    Open menu
                  </DropdownTrigger>
                  <DropdownContent class="min-w-40">
                    <DropdownLabel>Actions</DropdownLabel>
                    <DropdownItem>View details</DropdownItem>
                    <DropdownItem>Edit product</DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem>Archive</DropdownItem>
                  </DropdownContent>
                </Dropdown>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
    },
  ],
  apiRows: [
    {
      prop: "Table children",
      type: "TableHeader/TableBody/... primitives",
      defaultValue: "required",
    },
    { prop: "TableCaption", type: "caption element", defaultValue: "optional" },
    { prop: "TableFooter", type: "footer section", defaultValue: "optional" },
    { prop: "class", type: "string", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Use concise header labels, preserve semantic table structure, and keep meaningful caption/footer content so assistive technologies can map row and column relationships.",
});
