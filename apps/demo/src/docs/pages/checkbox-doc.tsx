import { useState } from "preact/hooks";
import {
  Button,
  Checkbox,
  DirectionProvider,
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
  TableRow
} from "@kamod-ui/core";
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
          <FieldTitle>Enable notifications</FieldTitle>
          <FieldDescription>You can enable or disable notifications at any time.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldLabel>
  </FieldGroup>
);

const CheckboxBasicPreview = () => (
  <FieldGroup class="mx-auto w-56">
    <Field orientation="horizontal">
      <Checkbox id="terms-checkbox-basic-doc" name="terms-checkbox-basic-doc" />
      <FieldLabel htmlFor="terms-checkbox-basic-doc">Accept terms and conditions</FieldLabel>
    </Field>
  </FieldGroup>
);

const CheckboxDescriptionPreview = () => (
  <FieldGroup class="mx-auto w-72">
    <Field orientation="horizontal">
      <Checkbox id="terms-checkbox-desc-doc" name="terms-checkbox-desc-doc" defaultChecked />
      <FieldContent>
        <FieldLabel htmlFor="terms-checkbox-desc-doc">Accept terms and conditions</FieldLabel>
        <FieldDescription>By clicking this checkbox, you agree to the terms and conditions.</FieldDescription>
      </FieldContent>
    </Field>
  </FieldGroup>
);

const CheckboxDisabledPreview = () => (
  <FieldGroup class="mx-auto w-56">
    <Field orientation="horizontal" data-disabled="">
      <Checkbox id="toggle-checkbox-disabled-doc" name="toggle-checkbox-disabled-doc" disabled />
      <FieldLabel htmlFor="toggle-checkbox-disabled-doc">Enable notifications</FieldLabel>
    </Field>
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
  { id: "4", name: "David Kim", email: "david.kim@example.com", role: "Editor" }
];

const CheckboxTablePreview = () => {
  const [selectedRows, setSelectedRows] = useState(() => new Set<string>(["1"]));
  const headerChecked: boolean | "indeterminate" =
    selectedRows.size === 0 ? false : selectedRows.size === tableData.length ? true : "indeterminate";

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

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<
  Lang,
  {
    dir: "ltr" | "rtl";
    label: string;
    acceptTerms: string;
    acceptTermsDescription: string;
    enableNotifications: string;
    enableNotificationsDescription: string;
  }
> = {
  en: {
    dir: "ltr",
    label: "English (LTR)",
    acceptTerms: "Accept terms and conditions",
    acceptTermsDescription: "By clicking this checkbox, you agree to the terms.",
    enableNotifications: "Enable notifications",
    enableNotificationsDescription: "You can enable or disable notifications at any time."
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    acceptTerms: "قبول الشروط والأحكام",
    acceptTermsDescription: "بالنقر على هذا المربع، فإنك توافق على الشروط.",
    enableNotifications: "تفعيل الإشعارات",
    enableNotificationsDescription: "يمكنك تفعيل أو إلغاء تفعيل الإشعارات في أي وقت."
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    acceptTerms: "קבל תנאים והגבלות",
    acceptTermsDescription: "על ידי לחיצה על תיבת הסימון הזו, אתה מסכים לתנאים.",
    enableNotifications: "הפעל התראות",
    enableNotificationsDescription: "אתה יכול להפעיל או להשבית התראות בכל עת."
  }
};

const CheckboxRtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-md flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button key={key} variant={lang === key ? "default" : "outline"} size="sm" onClick={() => setLang(key)}>
            {rtlCopy[key].label}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={t.dir} class="w-full">
        <FieldGroup class="w-full max-w-sm" dir={t.dir}>
          <Field orientation="horizontal">
            <Checkbox id="terms-checkbox-rtl-doc" name="terms-checkbox-rtl-doc" />
            <FieldLabel htmlFor="terms-checkbox-rtl-doc">{t.acceptTerms}</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="terms-checkbox-2-rtl-doc" name="terms-checkbox-2-rtl-doc" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="terms-checkbox-2-rtl-doc">{t.acceptTerms}</FieldLabel>
              <FieldDescription>{t.acceptTermsDescription}</FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal" data-disabled="">
            <Checkbox id="toggle-checkbox-rtl-doc" name="toggle-checkbox-rtl-doc" disabled />
            <FieldLabel htmlFor="toggle-checkbox-rtl-doc">{t.enableNotifications}</FieldLabel>
          </Field>
          <FieldLabel class="grid w-full gap-2">
            <Field orientation="horizontal" class="w-full min-w-0">
              <Checkbox id="toggle-checkbox-2-rtl-doc" name="toggle-checkbox-2-rtl-doc" />
              <FieldContent>
                <FieldTitle>{t.enableNotifications}</FieldTitle>
                <FieldDescription>{t.enableNotificationsDescription}</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        </FieldGroup>
      </DirectionProvider>
    </div>
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
      <Checkbox id="cb-ind-doc" checked={v} onCheckedChange={setV} aria-label="Indeterminate demo" />
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
    "Use defaultChecked or checked with onCheckedChange. Pair with Field, FieldLabel, and data-disabled / data-invalid on Field for states. checked may be true, false, or \"indeterminate\" (minus icon, aria-checked=mixed).",
  exampleSections: [
    {
      id: "checkbox-demo",
      title: "Demo",
      text: "FieldGroup with FieldLabel, descriptions, disabled row, and nested FieldLabel (shadcn CheckboxDemo).",
      code: `// See hero previewCode — Field + Checkbox + FieldContent / FieldTitle.`,
      renderPreview: () => <CheckboxDemoPreview />
    },
    {
      id: "checkbox-usage",
      title: "Usage",
      text: "Minimal standalone checkbox.",
      code: `import { Checkbox } from "@/components/kamod-ui/checkbox";

export const Example = () => <Checkbox aria-label="Accept" />;`,
      renderPreview: () => <Checkbox aria-label="Accept" />
    },
    {
      id: "checkbox-controlled",
      title: "Checked state",
      text: "Controlled checked with onCheckedChange (boolean).",
      code: `import { useState } from "preact/hooks";
import { Checkbox } from "@/components/kamod-ui/checkbox";

export const Example = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Toggle" />;
};`,
      renderPreview: () => <CheckboxControlledPreview />
    },
    {
      id: "checkbox-indeterminate",
      title: "Indeterminate",
      text: "Tri-state: pass checked=\"indeterminate\" or toggle from mixed to checked via click.",
      code: `import { useState } from "preact/hooks";
import { Checkbox } from "@/components/kamod-ui/checkbox";

export const Example = () => {
  const [v, setV] = useState<boolean | "indeterminate">("indeterminate");
  return <Checkbox checked={v} onCheckedChange={setV} />;
};`,
      renderPreview: () => <CheckboxIndeterminatePreview />
    },
    {
      id: "checkbox-invalid",
      title: "Invalid",
      text: "Field data-invalid and Checkbox aria-invalid (shadcn Invalid).",
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
      renderPreview: () => <CheckboxInvalidPreview />
    },
    {
      id: "checkbox-basic",
      title: "Basic",
      text: "Single horizontal Field + FieldLabel.",
      code: `// Field orientation="horizontal", Checkbox + FieldLabel htmlFor`,
      renderPreview: () => <CheckboxBasicPreview />
    },
    {
      id: "checkbox-description",
      title: "Description",
      text: "FieldContent with FieldDescription.",
      code: `// FieldContent, FieldLabel, FieldDescription`,
      renderPreview: () => <CheckboxDescriptionPreview />
    },
    {
      id: "checkbox-disabled",
      title: "Disabled",
      text: "disabled on Checkbox and data-disabled on Field.",
      code: `// Field data-disabled="" + Checkbox disabled`,
      renderPreview: () => <CheckboxDisabledPreview />
    },
    {
      id: "checkbox-group",
      title: "Group",
      text: "FieldSet, FieldLegend, FieldGroup list (shadcn Group).",
      code: `// FieldSet + FieldLegend variant="label" + FieldDescription`,
      renderPreview: () => <CheckboxGroupPreview />
    },
    {
      id: "checkbox-table",
      title: "Table",
      text: "Select-all and row selection with data-state on TableRow.",
      code: `// Checkbox in header + rows; Set<string> for selected ids`,
      renderPreview: () => <CheckboxTablePreview />
    },
    {
      id: "checkbox-rtl",
      title: "RTL",
      text: "DirectionProvider and dir on FieldGroup — EN / AR / HE.",
      code: `import { Checkbox, DirectionProvider, FieldGroup, … } from "@/components/kamod-ui/checkbox";`,
      renderPreview: () => <CheckboxRtlPreview />
    }
  ],
  apiRows: [
    { prop: "checked", type: "boolean | \"indeterminate\"", defaultValue: "uncontrolled" },
    { prop: "defaultChecked", type: "boolean | \"indeterminate\"", defaultValue: "false" },
    { prop: "onCheckedChange", type: "(checked) => void", defaultValue: "—" },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
    { prop: "aria-invalid", type: "boolean", defaultValue: "false" },
    { prop: "…", type: "native input attrs", defaultValue: "id, name, class, …" }
  ],
  accessibilityText:
    "Prefer visible labels with htmlFor or aria-label on icon-only table checkboxes. aria-checked reflects mixed for indeterminate."
});
