import {
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  Textarea,
} from "@kamod-ui/core";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const p = "fd";

const FieldSliderPreview = () => {
  const [v, setV] = useState(50);
  return (
    <Field class="w-full max-w-xs">
      <FieldTitle>Price cap</FieldTitle>
      <FieldDescription>
        Max budget: <span class="font-medium tabular-nums">{v}</span> (demo slider).
      </FieldDescription>
      <Slider
        aria-label="Price cap"
        class="mt-2 w-full"
        value={v}
        min={0}
        max={100}
        onInput={(e) => setV(Number((e.currentTarget as HTMLInputElement).value))}
      />
    </Field>
  );
};

export const fieldDocPage = createGenericDocPage({
  slug: "field",
  title: "Field",
  previewCode: `import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/kamod-ui/field";
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <FieldSet class="w-full max-w-xs">
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
        <Input id="profile-name" autoComplete="off" placeholder="Evil Rabbit" />
        <FieldDescription>This appears on invoices and emails.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel htmlFor="profile-user">Username</FieldLabel>
        <Input id="profile-user" autoComplete="off" aria-invalid />
        <FieldError>Choose another username.</FieldError>
      </Field>
    </FieldGroup>
  </FieldSet>
);`,
  usageLabel:
    "Composable form layout — FieldSet, FieldGroup, FieldLabel, FieldDescription, FieldError, FieldTitle, FieldContent, FieldSeparator (shadcn-aligned). Legacy label/description/error props on Field remain supported.",
  installationText:
    "Import Field and subcomponents from `@/components/kamod-ui/field` (FieldSet, FieldGroup, FieldLabel, FieldDescription, FieldError, …).",
  usageText:
    "Compose Field around controls. Use FieldSet + FieldLegend for semantics. Field orientation horizontal for checkbox/radio + label rows. FieldLabel can wrap a Field for choice cards. Field still accepts label, description, and error props for quick stacks (legacy).",
  exampleSections: [
    {
      id: "field-anatomy",
      title: "Anatomy",
      text: "FieldSet, FieldGroup, label, control, description, error (shadcn Usage).",
      code: `import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/kamod-ui/field";
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <FieldSet class="w-full max-w-xs">
    <FieldLegend>Profile</FieldLegend>
    <FieldDescription>This appears on invoices and emails.</FieldDescription>
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Full name</FieldLabel>
        <Input id="name" autoComplete="off" placeholder="Evil Rabbit" />
        <FieldDescription>This appears on invoices and emails.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" autoComplete="off" aria-invalid />
        <FieldError>Choose another username.</FieldError>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="newsletter" />
        <FieldLabel htmlFor="newsletter">Subscribe to the newsletter</FieldLabel>
      </Field>
    </FieldGroup>
  </FieldSet>
);`,
      renderPreview: () => (
        <FieldSet class="w-full max-w-xs">
          <FieldLegend>Profile</FieldLegend>
          <FieldDescription>This appears on invoices and emails.</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${p}-name`}>Full name</FieldLabel>
              <Input id={`${p}-name`} autoComplete="off" placeholder="Evil Rabbit" />
              <FieldDescription>This appears on invoices and emails.</FieldDescription>
            </Field>
            <Field invalid>
              <FieldLabel htmlFor={`${p}-username`}>Username</FieldLabel>
              <Input id={`${p}-username`} autoComplete="off" aria-invalid />
              <FieldError>Choose another username.</FieldError>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id={`${p}-newsletter`} />
              <FieldLabel htmlFor={`${p}-newsletter`}>Subscribe to the newsletter</FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      id: "field-legacy",
      title: "Legacy props",
      text: "Field with label, description, and error props (backward compatible).",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field label="Project name" description="Shown in the dashboard header">
    <Input placeholder="Kamod UI" />
  </Field>
);`,
      renderPreview: () => (
        <Field label="Project name" description="Shown in the dashboard header">
          <Input placeholder="Kamod UI" />
        </Field>
      ),
    },
    {
      id: "field-input",
      title: "Input",
      text: "Username and password fields (shadcn Field Input).",
      code: `import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/kamod-ui/field";
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <FieldSet class="w-full max-w-xs">
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" type="text" placeholder="Max Leiter" />
        <FieldDescription>Choose a unique username for your account.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <FieldDescription>Must be at least 8 characters long.</FieldDescription>
        <Input id="password" type="password" placeholder="••••••••" />
      </Field>
    </FieldGroup>
  </FieldSet>
);`,
      renderPreview: () => (
        <FieldSet class="w-full max-w-xs">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${p}-u`}>Username</FieldLabel>
              <Input id={`${p}-u`} type="text" placeholder="Max Leiter" />
              <FieldDescription>Choose a unique username for your account.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${p}-pw`}>Password</FieldLabel>
              <FieldDescription>Must be at least 8 characters long.</FieldDescription>
              <Input id={`${p}-pw`} type="password" placeholder="••••••••" />
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      id: "field-textarea",
      title: "Textarea",
      text: "shadcn Field Textarea.",
      code: `import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/kamod-ui/field";
import { Textarea } from "@/components/kamod-ui/textarea";

export const Example = () => (
  <FieldSet class="w-full max-w-xs">
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
        <Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
        <FieldDescription>Share your thoughts about our service.</FieldDescription>
      </Field>
    </FieldGroup>
  </FieldSet>
);`,
      renderPreview: () => (
        <FieldSet class="w-full max-w-xs">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${p}-fb`}>Feedback</FieldLabel>
              <Textarea id={`${p}-fb`} placeholder="Your feedback helps us improve..." rows={4} />
              <FieldDescription>Share your thoughts about our service.</FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      id: "field-select",
      title: "Select",
      text: "shadcn Field Select.",
      code: `import { Field, FieldDescription, FieldLabel } from "@/components/kamod-ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/kamod-ui/select";

export const Example = () => (
  <Field class="w-full max-w-xs">
    <FieldLabel>Department</FieldLabel>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Choose department" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="design">Design</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <FieldDescription>Select your department or area of work.</FieldDescription>
  </Field>
);`,
      renderPreview: () => (
        <Field class="w-full max-w-xs">
          <FieldLabel>Department</FieldLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>Select your department or area of work.</FieldDescription>
        </Field>
      ),
    },
    {
      id: "field-slider",
      title: "Slider",
      text: "FieldTitle + FieldDescription + Slider (shadcn Field Slider, single value).",
      code: `import { Field, FieldDescription, FieldTitle } from "@/components/kamod-ui/field"
import { Slider } from "@/components/kamod-ui/slider";
import { useState } from "preact/hooks";

export const Example = () => {
  const [v, setV] = useState(50);
  return (
    <Field class="w-full max-w-xs">
      <FieldTitle>Price cap</FieldTitle>
      <FieldDescription>Budget hint: {v}</FieldDescription>
      <Slider aria-label="Price cap" class="mt-2 w-full" value={v} min={0} max={100} onInput={(e) => setV(Number(e.currentTarget.value))} />
    </Field>
  );
};`,
      renderPreview: () => <FieldSliderPreview />,
    },
    {
      id: "field-fieldset",
      title: "Fieldset",
      text: "Legend, description, grid of inputs (shadcn Fieldset).",
      code: `import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/kamod-ui/field";
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <FieldSet class="w-full max-w-sm">
    <FieldLegend>Address Information</FieldLegend>
    <FieldDescription>We need your address to deliver your order.</FieldDescription>
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="street">Street Address</FieldLabel>
        <Input id="street" type="text" placeholder="123 Main St" />
      </Field>
      <div class="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input id="city" type="text" placeholder="New York" />
        </Field>
        <Field>
          <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
          <Input id="zip" type="text" placeholder="90502" />
        </Field>
      </div>
    </FieldGroup>
  </FieldSet>
);`,
      renderPreview: () => (
        <FieldSet class="w-full max-w-sm">
          <FieldLegend>Address Information</FieldLegend>
          <FieldDescription>We need your address to deliver your order.</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${p}-st`}>Street Address</FieldLabel>
              <Input id={`${p}-st`} type="text" placeholder="123 Main St" />
            </Field>
            <div class="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor={`${p}-city`}>City</FieldLabel>
                <Input id={`${p}-city`} type="text" placeholder="New York" />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${p}-zip`}>Postal Code</FieldLabel>
                <Input id={`${p}-zip`} type="text" placeholder="90502" />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      id: "field-checkbox",
      title: "Checkbox",
      text: "Horizontal Field rows + FieldContent (shadcn Field Checkbox).",
      code: `import { Checkbox } from "@/components/kamod-ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/kamod-ui/field";

export const Example = () => (
  <FieldGroup class="w-full max-w-xs">
    <FieldSet>
      <FieldLegend variant="label">Desktop items</FieldLegend>
      <FieldDescription>Select items to show on the desktop.</FieldDescription>
      <FieldGroup class="gap-3">
        <Field orientation="horizontal">
          <Checkbox id="c1" />
          <FieldLabel htmlFor="c1" class="font-normal">
            Hard disks
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="c2" />
          <FieldLabel htmlFor="c2" class="font-normal">
            External disks
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
    <FieldSeparator />
    <Field orientation="horizontal">
      <Checkbox id="c3" defaultChecked />
      <FieldContent>
        <FieldLabel htmlFor="c3">Sync folders</FieldLabel>
        <FieldDescription>Your Desktop & Documents are synced with cloud storage.</FieldDescription>
      </FieldContent>
    </Field>
  </FieldGroup>
);`,
      renderPreview: () => (
        <FieldGroup class="w-full max-w-xs">
          <FieldSet>
            <FieldLegend variant="label">Desktop items</FieldLegend>
            <FieldDescription>Select items to show on the desktop.</FieldDescription>
            <FieldGroup class="gap-3">
              <Field orientation="horizontal">
                <Checkbox id={`${p}-c1`} />
                <FieldLabel htmlFor={`${p}-c1`} class="font-normal">
                  Hard disks
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id={`${p}-c2`} />
                <FieldLabel htmlFor={`${p}-c2`} class="font-normal">
                  External disks
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <Field orientation="horizontal">
            <Checkbox id={`${p}-c3`} defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor={`${p}-c3`}>Sync folders</FieldLabel>
              <FieldDescription>
                Your Desktop & Documents are synced with cloud storage.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      ),
    },
    {
      id: "field-radio",
      title: "Radio",
      text: "RadioGroup inside FieldSet (shadcn Field Radio).",
      code: `import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "@/components/kamod-ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/kamod-ui/radio-group";

export const Example = () => (
  <FieldSet class="w-full max-w-xs">
    <FieldLegend variant="label">Subscription Plan</FieldLegend>
    <FieldDescription>Yearly and lifetime plans offer savings.</FieldDescription>
    <RadioGroup defaultValue="monthly">
      <Field orientation="horizontal">
        <RadioGroupItem value="monthly" id="plan-m" />
        <FieldLabel htmlFor="plan-m" class="font-normal">
          Monthly ($9.99/month)
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="yearly" id="plan-y" />
        <FieldLabel htmlFor="plan-y" class="font-normal">
          Yearly ($99.99/year)
        </FieldLabel>
      </Field>
    </RadioGroup>
  </FieldSet>
);`,
      renderPreview: () => (
        <FieldSet class="w-full max-w-xs">
          <FieldLegend variant="label">Subscription Plan</FieldLegend>
          <FieldDescription>Yearly and lifetime plans offer savings.</FieldDescription>
          <RadioGroup defaultValue="monthly">
            <Field orientation="horizontal">
              <RadioGroupItem value="monthly" id={`${p}-pm`} />
              <FieldLabel htmlFor={`${p}-pm`} class="font-normal">
                Monthly ($9.99/month)
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="yearly" id={`${p}-py`} />
              <FieldLabel htmlFor={`${p}-py`} class="font-normal">
                Yearly ($99.99/year)
              </FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
      ),
    },
    {
      id: "field-switch",
      title: "Switch",
      text: "Label + Switch horizontal (shadcn Field Switch).",
      code: `import { Field, FieldLabel } from "@/components/kamod-ui/field";
import { Switch } from "@/components/kamod-ui/switch";

export const Example = () => (
  <Field orientation="horizontal" class="w-fit">
    <FieldLabel htmlFor="2fa">Multi-factor authentication</FieldLabel>
    <Switch id="2fa" />
  </Field>
);`,
      renderPreview: () => (
        <Field orientation="horizontal" class="w-fit">
          <FieldLabel htmlFor={`${p}-2fa`}>Multi-factor authentication</FieldLabel>
          <Switch id={`${p}-2fa`} />
        </Field>
      ),
    },
    {
      id: "field-choice-card",
      title: "Choice card",
      text: "FieldLabel wraps Field + Radio (shadcn Choice Card).",
      code: `import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/kamod-ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/kamod-ui/radio-group";

export const Example = () => (
  <FieldGroup class="w-full max-w-xs">
    <FieldSet>
      <FieldLegend variant="label">Compute Environment</FieldLegend>
      <FieldDescription>Select the compute environment for your cluster.</FieldDescription>
      <RadioGroup defaultValue="kubernetes">
        <FieldLabel htmlFor="kube-id">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Kubernetes</FieldTitle>
              <FieldDescription>Run GPU workloads on a K8s cluster.</FieldDescription>
            </FieldContent>
            <RadioGroupItem value="kubernetes" id="kube-id" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="vm-id">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Virtual Machine</FieldTitle>
              <FieldDescription>Access a VM to run GPU workloads.</FieldDescription>
            </FieldContent>
            <RadioGroupItem value="vm" id="vm-id" />
          </Field>
        </FieldLabel>
      </RadioGroup>
    </FieldSet>
  </FieldGroup>
);`,
      renderPreview: () => (
        <FieldGroup class="w-full max-w-xs">
          <FieldSet>
            <FieldLegend variant="label">Compute Environment</FieldLegend>
            <FieldDescription>Select the compute environment for your cluster.</FieldDescription>
            <RadioGroup defaultValue="kubernetes">
              <FieldLabel htmlFor={`${p}-kube`}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Kubernetes</FieldTitle>
                    <FieldDescription>Run GPU workloads on a K8s cluster.</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="kubernetes" id={`${p}-kube`} />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor={`${p}-vm`}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Virtual Machine</FieldTitle>
                    <FieldDescription>Access a VM to run GPU workloads.</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="vm" id={`${p}-vm`} />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
        </FieldGroup>
      ),
    },
    {
      id: "field-group-sep",
      title: "Field group + separator",
      text: "Stacked FieldSets with FieldSeparator (shadcn Field Group).",
      code: `import { Checkbox } from "@/components/kamod-ui/checkbox"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/components/kamod-ui/field";

export const Example = () => (
  <FieldGroup class="w-full max-w-xs">
    <FieldSet>
      <FieldLabel>Responses</FieldLabel>
      <FieldDescription>Get notified when long requests finish.</FieldDescription>
      <FieldGroup data-slot="checkbox-group" class="gap-2">
        <Field orientation="horizontal">
          <Checkbox id="push" defaultChecked disabled />
          <FieldLabel htmlFor="push" class="font-normal">
            Push notifications
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
    <FieldSeparator />
    <FieldSet>
      <FieldLabel>Tasks</FieldLabel>
      <FieldDescription>Updates for tasks you created.</FieldDescription>
      <FieldGroup class="gap-2">
        <Field orientation="horizontal">
          <Checkbox id="t1" />
          <FieldLabel htmlFor="t1" class="font-normal">
            Push notifications
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="t2" />
          <FieldLabel htmlFor="t2" class="font-normal">
            Email notifications
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  </FieldGroup>
);`,
      renderPreview: () => (
        <FieldGroup class="w-full max-w-xs">
          <FieldSet>
            <FieldLabel>Responses</FieldLabel>
            <FieldDescription>Get notified when long requests finish.</FieldDescription>
            <FieldGroup data-slot="checkbox-group" class="gap-2">
              <Field orientation="horizontal">
                <Checkbox id={`${p}-push`} defaultChecked disabled />
                <FieldLabel htmlFor={`${p}-push`} class="font-normal">
                  Push notifications
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLabel>Tasks</FieldLabel>
            <FieldDescription>Updates for tasks you created.</FieldDescription>
            <FieldGroup class="gap-2">
              <Field orientation="horizontal">
                <Checkbox id={`${p}-t1`} />
                <FieldLabel htmlFor={`${p}-t1`} class="font-normal">
                  Push notifications
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id={`${p}-t2`} />
                <FieldLabel htmlFor={`${p}-t2`} class="font-normal">
                  Email notifications
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      ),
    },
    {
      id: "field-error-array",
      title: "FieldError (errors array)",
      text: "FieldError can derive text from an errors array (forms integration).",
      code: `import { Field, FieldError, FieldLabel } from "@/components/kamod-ui/field";
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field class="w-full max-w-xs">
    <FieldLabel htmlFor="x">Code</FieldLabel>
    <Input id="x" aria-invalid />
    <FieldError errors={[{ message: "Too short" }, { message: "Must contain a number" }]} />
  </Field>
);`,
      renderPreview: () => (
        <Field class="w-full max-w-xs">
          <FieldLabel htmlFor={`${p}-code`}>Code</FieldLabel>
          <Input id={`${p}-code`} aria-invalid />
          <FieldError errors={[{ message: "Too short" }, { message: "Must contain a number" }]} />
        </Field>
      ),
    },
    {
      id: "field-responsive",
      title: "Responsive orientation",
      text: "Field orientation responsive stacks until @md inside @container FieldGroup.",
      code: `import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/kamod-ui/field";
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <FieldGroup class="w-full max-w-md">
    <Field orientation="responsive">
      <FieldLabel htmlFor="responsive-input">Label</FieldLabel>
      <Input id="responsive-input" placeholder="Narrow: stacked — wide: row" />
      <FieldDescription>Resize the viewport to see layout change.</FieldDescription>
    </Field>
  </FieldGroup>
);`,
      renderPreview: () => (
        <FieldGroup class="w-full max-w-md">
          <Field orientation="responsive">
            <FieldLabel htmlFor={`${p}-resp`}>Label</FieldLabel>
            <Input id={`${p}-resp`} placeholder="Narrow: stacked — wide: row" />
            <FieldDescription>Resize the viewport to see layout change.</FieldDescription>
          </Field>
        </FieldGroup>
      ),
    },
    {
      id: "field-rtl",
      title: "RTL",
      text: 'dir="rtl" on FieldSet for mirrored flow.',
      code: `import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/kamod-ui/field";
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <FieldSet dir="rtl" class="w-full max-w-xs">
    <FieldLegend>معلومات</FieldLegend>
    <FieldDescription>نص مساعد بالعربية.</FieldDescription>
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="rtl-name">الاسم</FieldLabel>
        <Input id="rtl-name" placeholder="…" />
      </Field>
    </FieldGroup>
  </FieldSet>
);`,
      renderPreview: () => (
        <FieldSet dir="rtl" class="w-full max-w-xs">
          <FieldLegend>معلومات</FieldLegend>
          <FieldDescription>نص مساعد بالعربية.</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${p}-rtl-n`}>الاسم</FieldLabel>
              <Input id={`${p}-rtl-n`} placeholder="…" />
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      id: "field-legacy-error",
      title: "Legacy error",
      text: "Validation with legacy error prop.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field label="Email" error="Please provide a valid email address">
    <Input aria-invalid placeholder="name@example.com" />
  </Field>
);`,
      renderPreview: () => (
        <Field label="Email" error="Please provide a valid email address">
          <Input aria-invalid placeholder="name@example.com" />
        </Field>
      ),
    },
  ],
  apiRows: [
    {
      prop: "orientation",
      type: '"vertical" | "horizontal" | "responsive"',
      defaultValue: '"vertical"',
    },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
    { prop: "invalid", type: "boolean", defaultValue: "false" },
    { prop: "label / description / error", type: "ComponentChildren", defaultValue: "legacy only" },
    { prop: "FieldLabel htmlFor", type: "string", defaultValue: "—" },
    { prop: "FieldError errors", type: "{ message?: string }[]", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Use FieldLabel with htmlFor matching control id. Surface validation with aria-invalid on the control and FieldError or error prop. FieldSet and FieldLegend group related inputs for assistive tech.",
});
