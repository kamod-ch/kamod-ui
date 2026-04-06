import { Checkbox, Input, Label, Textarea } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const labelDocPage = createGenericDocPage({
  slug: "label",
  title: "Label",
  usageLabel:
    "Accessible captions for form controls — Radix/shadcn-aligned typography and disabled-state pairing.",
  installationText: "Import Label from `@/components/kamod-ui/label`.",
  usageText:
    "Associate controls with htmlFor/id. Put the control **before** the label when you rely on Tailwind `peer-disabled` styling on the label. For full forms with legends and errors, prefer a Field pattern when your app provides it.",
  exampleSections: [
    {
      id: "label-demo",
      title: "Demo",
      text: "Checkbox before label so peer-disabled styles apply when the input is disabled.",
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
      text: "Minimal htmlFor association (shadcn usage block).",
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
      title: "Label with checkbox",
      text: "Pair checkbox and label; use disabled on the checkbox to dim the label via peer.",
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
      title: "Label with input",
      text: "Stack label above the field (shadcn input-with-label).",
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
      title: "Label with textarea",
      text: "Label + multiline control.",
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
      title: "Label in a form stack",
      text: "Without a dedicated Field primitive, stack Label, Input, and helper text with muted typography.",
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
      text: "Optional size variants for typography scale.",
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
      text: "Set dir on the row; keep checkbox before label for peer styling.",
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
