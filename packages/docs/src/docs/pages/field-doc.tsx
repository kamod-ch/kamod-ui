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
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const p = "fd";

const FieldSliderPreview = () => {
  const [v, setV] = useState(50);
  return (
    <Field class="w-full max-w-xs">
      <FieldTitle>Price Cap</FieldTitle>
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
      text: "**Build the Relationships before the Styling.** Compose `FieldSet`, `FieldGroup`, the label, control, description and error in their intended reading order. The example shows which wrapper organizes a question and which element owns the actual editable value.\n\nPreserve stable identifiers and accessible associations when rearranging these parts; the [Accessibility Notes](#accessibility) describe what to verify after composing a complete form.",
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
      title: "Legacy Props",
      text: "**Keep Simple Field Composition Concise.** Use `Field` with `label`, `description` and `error` props when maintaining the compact wrapper API. It packages common field content while the child control remains responsible for its own value and interaction behavior.\n\nUse the compound pieces for richer layouts, and check the resulting associations rather than assuming that visible proximity alone connects the text to a custom control.",
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
      text: "**Choose Input Semantics for the Actual Value.** Group username and password inputs with their visible labels and supporting instructions. Each `Field` describes one value, making it possible to attach validation feedback locally rather than explaining every problem at the form's top.\n\nKeep hints outside placeholder text and let the field wrapper organize the message; the underlying input still owns its value, type and browser behavior.",
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
      text: "**Leave Room for a Longer Answer.** Place a multiline control in `Field` when the answer needs more room than a single line. Pair its label with concise instructions about the expected content, keeping those instructions separate from any validation error.\n\nKeep the label visible while typing, associate errors with the textarea, and avoid making the initial height so small that ordinary responses become difficult to review.",
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
      text: "**Label the Selection Rather than Its Placeholder.** Wrap `Select` in a field structure that names the question and describes the available choice. Associate the label with the select trigger so the surrounding layout and the interactive control communicate the same purpose.\n\nConnect help and validation to the control, use stable option values, and inspect [Select](/docs/select/installation) for grouped and unavailable-choice patterns.",
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
      text: "**Explain the Value and Its Unit.** Use `FieldTitle` and `FieldDescription` around a `Slider` when the value is chosen along a range. Explain the scale and current value in text so the thumb's position is not the only way to interpret the setting.\n\nName the actual slider control as well as the surrounding field, choose a meaningful step, and avoid requiring precise values that are difficult to select by dragging alone.",
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
      text: "**Group Controls that Answer One Larger Question.** Use a fieldset legend to introduce several inputs that answer one larger question. A description and grid layout can then organize the individual values without repeating the group's explanation beside every control.\n\nKeep the shared description separate from field-specific errors and preserve a sensible reading order when changing the grid from multiple columns to a narrow single-column layout.",
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
      text: "**Keep the Choice and Its Explanation Together.** Arrange checkbox fields horizontally with `FieldContent` holding the label and explanation beside each control. This gives longer preference descriptions room to wrap while preserving a clear association with the corresponding checked state.\n\nPreserve label activation and description associations, and ensure wrapped copy aligns naturally without shrinking the checkbox or separating it from the words that explain its state.",
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
      text: "**Name the Question and Each Exclusive Answer.** Place `RadioGroup` inside `FieldSet` when several options answer one mutually exclusive question. The legend names the choice, while each option's label explains one value that may be selected.\n\nKeep the options in one logical group, use stable submitted values, and avoid presenting several independently labeled controls when only one answer is allowed.",
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
      text: "**Describe the Setting in Its Enabled State.** Pair a `Switch` with a label in a horizontal field for a boolean preference. The label explains what enabling the setting does, while the switch displays the current value supplied by the application.\n\nExplain whether changes apply immediately or require saving, and keep the label tied to the actual switch so both the wording and control activate the same setting.",
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
      title: "Choice Card",
      text: "**Make a Larger Option Easier to Scan and Select.** Wrap the radio field in `FieldLabel` to make the choice-card surface part of the labeled option. The larger target accommodates supporting details while the radio control still represents one value in the shared group.\n\nKeep the entire selection relationship clear, avoid nested unrelated actions, and make selected state visible through more than a subtle background change.",
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
      title: "Field Group + Separator",
      text: "**Break Long Forms into Meaningful Sections.** Stack related fieldsets and insert `FieldSeparator` between distinct topics in a longer form. This adds a quiet structural break without changing the association between each group's legend and its controls.\n\nPreserve the same logical order on narrow screens, and keep validation messages near their fields instead of collecting all feedback between sections.",
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
      title: "FieldError (Errors Array)",
      text: "**Show Useful Validation Feedback without Duplication.** Pass an `errors` array to `FieldError` when validation produces structured messages for a field. The error component presents that feedback; the form integration remains responsible for deciding which messages belong to the current value.\n\nConnect the rendered error to its control and decide when it appears, especially after the first unsuccessful submit.",
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
      title: "Responsive Orientation",
      text: "**Adapt to the Form Container, Not Only the Screen.** Use the responsive field orientation inside a container-aware `FieldGroup`. The layout stacks at narrow widths and changes at `@md`, adapting to its actual available space rather than assuming the full page width.\n\nTest long labels and errors in each arrangement, and preserve the DOM reading order so the visual switch does not change the meaning of the form.",
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
      text: '**Check the Whole Pattern in Its Reading Direction.** Set `dir="rtl"` on the fieldset for a translated group of controls. Review labels, descriptions, error text and logical spacing together so the form remains one coherent reading sequence.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.',
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
      title: "Legacy Error",
      text: "**Keep the Correction Close to the Input.** Supply the legacy `error` prop when using the compact `Field` wrapper's validation presentation. Keep the message tied to the actual failed rule and update it when the underlying value is corrected.\n\nAssociate the feedback with the control through `aria-describedby` where appropriate, and expose its invalid state with `aria-invalid`. Try submitting an empty value and then correcting it to check the entire feedback cycle.",
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
