import { Field } from "@kamod-ui/core";
import { Label } from "@kamod-ui/core";
import { RadioGroup, RadioGroupItem } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const radioGroupDocPage = createGenericDocPage({
  slug: "radio-group",
  title: "Radio Group",
  usageLabel: "A set of mutually exclusive options styled like modern radio controls.",
  installationText:
    "Import RadioGroup and RadioGroupItem from `@/components/kamod-ui/radio-group`. Label pairs cleanly via id and htmlFor.",
  usageText:
    'Use defaultValue for uncontrolled groups, or value with onValueChange when the parent owns state. Omit name to get a stable generated group name. Pair each item with Label for accessible names; use size="sm" for dense layouts. disabled and aria-invalid on items match form and validation patterns.',
  exampleSections: [
    {
      id: "radio-default-labels",
      title: "Default",
      text: "Classic row layout with visible focus rings and clear typography, similar to shadcn/ui.",
      code: `import { Label } from "@/components/kamod-ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/kamod-ui/radio-group";

export const Example = () => (
  <RadioGroup defaultValue="option-one" class="grid gap-3">
    <div class="flex items-center gap-3">
      <RadioGroupItem value="option-one" id="rg-option-one" />
      <Label size="sm" htmlFor="rg-option-one">
        Option one
      </Label>
    </div>
    <div class="flex items-center gap-3">
      <RadioGroupItem value="option-two" id="rg-option-two" />
      <Label size="sm" htmlFor="rg-option-two">
        Option two
      </Label>
    </div>
  </RadioGroup>
);`,
      renderPreview: () => (
        <RadioGroup defaultValue="option-one" class="grid gap-3">
          <div class="flex items-center gap-3">
            <RadioGroupItem value="option-one" id="rg-option-one" />
            <Label size="sm" htmlFor="rg-option-one">
              Option one
            </Label>
          </div>
          <div class="flex items-center gap-3">
            <RadioGroupItem value="option-two" id="rg-option-two" />
            <Label size="sm" htmlFor="rg-option-two">
              Option two
            </Label>
          </div>
        </RadioGroup>
      ),
    },
    {
      id: "radio-description",
      title: "Description",
      text: "Stack a title and helper line beside each control for settings-style lists.",
      code: `import { RadioGroup, RadioGroupItem } from "@/components/kamod-ui/radio-group";

export const Example = () => (
  <RadioGroup defaultValue="standard" class="grid max-w-md gap-4">
    <div class="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <RadioGroupItem value="standard" class="items-start gap-3 p-4" aria-label="Standard density">
        <div class="grid gap-1">
          <p class="text-sm font-medium leading-none">Standard</p>
          <p class="text-xs text-muted-foreground">Balanced spacing for most interfaces.</p>
        </div>
      </RadioGroupItem>
    </div>
    <div class="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <RadioGroupItem value="compact" class="items-start gap-3 p-4" aria-label="Compact density">
        <div class="grid gap-1">
          <p class="text-sm font-medium leading-none">Compact</p>
          <p class="text-xs text-muted-foreground">Tighter rows for dense dashboards.</p>
        </div>
      </RadioGroupItem>
    </div>
  </RadioGroup>
);`,
      renderPreview: () => (
        <RadioGroup defaultValue="standard" class="grid max-w-md gap-4">
          <div class="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
            <RadioGroupItem
              value="standard"
              class="items-start gap-3 p-4"
              aria-label="Standard density"
            >
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">Standard</p>
                <p class="text-xs text-muted-foreground">Balanced spacing for most interfaces.</p>
              </div>
            </RadioGroupItem>
          </div>
          <div class="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
            <RadioGroupItem
              value="compact"
              class="items-start gap-3 p-4"
              aria-label="Compact density"
            >
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">Compact</p>
                <p class="text-xs text-muted-foreground">Tighter rows for dense dashboards.</p>
              </div>
            </RadioGroupItem>
          </div>
        </RadioGroup>
      ),
    },
    {
      id: "radio-choice-card",
      title: "Choice card",
      text: "Clickable cards with the control aligned to the primary label.",
      code: `import { RadioGroup, RadioGroupItem } from "@/components/kamod-ui/radio-group";

export const Example = () => (
  <RadioGroup defaultValue="pro" class="grid max-w-md gap-3">
    <div class="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <RadioGroupItem
        value="plus"
        class="w-full flex-row-reverse items-start justify-between gap-4 p-4"
        aria-label="Plus plan"
      >
        <div class="flex-1 space-y-1">
          <p class="text-sm font-medium leading-none">Plus</p>
          <p class="text-xs text-muted-foreground">For individuals and small teams.</p>
        </div>
      </RadioGroupItem>
    </div>
    <div class="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <RadioGroupItem
        value="pro"
        class="w-full flex-row-reverse items-start justify-between gap-4 p-4"
        aria-label="Pro plan"
      >
        <div class="flex-1 space-y-1">
          <p class="text-sm font-medium leading-none">Pro</p>
          <p class="text-xs text-muted-foreground">For growing businesses.</p>
        </div>
      </RadioGroupItem>
    </div>
    <div class="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <RadioGroupItem
        value="enterprise"
        class="w-full flex-row-reverse items-start justify-between gap-4 p-4"
        aria-label="Enterprise plan"
      >
        <div class="flex-1 space-y-1">
          <p class="text-sm font-medium leading-none">Enterprise</p>
          <p class="text-xs text-muted-foreground">For large teams and enterprises.</p>
        </div>
      </RadioGroupItem>
    </div>
  </RadioGroup>
);`,
      renderPreview: () => (
        <RadioGroup defaultValue="pro" class="grid max-w-md gap-3">
          <div class="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
            <RadioGroupItem
              value="plus"
              class="w-full flex-row-reverse items-start justify-between gap-4 p-4"
              aria-label="Plus plan"
            >
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium leading-none">Plus</p>
                <p class="text-xs text-muted-foreground">For individuals and small teams.</p>
              </div>
            </RadioGroupItem>
          </div>
          <div class="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
            <RadioGroupItem
              value="pro"
              class="w-full flex-row-reverse items-start justify-between gap-4 p-4"
              aria-label="Pro plan"
            >
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium leading-none">Pro</p>
                <p class="text-xs text-muted-foreground">For growing businesses.</p>
              </div>
            </RadioGroupItem>
          </div>
          <div class="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
            <RadioGroupItem
              value="enterprise"
              class="w-full flex-row-reverse items-start justify-between gap-4 p-4"
              aria-label="Enterprise plan"
            >
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium leading-none">Enterprise</p>
                <p class="text-xs text-muted-foreground">For large teams and enterprises.</p>
              </div>
            </RadioGroupItem>
          </div>
        </RadioGroup>
      ),
    },
    {
      id: "radio-fieldset-field",
      title: "Field group",
      text: "Use Field for a group heading, description, and stacked options.",
      code: `import { Field } from "@/components/kamod-ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/kamod-ui/radio-group";

export const Example = () => (
  <Field
    class="max-w-md rounded-xl border border-border bg-card p-4"
    label="Subscription plan"
    description="Yearly and lifetime plans offer significant savings."
  >
    <RadioGroup defaultValue="monthly" class="mt-2 grid gap-3">
      <RadioGroupItem value="monthly">Monthly ($9.99/month)</RadioGroupItem>
      <RadioGroupItem value="yearly">Yearly ($99/year)</RadioGroupItem>
      <RadioGroupItem value="lifetime">Lifetime ($299.99)</RadioGroupItem>
    </RadioGroup>
  </Field>
);`,
      renderPreview: () => (
        <Field
          class="max-w-md rounded-xl border border-border bg-card p-4"
          label="Subscription plan"
          description="Yearly and lifetime plans offer significant savings."
        >
          <RadioGroup defaultValue="monthly" class="mt-2 grid gap-3">
            <RadioGroupItem value="monthly">Monthly ($9.99/month)</RadioGroupItem>
            <RadioGroupItem value="yearly">Yearly ($99/year)</RadioGroupItem>
            <RadioGroupItem value="lifetime">Lifetime ($299.99)</RadioGroupItem>
          </RadioGroup>
        </Field>
      ),
    },
    {
      id: "radio-disabled-invalid",
      title: "Disabled & invalid",
      text: "Per-item disabled state and aria-invalid for validation feedback.",
      code: `import { RadioGroup, RadioGroupItem } from "@/components/kamod-ui/radio-group";

export const Example = () => (
  <div class="grid max-w-md gap-6">
    <RadioGroup defaultValue="d2" class="grid gap-3">
      <RadioGroupItem value="d1" disabled>
        Disabled default
      </RadioGroupItem>
      <RadioGroupItem value="d2">Option 2</RadioGroupItem>
      <RadioGroupItem value="d3">Option 3</RadioGroupItem>
    </RadioGroup>
    <div class="rounded-xl border border-destructive/40 bg-card p-4">
      <p class="mb-3 text-sm font-medium text-destructive">Notification preferences</p>
      <p class="mb-3 text-xs text-muted-foreground">Choose how you want to receive notifications.</p>
      <RadioGroup defaultValue="email" class="grid gap-3">
        <RadioGroupItem value="email" aria-invalid>
          Email only
        </RadioGroupItem>
        <RadioGroupItem value="sms" aria-invalid>
          SMS only
        </RadioGroupItem>
        <RadioGroupItem value="both" aria-invalid>
          Both email &amp; SMS
        </RadioGroupItem>
      </RadioGroup>
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="grid max-w-md gap-6">
          <RadioGroup defaultValue="d2" class="grid gap-3">
            <RadioGroupItem value="d1" disabled>
              Disabled default
            </RadioGroupItem>
            <RadioGroupItem value="d2">Option 2</RadioGroupItem>
            <RadioGroupItem value="d3">Option 3</RadioGroupItem>
          </RadioGroup>
          <div class="rounded-xl border border-destructive/40 bg-card p-4">
            <p class="mb-3 text-sm font-medium text-destructive">Notification preferences</p>
            <p class="mb-3 text-xs text-muted-foreground">
              Choose how you want to receive notifications.
            </p>
            <RadioGroup defaultValue="email" class="grid gap-3">
              <RadioGroupItem value="email" aria-invalid>
                Email only
              </RadioGroupItem>
              <RadioGroupItem value="sms" aria-invalid>
                SMS only
              </RadioGroupItem>
              <RadioGroupItem value="both" aria-invalid>
                Both email & SMS
              </RadioGroupItem>
            </RadioGroup>
          </div>
        </div>
      ),
    },
    {
      id: "radio-inline-sm",
      title: "Inline & small",
      text: "Horizontal groups and compact indicators for toolbars.",
      code: `import { RadioGroup, RadioGroupItem } from "@/components/kamod-ui/radio-group";

export const Example = () => (
  <RadioGroup name="theme-inline" defaultValue="system" class="flex flex-wrap items-center gap-6">
    <RadioGroupItem value="light" size="sm">
      Light
    </RadioGroupItem>
    <RadioGroupItem value="dark" size="sm">
      Dark
    </RadioGroupItem>
    <RadioGroupItem value="system" size="sm">
      System
    </RadioGroupItem>
  </RadioGroup>
);`,
      renderPreview: () => (
        <RadioGroup
          name="theme-inline"
          defaultValue="system"
          class="flex flex-wrap items-center gap-6"
        >
          <RadioGroupItem value="light" size="sm">
            Light
          </RadioGroupItem>
          <RadioGroupItem value="dark" size="sm">
            Dark
          </RadioGroupItem>
          <RadioGroupItem value="system" size="sm">
            System
          </RadioGroupItem>
        </RadioGroup>
      ),
    },
  ],
  apiRows: [
    { prop: "name", type: "string | undefined", defaultValue: "auto" },
    { prop: "defaultValue", type: "string | undefined", defaultValue: "undefined" },
    { prop: "value", type: "string | undefined", defaultValue: "undefined (uncontrolled)" },
    { prop: "onValueChange", type: "(value: string) => void", defaultValue: "undefined" },
    { prop: "RadioGroupItem value", type: "string", defaultValue: "required" },
    { prop: "RadioGroupItem size", type: '"default" | "sm"', defaultValue: '"default"' },
    { prop: "RadioGroupItem disabled", type: "boolean", defaultValue: "false" },
    { prop: "RadioGroupItem aria-invalid", type: "boolean", defaultValue: "false" },
  ],
  accessibilityText:
    'Prefer explicit labels via Label htmlFor and id, or aria-label on RadioGroupItem when the label is decorative. Keep one focusable radio per option; the root exposes role="radiogroup".',
});
