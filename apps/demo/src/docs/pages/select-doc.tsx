import {
  Field,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const selectDocPage = createGenericDocPage({
  slug: "select",
  title: "Select",
  usageLabel: "Select provides a modern Radix-style single-choice picker.",
  installationText: "Import Select primitives from `@/components/kamod-ui/select`.",
  usageText:
    "Compose trigger, value, groups and content items to build accessible single-select dropdowns.",
  exampleSections: [
    {
      id: "basic-select",
      title: "Basic Select",
      text: "Select one option from a compact modern dropdown list.",
      code: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/kamod-ui/select";

export const Example = () => (
  <Select defaultValue="preact" class="w-full max-w-sm">
    <SelectTrigger>
      <SelectValue placeholder="Select framework" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="react">React</SelectItem>
      <SelectItem value="preact">Preact</SelectItem>
      <SelectItem value="svelte">Svelte</SelectItem>
    </SelectContent>
  </Select>
);`,
      renderPreview: () => (
        <Select defaultValue="preact" class="w-full max-w-sm">
          <SelectTrigger>
            <SelectValue placeholder="Select framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="preact">Preact</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "select-groups",
      title: "Groups and Separators",
      text: "Use labels and separators to organize larger option sets.",
      code: `import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/kamod-ui/select";

export const Example = () => (
  <Select defaultValue="berlin" class="w-full max-w-sm">
    <SelectTrigger>
      <SelectValue placeholder="Choose city" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Europe</SelectLabel>
        <SelectItem value="berlin">Berlin</SelectItem>
        <SelectItem value="zurich">Zurich</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Americas</SelectLabel>
        <SelectItem value="new-york">New York</SelectItem>
        <SelectItem value="sao-paulo">Sao Paulo</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);`,
      renderPreview: () => (
        <Select defaultValue="berlin" class="w-full max-w-sm">
          <SelectTrigger>
            <SelectValue placeholder="Choose city" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              <SelectItem value="berlin">Berlin</SelectItem>
              <SelectItem value="zurich">Zurich</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Americas</SelectLabel>
              <SelectItem value="new-york">New York</SelectItem>
              <SelectItem value="sao-paulo">Sao Paulo</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "select-disabled",
      title: "Disabled Items",
      text: "Disable unavailable entries while keeping the same list structure.",
      code: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/kamod-ui/select";

export const Example = () => (
  <Select class="w-full max-w-sm">
    <SelectTrigger>
      <SelectValue placeholder="Pick deployment region" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="fra1">Frankfurt (FRA1)</SelectItem>
      <SelectItem value="ams1">Amsterdam (AMS1)</SelectItem>
      <SelectItem value="iad1" disabled>
        Washington (IAD1) - Maintenance
      </SelectItem>
      <SelectItem value="sin1">Singapore (SIN1)</SelectItem>
    </SelectContent>
  </Select>
);`,
      renderPreview: () => (
        <Select class="w-full max-w-sm">
          <SelectTrigger>
            <SelectValue placeholder="Pick deployment region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fra1">Frankfurt (FRA1)</SelectItem>
            <SelectItem value="ams1">Amsterdam (AMS1)</SelectItem>
            <SelectItem value="iad1" disabled>
              Washington (IAD1) - Maintenance
            </SelectItem>
            <SelectItem value="sin1">Singapore (SIN1)</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "select-scrollable",
      title: "Scrollable Content",
      text: "Use the default max-height content to keep long lists usable.",
      code: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/kamod-ui/select";

const timezones = [
  "UTC",
  "Europe/Berlin",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland"
];

export const Example = () => (
  <Select defaultValue="Europe/Berlin" class="w-full max-w-sm">
    <SelectTrigger>
      <SelectValue placeholder="Select timezone" />
    </SelectTrigger>
    <SelectContent>
      {timezones.map((zone) => (
        <SelectItem key={zone} value={zone}>
          {zone}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);`,
      renderPreview: () => (
        <Select defaultValue="Europe/Berlin" class="w-full max-w-sm">
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UTC">UTC</SelectItem>
            <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
            <SelectItem value="Europe/London">Europe/London</SelectItem>
            <SelectItem value="America/New_York">America/New_York</SelectItem>
            <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
            <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
            <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
            <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
            <SelectItem value="Pacific/Auckland">Pacific/Auckland</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "select-invalid",
      title: "Invalid State",
      text: "Combine with Field and ARIA invalid attributes for error presentation.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/kamod-ui/select";

export const Example = () => (
  <Field label="Environment" error="Please choose a deployment environment." data-invalid>
    <Select class="w-full max-w-sm">
      <SelectTrigger aria-invalid>
        <SelectValue placeholder="Select environment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="dev">Development</SelectItem>
        <SelectItem value="staging">Staging</SelectItem>
        <SelectItem value="prod">Production</SelectItem>
      </SelectContent>
    </Select>
  </Field>
);`,
      renderPreview: () => (
        <Field
          label="Environment"
          error="Please choose a deployment environment."
          data-invalid
          class="w-full max-w-sm"
        >
          <Select>
            <SelectTrigger aria-invalid>
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dev">Development</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="prod">Production</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      ),
    },
  ],
  apiRows: [
    { prop: "defaultValue", type: "string", defaultValue: "undefined" },
    { prop: "value", type: "string", defaultValue: "uncontrolled" },
    { prop: "onValueChange", type: "(value: string) => void", defaultValue: "undefined" },
    { prop: "SelectItem value", type: "string", defaultValue: "required" },
    { prop: "SelectItem disabled", type: "boolean", defaultValue: "false" },
    { prop: "SelectContent forceMount", type: "boolean", defaultValue: "false" },
  ],
  accessibilityText:
    "Provide clear option labels, mark invalid triggers with aria-invalid, and keep placeholder text distinct from valid selections.",
});
