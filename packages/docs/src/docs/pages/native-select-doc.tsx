import { Label, NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const nativeSelectDocPage = createGenericDocPage({
  slug: "native-select",
  title: "Native Select",
  previewChromeClass: "min-w-0 overflow-x-auto py-4 sm:py-6",
  usageLabel:
    "Browser-native `<select>` with Kamod styling, chevron affordance, sizes, validation states, and RTL-friendly layout — aligned with Starwind UI patterns.",
  installationText:
    "Import NativeSelect, NativeSelectOption, and optionally NativeSelectOptGroup from `@/components/kamod-ui/native-select`.",
  usageText:
    "Use NativeSelect for forms that should use the platform picker on mobile. Pair with Label and `aria-invalid` for accessible validation. Prefer the custom Select when you need search, portals, or rich option content.",
  exampleSections: [
    {
      id: "native-select-default",
      title: "Default",
      text: "**Keep the Browser-Native Interaction Predictable.** Pair `NativeSelect` with a `Label` and matching identifiers, then use an empty first option with `required` when a choice is mandatory. The native browser control supplies the picker while the field explains its purpose.\n\nUse stable option values and a deliberate empty state, and ensure application validation agrees with the native `required` behavior rather than relying on placeholder styling alone.",
      code: `import { Label } from "@/components/kamod-ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/kamod-ui/native-select";

export const Example = () => (
  <div class="flex w-full min-w-0 max-w-[240px] flex-col gap-2">
    <Label for="native-select-fruit">Fruit</Label>
    <NativeSelect id="native-select-fruit" class="w-full" required defaultValue="">
      <NativeSelectOption value="">Select a fruit</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
    </NativeSelect>
  </div>
);`,
      renderPreview: () => (
        <div class="flex w-full min-w-0 max-w-[240px] flex-col gap-2">
          <Label for="native-select-fruit">Fruit</Label>
          <NativeSelect id="native-select-fruit" class="w-full" required defaultValue="">
            <NativeSelectOption value="">Select a fruit</NativeSelectOption>
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
            <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
            <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
          </NativeSelect>
        </div>
      ),
    },
    {
      id: "native-select-groups",
      title: "Groups",
      text: "**Categorize Options without Changing Selection Semantics.** Use `NativeSelectOptGroup` to organize related options under shared labels within the browser's own picker. This helps distinguish categories without replacing native selection behavior with a custom popup implementation.\n\nKeep category names brief, avoid many tiny groups, and test the actual platform picker because native presentation varies by device.",
      code: `import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/kamod-ui/native-select";

export const Example = () => (
  <NativeSelect class="w-[260px]" required defaultValue="">
    <NativeSelectOption value="">Select an option</NativeSelectOption>
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
        <NativeSelect class="w-[260px]" required defaultValue="">
          <NativeSelectOption value="">Select an option</NativeSelectOption>
          <NativeSelectOptGroup label="Fruits">
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Vegetables">
            <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
            <NativeSelectOption value="spinach">Spinach</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      ),
    },
    {
      id: "native-select-disabled",
      title: "Disabled",
      text: "**Distinguish an Unavailable Field from an Unavailable Choice.** Disable the entire native select when the choice is unavailable, or disable individual options that cannot currently be selected. Preserve meaningful labels so the remaining options and current value still make sense in context.\n\nExplain prerequisites outside the picker and check the current value when options become unavailable after a related field changes.",
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
      ),
    },
    {
      id: "native-select-invalid",
      title: "Invalid",
      text: "**Pair Invalid State with a Correction.** Set `aria-invalid` on the select and show a nearby explanation when validation rejects the current choice. The browser-native interaction stays familiar while the application's message describes what the user needs to correct.\n\nKeep the label visible and update feedback after correction; a colored border alone is not enough to describe the problem.",
      code: `import { Label } from "@/components/kamod-ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/kamod-ui/native-select";

export const Example = () => (
  <div class="grid w-full min-w-0 max-w-sm gap-2">
    <Label for="native-select-invalid">Framework</Label>
    <NativeSelect id="native-select-invalid" class="w-full" aria-invalid required defaultValue="">
      <NativeSelectOption value="">Select a framework</NativeSelectOption>
      <NativeSelectOption value="astro">Astro</NativeSelectOption>
      <NativeSelectOption value="next">Next.js</NativeSelectOption>
      <NativeSelectOption value="svelte">SvelteKit</NativeSelectOption>
    </NativeSelect>
    <p class="text-destructive text-sm">Please select a framework.</p>
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-full min-w-0 max-w-sm gap-2">
          <Label for="native-select-invalid">Framework</Label>
          <NativeSelect
            id="native-select-invalid"
            class="w-full"
            aria-invalid
            required
            defaultValue=""
          >
            <NativeSelectOption value="">Select a framework</NativeSelectOption>
            <NativeSelectOption value="astro">Astro</NativeSelectOption>
            <NativeSelectOption value="next">Next.js</NativeSelectOption>
            <NativeSelectOption value="svelte">SvelteKit</NativeSelectOption>
          </NativeSelect>
          <p class="text-destructive text-sm">Please select a framework.</p>
        </div>
      ),
    },
    {
      id: "native-select-size",
      title: "Size",
      text: "**Match the Select to Nearby Fields.** Use the component's `size` option to coordinate the select's visual height with adjacent fields and actions. Compare compact and larger treatments with realistic option labels before choosing a density for the form.\n\nCheck long option names and touch interaction, remembering that the browser controls the opened picker even when the closed field uses your theme's dimensions.",
      code: `import { NativeSelect, NativeSelectOption } from "@/components/kamod-ui/native-select";

export const Example = () => (
  <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
    <NativeSelect size="sm" class="w-[180px]" required defaultValue="">
      <NativeSelectOption value="">Small</NativeSelectOption>
      <NativeSelectOption value="one">Option 1</NativeSelectOption>
      <NativeSelectOption value="two">Option 2</NativeSelectOption>
    </NativeSelect>
    <NativeSelect size="md" class="w-[180px]" required defaultValue="">
      <NativeSelectOption value="">Medium</NativeSelectOption>
      <NativeSelectOption value="one">Option 1</NativeSelectOption>
      <NativeSelectOption value="two">Option 2</NativeSelectOption>
    </NativeSelect>
    <NativeSelect size="lg" class="w-[180px]" required defaultValue="">
      <NativeSelectOption value="">Large</NativeSelectOption>
      <NativeSelectOption value="one">Option 1</NativeSelectOption>
      <NativeSelectOption value="two">Option 2</NativeSelectOption>
    </NativeSelect>
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
          <NativeSelect size="sm" class="w-[180px]" required defaultValue="">
            <NativeSelectOption value="">Small</NativeSelectOption>
            <NativeSelectOption value="one">Option 1</NativeSelectOption>
            <NativeSelectOption value="two">Option 2</NativeSelectOption>
          </NativeSelect>
          <NativeSelect size="md" class="w-[180px]" required defaultValue="">
            <NativeSelectOption value="">Medium</NativeSelectOption>
            <NativeSelectOption value="one">Option 1</NativeSelectOption>
            <NativeSelectOption value="two">Option 2</NativeSelectOption>
          </NativeSelect>
          <NativeSelect size="lg" class="w-[180px]" required defaultValue="">
            <NativeSelectOption value="">Large</NativeSelectOption>
            <NativeSelectOption value="one">Option 1</NativeSelectOption>
            <NativeSelectOption value="two">Option 2</NativeSelectOption>
          </NativeSelect>
        </div>
      ),
    },
    {
      id: "native-select-vs-select",
      title: "Native Select vs Select",
      text: "**Choose the Least Complex Control that Fits the Task.** Choose [Select](/docs/select/installation) or [Combobox](/docs/combobox/installation) when custom popup structure or search is needed. `NativeSelect` is a simpler starting point when platform-native option selection adequately expresses the task.\n\nTry the native version with the keyboard and on a phone before adding more layers. Preserve its label, default value and form submission behavior if you later migrate to a custom control; appearance alone is not a reason to duplicate working field state.",
      code: `// NativeSelect — mobile-friendly, zero JS overlay, full form semantics.
import { NativeSelect, NativeSelectOption } from "@/components/kamod-ui/native-select";

// Select — popover, keyboard nav, and advanced patterns (see Select docs).
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/kamod-ui/select";`,
      renderPreview: () => (
        <div class="bg-muted/50 text-muted-foreground rounded-lg border p-4 text-sm leading-relaxed">
          <p class="text-foreground mb-2 font-medium">When to Use Which</p>
          <ul class="list-inside list-disc space-y-1">
            <li>
              <span class="text-foreground font-medium">NativeSelect</span> — straightforward
              controls, native mobile sheets, minimal bundle cost.
            </li>
            <li>
              <span class="text-foreground font-medium">Select</span> — searchable options, custom
              styling inside the list, or alignment with other overlay primitives.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "native-select-rtl",
      title: "RTL",
      text: '**Check the Whole Pattern in Its Reading Direction.** Apply `dir="rtl"` to the surrounding field when its language requires it. Logical padding and chevron positioning mirror the native-select presentation while the browser continues to provide the actual picker interaction.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.',
      code: `import { NativeSelect, NativeSelectOption } from "@/components/kamod-ui/native-select";

export const Example = () => (
  <div dir="rtl">
    <NativeSelect class="w-[240px]" required defaultValue="">
      <NativeSelectOption value="">Select a fruit</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="grape">Grape</NativeSelectOption>
    </NativeSelect>
  </div>
);`,
      renderPreview: () => (
        <div dir="rtl">
          <NativeSelect class="w-[240px]" required defaultValue="">
            <NativeSelectOption value="">Select a fruit</NativeSelectOption>
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
            <NativeSelectOption value="grape">Grape</NativeSelectOption>
          </NativeSelect>
        </div>
      ),
    },
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
    { prop: "…", type: "native <select> attributes", defaultValue: "—" },
  ],
  accessibilityText:
    "Associate selects with Label using `id` / `for`. For placeholders, prefer `required` with an empty first option so `:invalid` maps to readable `text-foreground/85` on the control; use a disabled first option only when you must block re-selecting the placeholder. Announce errors with nearby text and `aria-invalid` on the select.",
});
