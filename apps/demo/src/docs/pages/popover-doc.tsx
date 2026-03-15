import {
  Button,
  Input,
  Label,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const popoverDocPage = createGenericDocPage({
  slug: "popover",
  title: "Popover",
  usageLabel: "A modern popup that floats next to a trigger for lightweight actions, forms, and contextual content.",
  installationText: "Import Popover, PopoverTrigger, PopoverContent and optional sub-components from @kamod-ui/core.",
  usageText:
    "Use PopoverTrigger with asChild when the trigger is a Button so you avoid nested buttons. Use popovers for secondary actions, inline forms, and contextual help; keep content focused and close on outside click.",
  exampleSections: [
    {
      id: "basic-popover",
      title: "Basic",
      text: "A simple popover with title and description, triggered by a button.",
      code: `import { Button, Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@kamod-ui/core";

export const Example = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">Open popover</Button>
    </PopoverTrigger>
    <PopoverContent align="start">
      <PopoverHeader>
        <PopoverTitle>Dimensions</PopoverTitle>
        <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
      </PopoverHeader>
    </PopoverContent>
  </Popover>
);`,
      renderPreview: () => (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      )
    },
    {
      id: "popover-form",
      title: "With Form",
      text: "Embed a compact settings form inside the popover. This mirrors the classic shadcn/ui dimensions example.",
      code: `import { Button, Input, Label, Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@kamod-ui/core";

export const Example = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">Open popover</Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <PopoverHeader>
        <PopoverTitle>Dimensions</PopoverTitle>
        <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
      </PopoverHeader>
      <div class="grid gap-2">
        <div class="grid grid-cols-3 items-center gap-4">
          <Label class="text-right">Width</Label>
          <Input class="col-span-2 h-8" defaultValue="100%" />
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label class="text-right">Max. width</Label>
          <Input class="col-span-2 h-8" defaultValue="300px" />
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label class="text-right">Height</Label>
          <Input class="col-span-2 h-8" defaultValue="25px" />
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label class="text-right">Max. height</Label>
          <Input class="col-span-2 h-8" defaultValue="none" />
        </div>
      </div>
    </PopoverContent>
  </Popover>
);`,
      renderPreview: () => (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent class="w-80">
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
            </PopoverHeader>
            <div class="grid gap-2">
              <div class="grid grid-cols-3 items-center gap-4">
                <Label class="text-right">Width</Label>
                <Input class="col-span-2 h-8" defaultValue="100%" />
              </div>
              <div class="grid grid-cols-3 items-center gap-4">
                <Label class="text-right">Max. width</Label>
                <Input class="col-span-2 h-8" defaultValue="300px" />
              </div>
              <div class="grid grid-cols-3 items-center gap-4">
                <Label class="text-right">Height</Label>
                <Input class="col-span-2 h-8" defaultValue="25px" />
              </div>
              <div class="grid grid-cols-3 items-center gap-4">
                <Label class="text-right">Max. height</Label>
                <Input class="col-span-2 h-8" defaultValue="none" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )
    },
    {
      id: "popover-placement",
      title: "Placement",
      text: "Control which side the popover appears on using the side prop.",
      code: `import { Button, Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@kamod-ui/core";

const sides = ["top", "right", "bottom", "left"] as const;

export const Example = () => (
  <div class="flex flex-wrap items-center gap-3">
    {sides.map((side) => (
      <Popover key={side}>
        <PopoverTrigger asChild>
          <Button variant="outline" class="capitalize">{side}</Button>
        </PopoverTrigger>
        <PopoverContent side={side} class="w-52">
          <PopoverTitle>Popover on {side}</PopoverTitle>
        </PopoverContent>
      </Popover>
    ))}
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-wrap items-center gap-3">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Popover key={side}>
              <PopoverTrigger asChild>
                <Button variant="outline" class="capitalize">
                  {side}
                </Button>
              </PopoverTrigger>
              <PopoverContent side={side} class="w-52">
                <PopoverTitle>Popover on {side}</PopoverTitle>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      )
    },
    {
      id: "popover-alignment",
      title: "Align",
      text: "Use the align prop on PopoverContent to control alignment along the cross axis (mirrors shadcn/ui).",
      code: `import { Button, Popover, PopoverContent, PopoverTrigger } from "@kamod-ui/core";

export const Example = () => (
  <div class="flex flex-wrap gap-6">
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">Start</Button>
      </PopoverTrigger>
      <PopoverContent align="start" class="w-40">
        <p class="text-sm">Aligned to start</p>
      </PopoverContent>
    </Popover>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">Center</Button>
      </PopoverTrigger>
      <PopoverContent align="center" class="w-40">
        <p class="text-sm">Aligned to center</p>
      </PopoverContent>
    </Popover>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">End</Button>
      </PopoverTrigger>
      <PopoverContent align="end" class="w-40">
        <p class="text-sm">Aligned to end</p>
      </PopoverContent>
    </Popover>
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-wrap gap-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Start
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" class="w-40">
              <p class="text-sm">Aligned to start</p>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Center
              </Button>
            </PopoverTrigger>
            <PopoverContent align="center" class="w-40">
              <p class="text-sm">Aligned to center</p>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                End
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" class="w-40">
              <p class="text-sm">Aligned to end</p>
            </PopoverContent>
          </Popover>
        </div>
      )
    },
    {
      id: "popover-form-compact",
      title: "With Form (compact)",
      text: "Narrow popover with horizontal label and field rows, matching the newer shadcn/ui dimensions example layout.",
      code: `import { Button, Input, Label, Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@kamod-ui/core";

export const Example = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">Open popover</Button>
    </PopoverTrigger>
    <PopoverContent class="w-64" align="start">
      <PopoverHeader>
        <PopoverTitle>Dimensions</PopoverTitle>
        <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
      </PopoverHeader>
      <div class="grid gap-4">
        <div class="flex items-center gap-3">
          <Label class="w-1/2 shrink-0" for="popover-width">Width</Label>
          <Input id="popover-width" defaultValue="100%" class="min-w-0 flex-1" />
        </div>
        <div class="flex items-center gap-3">
          <Label class="w-1/2 shrink-0" for="popover-height">Height</Label>
          <Input id="popover-height" defaultValue="25px" class="min-w-0 flex-1" />
        </div>
      </div>
    </PopoverContent>
  </Popover>
);`,
      renderPreview: () => (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent class="w-64" align="start">
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
            </PopoverHeader>
            <div class="grid gap-4">
              <div class="flex items-center gap-3">
                <Label class="w-1/2 shrink-0" for="popover-width-compact">
                  Width
                </Label>
                <Input id="popover-width-compact" defaultValue="100%" class="min-w-0 flex-1" />
              </div>
              <div class="flex items-center gap-3">
                <Label class="w-1/2 shrink-0" for="popover-height-compact">
                  Height
                </Label>
                <Input id="popover-height-compact" defaultValue="25px" class="min-w-0 flex-1" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )
    },
    {
      id: "popover-rtl",
      title: "RTL",
      text: "Set dir on PopoverContent (and your page root) for right-to-left layouts. Uses physical side values like the shadcn/ui RTL example.",
      code: `import { Button, Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@kamod-ui/core";

const sides = ["left", "top", "bottom", "right"] as const;
const labels: Record<(typeof sides)[number], string> = {
  left: "Left",
  top: "Top",
  bottom: "Bottom",
  right: "Right"
};

export const Example = () => (
  <div class="flex flex-wrap justify-center gap-2">
    {sides.map((side) => (
      <Popover key={side}>
        <PopoverTrigger asChild>
          <Button variant="outline">{labels[side]}</Button>
        </PopoverTrigger>
        <PopoverContent side={side} dir="rtl" class="w-56">
          <PopoverHeader>
            <PopoverTitle>الأبعاد</PopoverTitle>
            <PopoverDescription>تعيين الأبعاد للطبقة.</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    ))}
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-wrap justify-center gap-2">
          {(["left", "top", "bottom", "right"] as const).map((side) => {
            const labels = { left: "Left", top: "Top", bottom: "Bottom", right: "Right" } as const;
            return (
              <Popover key={side}>
                <PopoverTrigger asChild>
                  <Button variant="outline">{labels[side]}</Button>
                </PopoverTrigger>
                <PopoverContent side={side} dir="rtl" class="w-56">
                  <PopoverHeader>
                    <PopoverTitle>الأبعاد</PopoverTitle>
                    <PopoverDescription>تعيين الأبعاد للطبقة.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      )
    },
    {
      id: "popover-close",
      title: "With Close Button",
      text: "Use PopoverClose to add an explicit dismiss control inside the content.",
      code: `import { Button, Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@kamod-ui/core";

export const Example = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">Notifications</Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <PopoverClose />
      <PopoverHeader>
        <PopoverTitle>Notifications</PopoverTitle>
        <PopoverDescription>You have 3 unread messages.</PopoverDescription>
      </PopoverHeader>
      <div class="grid gap-2 text-sm">
        <div class="flex items-center gap-2 rounded-md border p-2">
          <span class="size-2 shrink-0 rounded-full bg-blue-500" />
          <span>New comment on your post</span>
        </div>
        <div class="flex items-center gap-2 rounded-md border p-2">
          <span class="size-2 shrink-0 rounded-full bg-green-500" />
          <span>Deployment successful</span>
        </div>
        <div class="flex items-center gap-2 rounded-md border p-2">
          <span class="size-2 shrink-0 rounded-full bg-orange-500" />
          <span>New team member joined</span>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);`,
      renderPreview: () => (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Notifications</Button>
          </PopoverTrigger>
          <PopoverContent class="w-80">
            <PopoverClose />
            <PopoverHeader>
              <PopoverTitle>Notifications</PopoverTitle>
              <PopoverDescription>You have 3 unread messages.</PopoverDescription>
            </PopoverHeader>
            <div class="grid gap-2 text-sm">
              <div class="flex items-center gap-2 rounded-md border p-2">
                <span class="size-2 shrink-0 rounded-full bg-blue-500" />
                <span>New comment on your post</span>
              </div>
              <div class="flex items-center gap-2 rounded-md border p-2">
                <span class="size-2 shrink-0 rounded-full bg-green-500" />
                <span>Deployment successful</span>
              </div>
              <div class="flex items-center gap-2 rounded-md border p-2">
                <span class="size-2 shrink-0 rounded-full bg-orange-500" />
                <span>New team member joined</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )
    },
    {
      id: "popover-default-open",
      title: "Default Open",
      text: "Render the popover in its open state by default.",
      code: `import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@kamod-ui/core";

export const Example = () => (
  <Popover defaultOpen>
    <PopoverTrigger class="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium">
      Already open
    </PopoverTrigger>
    <PopoverContent class="w-64">
      <PopoverHeader>
        <PopoverTitle>Welcome</PopoverTitle>
        <PopoverDescription>This popover is open by default on mount.</PopoverDescription>
      </PopoverHeader>
    </PopoverContent>
  </Popover>
);`,
      renderPreview: () => (
        <Popover defaultOpen>
          <PopoverTrigger class="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium">
            Already open
          </PopoverTrigger>
          <PopoverContent class="w-64">
            <PopoverHeader>
              <PopoverTitle>Welcome</PopoverTitle>
              <PopoverDescription>This popover is open by default on mount.</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      )
    },
    {
      id: "popover-settings",
      title: "Settings Panel",
      text: "A rich settings popover combining switches and fields for inline configuration.",
      code: `import { Button, Input, Label, Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@kamod-ui/core";
import { Settings } from "lucide-preact";

export const Example = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" size="icon">
        <Settings class="size-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <PopoverClose />
      <PopoverHeader>
        <PopoverTitle>Settings</PopoverTitle>
        <PopoverDescription>Configure your workspace preferences.</PopoverDescription>
      </PopoverHeader>
      <div class="grid gap-3">
        <div class="grid gap-1.5">
          <Label>Display name</Label>
          <Input defaultValue="Pedro Duarte" class="h-8" />
        </div>
        <div class="grid gap-1.5">
          <Label>Email</Label>
          <Input defaultValue="pedro@example.com" class="h-8" />
        </div>
        <Button size="sm" class="w-full">Save changes</Button>
      </div>
    </PopoverContent>
  </Popover>
);`,
      renderPreview: () => {
        const SettingsIcon = () => (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <SettingsIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-80">
              <PopoverClose />
              <PopoverHeader>
                <PopoverTitle>Settings</PopoverTitle>
                <PopoverDescription>Configure your workspace preferences.</PopoverDescription>
              </PopoverHeader>
              <div class="grid gap-3">
                <div class="grid gap-1.5">
                  <Label>Display name</Label>
                  <Input defaultValue="Pedro Duarte" class="h-8" />
                </div>
                <div class="grid gap-1.5">
                  <Label>Email</Label>
                  <Input defaultValue="pedro@example.com" class="h-8" />
                </div>
                <Button size="sm" class="w-full">Save changes</Button>
              </div>
            </PopoverContent>
          </Popover>
        );
      }
    }
  ],
  apiRows: [
    { prop: "defaultOpen", type: "boolean", defaultValue: "false" },
    { prop: "PopoverTrigger asChild", type: "boolean", defaultValue: "false — merge trigger props into the child element (e.g. Button) instead of wrapping a button" },
    { prop: "PopoverTrigger", type: "interactive opener", defaultValue: "required" },
    { prop: "PopoverContent side", type: '"top" | "right" | "bottom" | "left"', defaultValue: '"bottom"' },
    { prop: "PopoverContent align", type: '"start" | "center" | "end"', defaultValue: '"center"' },
    { prop: "PopoverContent sideOffset", type: "number", defaultValue: "4" },
    { prop: "PopoverContent forceMount", type: "boolean", defaultValue: "false" },
    { prop: "PopoverClose", type: "dismiss button", defaultValue: "renders X icon" }
  ],
  accessibilityText:
    "Popover content receives role=\"dialog\" and is linked to its trigger via aria-controls. Pressing Escape closes the popover and returns focus to the trigger. Ensure trigger labels are descriptive; avoid placing critical information only inside popovers."
});
