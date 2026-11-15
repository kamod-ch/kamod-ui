import {
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const CheckboxDemoPreview = () => (
  <FieldGroup class="w-full max-w-sm">
    <Field orientation="horizontal">
      <Checkbox id="terms-checkbox-doc" name="terms-checkbox-doc" />
      <FieldLabel htmlFor="terms-checkbox-doc">Accept terms and conditions</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <Checkbox id="terms-checkbox-2-doc" name="terms-checkbox-2-doc" defaultChecked />
      <FieldContent>
        <FieldLabel htmlFor="terms-checkbox-2-doc">Accept terms and conditions</FieldLabel>
        <FieldDescription>By clicking this checkbox, you agree to the terms.</FieldDescription>
      </FieldContent>
    </Field>
    <Field orientation="horizontal" data-disabled="">
      <Checkbox id="toggle-checkbox-doc" name="toggle-checkbox-doc" disabled />
      <FieldLabel htmlFor="toggle-checkbox-doc">Enable notifications</FieldLabel>
    </Field>
    <FieldLabel class="grid w-full max-w-sm gap-2">
      <Field orientation="horizontal" class="w-full min-w-0">
        <Checkbox id="toggle-checkbox-2-doc" name="toggle-checkbox-2-doc" />
        <FieldContent>
          <FieldTitle>Enable Notifications</FieldTitle>
          <FieldDescription>You can enable or disable notifications at any time.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldLabel>
  </FieldGroup>
);

const CheckboxInvalidPreview = () => (
  <FieldGroup class="mx-auto w-56">
    <Field orientation="horizontal" data-invalid="">
      <Checkbox id="terms-checkbox-invalid-doc" name="terms-checkbox-invalid-doc" aria-invalid />
      <FieldLabel htmlFor="terms-checkbox-invalid-doc">Accept terms and conditions</FieldLabel>
    </Field>
  </FieldGroup>
);

const CheckboxGroupPreview = () => (
  <FieldSet>
    <FieldLegend variant="label">Show these items on the desktop:</FieldLegend>
    <FieldDescription>Select the items you want to show on the desktop.</FieldDescription>
    <FieldGroup class="gap-3">
      <Field orientation="horizontal">
        <Checkbox id="finder-hard-doc" name="finder-hard-doc" defaultChecked />
        <FieldLabel class="font-normal" htmlFor="finder-hard-doc">
          Hard disks
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="finder-ext-doc" name="finder-ext-doc" defaultChecked />
        <FieldLabel class="font-normal" htmlFor="finder-ext-doc">
          External disks
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="finder-cd-doc" name="finder-cd-doc" />
        <FieldLabel class="font-normal" htmlFor="finder-cd-doc">
          CDs, DVDs, and iPods
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="finder-srv-doc" name="finder-srv-doc" />
        <FieldLabel class="font-normal" htmlFor="finder-srv-doc">
          Connected servers
        </FieldLabel>
      </Field>
    </FieldGroup>
  </FieldSet>
);

const tableData = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@example.com", role: "Admin" },
  { id: "2", name: "Marcus Rodriguez", email: "marcus.rodriguez@example.com", role: "User" },
  { id: "3", name: "Priya Patel", email: "priya.patel@example.com", role: "User" },
  { id: "4", name: "David Kim", email: "david.kim@example.com", role: "Editor" },
];

const CheckboxTablePreview = () => {
  const [selectedRows, setSelectedRows] = useState(() => new Set<string>(["1"]));
  const headerChecked: boolean | "indeterminate" =
    selectedRows.size === 0
      ? false
      : selectedRows.size === tableData.length
        ? true
        : "indeterminate";

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true || checked === "indeterminate") {
      setSelectedRows(new Set(tableData.map((row) => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const next = new Set(selectedRows);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedRows(next);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-10">
            <Checkbox
              id="select-all-checkbox-doc"
              name="select-all-checkbox-doc"
              checked={headerChecked}
              onCheckedChange={handleSelectAll}
              aria-label="Select all"
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((row) => (
          <TableRow key={row.id} data-state={selectedRows.has(row.id) ? "selected" : undefined}>
            <TableCell>
              <Checkbox
                id={`row-${row.id}-checkbox-doc`}
                name={`row-${row.id}-checkbox-doc`}
                checked={selectedRows.has(row.id)}
                onCheckedChange={(c) => handleSelectRow(row.id, c === true)}
                aria-label={`Select ${row.name}`}
              />
            </TableCell>
            <TableCell class="font-medium">{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const CheckboxControlledPreview = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div class="flex flex-col gap-2">
      <Checkbox
        id="cb-controlled-doc"
        checked={checked}
        onCheckedChange={(c) => setChecked(c === true)}
        aria-label="Controlled demo"
      />
      <span class="text-muted-foreground text-sm">{checked ? "Checked" : "Unchecked"}</span>
    </div>
  );
};

const CheckboxIndeterminatePreview = () => {
  const [v, setV] = useState<boolean | "indeterminate">("indeterminate");
  return (
    <div class="flex flex-col gap-2">
      <Checkbox
        id="cb-ind-doc"
        checked={v}
        onCheckedChange={setV}
        aria-label="Indeterminate demo"
      />
      <button
        type="button"
        class="text-muted-foreground text-sm underline"
        onClick={() => setV("indeterminate")}
      >
        Reset to indeterminate
      </button>
    </div>
  );
};

export const checkboxDocPage = createGenericDocPage({
  slug: "checkbox",
  generatedApi: true,
  title: "Checkbox",
  previewCode: `import { Checkbox } from "@/components/kamod-ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/kamod-ui/field";

export const Example = () => (
  <FieldGroup class="w-full max-w-sm">
    <Field orientation="horizontal">
      <Checkbox id="terms" name="terms" />
      <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
    </Field>
    {/* … */}
  </FieldGroup>
);`,
  usageLabel:
    "Native checkbox with custom indicator, checked / indeterminate, onCheckedChange, Field integration — shadcn-aligned examples.",
  installationText: "Import Checkbox from `@/components/kamod-ui/checkbox`.",
  usageText:
    'Use `defaultChecked` or `checked` with `onCheckedChange`. `checked` may be `true`, `false`, or `"indeterminate"`.',
  exampleSections: [
    {
      id: "checkbox-demo",
      title: "Demo",
      text: "Compose several independent choices with [Field](/docs/field/installation), including a description and a disabled option.",
      code: `// See hero previewCode — Field + Checkbox + FieldContent / FieldTitle.`,
      renderPreview: () => <CheckboxDemoPreview />,
    },
    {
      id: "checkbox-controlled",
      title: "Checked State",
      text: "Pass `checked` and `onCheckedChange` when another part of the screen needs the same boolean.",
      code: `import { useState } from "preact/hooks";
import { Checkbox } from "@/components/kamod-ui/checkbox";

export const Example = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Toggle" />;
};`,
      renderPreview: () => <CheckboxControlledPreview />,
    },
    {
      id: "checkbox-indeterminate",
      title: "Indeterminate",
      text: 'Use `checked="indeterminate"` for a mixed group, and decide what activating it does to the children.',
      code: `import { useState } from "preact/hooks";
import { Checkbox } from "@/components/kamod-ui/checkbox";

export const Example = () => {
  const [v, setV] = useState<boolean | "indeterminate">("indeterminate");
  return <Checkbox checked={v} onCheckedChange={setV} />;
};`,
      renderPreview: () => <CheckboxIndeterminatePreview />,
    },
    {
      id: "checkbox-invalid",
      title: "Invalid",
      text: "Set `data-invalid` on Field and `aria-invalid` on Checkbox so the error reaches the control.",
      code: `import { Checkbox } from "@/components/kamod-ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/kamod-ui/field";

export const Example = () => (
  <FieldGroup class="w-56">
    <Field orientation="horizontal" data-invalid="">
      <Checkbox id="inv" aria-invalid />
      <FieldLabel htmlFor="inv">Accept terms</FieldLabel>
    </Field>
  </FieldGroup>
);`,
      renderPreview: () => <CheckboxInvalidPreview />,
    },
    {
      id: "checkbox-group",
      title: "Group",
      text: "Name the set with FieldSet and FieldLegend. Each choice keeps its own label, unlike [Radio Group](/docs/radio-group/installation).",
      code: `// FieldSet + FieldLegend variant="label" + FieldDescription`,
      renderPreview: () => <CheckboxGroupPreview />,
    },
    {
      id: "checkbox-table",
      title: "Table",
      text: "Derive the header checkbox from selected row ids, and decide whether select-all covers this page or the whole set.",
      code: `// Checkbox in header + rows; Set<string> for selected ids`,
      renderPreview: () => <CheckboxTablePreview />,
    },
  ],
  apiRows: [
    { prop: "checked", type: 'boolean | "indeterminate"', defaultValue: "uncontrolled" },
    { prop: "defaultChecked", type: 'boolean | "indeterminate"', defaultValue: "false" },
    { prop: "onCheckedChange", type: "(checked) => void", defaultValue: "—" },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
    { prop: "aria-invalid", type: "boolean", defaultValue: "false" },
    { prop: "…", type: "native input attrs", defaultValue: "id, name, class, …" },
  ],
  accessibilityText:
    "Prefer visible labels with htmlFor or aria-label on icon-only table checkboxes. aria-checked reflects mixed for indeterminate.",
});
