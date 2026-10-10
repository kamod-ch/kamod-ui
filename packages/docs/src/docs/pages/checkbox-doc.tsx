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
        <FieldDescription>
          By clicking this checkbox, you agree to the terms and conditions.
        </FieldDescription>
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
    enableNotificationsDescription: "You can enable or disable notifications at any time.",
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    acceptTerms: "قبول الشروط والأحكام",
    acceptTermsDescription: "بالنقر على هذا المربع، فإنك توافق على الشروط.",
    enableNotifications: "تفعيل الإشعارات",
    enableNotificationsDescription: "يمكنك تفعيل أو إلغاء تفعيل الإشعارات في أي وقت.",
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    acceptTerms: "קבל תנאים והגבלות",
    acceptTermsDescription: "על ידי לחיצה על תיבת הסימון הזו, אתה מסכים לתנאים.",
    enableNotifications: "הפעל התראות",
    enableNotificationsDescription: "אתה יכול להפעיל או להשבית התראות בכל עת.",
  },
};

const CheckboxRtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-md flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button
            key={key}
            variant={lang === key ? "default" : "outline"}
            size="sm"
            onClick={() => setLang(key)}
          >
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
            <Checkbox
              id="terms-checkbox-2-rtl-doc"
              name="terms-checkbox-2-rtl-doc"
              defaultChecked
            />
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
    'Use defaultChecked or checked with onCheckedChange. Pair with Field, FieldLabel, and data-disabled / data-invalid on Field for states. checked may be true, false, or "indeterminate" (minus icon, aria-checked=mixed).',
  exampleSections: [
    {
      id: "checkbox-demo",
      title: "Demo",
      text: "**Compare Independent Choices in a Realistic Field Layout.** Compose checkboxes with `FieldGroup`, `FieldLabel` and supporting descriptions to show several independent preferences. The example includes disabled and nested label treatments, demonstrating how the same boolean control fits different amounts of explanatory content.\n\nKeep the input association intact when copying the composition, and use [Field](/docs/field/installation) to group supporting text and validation consistently.",
      code: `// See hero previewCode — Field + Checkbox + FieldContent / FieldTitle.`,
      renderPreview: () => <CheckboxDemoPreview />,
    },
    {
      id: "checkbox-usage",
      title: "Usage",
      text: "**Start with the Smallest Selectable Option.** Start with one `Checkbox` to see the control without a surrounding form layout. In a finished interface, pair it with an associated [Label](/docs/label/installation) so its checked state answers a clearly named question.\n\nAdd a visible label for ordinary forms and decide how the selected value will be stored or submitted before integrating it into a larger workflow.",
      code: `import { Checkbox } from "@/components/kamod-ui/checkbox";

export const Example = () => <Checkbox aria-label="Accept" />;`,
      renderPreview: () => <Checkbox aria-label="Accept" />,
    },
    {
      id: "checkbox-controlled",
      title: "Checked State",
      text: "**Keep One Source of Truth for Selection.** Pass `checked` and update it through `onCheckedChange` when another part of the application needs the same boolean state. The parent then supplies the value rendered by the checkbox instead of maintaining a separate visual selection.\n\nThis makes summaries and submit payloads agree with the visible control, including changes made by another part of the interface.",
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
      text: '**Represent a Mixed Collection Honestly.** Use `checked="indeterminate"` for a mixed selection, such as a group where only some items are checked. This communicates a summary state; define how activating that summary changes the underlying individual values.\n\nDerive that state from the collection and decide what activating the parent should do; the mixed visual state should never be stored as if it were a separate child choice.',
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
      text: "**Connect the Error to the Option.** Combine `data-invalid` on `Field` with `aria-invalid` on `Checkbox` to present an invalid choice coherently. The field supplies surrounding feedback, while the actual control exposes its validation state to assistive technology.\n\nAssociate that message with the checkbox and choose when validation appears, so an untouched field is not presented as a failure without context.",
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
      id: "checkbox-basic",
      title: "Basic",
      text: "**Make the Label Part of the Interaction.** Place `Checkbox` and its `FieldLabel` in a horizontal field for a short independent option. Their association gives the label an interaction role as well as explaining what the boolean value means.\n\nUse a stable identifier to connect the label, and check that clicking the words toggles the intended checkbox rather than another repeated field.",
      code: `// Field orientation="horizontal", Checkbox + FieldLabel htmlFor`,
      renderPreview: () => <CheckboxBasicPreview />,
    },
    {
      id: "checkbox-description",
      title: "Description",
      text: "**Explain the Consequence before Selection.** Use `FieldContent` to keep a checkbox's label and `FieldDescription` together beside the control. This leaves room for an explanation of the consequence without turning the main option label into a long paragraph.\n\nKeep it readable and associated with the checkbox, and avoid hiding essential consent information in a tooltip or another disclosure.",
      code: `// FieldContent, FieldLabel, FieldDescription`,
      renderPreview: () => <CheckboxDescriptionPreview />,
    },
    {
      id: "checkbox-disabled",
      title: "Disabled",
      text: "**Explain Why a Choice Is Unavailable.** Set `disabled` on the checkbox and `data-disabled` on its field wrapper to coordinate behavior and presentation. The control becomes unavailable while the surrounding layout still communicates the option's identity and existing state.\n\nIf another action unlocks it, place that instruction nearby; disabled controls should not be the only route to discovering their own prerequisite.",
      code: `// Field data-disabled="" + Checkbox disabled`,
      renderPreview: () => <CheckboxDisabledPreview />,
    },
    {
      id: "checkbox-group",
      title: "Group",
      text: "**Name the Collection as Well as Its Choices.** Use `FieldSet` and `FieldLegend` to name the shared question, then list independent choices in `FieldGroup`. Each checkbox answers one part of that question and retains its own associated label.\n\nUse stable values for submission, keep the order predictable, and distinguish multi-selection from the mutually exclusive behavior of [Radio Group](/docs/radio-group/installation).",
      code: `// FieldSet + FieldLegend variant="label" + FieldDescription`,
      renderPreview: () => <CheckboxGroupPreview />,
    },
    {
      id: "checkbox-table",
      title: "Table",
      text: "**Define the Scope of Select-All.** Derive the header checkbox from the selected table rows and use row `data-state` styling to reflect selection. The select-all control should summarize the same records that the row checkboxes update.\n\nUse **Stable Record IDs** so sorting or pagination cannot transfer selection to a different record. Decide whether select-all applies to the current page, filtered results or the whole dataset, and make that scope clear beside any bulk action.",
      code: `// Checkbox in header + rows; Set<string> for selected ids`,
      renderPreview: () => <CheckboxTablePreview />,
    },
    {
      id: "checkbox-rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Use `DirectionProvider` and `dir` on the field collection to compare translated checkbox layouts. Keep each input associated with its own label while the control, description and spacing follow the selected reading direction.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
      code: `import { Checkbox, DirectionProvider, FieldGroup, … } from "@/components/kamod-ui/checkbox";`,
      renderPreview: () => <CheckboxRtlPreview />,
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
