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
} from "@kamod-ui/core";
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
      text: "Password field with label and helper text (shadcn InputDemo).",
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
      text: "Minimal placeholder (shadcn Basic).",
      code: `import { Input } from "@/components/kamod-ui/input";

export const Example = () => <Input placeholder="Enter text" class="max-w-md" />;`,
      renderPreview: () => <Input placeholder="Enter text" class="max-w-md" />,
    },
    {
      id: "input-field",
      title: "Field",
      text: "Label and description via Field props.",
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
      title: "Field group",
      text: "Stack multiple Field blocks and a horizontal action row (shadcn Field Group).",
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
      text: "disabled on Input and Field.disabled for group tone (shadcn Disabled).",
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
      text: "aria-invalid on Input and Field.invalid (shadcn Invalid).",
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
      text: 'type="file" with file:* styling on Input (shadcn File).',
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
      text: "Search field and button in one horizontal Field (shadcn Inline).",
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
      text: "Two columns with CSS grid (shadcn Grid).",
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
      text: "Field.required shows an asterisk (shadcn Required).",
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
      text: "Badge in the label row (shadcn Badge).",
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
      title: "Input group",
      text: "Prefix text and trailing icon via InputGroup (shadcn Input Group).",
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
      title: "Button group",
      text: "Flush input + button via ButtonGroup (shadcn Button Group).",
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
      text: "Full form with Select (shadcn Form). Country uses Label + id on SelectTrigger.",
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
      text: "sm / md / lg height and typography.",
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
      text: 'dir="rtl" on Field and Input for Arabic-style layout (shadcn RTL).',
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
