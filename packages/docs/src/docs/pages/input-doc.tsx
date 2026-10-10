import {
  Badge,
  Button,
  ButtonGroup,
  Field,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kamod-ch/ui";
import { Info } from "lucide-preact";
import { createGenericDocPage } from "./create-generic-doc-page";

const p = "input-doc";

export const inputDocPage = createGenericDocPage({
  slug: "input",
  title: "Input",
  previewCode: `import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field
    label="API Key"
    description="Your API key is encrypted and stored securely."
  >
    <Input id="${p}-demo-api" type="password" placeholder="sk-..." class="max-w-md" />
  </Field>
);`,
  usageLabel:
    "Single-line text control — shadcn-aligned styling, sizes, Field composition, file type, and groups.",
  installationText: "Import Input from `@/components/kamod-ui/input`.",
  usageText:
    'Pair with Field for label and description. Use orientation="horizontal" on Field for search + button rows. Use InputGroup for prefixed text and icons; ButtonGroup to attach a button flush to the input.',
  exampleSections: [
    {
      id: "input-demo",
      title: "Demo",
      text: "**Keep the Field Understandable after Typing Begins.** Compose a password `Input` with a visible label and helper text describing the expected value. The example focuses on the field presentation; your form still determines the password rules, validation and submission behavior.\n\nFor passwords, choose suitable autocomplete behavior and describe requirements before submission; the input's visual style does not supply validation or secure storage.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field
    label="API Key"
    description="Your API key is encrypted and stored securely."
  >
    <Input id="demo-api" type="password" placeholder="sk-..." class="max-w-md" />
  </Field>
);`,
      renderPreview: () => (
        <Field label="API Key" description="Your API key is encrypted and stored securely.">
          <Input id={`${p}-demo-api`} type="password" placeholder="sk-..." class="max-w-md" />
        </Field>
      ),
    },
    {
      id: "input-basic",
      title: "Basic",
      text: "**Use the Minimal Control as a Starting Point.** Use the minimal `Input` to inspect the component's default appearance and placeholder treatment. Before integrating it into a form, add the naming and value requirements that explain what users should enter.\n\nAdd a visible label or a deliberate accessible name in the finished form, and choose the appropriate input type, autocomplete setting and validation rules for the value.",
      code: `import { Input } from "@/components/kamod-ui/input";

export const Example = () => <Input placeholder="Enter text" class="max-w-md" />;`,
      renderPreview: () => <Input placeholder="Enter text" class="max-w-md" />,
    },
    {
      id: "input-field",
      title: "Field",
      text: "**Put Guidance Next to the Value It Explains.** Pass label and description content through `Field` to introduce a text input and its expected format. The wrapper provides local context while the input remains the element that receives focus and accepts the value.\n\nPreserve the identifier and help-text associations when copying the pattern, and keep field-specific errors in the same local context.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field
    label="Username"
    description="Choose a unique username for your account."
  >
    <Input id="username" type="text" placeholder="Enter your username" class="max-w-md" />
  </Field>
);`,
      renderPreview: () => (
        <Field label="Username" description="Choose a unique username for your account.">
          <Input
            id={`${p}-username`}
            type="text"
            placeholder="Enter your username"
            class="max-w-md"
          />
        </Field>
      ),
    },
    {
      id: "input-field-group",
      title: "Field Group",
      text: "**Organize a Short Sequence of Related Fields.** Stack related `Field` blocks and place their actions in a shared row after the final input. This gives a short form a clear reading sequence, from explaining each value to deciding what to do with the completed entries.\n\nKeep button types explicit inside a form, choose a meaningful submit label, and test the layout with error messages as well as the initial empty fields.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <div class="flex w-full max-w-md flex-col gap-6">
    <Field label="Name">
      <Input id="fg-name" placeholder="Jordan Lee" />
    </Field>
    <Field
      label="Email"
      description="We'll send updates to this address."
    >
      <Input id="fg-email" type="email" placeholder="name@example.com" />
    </Field>
    <Field orientation="horizontal">
      <Button type="reset" variant="outline">
        Reset
      </Button>
      <Button type="submit">Submit</Button>
    </Field>
  </div>
);`,
      renderPreview: () => (
        <div class="flex w-full max-w-md flex-col gap-6">
          <Field label="Name">
            <Input id={`${p}-fg-name`} placeholder="Jordan Lee" />
          </Field>
          <Field label="Email" description="We'll send updates to this address.">
            <Input id={`${p}-fg-email`} type="email" placeholder="name@example.com" />
          </Field>
          <Field orientation="horizontal">
            <Button type="reset" variant="outline">
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </div>
      ),
    },
    {
      id: "input-disabled",
      title: "Disabled",
      text: "**Explain Why Entry Is Unavailable.** Set `disabled` on `Input` and coordinate the field's disabled presentation when entry is temporarily unavailable. The existing label and value remain part of the form's explanation even though the control cannot be edited.\n\nPlace prerequisites nearby and remember that disabled native controls behave differently from read-only fields during interaction and submission; choose the state according to the actual workflow.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field label="Email" disabled description="This field is currently disabled.">
    <Input id="dis-email" type="email" placeholder="Email" disabled class="max-w-md" />
  </Field>
);`,
      renderPreview: () => (
        <Field label="Email" disabled description="This field is currently disabled.">
          <Input id={`${p}-dis-email`} type="email" placeholder="Email" disabled class="max-w-md" />
        </Field>
      ),
    },
    {
      id: "input-invalid",
      title: "Invalid",
      text: "**Tell Users How to Correct the Value.** Set `aria-invalid` on `Input` and the field's invalid state when a validation rule fails. Keep the actual error message nearby so the styled boundary leads to an understandable correction rather than only a color change.\n\nDecide when validation runs and how feedback clears, so a corrected value does not remain visually marked as wrong without explanation.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field
    label="Invalid Input"
    invalid
    description="This field contains validation errors."
  >
    <Input id="inv" placeholder="Error" aria-invalid class="max-w-md" />
  </Field>
);`,
      renderPreview: () => (
        <Field label="Invalid Input" invalid description="This field contains validation errors.">
          <Input id={`${p}-inv`} placeholder="Error" aria-invalid class="max-w-md" />
        </Field>
      ),
    },
    {
      id: "input-file",
      title: "File",
      text: '**Separate Selecting from Uploading.** Set `type="file"` to use the browser\'s file chooser and style its native button with `file:*` utilities. The selected file is only the beginning of the workflow; upload state and service responses belong to the application.\n\nExplain limits before selection, show useful failure messages, and avoid treating the displayed filename as proof of a completed upload.',
      code: `import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field label="Picture" description="Select a picture to upload.">
    <Input id="pic" type="file" class="max-w-md" />
  </Field>
);`,
      renderPreview: () => (
        <Field label="Picture" description="Select a picture to upload.">
          <Input id={`${p}-pic`} type="file" class="max-w-md" />
        </Field>
      ),
    },
    {
      id: "input-inline",
      title: "Inline",
      text: "**Pair a Compact Query with Its Action.** Place a search input and its button in one horizontal field when they form a single query action. Keep the entry area flexible so the typed text remains useful alongside the action at narrower widths.\n\nGive the input a real name, support Enter where appropriate, and let the layout adapt before the button or value becomes cramped.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field orientation="horizontal" class="max-w-md">
    <Input type="search" placeholder="Search..." class="min-w-0 flex-1" />
    <Button>Search</Button>
  </Field>
);`,
      renderPreview: () => (
        <Field orientation="horizontal" class="max-w-md">
          <Input type="search" placeholder="Search..." class="min-w-0 flex-1" />
          <Button>Search</Button>
        </Field>
      ),
    },
    {
      id: "input-grid",
      title: "Grid",
      text: "**Use Columns Only When the Fields Belong Together.** Use a two-column grid for closely related fields when sufficient width is available. The same markup should read naturally when the grid stacks, with labels and errors remaining adjacent to their own controls.\n\nTest longer labels and validation messages, and avoid making unrelated values appear paired merely because there is spare horizontal space.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <div class="grid max-w-sm grid-cols-2 gap-4">
    <Field label="First Name">
      <Input id="fn" placeholder="Jordan" />
    </Field>
    <Field label="Last Name">
      <Input id="ln" placeholder="Lee" />
    </Field>
  </div>
);`,
      renderPreview: () => (
        <div class="grid max-w-sm grid-cols-2 gap-4">
          <Field label="First Name">
            <Input id={`${p}-fn`} placeholder="Jordan" />
          </Field>
          <Field label="Last Name">
            <Input id={`${p}-ln`} placeholder="Lee" />
          </Field>
        </div>
      ),
    },
    {
      id: "input-required",
      title: "Required",
      text: "**Communicate Requirements in Text and Behavior.** Use `Field.required` to display the visual requirement marker, then align the input's real validation with that promise. The asterisk introduces the rule; it does not itself decide whether the form can be submitted.\n\nExplain the marker where necessary and handle missing values accessibly; visual decoration on a wrapper does not independently enforce a submitted value.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field
    required
    label="Required Field"
    description="This field must be filled out."
  >
    <Input id="req" placeholder="This field is required" required class="max-w-md" />
  </Field>
);`,
      renderPreview: () => (
        <Field required label="Required Field" description="This field must be filled out.">
          <Input id={`${p}-req`} placeholder="This field is required" required class="max-w-md" />
        </Field>
      ),
    },
    {
      id: "input-badge",
      title: "Badge",
      text: "**Keep Label Metadata Secondary.** Add a small badge beside the field label for metadata such as an optional or recommended value. Keep that badge secondary to the field name and distinct from the actual validation feedback shown for the entered value.\n\nUse concise wording, preserve the label association, and ensure any requirement represented by the badge is also reflected in the field's actual validation and instructions.",
      code: `import { Badge } from "@/components/kamod-ui/badge"
import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field
    label={
      <span class="flex w-full items-center gap-2">
        Webhook URL
        <Badge variant="secondary" class="ms-auto">
          Beta
        </Badge>
      </span>
    }
  >
    <Input id="wh" type="url" placeholder="https://api.example.com/webhook" class="max-w-md" />
  </Field>
);`,
      renderPreview: () => (
        <Field
          label={
            <span class="flex w-full items-center gap-2">
              Webhook URL
              <Badge variant="secondary" class="ms-auto">
                Beta
              </Badge>
            </span>
          }
        >
          <Input
            id={`${p}-wh`}
            type="url"
            placeholder="https://api.example.com/webhook"
            class="max-w-md"
          />
        </Field>
      ),
    },
    {
      id: "input-input-group",
      title: "Input Group",
      text: "**Clarify the Value with a Prefix or Suffix.** Compose [Input Group](/docs/input-group/installation) around the input when a prefix, suffix or icon explains its format. The surrounding addon provides context without requiring that decorative text to become part of the editable value.\n\nKeep decorative addons out of the focus order; give real addon actions their own accessible names. Test a long value beside the prefix and icon, allowing the field to grow before the supporting elements crowd out the editable content.",
      code: `import { Info } from "lucide-preact";
import { Field } from "@/components/kamod-ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/kamod-ui/input-group";

export const Example = () => (
  <Field label="Website URL">
    <InputGroup class="max-w-md">
      <InputGroupInput id="url" placeholder="example.com" />
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Info class="size-4" aria-hidden />
      </InputGroupAddon>
    </InputGroup>
  </Field>
);`,
      renderPreview: () => (
        <Field label="Website URL">
          <InputGroup class="max-w-md">
            <InputGroupInput id={`${p}-url`} placeholder="example.com" />
            <InputGroupAddon>
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Info class="size-4" aria-hidden />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      ),
    },
    {
      id: "input-button-group",
      title: "Button Group",
      text: "**Keep a Single Entry Task Visually Joined.** Use [Button Group](/docs/button-group/installation) to join an input and its action into one continuous control. The shared boundary communicates their relationship while the input and button keep separate names and interaction roles.\n\nKeep their individual semantics intact, label the input separately from its placeholder, and allow enough width for both the typed value and the longest action label.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group"
import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field label="Search">
    <ButtonGroup class="max-w-md w-full">
      <Input id="bg-search" placeholder="Type to search..." class="min-w-0 flex-1 rounded-e-none border-e-0" />
      <Button variant="outline" class="rounded-s-none shrink-0">
        Search
      </Button>
    </ButtonGroup>
  </Field>
);`,
      renderPreview: () => (
        <Field label="Search">
          <ButtonGroup class="max-w-md w-full">
            <Input
              id={`${p}-bg-search`}
              placeholder="Type to search..."
              class="min-w-0 flex-1 rounded-e-none border-e-0"
            />
            <Button variant="outline" class="rounded-s-none shrink-0">
              Search
            </Button>
          </ButtonGroup>
        </Field>
      ),
    },
    {
      id: "input-form",
      title: "Form",
      text: "**Check the Complete Form Rather than Isolated Controls.** Combine text inputs with a `Select` for a complete form layout, associating the country label with the select trigger's `id`. This illustrates how different control types can share one field rhythm and submission context.\n\nConnect errors to the relevant controls, preserve entered values after a failed request, and use [Formisch](/docs/formisch/installation) when schema-driven state management fits the application.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input"
import { Label } from "@/components/kamod-ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/kamod-ui/select";

export const Example = () => (
  <form class="flex w-full max-w-sm flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
    <Field label="Name">
      <Input id="form-name" type="text" placeholder="Evil Rabbit" required />
    </Field>
    <Field label="Email" description="We'll never share your email with anyone.">
      <Input id="form-email" type="email" placeholder="john@example.com" />
    </Field>
    <div class="grid grid-cols-2 gap-4">
      <Field label="Phone">
        <Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
      </Field>
      <div class="grid gap-2">
        <Label htmlFor="form-country">Country</Label>
        <Select defaultValue="us">
          <SelectTrigger id="form-country" class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <Field label="Address">
      <Input id="form-address" type="text" placeholder="123 Main St" />
    </Field>
    <Field orientation="horizontal">
      <Button type="button" variant="outline">
        Cancel
      </Button>
      <Button type="submit">Submit</Button>
    </Field>
  </form>
);`,
      renderPreview: () => (
        <form class="flex w-full max-w-sm flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <Field label="Name">
            <Input id={`${p}-form-name`} type="text" placeholder="Evil Rabbit" required />
          </Field>
          <Field label="Email" description="We'll never share your email with anyone.">
            <Input id={`${p}-form-email`} type="email" placeholder="john@example.com" />
          </Field>
          <div class="grid grid-cols-2 gap-4">
            <Field label="Phone">
              <Input id={`${p}-form-phone`} type="tel" placeholder="+1 (555) 123-4567" />
            </Field>
            <div class="grid gap-2">
              <Label htmlFor={`${p}-form-country`}>Country</Label>
              <Select defaultValue="us">
                <SelectTrigger id={`${p}-form-country`} class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Field label="Address">
            <Input id={`${p}-form-address`} type="text" placeholder="123 Main St" />
          </Field>
          <Field orientation="horizontal">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </form>
      ),
    },
    {
      id: "input-sizes",
      title: "Sizes",
      text: "**Choose One Density for a Local Form Section.** Choose `sm`, `md` or `lg` to adjust input height and typography together. Compare the same label and value across sizes so density remains a deliberate choice for the form rather than a per-field improvisation.\n\nTest both short and long content before choosing a compact size, and leave sufficient interaction space for fields used frequently on touch screens.",
      code: `import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <div class="grid w-full max-w-md gap-3">
    <Input size="sm" placeholder="Small input" />
    <Input size="md" placeholder="Default (md)" />
    <Input size="lg" placeholder="Large input" />
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-full max-w-md gap-3">
          <Input size="sm" placeholder="Small input" />
          <Input size="md" placeholder="Default (md)" />
          <Input size="lg" placeholder="Large input" />
        </div>
      ),
    },
    {
      id: "input-rtl",
      title: "RTL",
      text: '**Check the Whole Pattern in Its Reading Direction.** Set `dir="rtl"` on the translated field and input composition. Review labels, entered text, helper messages and action placement together, keeping logical alignment consistent across the entire form row.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.',
      code: `import { Field } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

export const Example = () => (
  <Field
    dir="rtl"
    label="مفتاح API"
    description="مفتاح API الخاص بك مشفر ومخزن بأمان."
  >
    <Input id="rtl-api" type="password" placeholder="sk-..." dir="rtl" class="max-w-md" />
  </Field>
);`,
      renderPreview: () => (
        <Field dir="rtl" label="مفتاح API" description="مفتاح API الخاص بك مشفر ومخزن بأمان.">
          <Input
            id={`${p}-rtl-api`}
            type="password"
            placeholder="sk-..."
            dir="rtl"
            class="max-w-md"
          />
        </Field>
      ),
    },
  ],
  apiRows: [
    { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"' },
    { prop: "type", type: "string", defaultValue: '"text"' },
    { prop: "placeholder", type: "string", defaultValue: "undefined" },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
    { prop: "aria-invalid", type: "boolean", defaultValue: "false" },
    { prop: "class", type: "string", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Associate inputs with visible labels (Field, or Label with htmlFor). Use semantic types (email, tel, search, password). Mark validation with aria-invalid and describe errors in Field.error or description.",
});
