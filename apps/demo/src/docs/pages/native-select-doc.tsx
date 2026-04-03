import {
  Label,
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const nativeSelectDocPage = createGenericDocPage({
  slug: "native-select",
  title: "Native Select",
  usageLabel:
    "Browser-native `<select>` with Kamod styling, chevron affordance, sizes, validation states, and RTL-friendly layout — aligned with Starwind UI patterns.",
  installationText: "Import NativeSelect, NativeSelectOption, and optionally NativeSelectOptGroup from `@/components/kamod-ui/native-select`.",
  usageText:
    "Use NativeSelect for forms that should use the platform picker on mobile. Pair with Label and `aria-invalid` for accessible validation. Prefer the custom Select when you need search, portals, or rich option content.",
  exampleSections: [
    {
      id: "native-select-default",
      title: "Default",
      text: "Fruit picker with a disabled placeholder option — mirrors the primary Starwind example.",
      code: `import { NativeSelect, NativeSelectOption } from "@/components/kamod-ui/native-select";

export const Example = () => (
  <NativeSelect class="w-[240px]" defaultValue="">
    <NativeSelectOption value="" disabled>
      Select a fruit
    </NativeSelectOption>
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
    <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
    <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
  </NativeSelect>
);`,
      renderPreview: () => (
        <NativeSelect class="w-[240px]" defaultValue="">
          <NativeSelectOption value="" disabled>
            Select a fruit
          </NativeSelectOption>
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
          <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
        </NativeSelect>
      )
    },
    {
      id: "native-select-groups",
      title: "Groups",
      text: "Use NativeSelectOptGroup to organize options into categories.",
      code: `import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/kamod-ui/native-select";

export const Example = () => (
  <NativeSelect class="w-[260px]" defaultValue="">
    <NativeSelectOption value="" disabled>
      Select an option
    </NativeSelectOption>
    <NativeSelectOptGroup label="Fruits">
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
    </NativeSelectOptGroup>
    <NativeSelectOptGroup label="Vegetables">
      <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
      <NativeSelectOption value="spinach">Spinach</NativeSelectOption>
    </NativeSelectOptGroup>
  </NativeSelect>
);`,
      renderPreview: () => (
        <NativeSelect class="w-[260px]" defaultValue="">
          <NativeSelectOption value="" disabled>
            Select an option
          </NativeSelectOption>
          <NativeSelectOptGroup label="Fruits">
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Vegetables">
            <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
            <NativeSelectOption value="spinach">Spinach</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      )
    },
    {
      id: "native-select-disabled",
      title: "Disabled",
      text: "Disable the whole control or individual options.",
      code: `import { NativeSelect, NativeSelectOption } from "@/components/kamod-ui/native-select";

export const Example = () => (
  <div class="flex flex-col gap-4">
    <NativeSelect class="w-[220px]" disabled defaultValue="">
      <NativeSelectOption value="" disabled>
        Select framework
      </NativeSelectOption>
      <NativeSelectOption value="astro">Astro</NativeSelectOption>
      <NativeSelectOption value="next">Next.js</NativeSelectOption>
    </NativeSelect>
    <NativeSelect class="w-[220px]" defaultValue="astro">
      <NativeSelectOption value="astro">Astro</NativeSelectOption>
      <NativeSelectOption value="next" disabled>
        Next.js (Disabled)
      </NativeSelectOption>
      <NativeSelectOption value="svelte">SvelteKit</NativeSelectOption>
    </NativeSelect>
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-col gap-4">
          <NativeSelect class="w-[220px]" disabled defaultValue="">
            <NativeSelectOption value="" disabled>
              Select framework
            </NativeSelectOption>
            <NativeSelectOption value="astro">Astro</NativeSelectOption>
            <NativeSelectOption value="next">Next.js</NativeSelectOption>
          </NativeSelect>
          <NativeSelect class="w-[220px]" defaultValue="astro">
            <NativeSelectOption value="astro">Astro</NativeSelectOption>
            <NativeSelectOption value="next" disabled>
              Next.js (Disabled)
            </NativeSelectOption>
            <NativeSelectOption value="svelte">SvelteKit</NativeSelectOption>
          </NativeSelect>
        </div>
      )
    },
    {
      id: "native-select-invalid",
      title: "Invalid",
      text: "Use `aria-invalid` with a visible error message for validation feedback.",
      code: `import { Label } from "@/components/kamod-ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/kamod-ui/native-select";

export const Example = () => (
  <div class="grid w-full max-w-sm gap-2">
    <Label for="native-select-invalid">Framework</Label>
    <NativeSelect id="native-select-invalid" class="w-full" aria-invalid defaultValue="">
      <NativeSelectOption value="" disabled>
        Select a framework
      </NativeSelectOption>
      <NativeSelectOption value="astro">Astro</NativeSelectOption>
      <NativeSelectOption value="next">Next.js</NativeSelectOption>
      <NativeSelectOption value="svelte">SvelteKit</NativeSelectOption>
    </NativeSelect>
    <p class="text-destructive text-sm">Please select a framework.</p>
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-full max-w-sm gap-2">
          <Label for="native-select-invalid">Framework</Label>
          <NativeSelect id="native-select-invalid" class="w-full" aria-invalid defaultValue="">
            <NativeSelectOption value="" disabled>
              Select a framework
            </NativeSelectOption>
            <NativeSelectOption value="astro">Astro</NativeSelectOption>
            <NativeSelectOption value="next">Next.js</NativeSelectOption>
            <NativeSelectOption value="svelte">SvelteKit</NativeSelectOption>
          </NativeSelect>
          <p class="text-destructive text-sm">Please select a framework.</p>
        </div>
      )
    },
    {
      id: "native-select-size",
      title: "Size",
      text: "Use the `size` prop for compact or larger touch targets.",
      code: `import { NativeSelect, NativeSelectOption } from "@/components/kamod-ui/native-select";

export const Example = () => (
  <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
    <NativeSelect size="sm" class="w-[180px]" defaultValue="">
      <NativeSelectOption value="" disabled>
        Small
      </NativeSelectOption>
      <NativeSelectOption value="one">Option 1</NativeSelectOption>
      <NativeSelectOption value="two">Option 2</NativeSelectOption>
    </NativeSelect>
    <NativeSelect size="md" class="w-[180px]" defaultValue="">
      <NativeSelectOption value="" disabled>
        Medium
      </NativeSelectOption>
      <NativeSelectOption value="one">Option 1</NativeSelectOption>
      <NativeSelectOption value="two">Option 2</NativeSelectOption>
    </NativeSelect>
    <NativeSelect size="lg" class="w-[180px]" defaultValue="">
      <NativeSelectOption value="" disabled>
        Large
      </NativeSelectOption>
      <NativeSelectOption value="one">Option 1</NativeSelectOption>
      <NativeSelectOption value="two">Option 2</NativeSelectOption>
    </NativeSelect>
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
          <NativeSelect size="sm" class="w-[180px]" defaultValue="">
            <NativeSelectOption value="" disabled>
              Small
            </NativeSelectOption>
            <NativeSelectOption value="one">Option 1</NativeSelectOption>
            <NativeSelectOption value="two">Option 2</NativeSelectOption>
          </NativeSelect>
          <NativeSelect size="md" class="w-[180px]" defaultValue="">
            <NativeSelectOption value="" disabled>
              Medium
            </NativeSelectOption>
            <NativeSelectOption value="one">Option 1</NativeSelectOption>
            <NativeSelectOption value="two">Option 2</NativeSelectOption>
          </NativeSelect>
          <NativeSelect size="lg" class="w-[180px]" defaultValue="">
            <NativeSelectOption value="" disabled>
              Large
            </NativeSelectOption>
            <NativeSelectOption value="one">Option 1</NativeSelectOption>
            <NativeSelectOption value="two">Option 2</NativeSelectOption>
          </NativeSelect>
        </div>
      )
    },
    {
      id: "native-select-vs-select",
      title: "Native Select vs Select",
      text: "Choose NativeSelect for platform-native pickers and simple forms. Use the custom Select component when you need search, grouped virtualized lists, or rich option UI.",
      code: `// NativeSelect — mobile-friendly, zero JS overlay, full form semantics.
import { NativeSelect, NativeSelectOption } from "@/components/kamod-ui/native-select";

// Select — popover, keyboard nav, and advanced patterns (see Select docs).
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/kamod-ui/select";`,
      renderPreview: () => (
        <div class="bg-muted/50 text-muted-foreground rounded-lg border p-4 text-sm leading-relaxed">
          <p class="text-foreground mb-2 font-medium">When to use which</p>
          <ul class="list-inside list-disc space-y-1">
            <li>
              <span class="text-foreground font-medium">NativeSelect</span> — straightforward controls, native mobile
              sheets, minimal bundle cost.
            </li>
            <li>
              <span class="text-foreground font-medium">Select</span> — searchable options, custom styling inside the
              list, or alignment with other overlay primitives.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: "native-select-rtl",
      title: "RTL",
      text: "Set `dir=\"rtl\"` on a wrapper; padding and chevron use logical properties so the control mirrors correctly.",
      code: `import { NativeSelect, NativeSelectOption } from "@/components/kamod-ui/native-select";

export const Example = () => (
  <div dir="rtl">
    <NativeSelect class="w-[240px]" defaultValue="">
      <NativeSelectOption value="" disabled>
        Select a fruit
      </NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="grape">Grape</NativeSelectOption>
    </NativeSelect>
  </div>
);`,
      renderPreview: () => (
        <div dir="rtl">
          <NativeSelect class="w-[240px]" defaultValue="">
            <NativeSelectOption value="" disabled>
              Select a fruit
            </NativeSelectOption>
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
            <NativeSelectOption value="grape">Grape</NativeSelectOption>
          </NativeSelect>
        </div>
      )
    }
  ],
  apiRows: [
    { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"' },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
    { prop: "defaultValue", type: "string", defaultValue: "undefined" },
    { prop: "name", type: "string", defaultValue: "undefined" },
    { prop: "id", type: "string", defaultValue: "undefined" },
    { prop: "aria-invalid", type: "boolean", defaultValue: "false" },
    { prop: "icon", type: "ComponentChildren", defaultValue: "chevron SVG" },
    { prop: "class", type: "string", defaultValue: "undefined" },
    { prop: "…", type: "native <select> attributes", defaultValue: "—" }
  ],
  accessibilityText:
    "Associate selects with Label using `id` / `for`. Use a disabled first option as a visible placeholder when no value is selected. Announce errors with nearby text and `aria-invalid` on the select."
});
