import { Checkbox, Input, Label, Textarea } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const labelDocPage = createGenericDocPage({
  slug: "label",
  title: "Label",
  usageLabel:
    "Accessible captions for form controls — Radix/shadcn-aligned typography and disabled-state pairing.",
  installationText: "Import Label from `@/components/kamod-ui/label`.",
  usageText:
    "Associate controls with htmlFor/id. Put the control **Before** the label when you rely on Tailwind `peer-disabled` styling on the label. For full forms with legends and errors, prefer a Field pattern when your app provides it.",
  exampleSections: [
    {
      id: "label-demo",
      title: "Demo",
      text: "**Keep Visual State Tied to the Real Input.** Place the checkbox before its associated `Label` so peer-based disabled styling can reflect the control's state. The label then serves both as visible explanation and as the named target associated with that checkbox.\n\nTest clicking the text and reading the field name, not only whether the disabled color looks right.",
      code: `import { Checkbox } from "@/components/kamod-ui/checkbox"
import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <div class="flex items-center gap-2">
    <Checkbox id="terms" />
    <Label htmlFor="terms">Accept terms and conditions</Label>
  </div>
);`,
      renderPreview: () => (
        <div class="flex items-center gap-2">
          <Checkbox id="terms-label-demo-main" />
          <Label htmlFor="terms-label-demo-main">Accept terms and conditions</Label>
        </div>
      ),
    },
    {
      id: "label-usage",
      title: "Usage",
      text: "**Connect a Readable Name to One Control.** Connect `Label` through `htmlFor` to the control's matching `id`. This small association makes the visible field name meaningful to the browser and assistive technology, rather than merely placing text near an input.\n\nRepeated examples need distinct identifiers so activating one label cannot accidentally focus or toggle another field.",
      code: `import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <Label htmlFor="email">Your email address</Label>
);`,
      renderPreview: () => (
        <div class="grid max-w-xs gap-1">
          <Label htmlFor="email-label-usage-only">Your email address</Label>
          <input
            id="email-label-usage-only"
            type="email"
            class="rounded-md border border-input px-2 py-1 text-sm"
            placeholder="you@example.com"
          />
        </div>
      ),
    },
    {
      id: "label-with-checkbox",
      title: "Label with Checkbox",
      text: "**Make the Words Activate the Choice.** Pair `Label` with a checkbox using the same identifier, and let the control's `disabled` state drive its peer styling. The label remains readable while communicating that the corresponding choice cannot currently be changed.\n\nKeep the disabled state on the actual control, preserve any explanatory text nearby, and avoid placing unrelated links inside a label when their action could conflict with toggling.",
      code: `import { Checkbox } from "@/components/kamod-ui/checkbox"
import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <Checkbox id="terms2" />
      <Label htmlFor="terms2">Accept terms and conditions</Label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="terms2d" disabled />
      <Label htmlFor="terms2d">Unavailable option</Label>
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <Checkbox id="terms-label-doc-2" />
            <Label htmlFor="terms-label-doc-2">Accept terms and conditions</Label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="terms-label-doc-2d" disabled />
            <Label htmlFor="terms-label-doc-2d">Unavailable option</Label>
          </div>
        </div>
      ),
    },
    {
      id: "label-with-input",
      title: "Label with Input",
      text: "**Keep the Name Visible While the Value Changes.** Stack `Label` above `Input` when the field needs a persistent name independent of its placeholder. Keep `htmlFor` and the input's `id` aligned so the visual arrangement also has a programmatic association.\n\nUse a stable identifier, add hints separately and avoid putting formatting instructions into an excessively long field name.",
      code: `import { Input } from "@/components/kamod-ui/input"
import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <div class="grid w-full max-w-sm items-center gap-3">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="Email" />
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="email-label-doc">Email</Label>
          <Input id="email-label-doc" type="email" placeholder="Email" />
        </div>
      ),
    },
    {
      id: "label-with-textarea",
      title: "Label with Textarea",
      text: "**Explain What Belongs in the Longer Response.** Associate `Label` with a textarea through its `id`, giving a longer answer a stable field name. The label should explain the requested content while any format or length guidance remains nearby as supporting text.\n\nKeep both available during editing and ensure the multiline control's identifier remains unique when the pattern appears several times.",
      code: `import { Label } from "@/components/kamod-ui/label"
import { Textarea } from "@/components/kamod-ui/textarea";

export const Example = () => (
  <div class="grid w-full gap-3">
    <Label htmlFor="message">Your message</Label>
    <Textarea id="message" placeholder="Type your message here." />
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-full gap-3">
          <Label htmlFor="message-label-doc">Your message</Label>
          <Textarea id="message-label-doc" placeholder="Type your message here." />
        </div>
      ),
    },
    {
      id: "label-field-hint",
      title: "Label in a Form Stack",
      text: "**Associate Help as Well as the Name.** Compose `Label`, `Input` and a muted help paragraph when building a field without the higher-level `Field` wrapper. Give the help text an identifier and associate it with the input where that explanation is needed.\n\nUse [Field](/docs/field/installation) when repeated descriptions and validation messages would otherwise require the same surrounding structure throughout a form.",
      code: `import { Input } from "@/components/kamod-ui/input"
import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <div class="grid w-full max-w-sm gap-2">
    <Label htmlFor="card">Card number</Label>
    <Input id="card" placeholder="1234 5678 9012 3456" />
    <p class="text-muted-foreground text-sm">Enter your 16-digit card number</p>
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-full max-w-sm gap-2">
          <Label htmlFor="card-label-doc">Card number</Label>
          <Input id="card-label-doc" placeholder="1234 5678 9012 3456" />
          <p class="text-muted-foreground text-sm">Enter your 16-digit card number</p>
        </div>
      ),
    },
    {
      id: "label-sizes",
      title: "Sizes",
      text: "**Choose a Readable Hierarchy for the Form.** Use the label's size options to match its typography to the surrounding controls. Changing the visual scale should preserve the wording and identifier association that make the label useful for understanding and focusing the field.\n\nKeep size choices consistent across related fields and avoid reducing contrast at the same time that you reduce the text size.",
      code: `import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <div class="grid gap-2">
    <Label size="sm">Small label</Label>
    <Label size="md">Medium label</Label>
    <Label size="lg">Large label</Label>
  </div>
);`,
      renderPreview: () => (
        <div class="grid gap-2">
          <Label size="sm">Small label</Label>
          <Label size="md">Medium label</Label>
          <Label size="lg">Large label</Label>
        </div>
      ),
    },
    {
      id: "label-rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Set the row's `dir` for translated label layouts while preserving the control-before-label relationship needed by peer styling. Logical spacing can mirror the presentation without breaking the checkbox's named association.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
      code: `import { Checkbox } from "@/components/kamod-ui/checkbox"
import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <div class="flex gap-2" dir="rtl">
    <Checkbox id="terms-rtl" />
    <Label htmlFor="terms-rtl">قبول الشروط والأحكام</Label>
  </div>
);`,
      renderPreview: () => (
        <div class="flex gap-2" dir="rtl">
          <Checkbox id="terms-label-rtl" />
          <Label htmlFor="terms-label-rtl">قبول الشروط والأحكام</Label>
        </div>
      ),
    },
  ],
  apiRows: [
    { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: '"sm"' },
    { prop: "htmlFor", type: "string", defaultValue: "undefined" },
    { prop: "children", type: "ComponentChildren", defaultValue: "required" },
  ],
  accessibilityText:
    "Associate labels with controls via htmlFor/id or wrap the control inside the label. Ensure disabled controls use the native disabled attribute so peer-disabled label styles apply.",
});
