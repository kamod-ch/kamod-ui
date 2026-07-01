import { RadioGroup, SelectableCard } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const selectableCardDocPage = createGenericDocPage({
  slug: "selectable-card",
  title: "Selectable Card",
  usageLabel:
    "Card-style radio options for plan pickers, delivery choices, and other single-select layouts.",
  installationText:
    "Import SelectableCard from `@/components/kamod-ui/selectable-card` and wrap it in RadioGroup.",
  usageText:
    "Use SelectableCard when you want radio semantics with a larger click target. Keep the option text inside the card so the radio gets a clear accessible name. Use defaultValue for uncontrolled groups, or value with onValueChange when the parent owns state.",
  exampleSections: [
    {
      id: "selectable-card-demo",
      title: "Demo",
      text: "A pair of card-style radio options for choosing an infrastructure target.",
      code: `import { RadioGroup } from "@/components/kamod-ui/radio-group";
import { SelectableCard } from "@/components/kamod-ui/selectable-card";

export const Example = () => (
  <RadioGroup defaultValue="kubernetes" class="grid max-w-md gap-3">
    <SelectableCard value="kubernetes">
      <div class="grid gap-1">
        <p class="text-sm font-medium leading-none">Kubernetes</p>
        <p class="text-sm text-muted-foreground">Best for clustered workloads and autoscaling.</p>
      </div>
    </SelectableCard>
    <SelectableCard value="virtual-machine">
      <div class="grid gap-1">
        <p class="text-sm font-medium leading-none">Virtual machine</p>
        <p class="text-sm text-muted-foreground">Good for predictable apps and direct control.</p>
      </div>
    </SelectableCard>
  </RadioGroup>
);`,
      renderPreview: () => (
        <RadioGroup defaultValue="kubernetes" class="grid max-w-md gap-3">
          <SelectableCard value="kubernetes">
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">Kubernetes</p>
              <p class="text-sm text-muted-foreground">
                Best for clustered workloads and autoscaling.
              </p>
            </div>
          </SelectableCard>
          <SelectableCard value="virtual-machine">
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">Virtual machine</p>
              <p class="text-sm text-muted-foreground">
                Good for predictable apps and direct control.
              </p>
            </div>
          </SelectableCard>
        </RadioGroup>
      ),
    },
    {
      id: "selectable-card-disabled",
      title: "Disabled state",
      text: "Disabled cards keep the same structure and dim themselves automatically.",
      code: `import { RadioGroup } from "@/components/kamod-ui/radio-group";
import { SelectableCard } from "@/components/kamod-ui/selectable-card";

export const Example = () => (
  <RadioGroup defaultValue="starter" class="grid max-w-md gap-3">
    <SelectableCard value="starter">
      <div class="grid gap-1">
        <p class="text-sm font-medium leading-none">Starter</p>
        <p class="text-sm text-muted-foreground">Simple deployments for small projects.</p>
      </div>
    </SelectableCard>
    <SelectableCard value="enterprise" disabled>
      <div class="grid gap-1">
        <p class="text-sm font-medium leading-none">Enterprise</p>
        <p class="text-sm text-muted-foreground">Available on request for approved accounts.</p>
      </div>
    </SelectableCard>
  </RadioGroup>
);`,
      renderPreview: () => (
        <RadioGroup defaultValue="starter" class="grid max-w-md gap-3">
          <SelectableCard value="starter">
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">Starter</p>
              <p class="text-sm text-muted-foreground">Simple deployments for small projects.</p>
            </div>
          </SelectableCard>
          <SelectableCard value="enterprise" disabled>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">Enterprise</p>
              <p class="text-sm text-muted-foreground">
                Available on request for approved accounts.
              </p>
            </div>
          </SelectableCard>
        </RadioGroup>
      ),
    },
  ],
  apiRows: [
    { prop: "value", type: "string", defaultValue: "required" },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
    { prop: "class", type: "string", defaultValue: "undefined" },
    { prop: "children", type: "ComponentChildren", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Keep SelectableCard inside RadioGroup so keyboard navigation, roving focus, and selection semantics stay intact. Put meaningful text inside the card so each option has a clear accessible name.",
});
