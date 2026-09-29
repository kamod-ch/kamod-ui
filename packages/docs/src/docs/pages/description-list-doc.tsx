import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DescriptionList,
  DescriptionListDetails,
  DescriptionListItem,
  DescriptionListTerm,
} from "@kamod-ch/ui";
import { Copy, Pencil } from "lucide-preact";
import { createGenericDocPage } from "./create-generic-doc-page";

const USAGE_SNIPPET = `import {
  DescriptionList,
  DescriptionListDetails,
  DescriptionListItem,
  DescriptionListTerm,
} from "@/components/kamod-ui/description-list";

export const Example = () => (
  <DescriptionList bordered layout="inline">
    <DescriptionListItem>
      <DescriptionListTerm>Customer</DescriptionListTerm>
      <DescriptionListDetails>Ada Lovelace</DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>Email</DescriptionListTerm>
      <DescriptionListDetails>ada@example.com</DescriptionListDetails>
    </DescriptionListItem>
  </DescriptionList>
);`;

const CustomerProfilePreview = () => (
  <DescriptionList bordered layout="inline" class="max-w-lg">
    <DescriptionListItem>
      <DescriptionListTerm>Customer</DescriptionListTerm>
      <DescriptionListDetails class="flex items-center gap-2">
        <Avatar class="size-7">
          <AvatarImage src="https://avatar.vercel.sh/ada" alt="" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <span>Ada Lovelace</span>
      </DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>Email</DescriptionListTerm>
      <DescriptionListDetails>ada.lovelace@analytical-engine.io</DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>Plan</DescriptionListTerm>
      <DescriptionListDetails>Enterprise</DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>Since</DescriptionListTerm>
      <DescriptionListDetails>March 2024</DescriptionListDetails>
    </DescriptionListItem>
  </DescriptionList>
);

const InvoicePreview = () => (
  <DescriptionList bordered layout="stacked" class="max-w-md">
    <DescriptionListItem>
      <DescriptionListTerm>Invoice</DescriptionListTerm>
      <DescriptionListDetails>INV-2026-10482</DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>Status</DescriptionListTerm>
      <DescriptionListDetails>
        <Badge variant="success">Paid</Badge>
      </DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>Amount</DescriptionListTerm>
      <DescriptionListDetails>
        {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(1284.5)}
      </DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>Due date</DescriptionListTerm>
      <DescriptionListDetails>—</DescriptionListDetails>
    </DescriptionListItem>
  </DescriptionList>
);

const TechnicalPreview = () => (
  <DescriptionList bordered layout="inline" class="max-w-xl">
    <DescriptionListItem>
      <DescriptionListTerm>Resource ID</DescriptionListTerm>
      <DescriptionListDetails class="flex min-w-0 items-start gap-2">
        <code class="min-w-0 flex-1 font-mono text-xs">
          org_01j9x4k2m8n0p3q5r7s9t1v3w5y7z9a1b3c5d7e9f0
        </code>
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          aria-label="Copy resource ID"
          onClick={() => {}}
        >
          <Copy />
        </Button>
      </DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>Region</DescriptionListTerm>
      <DescriptionListDetails>eu-central-1</DescriptionListDetails>
    </DescriptionListItem>
  </DescriptionList>
);

const TwoColumnPreview = () => (
  <DescriptionList bordered layout="stacked" columns={2} class="max-w-3xl">
    <DescriptionListItem>
      <DescriptionListTerm>Company</DescriptionListTerm>
      <DescriptionListDetails>Analytical Engine GmbH</DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>VAT ID</DescriptionListTerm>
      <DescriptionListDetails>DE123456789</DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>Billing email</DescriptionListTerm>
      <DescriptionListDetails>billing@analytical-engine.io</DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>Support tier</DescriptionListTerm>
      <DescriptionListDetails>Priority</DescriptionListDetails>
    </DescriptionListItem>
  </DescriptionList>
);

const EditActionPreview = () => (
  <DescriptionList bordered layout="inline" class="max-w-lg">
    <DescriptionListItem>
      <DescriptionListTerm>Display name</DescriptionListTerm>
      <DescriptionListDetails class="flex min-w-0 items-center justify-between gap-3">
        <span class="min-w-0">Ada Lovelace</span>
        <Button type="button" variant="ghost" size="xs">
          <Pencil data-icon="inline-start" />
          Edit
        </Button>
      </DescriptionListDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionListTerm>Timezone</DescriptionListTerm>
      <DescriptionListDetails>Europe/Berlin</DescriptionListDetails>
    </DescriptionListItem>
  </DescriptionList>
);

export const descriptionListDocPage = createGenericDocPage({
  slug: "description-list",
  title: "Description List",
  usageLabel: "Description List",
  previewCode: USAGE_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/description-list`. The component renders a semantic `dl` with grouped `dt`/`dd` pairs for detail views.",
  installationExample: {
    code: USAGE_SNIPPET,
    renderPreview: CustomerProfilePreview,
  },
  usageText:
    'Description List composes label/value pairs for customer profiles, invoices, and technical metadata. Use `layout="stacked"` for terms above values or `layout="inline"` for side-by-side pairs from `sm` upward. Set `columns={2}` or `{3}` for multi-column grids that collapse to one column on small screens. Missing values are shown explicitly by the consumer — the component never invents placeholders beyond what you pass in.',
  exampleSections: [
    {
      id: "customer-profile",
      title: "Customer profile",
      text: "Inline layout with avatar in the value cell. Long emails wrap without breaking the grid.",
      code: USAGE_SNIPPET,
      renderPreview: CustomerProfilePreview,
    },
    {
      id: "invoice-details",
      title: "Invoice details with status badge",
      text: "Stacked layout for compact sections. Status uses `Badge`; missing due date is an explicit em dash from the consumer.",
      code: `import { Badge, DescriptionList, DescriptionListDetails, DescriptionListItem, DescriptionListTerm } from "@/components/kamod-ui/description-list";

export const Example = () => (
  <DescriptionList bordered layout="stacked">
    <DescriptionListItem>
      <DescriptionListTerm>Status</DescriptionListTerm>
      <DescriptionListDetails><Badge variant="success">Paid</Badge></DescriptionListDetails>
    </DescriptionListItem>
  </DescriptionList>
);`,
      renderPreview: InvoicePreview,
    },
    {
      id: "technical-id",
      title: "Technical details with long ID",
      text: "Values use `overflow-wrap: anywhere` for IDs and URLs. Copy actions are composed separately — no built-in clipboard logic.",
      code: `import { Button, DescriptionList, DescriptionListDetails, DescriptionListItem, DescriptionListTerm } from "@/components/kamod-ui/description-list";

export const Example = () => (
  <DescriptionList bordered layout="inline">
    <DescriptionListItem>
      <DescriptionListTerm>Resource ID</DescriptionListTerm>
      <DescriptionListDetails class="flex min-w-0 items-start gap-2">
        <code class="min-w-0 flex-1 font-mono text-xs">org_01j9x4k2m8n0p3q5r7s9t1v3w5y7z9a1b3c5d7e9f0</code>
        <Button type="button" variant="outline" size="icon-xs" aria-label="Copy resource ID">…</Button>
      </DescriptionListDetails>
    </DescriptionListItem>
  </DescriptionList>
);`,
      renderPreview: TechnicalPreview,
    },
    {
      id: "two-columns",
      title: "Responsive two-column grid",
      text: "`columns={2}` keeps one column on small screens and splits pairs across two columns from `md`.",
      code: `import { DescriptionList, DescriptionListDetails, DescriptionListItem, DescriptionListTerm } from "@/components/kamod-ui/description-list";

export const Example = () => (
  <DescriptionList bordered columns={2}>
    <DescriptionListItem>
      <DescriptionListTerm>Company</DescriptionListTerm>
      <DescriptionListDetails>Analytical Engine GmbH</DescriptionListDetails>
    </DescriptionListItem>
  </DescriptionList>
);`,
      renderPreview: TwoColumnPreview,
    },
    {
      id: "edit-action",
      title: "Edit action beside a value",
      text: "Actions live inside `DescriptionListDetails` — the list itself stays non-interactive.",
      code: `import { Button, DescriptionList, DescriptionListDetails, DescriptionListItem, DescriptionListTerm } from "@/components/kamod-ui/description-list";

export const Example = () => (
  <DescriptionList bordered layout="inline">
    <DescriptionListItem>
      <DescriptionListTerm>Display name</DescriptionListTerm>
      <DescriptionListDetails class="flex min-w-0 items-center justify-between gap-3">
        <span>Ada Lovelace</span>
        <Button type="button" variant="ghost" size="xs">Edit</Button>
      </DescriptionListDetails>
    </DescriptionListItem>
  </DescriptionList>
);`,
      renderPreview: EditActionPreview,
    },
  ],
  apiRows: [
    { prop: "layout", type: '"stacked" | "inline"', defaultValue: '"stacked"' },
    { prop: "columns", type: "1 | 2 | 3", defaultValue: "1" },
    { prop: "bordered", type: "boolean", defaultValue: "false" },
    { prop: "DescriptionListItem", type: "HTMLDivElement props", defaultValue: "—" },
    { prop: "DescriptionListTerm", type: "HTMLElement props (renders dt)", defaultValue: "—" },
    { prop: "DescriptionListDetails", type: "HTMLElement props (renders dd)", defaultValue: "—" },
  ],
  accessibilityText:
    "Native `dl`/`dt`/`dd` semantics expose term/value relationships to assistive tech without duplicating content in visually hidden nodes. Keep one term per value inside each item. When values include buttons or links, ensure each control has an accessible name. The root list does not add edit mode or click handlers.",
});
