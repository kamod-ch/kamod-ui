import { Switch } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const switchDocPage = createGenericDocPage({
  slug: "switch",
  title: "Switch",
  usageLabel: "A compact control for on/off settings.",
  installationText: "Import Switch from `@/components/kamod-ui/switch`.",
  usageText:
    "Use defaultChecked for local state, or checked with onCheckedChange for controlled usage. The size prop supports compact layouts, while aria-invalid and disabled help communicate state clearly.",
  exampleSections: [
    {
      id: "switch-description",
      title: "Description",
      text: "A modern settings row with concise helper text and a trailing switch.",
      code: `import { Switch } from "@/components/kamod-ui/switch";

export const Example = () => (
  <div class="flex w-full max-w-md items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
    <div class="space-y-1">
      <p class="text-sm font-medium leading-none">Share across devices</p>
      <p class="text-xs text-muted-foreground">
        Keep your settings synced when switching devices.
      </p>
    </div>
    <Switch defaultChecked aria-label="Share across devices" />
  </div>
);`,
      renderPreview: () => (
        <div class="flex w-full max-w-md items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
          <div class="space-y-1">
            <p class="text-sm font-medium leading-none">Share across devices</p>
            <p class="text-xs text-muted-foreground">
              Keep your settings synced when switching devices.
            </p>
          </div>
          <Switch defaultChecked aria-label="Share across devices" />
        </div>
      ),
    },
    {
      id: "switch-choice-card",
      title: "Choice Card",
      text: "Card-like options with clear labels and independent switches.",
      code: `import { Switch } from "@/components/kamod-ui/switch";

export const Example = () => (
  <div class="grid w-full max-w-md gap-3">
    <label class="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
      <div class="space-y-1">
        <p class="text-sm font-medium leading-none">Enable notifications</p>
        <p class="text-xs text-muted-foreground">
          Receive updates when important events happen.
        </p>
      </div>
      <Switch defaultChecked aria-label="Enable notifications" />
    </label>
    <label class="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
      <div class="space-y-1">
        <p class="text-sm font-medium leading-none">Marketing updates</p>
        <p class="text-xs text-muted-foreground">
          Get product news, feature launches and offers.
        </p>
      </div>
      <Switch aria-label="Marketing updates" />
    </label>
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-full max-w-md gap-3">
          <label class="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
            <div class="space-y-1">
              <p class="text-sm font-medium leading-none">Enable notifications</p>
              <p class="text-xs text-muted-foreground">
                Receive updates when important events happen.
              </p>
            </div>
            <Switch defaultChecked aria-label="Enable notifications" />
          </label>
          <label class="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
            <div class="space-y-1">
              <p class="text-sm font-medium leading-none">Marketing updates</p>
              <p class="text-xs text-muted-foreground">
                Get product news, feature launches and offers.
              </p>
            </div>
            <Switch aria-label="Marketing updates" />
          </label>
        </div>
      ),
    },
    {
      id: "switch-disabled-invalid",
      title: "Disabled & Invalid",
      text: "Show disabled and validation states to communicate constraints quickly.",
      code: `import { Switch } from "@/components/kamod-ui/switch";

export const Example = () => (
  <div class="grid w-full max-w-md gap-3">
    <div class="flex items-center justify-between rounded-xl border border-border bg-card p-4">
      <span class="text-sm font-medium">Disabled option</span>
      <Switch disabled aria-label="Disabled option" />
    </div>
    <div class="flex items-center justify-between rounded-xl border border-destructive/50 bg-card p-4">
      <span class="text-sm font-medium text-destructive">Accept terms</span>
      <Switch aria-invalid defaultChecked aria-label="Accept terms" />
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-full max-w-md gap-3">
          <div class="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <span class="text-sm font-medium">Disabled option</span>
            <Switch disabled aria-label="Disabled option" />
          </div>
          <div class="flex items-center justify-between rounded-xl border border-destructive/50 bg-card p-4">
            <span class="text-sm font-medium text-destructive">Accept terms</span>
            <Switch aria-invalid defaultChecked aria-label="Accept terms" />
          </div>
        </div>
      ),
    },
    {
      id: "switch-size",
      title: "Size",
      text: "Use structured setting rows to compare compact and default controls.",
      code: `import { Switch } from "@/components/kamod-ui/switch";

export const Example = () => (
  <div class="grid w-full max-w-md gap-3">
    <div class="docs-switch-row">
      <div>
        <p class="docs-switch-row-title">Compact</p>
        <p class="docs-switch-row-copy">Space-saving for dense panels.</p>
      </div>
      <Switch size="sm" defaultChecked aria-label="Compact switch" />
    </div>
    <div class="docs-switch-row">
      <div>
        <p class="docs-switch-row-title">Default</p>
        <p class="docs-switch-row-copy">Balanced for regular forms.</p>
      </div>
      <Switch defaultChecked aria-label="Default switch" />
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-full max-w-md gap-3">
          <div class="docs-switch-row">
            <div>
              <p class="docs-switch-row-title">Compact</p>
              <p class="docs-switch-row-copy">Space-saving for dense panels.</p>
            </div>
            <Switch size="sm" defaultChecked aria-label="Compact switch" />
          </div>
          <div class="docs-switch-row">
            <div>
              <p class="docs-switch-row-title">Default</p>
              <p class="docs-switch-row-copy">Balanced for regular forms.</p>
            </div>
            <Switch defaultChecked aria-label="Default switch" />
          </div>
        </div>
      ),
    },
  ],
  apiRows: [
    { prop: "size", type: `"default" | "sm"`, defaultValue: `"default"` },
    { prop: "defaultChecked", type: "boolean", defaultValue: "false" },
    { prop: "checked", type: "boolean", defaultValue: "uncontrolled" },
    { prop: "onCheckedChange", type: "(next: boolean) => void", defaultValue: "undefined" },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
    { prop: "aria-invalid", type: "boolean", defaultValue: "false" },
  ],
  accessibilityText:
    "Provide a clear label with visible text or aria-label. Use switch for immediate on/off settings and use checkbox semantics when the value is part of form submission.",
});
